"""Flask microservice for LearnHub resource search."""

from __future__ import annotations

import os
import threading
import time
from collections import defaultdict, deque
from typing import Any, Callable
from uuid import UUID

from flask import Flask, jsonify, make_response, request
from flask_cors import CORS

from assistant import AssistantServiceError, answer_question
from search_algorithms import rank_resources
from supabase_resources import SupabaseResourceStore


MAX_ASSISTANT_QUESTION_LENGTH = 1000
MAX_HISTORY_TURNS = 6
MAX_HISTORY_TEXT_LENGTH = 1000
MAX_CONTEXT_FIELD_LENGTH = 200


class AssistantRateLimiter:
    def __init__(self, limit: int = 10, window_seconds: int = 60):
        self.limit = limit
        self.window_seconds = window_seconds
        self.requests: dict[str, deque[float]] = defaultdict(deque)
        self.lock = threading.Lock()

    def allow(self, user_id: str) -> bool:
        now = time.monotonic()
        cutoff = now - self.window_seconds
        with self.lock:
            if user_id not in self.requests and len(self.requests) >= 5000:
                expired_users = [
                    user for user, timestamps in self.requests.items()
                    if not timestamps or timestamps[-1] <= cutoff
                ]
                for user in expired_users:
                    del self.requests[user]
                if len(self.requests) >= 5000:
                    return False
            user_requests = self.requests[user_id]
            while user_requests and user_requests[0] <= cutoff:
                user_requests.popleft()
            if len(user_requests) >= self.limit:
                return False
            user_requests.append(now)
            return True

    def __call__(self, user_id: str) -> bool:
        return self.allow(user_id)


def _pagination_args() -> tuple[int, int] | tuple[None, str]:
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 20))
    except ValueError:
        return None, "page and per_page must be integers"
    if page < 1 or per_page < 1 or per_page > 100:
        return None, "page must be at least 1 and per_page must be between 1 and 100"
    return page, per_page


def create_app(
    resource_loader: Callable[[], list[dict[str, Any]]] | None = None,
    assistant_responder: Callable[..., dict[str, Any]] | None = None,
    assistant_user_loader: Callable[[str], list[dict[str, Any]]] | None = None,
    token_verifier: Callable[[str], dict[str, Any]] | None = None,
    assistant_rate_limiter: Callable[[str], bool] | None = None,
) -> Flask:
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 32 * 1024
    CORS(app, origins=[os.environ.get("CLIENT_ORIGIN", "http://localhost:3000")])
    resource_store = SupabaseResourceStore()
    load_resources = resource_loader or resource_store.list_resources
    load_user_resources = assistant_user_loader or resource_store.list_accessible_resources
    verify_token = token_verifier or resource_store.verify_access_token
    respond_to_question = assistant_responder or answer_question
    allow_assistant_request = assistant_rate_limiter or AssistantRateLimiter()

    @app.errorhandler(413)
    def request_too_large(_error: Exception) -> tuple[Any, int]:
        return jsonify({"error": "Request is too large. Shorten the question and try again."}), 413

    @app.get("/health")
    def health() -> tuple[Any, int]:
        return jsonify({"status": "ok", "service": "learnhub-search"}), 200

    @app.route("/search", methods=["GET", "POST"])
    def search() -> tuple[Any, int]:
        payload = request.get_json(silent=True) if request.method == "POST" else {}
        if request.method == "POST" and not isinstance(payload, dict):
            return jsonify({"error": "Request body must be a JSON object"}), 400

        query = request.args.get("q", payload.get("query", payload.get("q", "")))
        resources = payload.get("resources")
        if not isinstance(query, str):
            return jsonify({"error": "query must be a string"}), 400
        page, per_page = _pagination_args()
        if page is None:
            return jsonify({"error": per_page}), 400

        if resources is None:
            try:
                resources = load_resources()
            except RuntimeError as error:
                return jsonify({"error": str(error)}), 503
        elif not isinstance(resources, list) or not all(isinstance(resource, dict) for resource in resources):
            return jsonify({"error": "resources must be an array of objects"}), 400

        results = rank_resources(resources, query)
        total = len(results)
        start = (page - 1) * per_page
        end = start + per_page
        return jsonify({
            "query": query,
            "page": page,
            "per_page": per_page,
            "total": total,
            "results": results[start:end],
        }), 200

    @app.post("/assistant/chat")
    def assistant_chat() -> tuple[Any, int]:
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return jsonify({"error": "Request body must be a JSON object"}), 400
        if set(payload) - {"question", "context", "history", "conversation_id"}:
            return jsonify({"error": "Request contains an unsupported field"}), 400

        question = payload.get("question")
        if not isinstance(question, str) or not question.strip():
            return jsonify({"error": "question must be a non-empty string"}), 400
        if len(question) > MAX_ASSISTANT_QUESTION_LENGTH:
            return jsonify({"error": "question must be 1000 characters or fewer"}), 400
        question = question.strip()

        auth_header = request.headers.get("Authorization", "")
        scheme, separator, access_token = auth_header.partition(" ")
        if scheme.lower() != "bearer" or not separator or not access_token.strip():
            return jsonify({"error": "Sign in to use the LearnHub Assistant."}), 401
        access_token = access_token.strip()
        try:
            user = verify_token(access_token)
        except PermissionError:
            return jsonify({"error": "Your session has expired. Please sign in again."}), 401
        except RuntimeError:
            return jsonify({"error": "Sign-in verification is temporarily unavailable. Please try again."}), 503
        if not isinstance(user, dict) or not isinstance(user.get("id"), str) or not user["id"]:
            return jsonify({"error": "Your session could not be verified. Please sign in again."}), 401
        if not allow_assistant_request(user["id"]):
            response = make_response(jsonify({
                "error": "You’re sending questions too quickly. Please wait a moment and try again."
            }), 429)
            response.headers["Retry-After"] = "60"
            return response

        context = payload.get("context")
        if context is not None and not isinstance(context, dict):
            return jsonify({"error": "context must be an object"}), 400
        if context is not None and any(
            key not in ("resource_id", "title", "subject", "topic", "resource_type")
            or not isinstance(value, str)
            or len(value) > MAX_CONTEXT_FIELD_LENGTH
            for key, value in context.items()
        ):
            return jsonify({"error": "context contains an invalid field"}), 400
        history = payload.get("history", [])
        if not isinstance(history, list) or len(history) > MAX_HISTORY_TURNS or not all(
            isinstance(turn, dict)
            and turn.get("role") in ("user", "model")
            and isinstance(turn.get("content"), str)
            and len(turn["content"]) <= MAX_HISTORY_TEXT_LENGTH
            for turn in history
        ):
            return jsonify({"error": "history must contain up to six user/model text turns of 1000 characters or fewer"}), 400
        conversation_id = payload.get("conversation_id")
        if conversation_id is not None:
            if not isinstance(conversation_id, str):
                return jsonify({"error": "conversation_id must be a UUID"}), 400
            try:
                UUID(conversation_id)
            except ValueError:
                return jsonify({"error": "conversation_id must be a UUID"}), 400

        try:
            resources = load_user_resources(access_token)
        except PermissionError:
            return jsonify({"error": "Your session has expired. Please sign in again."}), 401
        except RuntimeError as error:
            app.logger.warning("Assistant resource retrieval failed: %s", error)
            return jsonify({"error": "LearnHub resources are temporarily unavailable. Please try again."}), 503
        if not isinstance(resources, list) or not all(
            isinstance(resource, dict) for resource in resources
        ):
            return jsonify({"error": "Resource store returned an invalid response"}), 503

        verified_resources = [
            resource for resource in resources
            if resource.get("verification_status") == "verified"
        ]
        try:
            result = respond_to_question(
                question,
                verified_resources,
                context=context,
                history=history,
            )
        except AssistantServiceError as error:
            status = 503 if "not configured" in str(error).lower() else 502
            return jsonify({
                "error": "The LearnHub Assistant is temporarily unavailable. Please try again."
            }), status

        if (
            not isinstance(result, dict)
            or not isinstance(result.get("answer"), str)
            or not isinstance(result.get("sources"), list)
        ):
            return jsonify({"error": "Assistant returned an invalid response"}), 502
        result.setdefault("needsTeacherHelp", not result["sources"])
        if not isinstance(result["needsTeacherHelp"], bool):
            return jsonify({"error": "Assistant returned an invalid response"}), 502
        return jsonify(result), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

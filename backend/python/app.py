"""Flask microservice for LearnHub resource search."""

from __future__ import annotations

import os
from typing import Any, Callable

from flask import Flask, jsonify, request
from flask_cors import CORS

from assistant import AssistantServiceError, answer_question
from search_algorithms import rank_resources
from supabase_resources import SupabaseResourceStore


MAX_ASSISTANT_QUESTION_LENGTH = 1000


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
) -> Flask:
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 32 * 1024
    CORS(app, origins=[os.environ.get("CLIENT_ORIGIN", "http://localhost:3000")])
    load_resources = resource_loader or SupabaseResourceStore().list_resources
    respond_to_question = assistant_responder or answer_question

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

        question = payload.get("question")
        if not isinstance(question, str) or not question.strip():
            return jsonify({"error": "question must be a non-empty string"}), 400
        question = question.strip()
        if len(question) > MAX_ASSISTANT_QUESTION_LENGTH:
            return jsonify({"error": "question must be 1000 characters or fewer"}), 400

        context = payload.get("context")
        if context is not None and not isinstance(context, dict):
            return jsonify({"error": "context must be an object"}), 400
        history = payload.get("history", [])
        if not isinstance(history, list) or not all(
            isinstance(turn, dict)
            and turn.get("role") in ("user", "model")
            and isinstance(turn.get("content"), str)
            for turn in history
        ):
            return jsonify({"error": "history must contain user/model text turns"}), 400

        try:
            resources = load_resources()
        except RuntimeError as error:
            return jsonify({"error": str(error)}), 503
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
            return jsonify({"error": str(error)}), status

        if (
            not isinstance(result, dict)
            or not isinstance(result.get("answer"), str)
            or not isinstance(result.get("sources"), list)
        ):
            return jsonify({"error": "Assistant returned an invalid response"}), 502
        return jsonify(result), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

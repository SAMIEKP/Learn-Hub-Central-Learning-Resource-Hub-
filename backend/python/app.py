"""Flask microservice for LearnHub resource search."""

from __future__ import annotations

import os
from typing import Any, Callable

from flask import Flask, jsonify, request
from flask_cors import CORS

from search_algorithms import rank_resources
from supabase_resources import SupabaseResourceStore


def _pagination_args() -> tuple[int, int] | tuple[None, str]:
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 20))
    except ValueError:
        return None, "page and per_page must be integers"
    if page < 1 or per_page < 1 or per_page > 100:
        return None, "page must be at least 1 and per_page must be between 1 and 100"
    return page, per_page


def create_app(resource_loader: Callable[[], list[dict[str, Any]]] | None = None) -> Flask:
    app = Flask(__name__)
    CORS(app, origins=[os.environ.get("CLIENT_ORIGIN", "http://localhost:3000")])
    load_resources = resource_loader or SupabaseResourceStore().list_resources

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

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

import unittest
from unittest.mock import patch

from app import AssistantRateLimiter, create_app


class SearchApiTests(unittest.TestCase):
    def setUp(self):
        self.resources = [
            {"title": "Mathematics", "subject": "algebra"},
            {"title": "Biology", "subject": "science"},
            {"title": "Biology revision", "subject": "science"},
        ]
        self.client = create_app(lambda: self.resources).test_client()

    def test_health(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], "ok")

    def test_search_returns_ranked_results_from_loader(self):
        response = self.client.get("/search?q=biology")

        body = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(body["total"], 3)
        self.assertEqual(body["results"][0]["title"], "Biology")
        self.assertEqual(response.headers["Access-Control-Allow-Origin"], "http://localhost:3000")

    def test_search_paginates_results(self):
        response = self.client.get("/search?q=biology&page=2&per_page=1")

        body = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(body["page"], 2)
        self.assertEqual(body["per_page"], 1)
        self.assertEqual(len(body["results"]), 1)

    def test_search_validates_pagination(self):
        response = self.client.get("/search?q=biology&per_page=101")

        self.assertEqual(response.status_code, 400)
        self.assertIn("per_page", response.get_json()["error"])

    def test_post_payload_remains_supported(self):
        response = self.client.post(
            "/search",
            json={"query": "biology", "resources": self.resources},
        )

        self.assertEqual(response.status_code, 200)

    def test_assistant_only_receives_verified_resources(self):
        resources = [
            {"id": "approved", "verification_status": "verified"},
            {"id": "pending", "verification_status": "pending"},
            {"id": "rejected", "verification_status": "rejected"},
        ]
        received = {}

        def respond(question, approved_resources, context=None, history=None):
            received["question"] = question
            received["resources"] = approved_resources
            received["context"] = context
            received["history"] = history
            return {
                "answer": "Cells are the basic units of life. [1]",
                "sources": [{"resource_id": "approved", "title": "Cell Biology"}],
            }

        client = create_app(
            assistant_responder=respond,
            assistant_user_loader=lambda _token: resources,
            token_verifier=lambda token: {"id": "student-1"} if token == "valid-token" else {},
        ).test_client()
        response = client.post("/assistant/chat", json={
            "question": "What is a cell?",
            "context": {"resource_id": "approved", "title": "Cell Biology"},
            "history": [{"role": "user", "content": "Tell me about cells"}],
        }, headers={"Authorization": "Bearer valid-token"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(received["question"], "What is a cell?")
        self.assertEqual([resource["id"] for resource in received["resources"]], ["approved"])
        self.assertEqual(received["context"]["resource_id"], "approved")
        self.assertEqual(response.get_json()["sources"][0]["title"], "Cell Biology")
        self.assertFalse(response.get_json()["needsTeacherHelp"])

    def test_assistant_validates_question(self):
        response = self.client.post("/assistant/chat", json={"question": " "})

        self.assertEqual(response.status_code, 400)
        self.assertIn("non-empty", response.get_json()["error"])

    def test_assistant_rejects_missing_or_invalid_authentication(self):
        verification_calls = []
        client = create_app(token_verifier=lambda token: (
            verification_calls.append(token) or {}
        )).test_client()

        missing = client.post("/assistant/chat", json={"question": "Explain cells"})
        invalid = client.post(
            "/assistant/chat",
            json={"question": "Explain cells"},
            headers={"Authorization": "Bearer invalid-token"},
        )

        self.assertEqual(missing.status_code, 401)
        self.assertEqual(invalid.status_code, 401)
        self.assertEqual(verification_calls, ["invalid-token"])

    def test_assistant_rate_limits_by_verified_user(self):
        calls = []

        def allow_first_request(user_id):
            calls.append(user_id)
            return len(calls) == 1

        client = create_app(
            assistant_user_loader=lambda _token: [],
            token_verifier=lambda _token: {"id": "student-1"},
            assistant_rate_limiter=allow_first_request,
        ).test_client()
        headers = {"Authorization": "Bearer valid-token"}

        allowed = client.post("/assistant/chat", json={"question": "Explain cells"}, headers=headers)
        limited = client.post("/assistant/chat", json={"question": "Explain cells"}, headers=headers)

        self.assertEqual(allowed.status_code, 200)
        self.assertTrue(allowed.get_json()["needsTeacherHelp"])
        self.assertEqual(limited.status_code, 429)
        self.assertEqual(limited.headers["Retry-After"], "60")
        self.assertEqual(calls, ["student-1", "student-1"])

    def test_rate_limiter_applies_sliding_window_per_user(self):
        limiter = AssistantRateLimiter(limit=2, window_seconds=60)

        with patch("app.time.monotonic", side_effect=[100, 100, 100, 161]):
            self.assertTrue(limiter.allow("student-1"))
            self.assertTrue(limiter.allow("student-1"))
            self.assertFalse(limiter.allow("student-1"))
            self.assertTrue(limiter.allow("student-1"))

    def test_assistant_rejects_questions_over_the_length_limit(self):
        verification_calls = []
        client = create_app(
            token_verifier=lambda token: (
                verification_calls.append(token) or {"id": "student-1"}
            ),
        ).test_client()

        response = client.post(
            "/assistant/chat",
            json={"question": "x" * 1001},
            headers={"Authorization": "Bearer valid-token"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(verification_calls, [])

    def test_assistant_validates_history_size_and_conversation_identifier(self):
        client = create_app(
            token_verifier=lambda _token: {"id": "student-1"},
        ).test_client()
        headers = {"Authorization": "Bearer valid-token"}

        excessive_history = client.post("/assistant/chat", json={
            "question": "Explain cells",
            "history": [{"role": "user", "content": "Question"}] * 7,
        }, headers=headers)
        invalid_id = client.post("/assistant/chat", json={
            "question": "Explain cells",
            "conversation_id": "not-a-uuid",
        }, headers=headers)

        self.assertEqual(excessive_history.status_code, 400)
        self.assertEqual(invalid_id.status_code, 400)

    def test_assistant_reports_resource_store_configuration_error(self):
        client = create_app(
            assistant_user_loader=lambda _token: (_ for _ in ()).throw(
                RuntimeError("SUPABASE_URL is required")
            ),
            token_verifier=lambda _token: {"id": "student-1"},
        ).test_client()

        response = client.post(
            "/assistant/chat",
            json={"question": "Explain cells"},
            headers={"Authorization": "Bearer valid-token"},
        )

        self.assertEqual(response.status_code, 503)
        self.assertNotIn("SUPABASE_URL", response.get_json()["error"])


if __name__ == "__main__":
    unittest.main()

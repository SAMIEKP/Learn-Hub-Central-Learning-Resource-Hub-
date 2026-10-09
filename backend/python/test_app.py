import unittest

from app import create_app


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

        client = create_app(lambda: resources, respond).test_client()
        response = client.post("/assistant/chat", json={
            "question": "What is a cell?",
            "context": {"resource_id": "approved", "title": "Cell Biology"},
            "history": [{"role": "user", "content": "Tell me about cells"}],
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(received["question"], "What is a cell?")
        self.assertEqual([resource["id"] for resource in received["resources"]], ["approved"])
        self.assertEqual(received["context"]["resource_id"], "approved")
        self.assertEqual(response.get_json()["sources"][0]["title"], "Cell Biology")

    def test_assistant_validates_question(self):
        response = self.client.post("/assistant/chat", json={"question": " "})

        self.assertEqual(response.status_code, 400)
        self.assertIn("non-empty", response.get_json()["error"])

    def test_assistant_reports_resource_store_configuration_error(self):
        client = create_app(lambda: (_ for _ in ()).throw(
            RuntimeError("SUPABASE_URL is required")
        )).test_client()

        response = client.post("/assistant/chat", json={"question": "Explain cells"})

        self.assertEqual(response.status_code, 503)


if __name__ == "__main__":
    unittest.main()

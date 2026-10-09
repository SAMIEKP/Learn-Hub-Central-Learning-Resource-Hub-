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


if __name__ == "__main__":
    unittest.main()

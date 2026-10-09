import json
import unittest
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

from supabase_resources import SupabaseResourceStore


class FakeResponse:
    def __init__(self, body):
        self.body = body

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return None

    def read(self):
        return json.dumps(self.body).encode("utf-8")


class SupabaseAssistantResourceTests(unittest.TestCase):
    def setUp(self):
        self.store = SupabaseResourceStore(
            url="https://project.supabase.co",
            key="service-role-secret",
            anon_key="public-anon-key",
        )

    def test_access_token_is_validated_by_supabase_auth(self):
        captured = {}

        def fake_urlopen(request, timeout):
            captured["request"] = request
            captured["timeout"] = timeout
            return FakeResponse({"id": "student-1"})

        with patch("supabase_resources.urlopen", side_effect=fake_urlopen):
            user = self.store.verify_access_token("student-access-token")

        self.assertEqual(user, {"id": "student-1"})
        self.assertEqual(captured["request"].get_header("Authorization"), "Bearer student-access-token")
        self.assertEqual(captured["request"].get_header("Apikey"), "public-anon-key")
        self.assertNotEqual(captured["request"].get_header("Apikey"), "service-role-secret")

    def test_assistant_resource_query_uses_user_token_and_verified_filter(self):
        captured = {}
        resource = {
            "id": "verified-1",
            "verification_status": "verified",
            "extracted_text": "Verified text",
        }

        def fake_urlopen(request, timeout):
            captured["request"] = request
            captured["timeout"] = timeout
            return FakeResponse([resource])

        with patch("supabase_resources.urlopen", side_effect=fake_urlopen):
            resources = self.store.list_accessible_resources("student-access-token")

        query = parse_qs(urlparse(captured["request"].full_url).query)
        self.assertEqual(resources, [resource])
        self.assertEqual(query["verification_status"], ["eq.verified"])
        self.assertEqual(query["extracted_text"], ["not.is.null"])
        self.assertEqual(captured["request"].get_header("Authorization"), "Bearer student-access-token")
        self.assertEqual(captured["request"].get_header("Apikey"), "public-anon-key")


if __name__ == "__main__":
    unittest.main()

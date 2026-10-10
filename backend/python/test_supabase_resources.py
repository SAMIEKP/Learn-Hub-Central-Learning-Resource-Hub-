import json
import unittest
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

import jwt

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
            jwt_secret="test-supabase-jwt-secret",
        )

    def test_supabase_template_token_is_validated_with_legacy_secret(self):
        with patch("supabase_resources.jwt.decode", return_value={
            "aud": "authenticated",
            "role": "authenticated",
            "sub": "user_123",
        }) as decode:
            user = self.store.verify_access_token("student-access-token")

        self.assertEqual(user, {"id": "user_123"})
        decode.assert_called_once_with(
            "student-access-token",
            "test-supabase-jwt-secret",
            algorithms=["HS256"],
            audience="authenticated",
            options={"require": ["sub", "aud", "exp", "iat", "role"]},
        )

    def test_invalid_supabase_template_token_is_rejected(self):
        with patch("supabase_resources.jwt.decode", side_effect=jwt.InvalidTokenError):
            with self.assertRaises(PermissionError):
                self.store.verify_access_token("invalid-token")

    def test_supabase_token_with_non_authenticated_role_is_rejected(self):
        with patch("supabase_resources.jwt.decode", return_value={
            "aud": "authenticated",
            "role": "service_role",
            "sub": "user_123",
        }):
            with self.assertRaises(PermissionError):
                self.store.verify_access_token("invalid-role-token")

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
        self.assertEqual(
            captured["request"].get_header("Authorization"),
            "Bearer " + "student-access-token",
        )
        self.assertEqual(captured["request"].get_header("Apikey"), "public-anon-key")


if __name__ == "__main__":
    unittest.main()

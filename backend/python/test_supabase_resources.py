import json
import unittest
from types import SimpleNamespace
from unittest.mock import Mock, patch
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
        )

    def test_clerk_access_token_is_validated_against_configured_issuer(self):
        self.store.clerk_issuer = "https://learnhub.clerk.accounts.dev"
        self.store.clerk_jwks = SimpleNamespace(
            get_signing_key_from_jwt=Mock(return_value=SimpleNamespace(key="public-key"))
        )
        with patch("supabase_resources.jwt.decode", return_value={
            "iss": self.store.clerk_issuer,
            "sub": "user_123",
        }) as decode:
            user = self.store.verify_access_token("student-access-token")

        self.assertEqual(user, {"id": "user_123"})
        decode.assert_called_once_with(
            "student-access-token",
            "public-key",
            algorithms=["RS256"],
            issuer=self.store.clerk_issuer,
            options={"require": ["sub", "iss", "exp", "iat"]},
        )

    def test_invalid_clerk_token_is_rejected(self):
        self.store.clerk_issuer = "https://learnhub.clerk.accounts.dev"
        self.store.clerk_jwks = SimpleNamespace(
            get_signing_key_from_jwt=Mock(return_value=SimpleNamespace(key="public-key"))
        )
        with patch("supabase_resources.jwt.decode", side_effect=jwt.InvalidTokenError):
            with self.assertRaises(PermissionError):
                self.store.verify_access_token("invalid-token")

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
            "Bearer student-access-token",
        )
        self.assertEqual(captured["request"].get_header("Apikey"), "public-anon-key")


if __name__ == "__main__":
    unittest.main()

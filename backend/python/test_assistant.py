import json
import os
import unittest
from unittest.mock import patch

import assistant


RESOURCES = [
    {
        "id": "verified-cell-resource",
        "title": "Cell structure",
        "subject": "Biology",
        "topic": "Cells",
        "resource_type": "class_note",
        "verification_status": "verified",
        "extracted_text": (
            "Cells are the basic units of life. The cell membrane controls "
            "what enters and leaves the cell. The nucleus contains genetic "
            "material and controls cell activities."
        ),
    },
    {
        "id": "pending-cell-resource",
        "title": "Unapproved cell note",
        "subject": "Biology",
        "verification_status": "pending",
        "extracted_text": "Cells contain cytoplasm and a nucleus.",
    },
]


class AssistantTests(unittest.TestCase):
    def test_retrieval_uses_only_verified_resource_text(self):
        passages = assistant._retrieve_passages(
            RESOURCES,
            "What does the cell membrane do?",
            {"resource_id": "verified-cell-resource"},
        )

        self.assertTrue(passages)
        self.assertEqual(
            {passage["resource_id"] for passage in passages},
            {"verified-cell-resource"},
        )
        self.assertTrue(any("controls what enters" in item["description"] for item in passages))

    def test_no_relevant_passage_returns_plain_fallback_without_calling_gemini(self):
        with patch.object(assistant, "_generate_gemini_answer") as generate:
            result = assistant.answer_question(
                "How do quadratic equations work?",
                RESOURCES,
            )

        self.assertEqual(result, {"answer": assistant.NO_EVIDENCE_MESSAGE, "sources": []})
        generate.assert_not_called()

    def test_gemini_receives_server_key_and_grounded_passage(self):
        class Response:
            def __enter__(self):
                return self

            def __exit__(self, *_args):
                return None

            def read(self):
                return json.dumps({
                    "candidates": [{
                        "content": {
                            "parts": [{"text": "The membrane controls what enters and leaves [1]."}]
                        }
                    }]
                }).encode()

        captured = {}

        def fake_urlopen(request, timeout):
            captured["request"] = request
            captured["timeout"] = timeout
            captured["payload"] = json.loads(request.data.decode())
            return Response()

        passages = assistant._retrieve_passages(
            RESOURCES,
            "What does the cell membrane do?",
            {"resource_id": "verified-cell-resource"},
        )
        with patch.dict(os.environ, {"GEMINI_API_KEY": "server-test-key"}), patch.object(
            assistant, "urlopen", side_effect=fake_urlopen
        ):
            answer = assistant._generate_gemini_answer("What does the cell membrane do?", passages, [])

        self.assertIn("membrane", answer)
        self.assertEqual(captured["timeout"], 25)
        self.assertEqual(captured["request"].get_header("X-goog-api-key"), "server-test-key")
        self.assertIn("controls what enters", str(captured["payload"]))
        self.assertIn("systemInstruction", captured["payload"])
        self.assertIn(
            "currently viewing the verified resource",
            captured["payload"]["contents"][-1]["parts"][0]["text"],
        )

    def test_sources_only_include_available_metadata(self):
        sources = assistant._source_references([{
            "resource_id": "resource-1",
            "title": "Cell structure",
            "subject": "Biology",
        }], {1})

        self.assertEqual(sources, [{
            "resource_id": "resource-1",
            "title": "Cell structure",
            "subject": "Biology",
            "citation_numbers": [1],
        }])

    def test_answer_only_returns_references_for_real_passage_citations(self):
        with patch.object(
            assistant,
            "_generate_gemini_answer",
            return_value="The membrane controls what enters the cell [1]. [9]",
        ):
            result = assistant.answer_question(
                "What does the cell membrane do?",
                RESOURCES,
            )

        self.assertEqual(result["answer"], "The membrane controls what enters the cell [1]. ")
        self.assertEqual([source["resource_id"] for source in result["sources"]], [
            "verified-cell-resource",
        ])
        self.assertEqual(result["sources"][0]["citation_numbers"], [1])

    def test_answer_without_valid_source_citation_returns_uncertainty(self):
        with patch.object(
            assistant,
            "_generate_gemini_answer",
            return_value="A claim without a source [99].",
        ):
            result = assistant.answer_question(
                "What does the cell membrane do?",
                RESOURCES,
            )

        self.assertEqual(result, {"answer": assistant.NO_EVIDENCE_MESSAGE, "sources": []})


if __name__ == "__main__":
    unittest.main()

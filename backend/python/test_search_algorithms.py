import unittest

from search_algorithms import (
    build_tfidf_index,
    cosine_similarity,
    extract_terms,
    rank_resources,
)


RESOURCES = [
    {
        "title": "Mitosis and meiosis",
        "description": "Cell division and chromosomes",
        "subject": "Biology",
        "tags": "cell division chromosomes",
    },
    {
        "title": "Quadratic equations",
        "description": "Algebra practice",
        "subject": "Mathematics",
        "tags": "algebra equations",
    },
]


class SearchAlgorithmTests(unittest.TestCase):
    def test_extracts_words_and_two_word_phrases(self):
        terms = extract_terms(RESOURCES[0])
        self.assertIn("mitosis", terms)
        self.assertIn("cell division", terms)
        self.assertNotIn("and", terms)

    def test_builds_tfidf_and_cosine_vectors(self):
        _idf, vectors = build_tfidf_index(RESOURCES)
        self.assertGreater(vectors[0]["mitosis"], 0)
        self.assertEqual(cosine_similarity(vectors[0], vectors[1]), 0)
        self.assertAlmostEqual(cosine_similarity(vectors[0], vectors[0]), 1)

    def test_ranks_related_resource_first(self):
        results = sorted(rank_resources(RESOURCES, "mitosis chromosomes"), key=lambda item: item["score"], reverse=True)
        self.assertEqual(results[0]["title"], "Mitosis and meiosis")


if __name__ == "__main__":
    unittest.main()

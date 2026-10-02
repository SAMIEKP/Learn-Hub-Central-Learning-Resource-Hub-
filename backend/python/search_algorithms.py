"""LearnHub TF-IDF, cosine similarity, keyword extraction and ranking.

This module intentionally uses only Python's standard library so it can be
used from Flask, FastAPI, a worker, or a Supabase indexing job.
"""

from __future__ import annotations

import math
import re
from collections import Counter
from typing import Iterable, Mapping

STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in",
    "is", "it", "of", "on", "or", "that", "the", "this", "to", "with", "will",
    "was", "were", "not", "into", "than", "their", "there", "these", "those",
    "under",
}


def normalise(value: object | None) -> str:
    text = str(value or "").lower()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9\s]", " ", text)).strip()


def tokenize(value: object | None, stop_words: set[str] = STOP_WORDS) -> list[str]:
    return [word for word in normalise(value).split() if word not in stop_words]


def extract_terms(resource: Mapping[str, object], stop_words: set[str] = STOP_WORDS) -> list[str]:
    text = " ".join(
        str(resource.get(field) or "")
        for field in ("title", "description", "subject", "topic", "tags")
    )
    words = tokenize(text, stop_words)
    phrases = [f"{left} {right}" for left, right in zip(words, words[1:])]
    return words + phrases


def build_tfidf_index(resources: list[Mapping[str, object]]) -> tuple[dict[str, float], list[dict[str, float]]]:
    documents = [extract_terms(resource) for resource in resources]
    document_frequency = Counter(
        term for terms in documents for term in set(terms)
    )
    total_documents = max(len(resources), 1)
    idf = {
        term: math.log((total_documents + 1) / (frequency + 1)) + 1
        for term, frequency in document_frequency.items()
    }
    vectors = [to_tfidf_vector(terms, idf) for terms in documents]
    return idf, vectors


def to_tfidf_vector(terms: Iterable[str], idf: Mapping[str, float]) -> dict[str, float]:
    terms = list(terms)
    frequencies = Counter(terms)
    total = max(len(terms), 1)
    return {
        term: (count / total) * idf.get(term, 0.0)
        for term, count in frequencies.items()
    }


def cosine_similarity(left: Mapping[str, float], right: Mapping[str, float]) -> float:
    left_magnitude = math.sqrt(sum(value * value for value in left.values()))
    right_magnitude = math.sqrt(sum(value * value for value in right.values()))
    if not left_magnitude or not right_magnitude:
        return 0.0
    dot_product = sum(value * right.get(term, 0.0) for term, value in left.items())
    return dot_product / (left_magnitude * right_magnitude)


def rank_resources(resources: list[Mapping[str, object]], query: str) -> list[dict[str, object]]:
    idf, vectors = build_tfidf_index(resources)
    query_words = tokenize(query)
    query_vector = to_tfidf_vector(extract_terms({"title": query}), idf)
    normalised_query = normalise(query)

    ranked = []
    for index, resource in enumerate(resources):
        title = normalise(resource.get("title"))
        subject = normalise(resource.get("subject"))
        topic = normalise(resource.get("topic"))
        form = normalise(resource.get("form"))
        tags = normalise(resource.get("tags"))
        terms = extract_terms(resource)
        exact_title = bool(query_words and title == normalised_query)
        title_match = sum(term in title for term in query_words)
        keyword_match = sum(term in tags or term in terms for term in query_words)
        field_match = sum(term in subject or term in topic or term in form for term in query_words)
        similarity = cosine_similarity(query_vector, vectors[index]) if query_words else 0.0
        verified = bool(resource.get("verified") or resource.get("verification_status") == "verified")
        rating = min(float(resource.get("rating") or 0), 5) / 5

        score = (
            (10 if exact_title else 0)
            + title_match * 3
            + similarity * 8
            + keyword_match * 2
            + field_match * 1.5
            + (0.75 if verified else 0)
            + rating * 0.5
            if query_words
            else (0.75 if verified else 0) + rating * 0.5
        )

        ranked.append({
            **resource,
            "score": score,
            "cosine_similarity": similarity,
            "keywords": sorted(vectors[index], key=vectors[index].get, reverse=True)[:10],
        })

    return ranked

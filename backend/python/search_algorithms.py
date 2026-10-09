"""LearnHub TF-IDF, cosine similarity, keyword extraction and ranking."""

from __future__ import annotations

import re
from dataclasses import dataclass
from difflib import SequenceMatcher
from hashlib import sha256
import json
from math import sqrt
from typing import Mapping

from sklearn.feature_extraction.text import TfidfVectorizer

STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in",
    "is", "it", "of", "on", "or", "that", "the", "this", "to", "with", "will",
    "was", "were", "not", "into", "than", "their", "there", "these", "those",
    "under",
}

FUZZY_MATCH_THRESHOLD = 0.78


@dataclass(frozen=True)
class _TfidfIndex:
    idf: dict[str, float]
    vectors: list[dict[str, float]]
    vectorizer: TfidfVectorizer | None
    terms: object


_INDEX_CACHE: dict[str, _TfidfIndex] = {}
_INDEX_CACHE_LIMIT = 4


def normalise(value: object | None) -> str:
    text = str(value or "").lower()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9\s]", " ", text)).strip()


def tokenize(value: object | None, stop_words: set[str] = STOP_WORDS) -> list[str]:
    return [word for word in normalise(_field_text(value)).split() if word not in stop_words]


def _field_text(value: object | None) -> str:
    if isinstance(value, (list, tuple, set)):
        return " ".join(str(item or "") for item in value)
    return str(value or "")


def _resource_text(resource: Mapping[str, object]) -> str:
    return " ".join(
        _field_text(resource.get(field))
        for field in ("title", "description", "subject", "topic", "tags")
    )


def _resource_fingerprint(resources: list[Mapping[str, object]]) -> str:
    payload = json.dumps(
        [_resource_text(resource) for resource in resources],
        ensure_ascii=True,
        separators=(",", ":"),
    )
    return sha256(payload.encode("utf-8")).hexdigest()


def _build_tfidf_index(resources: list[Mapping[str, object]]) -> _TfidfIndex:
    if not resources:
        return _TfidfIndex({}, [], None, [])

    vectorizer = TfidfVectorizer(
        lowercase=True,
        ngram_range=(1, 2),
        stop_words=sorted(STOP_WORDS),
    )
    try:
        matrix = vectorizer.fit_transform([_resource_text(resource) for resource in resources])
    except ValueError:
        # scikit-learn raises when every document is empty or contains only
        # stop words. An empty index is a valid result for that input.
        return _TfidfIndex({}, [{} for _ in resources], None, [])

    terms = vectorizer.get_feature_names_out()
    idf = dict(zip(terms, vectorizer.idf_))
    vectors = [_row_to_vector(matrix.getrow(index), terms) for index in range(matrix.shape[0])]
    return _TfidfIndex(idf, vectors, vectorizer, terms)


def _get_tfidf_index(resources: list[Mapping[str, object]]) -> _TfidfIndex:
    """Return a cached index, rebuilding only when the resource content changes."""
    fingerprint = _resource_fingerprint(resources)
    cached = _INDEX_CACHE.get(fingerprint)
    if cached is not None:
        return cached

    index = _build_tfidf_index(resources)
    _INDEX_CACHE[fingerprint] = index
    if len(_INDEX_CACHE) > _INDEX_CACHE_LIMIT:
        del _INDEX_CACHE[next(iter(_INDEX_CACHE))]
    return index


def extract_terms(resource: Mapping[str, object], stop_words: set[str] = STOP_WORDS) -> list[str]:
    text = _resource_text(resource)
    words = tokenize(text, stop_words)
    phrases = [f"{left} {right}" for left, right in zip(words, words[1:])]
    return words + phrases


def build_tfidf_index(resources: list[Mapping[str, object]]) -> tuple[dict[str, float], list[dict[str, float]]]:
    """Build a standard, smoothed TF-IDF index using scikit-learn.

    The return shape is kept compatible with the original implementation:
    the first value maps terms to IDF values and the second contains one
    sparse vector dictionary per resource.
    """
    index = _get_tfidf_index(resources)
    return index.idf, index.vectors


def _row_to_vector(row: object, terms: object) -> dict[str, float]:
    return {
        str(term): float(value)
        for index, value in zip(row.indices, row.data)
        for term in [terms[index]]
    }


def cosine_similarity(left: Mapping[str, float], right: Mapping[str, float]) -> float:
    left_magnitude = sqrt(sum(value * value for value in left.values()))
    right_magnitude = sqrt(sum(value * value for value in right.values()))
    if not left_magnitude or not right_magnitude:
        return 0.0
    dot_product = sum(value * right.get(term, 0.0) for term, value in left.items())
    return dot_product / (left_magnitude * right_magnitude)


def _fuzzy_token_score(query_word: str, candidates: set[str]) -> float:
    """Return the best useful fuzzy match for a query token."""
    if len(query_word) < 3 or not candidates:
        return 0.0
    return max(
        (
            SequenceMatcher(None, query_word, candidate).ratio()
            for candidate in candidates
            if abs(len(query_word) - len(candidate)) <= max(2, len(query_word) // 3)
        ),
        default=0.0,
    )


def rank_resources(resources: list[Mapping[str, object]], query: str) -> list[dict[str, object]]:
    index = _get_tfidf_index(resources)
    vectors = index.vectors
    query_words = tokenize(query)
    query_vector: dict[str, float] = {}
    if index.vectorizer is not None and query_words:
        query_vector = _row_to_vector(index.vectorizer.transform([query]), index.terms)
    normalised_query = normalise(query)

    ranked = []
    for index, resource in enumerate(resources):
        title = normalise(resource.get("title"))
        title_words = set(tokenize(resource.get("title")))
        subject_words = set(tokenize(resource.get("subject")))
        topic_words = set(tokenize(resource.get("topic")))
        form_words = set(tokenize(resource.get("form")))
        tags_words = set(tokenize(resource.get("tags")))
        all_words = title_words | subject_words | topic_words | form_words | tags_words | set(
            tokenize(resource.get("description"))
        )
        exact_title = bool(query_words and title == normalised_query)
        title_match = sum(term in title_words for term in query_words)
        keyword_match = sum(term in tags_words for term in query_words)
        field_match = sum(term in subject_words or term in topic_words or term in form_words for term in query_words)
        fuzzy_matches = sum(
            _fuzzy_token_score(term, all_words) >= FUZZY_MATCH_THRESHOLD
            for term in query_words
        )
        fuzzy_title_matches = sum(
            _fuzzy_token_score(term, title_words) >= FUZZY_MATCH_THRESHOLD
            for term in query_words
        )
        similarity = cosine_similarity(query_vector, vectors[index]) if query_words else 0.0
        verified = bool(resource.get("verified") or resource.get("verification_status") == "verified")
        try:
            rating = min(max(float(resource.get("rating") or 0), 0), 5) / 5
        except (TypeError, ValueError):
            rating = 0

        score = (
            (10 if exact_title else 0)
            + title_match * 3
            + fuzzy_title_matches * 2
            + fuzzy_matches * 1.25
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

    return sorted(ranked, key=lambda item: item["score"], reverse=True)

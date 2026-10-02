# LearnHub Python search algorithms

Run the tests from this directory:

```bash
python3 -m unittest -v
```

`rank_resources(resources, query)` returns ranked resources with `score`,
`cosine_similarity`, and the top ten TF-IDF `keywords`. The function is ready
to be called by a Python API or indexing worker before writing `keywords` and
`resource_keywords` to Supabase.

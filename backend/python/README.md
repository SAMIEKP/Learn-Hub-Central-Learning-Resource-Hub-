# LearnHub Python search algorithms

Install the Python dependency and run the tests from this directory:

```bash
python3 -m pip install -r requirements.txt
python3 -m unittest -v
```

Start the search microservice with:

```bash
python3 app.py
```

The service exposes `GET /health` and `GET /search?q=biology`. It loads only
verified resources from Supabase using the server-only
`SUPABASE_SERVICE_ROLE_KEY`, ranks them, and paginates the response. Set
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` before starting the service:

```bash
export SUPABASE_URL=https://your-project-ref.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
python3 app.py
```

Search example:

```bash
curl 'http://localhost:5000/search?q=biology&page=1&per_page=20'
```

The response includes `query`, `page`, `per_page`, `total`, and ranked
`results`. `POST /search` remains available for local testing with a JSON
`resources` array. The fitted TF-IDF index is cached in-process by the
resource content fingerprint, so repeated searches reuse the same index.
The cache keeps the four most recent resource snapshots. Search also applies
standard-library fuzzy token matching for common misspellings.

The React client can call the service through `searchResources` in
`src/api/client.js`. Set `REACT_APP_SEARCH_API_URL` when the Flask service is
not running at `http://localhost:5000`.

`rank_resources(resources, query)` uses scikit-learn's standard,
smoothed `TfidfVectorizer` with unigram and bigram features. It returns
resources ranked by `score`, with `cosine_similarity` and the top ten TF-IDF
`keywords`. The function is ready to be called by a Flask API or indexing
worker before writing `keywords` and `resource_keywords` to Supabase.

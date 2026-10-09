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
export SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
python3 app.py
```

The service also exposes `POST /assistant/chat` for the LearnHub Assistant.
It retrieves relevant passages only from verified resources with extracted
text, then asks Gemini to explain the answer in student-friendly language.
Resource titles and IDs are returned as citations; page and section references
are omitted when they are not stored with the indexed resource text. Configure
`GEMINI_API_KEY` on the Python service only (never in the React app), and
optionally set `GEMINI_MODEL` (defaults to `gemini-2.5-flash`). The deployed
Python service must also set `CLIENT_ORIGIN` to the deployed React site's
origin. The deployed React app must set its existing
`REACT_APP_SEARCH_API_URL` to this service's base URL.

Assistant requests require a Supabase access token. The Python service checks
the token with Supabase Auth, then queries verified resources using that
student's JWT and `SUPABASE_ANON_KEY`, so Supabase row-level security applies;
the service-role key is not used for assistant retrieval. Configure the React
app's existing `REACT_APP_SUPABASE_URL` and
`REACT_APP_SUPABASE_PUBLISHABLE_KEY` (or `REACT_APP_SUPABASE_ANON_KEY`) so its
login and signup forms establish real sessions. `SUPABASE_ANON_KEY` is the
server-side anon/publishable client key, not a service-role key. Assistant
conversation history is request-only and is not stored by LearnHub. A
per-user, in-memory rate limit allows 10 requests per minute per Python
process; use a shared gateway or distributed limiter when deploying multiple
workers/replicas.

The request body accepts a `question`, optional `context` for the resource
currently being viewed, and recent `history`. Context helps rank the viewed
resource but does not restrict general questions to it. The API loads resources
from Supabase itself; clients cannot submit resource text. If no relevant
approved passages exist, it returns a plain uncertainty response without
calling Gemini.

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

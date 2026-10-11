# LearnHub Python search algorithms

Install the Python dependencies and run the tests from this directory:

```bash
python3 -m pip install -r requirements.txt
python3 -m unittest -v
```

Start the search and assistant API on port `5001` (port `5000` is commonly
used by macOS services). For local development, fill in the backend values in
`backend/.env`, then load them and start the service from this directory:

```bash
set -a
. ../.env
set +a
python3 app.py
```

For deployment, set the same variables in the backend hosting environment.

The service exposes `GET /health` and `GET /search?q=biology`. It loads only
verified resources from Supabase using the server-only
`SUPABASE_SERVICE_ROLE_KEY` for the public search endpoint, ranks them, and
paginates the response. Search responses contain public display metadata only;
indexed text and storage paths are not returned to the browser.

The React app uses `REACT_APP_SEARCH_API_URL=http://localhost:5001` locally.
For deployment, configure it to the publicly reachable base URL of this
service and set `CLIENT_ORIGIN` to the exact frontend origin. Both values are
required for browser requests to reach the service across origins.

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

Assistant requests use Supabase Auth JWT tokens. The Python
service verifies the token's HS256 signature, audience, expiry, and
authenticated role with `SUPABASE_JWT_SECRET`, then uses that same caller token
to query verified resources through Supabase RLS. Configure
`SUPABASE_JWT_SECRET` on the Python service with the Supabase JWT secret
(found in your Supabase project settings under API > JWT Secret). Keep it
server-side only; never expose it in the React app or commit its value.

Configure frontend `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_PUBLISHABLE_KEY`
(or `REACT_APP_SUPABASE_ANON_KEY`). Keep all secret keys server-side. Assistant
conversation history is request-only and is not stored by LearnHub. A
per-user, in-memory rate limit allows 10 requests per minute per Python
process; use a shared gateway or distributed limiter when deploying multiple
workers/replicas.

Google and Facebook sign-in are configured in Supabase Auth. Enable
the desired OAuth providers in the Supabase Dashboard under Authentication > Providers.
Configure their callback URLs to point to your Learn Hub origin.

The request body accepts a `question`, optional `context` for the resource
currently being viewed, and recent `history`. Context helps rank the viewed
resource but does not restrict general questions to it. The API loads resources
from Supabase itself; clients cannot submit resource text. If no relevant
approved passages exist, it returns a plain uncertainty response without
calling Gemini.

Search example:

```bash
curl 'http://localhost:5001/search?q=biology&page=1&per_page=20'
```

The response includes `query`, `page`, `per_page`, `total`, and ranked
`results`. `POST /search` remains available for local testing with a JSON
`resources` array. The fitted TF-IDF index is cached in-process by the
resource content fingerprint, so repeated searches reuse the same index.
The cache keeps the four most recent resource snapshots. Search also applies
standard-library fuzzy token matching for common misspellings.

The React home-page resource search calls the service through `searchResources`
in `src/api/client.js`. Results are limited to verified resources and open in
the existing resource detail view. Set `REACT_APP_SEARCH_API_URL` when the
Flask service is not running at `http://localhost:5001`.

`rank_resources(resources, query)` uses scikit-learn's standard,
smoothed `TfidfVectorizer` with unigram and bigram features. It returns
resources ranked by `score`, with `cosine_similarity` and the top ten TF-IDF
`keywords`. The function is ready to be called by a Flask API or indexing
worker before writing `keywords` and `resource_keywords` to Supabase.

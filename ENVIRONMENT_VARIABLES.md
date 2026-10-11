# Environment Variables Quick Reference

## Netlify (Frontend)

```bash
REACT_APP_SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=sb_publishable_aXVeXketrCIqQPr763b8Xg_THN8JsOn
REACT_APP_SEARCH_API_URL=https://your-python-backend.onrender.com
```

## Render - Node.js Backend

```bash
PORT=4000
CLIENT_ORIGIN=https://your-frontend.netlify.app
SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
```

## Render - Python Backend

```bash
SEARCH_PORT=5001
CLIENT_ORIGIN=https://your-frontend.netlify.app
SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=PUBVNBHMI9jWJYQ0h/LMGdYNOhbpJzuzmIaMlllNDngNySXibZ9GC4cF4HGN64AOBe5khkofUaFV/kzvW7AuhQ==
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

## Where to Get These Values:

### From Supabase Dashboard:
1. Go to **Project Settings** > **API**
2. Copy:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY` / `REACT_APP_SUPABASE_PUBLISHABLE_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
   - JWT Secret → `SUPABASE_JWT_SECRET`

### From Google AI Studio:
1. Go to https://makersuite.google.com/app/apikey
2. Create API key → `GEMINI_API_KEY`

### From Deployment URLs:
1. After deploying to Netlify → `CLIENT_ORIGIN` and `REACT_APP_SEARCH_API_URL`
2. After deploying to Render → `REACT_APP_SEARCH_API_URL`

## Important:

⚠️ **Replace placeholder values with your actual deployment URLs**
⚠️ **Keep service role keys and JWT secrets server-side only**
⚠️ **Never commit .env files to Git**

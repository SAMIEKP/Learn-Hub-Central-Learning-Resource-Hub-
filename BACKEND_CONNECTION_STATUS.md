# Frontend-Backend Connection Status

## Architecture Overview

Your application has three main components:

1. **Frontend (React)** - Port 3000
   - Uses Supabase Auth for authentication
   - Connects to Python backend for search and assistant features
   - Connects to Node.js backend for API endpoints

2. **Backend Node.js (Express)** - Port 4000
   - Currently minimal (health check only)
   - Uses Supabase service role key for server operations
   - CORS configured for frontend origin

3. **Backend Python (Flask)** - Port 5001
   - Handles resource search (`/search`)
   - Handles LearnHub Assistant (`/assistant/chat`)
   - Verifies Supabase JWT tokens
   - Queries Supabase for resources

## Connection Configuration

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=sb_publishable_aXVeXketrCIqQPr763b8Xg_THN8JsOn
REACT_APP_SEARCH_API_URL=http://localhost:5001
```

### Backend Node.js (backend/.env)
```
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Backend Python (backend/.env)
```
SEARCH_PORT=5001
CLIENT_ORIGIN=http://localhost:3000
SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
```

## What Was Changed

### ✅ Completed Migration
1. Frontend auth migrated from Clerk to Supabase Auth
2. Python backend updated to verify Supabase JWT tokens (not Clerk)
3. Documentation updated to reflect Supabase Auth usage
4. Created the Supabase Auth-compatible application schema (`backend/supabase/app-schema.sql`)

### ⚠️ Important: Database Schema Update Required

The database schema has been updated to use Supabase Auth. There are two scenarios:

**Scenario 1: New Database (No Existing Data)**
- Apply `backend/supabase/app-schema.sql` in the Supabase SQL Editor.
- This creates the Supabase Auth tables, verified schools and memberships,
  resource publishing controls, feed tables, and storage policies.

**Scenario 2: Existing Database**
- Do not re-run the fresh-project schema against an existing database.
- Create and review a dedicated migration for the database's current state before
  deploying these changes.

The schema now:
- Uses Supabase Auth's `auth.uid()` in RLS policies.
- Protects tables with least-privilege RLS policies.
- Uses approved school memberships to determine who can publish resources.
- Keeps resource files in a private Storage bucket.

## Testing the Connection

### 1. Start all services:

```bash
# Terminal 1: Frontend
cd "/Users/samuelkapalamula/Documents/Learn Hub (Central Learning Resource Hub) ° Project/Learn Hub (Central Learning Resource Hub)"
npm start

# Terminal 2: Node.js Backend
cd backend
npm run dev

# Terminal 3: Python Backend
cd backend/python
export SEARCH_PORT=5001
export CLIENT_ORIGIN=http://localhost:3000
export SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
export SUPABASE_ANON_KEY=your-anon-key
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
export SUPABASE_JWT_SECRET=your-jwt-secret
export GEMINI_API_KEY=your-gemini-api-key
python3 app.py
```

### 2. Verify health endpoints:

```bash
# Node.js backend
curl http://localhost:4000/health

# Python backend
curl http://localhost:5001/health
```

### 3. Test authentication flow:
1. Open http://localhost:3000
2. Try to sign up / sign in with Supabase Auth
3. Check browser console for any errors
4. Verify session is created in Supabase dashboard

### 4. Test search (after applying new schema):
```bash
curl 'http://localhost:5001/search?q=biology&page=1&per_page=20'
```

### 5. Test assistant (requires signed-in user):
```bash
# This will fail without a valid Supabase JWT token
curl -X POST http://localhost:5001/assistant/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN" \
  -d '{"question": "What is photosynthesis?"}'
```

## Common Issues

### Issue: "Invalid Supabase session token"
**Cause**: Python backend cannot verify JWT token
**Solution**: Ensure `SUPABASE_JWT_SECRET` is set correctly in Python backend .env

### Issue: RLS policies blocking access
**Cause**: The current `app-schema.sql` has not been applied, or the connected
database is running an older schema.
**Solution**: For a new project, apply `backend/supabase/app-schema.sql`. For an
existing project, create a reviewed migration instead of applying the fresh schema.

### Issue: CORS errors
**Cause**: `CLIENT_ORIGIN` not set correctly
**Solution**: Ensure `CLIENT_ORIGIN` matches your frontend URL exactly

### Issue: "Supabase denied resource access"
**Cause**: Invalid or expired JWT token, or RLS policy mismatch
**Solution**: Check user is authenticated and schema is updated

## Next Steps

1. **Apply the new schema** to your Supabase project
2. **Update environment variables** with your actual Supabase credentials
3. **Start all services** and test the connection
4. **Test the full auth flow** (sign up, sign in, profile creation)
5. **Test search and assistant** features with authenticated user

## Environment Variables Checklist

- [ ] Frontend: `REACT_APP_SUPABASE_URL`
- [ ] Frontend: `REACT_APP_SUPABASE_PUBLISHABLE_KEY`
- [ ] Frontend: `REACT_APP_SEARCH_API_URL`
- [ ] Backend Node.js: `PORT`
- [ ] Backend Node.js: `CLIENT_ORIGIN`
- [ ] Backend Node.js: `SUPABASE_URL`
- [ ] Backend Node.js: `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Backend Python: `SEARCH_PORT`
- [ ] Backend Python: `CLIENT_ORIGIN`
- [ ] Backend Python: `SUPABASE_URL`
- [ ] Backend Python: `SUPABASE_ANON_KEY`
- [ ] Backend Python: `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Backend Python: `SUPABASE_JWT_SECRET`
- [ ] Backend Python: `GEMINI_API_KEY`

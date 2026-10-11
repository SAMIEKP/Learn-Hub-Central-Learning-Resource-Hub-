# Deployment Guide - Render (Backend) + Netlify (Frontend) + Supabase (Database)

## Architecture

- **Frontend**: Netlify (React app)
- **Backend Node.js**: Render (Express API)
- **Backend Python**: Render (Flask - Search & Assistant)
- **Database**: Supabase (PostgreSQL + Auth + Storage)

---

## 1. Supabase Configuration (Already Done)

Your database is already on Supabase. Get these values from your Supabase Dashboard:

### Supabase Dashboard > Project Settings > API:

```
SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=PUBVNBHMI9jWJYQ0h/LMGdYNOhbpJzuzmIaMlllNDngNySXibZ9GC4cF4HGN64AOBe5khkofUaFV/kzvW7AuhQ==
```

### Configure Supabase Auth:

1. **Authentication** > **Providers** > **Email**
   - Enable "Confirm email" (recommended)
   
2. **Authentication** > **URL Configuration**
   - Site URL: `https://your-frontend-url.netlify.app`
   - Redirect URLs: Add `https://your-frontend-url.netlify.app/**`

3. **Authentication** > **Email Templates**
   - Customize confirmation email if desired

---

## 2. Netlify Deployment (Frontend)

### Environment Variables for Netlify:

Go to your Netlify site > **Site Settings** > **Environment Variables**

```bash
# Required
REACT_APP_SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=sb_publishable_aXVeXketrCIqQPr763b8Xg_THN8JsOn
REACT_APP_SEARCH_API_URL=https://your-backend-render-url.onrender.com

# Optional - for API backend if using it
REACT_APP_API_URL=https://your-backend-render-url.onrender.com
```

### Build Settings (Netlify):

- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Node version**: 20 or higher

### Deploy to Netlify:

```bash
# Option 1: Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod

# Option 2: Git Integration
1. Push your code to GitHub
2. Connect Netlify to your GitHub repo
3. Configure build settings
4. Deploy automatically on push
```

---

## 3. Render Deployment - Node.js Backend

### Environment Variables for Render:

Go to your Render service > **Environment**

```bash
# Required
PORT=4000
CLIENT_ORIGIN=https://your-frontend-url.netlify.app
SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional
NODE_ENV=production
```

### Render Service Configuration:

1. **Web Service** (New)
2. **Name**: learnhub-backend-node
3. **Region**: Choose nearest to your users
4. **Branch**: main
5. **Root Directory**: `backend`
6. **Build Command**: `npm install`
7. **Start Command**: `npm start`
8. **Runtime**: Node

### render.yaml (Optional - for automatic deployment):

Create `backend/render.yaml`:

```yaml
services:
  - type: web
    name: learnhub-backend-node
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: PORT
        value: 4000
      - key: CLIENT_ORIGIN
        value: https://your-frontend-url.netlify.app
      - key: SUPABASE_URL
        value: https://vplkktzgytphfxcdelor.supabase.co
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
```

---

## 4. Render Deployment - Python Backend

### Environment Variables for Render:

Go to your Render service > **Environment**

```bash
# Required
SEARCH_PORT=5001
CLIENT_ORIGIN=https://your-frontend-url.netlify.app
SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=PUBVNBHMI9jWJYQ0h/LMGdYNOhbpJzuzmIaMlllNDngNySXibZ9GC4cF4HGN64AOBe5khkofUaFV/kzvW7AuhQ==
GEMINI_API_KEY=your-gemini-api-key

# Optional
GEMINI_MODEL=gemini-2.5-flash
```

### Render Service Configuration:

1. **Web Service** (New)
2. **Name**: learnhub-backend-python
3. **Region**: Choose nearest to your users
4. **Branch**: main
5. **Root Directory**: `backend/python`
6. **Build Command**: (leave empty or `pip install -r requirements.txt`)
7. **Start Command**: `python3 app.py`
8. **Runtime**: Python 3

### Create requirements.txt (if not exists):

Ensure `backend/python/requirements.txt` exists:

```txt
flask
flask-cors
google-generativeai
scikit-learn
PyJWT
```

### render.yaml (Optional - for automatic deployment):

Create `backend/python/render.yaml`:

```yaml
services:
  - type: web
    name: learnhub-backend-python
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: python3 app.py
    envVars:
      - key: SEARCH_PORT
        value: 5001
      - key: CLIENT_ORIGIN
        value: https://your-frontend-url.netlify.app
      - key: SUPABASE_URL
        value: https://vplkktzgytphfxcdelor.supabase.co
      - key: SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: SUPABASE_JWT_SECRET
        sync: false
      - key: GEMINI_API_KEY
        sync: false
```

---

## 5. Complete Environment Variables Checklist

### Netlify (Frontend):
- [ ] `REACT_APP_SUPABASE_URL`
- [ ] `REACT_APP_SUPABASE_PUBLISHABLE_KEY`
- [ ] `REACT_APP_SEARCH_API_URL`

### Render - Node.js Backend:
- [ ] `PORT`
- [ ] `CLIENT_ORIGIN`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NODE_ENV` (optional)

### Render - Python Backend:
- [ ] `SEARCH_PORT`
- [ ] `CLIENT_ORIGIN`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_JWT_SECRET`
- [ ] `GEMINI_API_KEY`
- [ ] `GEMINI_MODEL` (optional)

### Supabase:
- [ ] Enable email confirmation in Auth settings
- [ ] Add frontend URL to Redirect URLs
- [ ] Configure email templates (optional)
- [ ] Enable OAuth providers if needed (Google, Facebook)

---

## 6. Deployment Steps

### Step 1: Prepare Your Code

```bash
# Ensure .gitignore is correct
echo ".env" >> .gitignore
echo "backend/.env" >> .gitignore
echo "backend/python/.env" >> .gitignore

# Commit your changes
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Frontend to Netlify

1. Go to https://app.netlify.com
2. "Add new site" > "Import from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Add environment variables
6. Deploy

### Step 3: Deploy Node.js Backend to Render

1. Go to https://dashboard.render.com
2. "New" > "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

### Step 4: Deploy Python Backend to Render

1. Go to https://dashboard.render.com
2. "New" > "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Root Directory: `backend/python`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python3 app.py`
5. Add environment variables
6. Deploy

### Step 5: Update URLs

After deployment, you'll get URLs like:
- Frontend: `https://learnhub-frontend.netlify.app`
- Node.js Backend: `https://learnhub-backend-node.onrender.com`
- Python Backend: `https://learnhub-backend-python.onrender.com`

Update your environment variables with these actual URLs.

### Step 6: Configure Supabase

1. Update Supabase Redirect URLs with your Netlify URL
2. Test the complete flow

---

## 7. Testing After Deployment

```bash
# Test health endpoints
curl https://your-node-backend.onrender.com/health
curl https://your-python-backend.onrender.com/health

# Test frontend
# Open https://your-frontend.netlify.app in browser
# Try to sign up/sign in
```

---

## 8. Free Tier Limits

### Netlify Free Tier:
- 100GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

### Render Free Tier:
- 750 hours/month per service
- Web services spin down after 15 min inactivity
- Cold start on first request (~30s)

### Supabase Free Tier:
- 500MB database
- 1GB file storage
- 50,000 MAU/month
- 2GB bandwidth/month

---

## 9. Important Security Notes

⚠️ **NEVER commit these to Git:**
- `.env` files
- Service role keys
- JWT secrets
- API keys

⚠️ **Always use environment variables:**
- In production, set these in deployment platform
- Never hardcode secrets in code
- Use different keys for dev/staging/production

---

## 10. Troubleshooting

### Issue: CORS errors
**Solution**: Ensure `CLIENT_ORIGIN` in backend matches your frontend URL exactly

### Issue: Backend not starting
**Solution**: Check Render logs, ensure start command is correct

### Issue: Database connection failed
**Solution**: Verify Supabase URL and keys are correct in environment variables

### Issue: Email not sending
**Solution**: Check Supabase Auth email provider settings

### Issue: "Service unavailable" on first request
**Solution**: Render free tier spins down after inactivity, first request may be slow

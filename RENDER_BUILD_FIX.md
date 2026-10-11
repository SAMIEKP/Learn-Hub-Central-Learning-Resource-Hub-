# Render Build Fix - Node.js Backend

## The Problem

Your Render build failed with:
```
sh: 1: react-scripts: not found
```

This happened because Render was trying to build the **frontend** (React app) instead of the **backend** (Node.js Express app).

## The Solution

### Option 1: Manual Configuration (Recommended)

1. Go to your Render service dashboard
2. Click **Settings** > **Build & Deploy**
3. Update these settings:

**For Node.js Backend:**
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**For Python Backend:**
- **Root Directory**: `backend/python`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python3 app.py`

4. Save and trigger a new deploy

### Option 2: Using render.yaml Files

I've moved the render.yaml files to the root directory:
- `render-node.yaml` - For Node.js backend
- `render-python.yaml` - For Python backend

To use them:

1. **Rename the file you want to use** to `render.yaml`:
   ```bash
   # For Node.js backend
   mv render-node.yaml render.yaml

   # OR for Python backend
   mv render-python.yaml render.yaml
   ```

2. **Commit and push** to GitHub
3. **Render will auto-detect** and use the configuration

### Option 3: Delete and Recreate Service

If the above doesn't work:

1. Delete the failed Render service
2. Create a new Web Service
3. When connecting to GitHub, **specify the root directory**:
   - For Node.js: `backend`
   - For Python: `backend/python`
4. Set build and start commands correctly
5. Add environment variables

## Why This Happened

Render automatically detects project type from the root directory. Since your root has `package.json` with React scripts, it tried to build as a React app. By specifying the `rootDir`, we tell Render to look in the subdirectory for the actual backend code.

## Verification

After fixing, the build log should show:

**Node.js Backend:**
```
==> Cloning from https://github.com/...
==> Installing Node.js version 20...
==> Running build command 'npm install'...
added XX packages in Xs
==> Starting service with 'npm start'
Learn Hub backend listening on port 4000
```

**Python Backend:**
```
==> Cloning from https://github.com/...
==> Installing Python dependencies...
==> Starting service with 'python3 app.py'
* Running on http://0.0.0.0:5001
```

## If You Still Have Issues

1. Check that `backend/package.json` exists and has correct scripts
2. Check that `backend/src/server.js` exists
3. Ensure Node.js version is >= 20 (specified in package.json)
4. For Python: Ensure `requirements.txt` exists in `backend/python/`

## Quick Fix Commands

```bash
# Check backend package.json
cat backend/package.json

# Check backend server exists
ls backend/src/server.js

# Check Python requirements
cat backend/python/requirements.txt
```

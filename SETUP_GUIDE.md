# Setup Guide - After Schema Migration

## 1. Verify Schema Application

First, run the verification script in Supabase SQL Editor:

```sql
-- Run: supabase/verify-schema.sql
```

This will confirm:
- ✅ `current_user_id` function exists
- ✅ Old Clerk functions removed
- ✅ All tables created
- ✅ RLS policies configured

## 2. Install Frontend Dependencies

If you have Node.js installed:

```bash
cd "/Users/samuelkapalamula/Documents/Learn Hub (Central Learning Resource Hub) ° Project/Learn Hub (Central Learning Resource Hub)"
npm install
```

If you don't have Node.js, install it from https://nodejs.org/ (version 20 or higher recommended).

## 3. Create Frontend .env File

Create `.env` in the root directory (this file is in .gitignore for security):

```bash
REACT_APP_SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=sb_publishable_aXVeXketrCIqQPr763b8Xg_THN8JsOn
REACT_APP_SEARCH_API_URL=http://localhost:5001
```

**Note**: You can get these values from your Supabase Dashboard > Project Settings > API

## 4. Install Backend Dependencies

### Node.js Backend:

```bash
cd backend
npm install
```

### Python Backend:

```bash
cd backend/python
pip3 install -r requirements.txt
```

## 5. Create Backend .env Files

### Backend Node.js (.env):

Create `backend/.env`:

```bash
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get `SUPABASE_SERVICE_ROLE_KEY` from Supabase Dashboard > Project Settings > API

### Backend Python (.env):

Create `backend/python/.env`:

```bash
SEARCH_PORT=5001
CLIENT_ORIGIN=http://localhost:3000
SUPABASE_URL=https://vplkktzgytphfxcdelor.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.5-flash
```

Get these values from:
- `SUPABASE_ANON_KEY`: Supabase Dashboard > Project Settings > API
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard > Project Settings > API
- `SUPABASE_JWT_SECRET`: Supabase Dashboard > Project Settings > API > JWT Secret
- `GEMINI_API_KEY`: Google AI Studio (https://makersuite.google.com/app/apikey)

## 6. Start All Services

Open 3 terminal windows:

### Terminal 1 - Frontend:
```bash
cd "/Users/samuelkapalamula/Documents/Learn Hub (Central Learning Resource Hub) ° Project/Learn Hub (Central Learning Resource Hub)"
npm start
```

### Terminal 2 - Node.js Backend:
```bash
cd backend
npm run dev
```

### Terminal 3 - Python Backend:
```bash
cd backend/python
python3 app.py
```

## 7. Test the Application

1. Open http://localhost:3000 in your browser
2. Try to sign up a new account
3. Check Supabase Dashboard > Authentication > Users to see if user was created
4. Check Supabase Dashboard > Table Editor > profiles to see if profile was created
5. Try to sign in with the new account
6. Test resource search
7. Test assistant feature (if Gemini API key is configured)

## 8. Common Issues

### Issue: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### Issue: "python3: command not found"
**Solution**: Install Python 3 from https://python.org/

### Issue: Port already in use
**Solution**: Change the port in .env files or kill the process using the port

### Issue: CORS errors
**Solution**: Ensure `CLIENT_ORIGIN` matches your frontend URL exactly

### Issue: "Invalid Supabase session token"
**Solution**: Ensure `SUPABASE_JWT_SECRET` is set correctly in Python backend

### Issue: RLS blocking access
**Solution**: Verify schema was applied correctly using verify-schema.sql

## 9. Quick Verification Checklist

- [ ] Schema applied in Supabase SQL Editor
- [ ] Verification script passes all checks
- [ ] Frontend .env created with correct values
- [ ] Backend Node.js .env created with correct values
- [ ] Backend Python .env created with correct values
- [ ] All dependencies installed
- [ ] All 3 services start without errors
- [ ] Can access frontend at http://localhost:3000
- [ ] Can sign up/sign in successfully
- [ ] User appears in Supabase Auth dashboard
- [ ] Profile appears in Supabase profiles table

## 10. Next Steps

Once everything is working:

1. Test all features (search, assistant, profile management)
2. Configure OAuth providers (Google, Facebook) in Supabase Dashboard if needed
3. Set up storage buckets in Supabase for file uploads
4. Deploy to production when ready

## Support

If you encounter issues:

1. Check browser console for frontend errors
2. Check terminal logs for backend errors
3. Check Supabase Dashboard logs
4. Review DATABASE_MIGRATION_GUIDE.md
5. Review BACKEND_CONNECTION_STATUS.md

# Admin Dashboard Data Issue - Troubleshooting Guide

## Problem
Data is not showing in the admin dashboard (Services, Guidelines, Consultations tabs).

## Verification Steps

### 1. Check MongoDB Data
The database HAS data (verified):
- ✅ 6 Services
- ✅ 8 Guidelines  
- ✅ 2 Consultations
- ✅ 1 Admin User (username: Chandramohan)

### 2. Debug Tools Added

#### A. Enhanced Logging
Added console.log statements to track API calls in `frontend/js/api.js`:
- Shows which endpoints are being called
- Displays response status codes
- Logs actual data received

#### B. Debug Page
Created `frontend/test-admin.html` - Open this in browser to:
- Test authentication status
- Test each API endpoint individually
- Try logging in
- See detailed error messages

**To use**: Navigate to `http://localhost:3000/test-admin.html`

## Common Issues & Solutions

### Issue 1: Not Logged In
**Symptom**: "Not authenticated" errors
**Solution**: 
1. Go to `/login`
2. Login with:
   - Username: `Chandramohan`
   - Password: `5655`
3. Then go to `/admin`

### Issue 2: Session Not Working
**Symptom**: Keep getting redirected to login
**Solution**:
1. Check if `express-session` is installed: `npm install`
2. Make sure `.env` file exists
3. Clear browser cookies and try again

### Issue 3: CORS Issues
**Symptom**: Network errors in console
**Solution**: Server is configured with `credentials: true` - should work

### Issue 4: MongoDB Not Running
**Symptom**: Connection errors
**Solution**: Run `mongod.bat` from project folder

## Testing Steps

1. **Start MongoDB** (if not running):
   ```
   mongod.bat
   ```

2. **Start Server** (in new terminal):
   ```
   npm start
   ```

3. **Open Debug Page**:
   - Go to: http://localhost:3000/test-admin.html
   - Click "Check Authentication"
   - If not logged in, use the Login Test section
   - Then test each API endpoint

4. **Check Browser Console**:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for log messages starting with "Fetching..."
   - Check for any red error messages

5. **Try Admin Dashboard**:
   - Go to: http://localhost:3000/admin
   - Open Console (F12)
   - Watch for log messages
   - Should see:
     - "Fetching services from: /api/services"
     - "Services response status: 200"
     - "Services data: [...]"

## Expected Console Output (Success)

When admin dashboard loads successfully, you should see:
```
Fetching services from: /api/services
Services response status: 200
Services data: [{title: "Building Plan Approval", ...}, ...]
Fetching guidelines from: /api/guidelines
Guidelines response status: 200
Guidelines data: [{title: "FSI Rules", ...}, ...]
Fetching consultations from: /api/consultations
Consultations response status: 200
Consultations data: [{name: "Ram", ...}, ...]
```

## Quick Fix Checklist

- [ ] MongoDB is running (`mongod.bat`)
- [ ] Server is running (`npm start`)
- [ ] Logged in as admin at `/login`
- [ ] Browser console shows no errors
- [ ] Can see data at `/test-admin.html`
- [ ] Session cookies are enabled in browser

## If Still Not Working

1. Open browser DevTools (F12)
2. Go to Network tab
3. Visit `/admin` page
4. Look for API calls to `/api/services`, `/api/guidelines`, `/api/consultations`
5. Click on each request
6. Check:
   - Status code (should be 200)
   - Response tab (should show JSON data)
   - If 401: Not authenticated - need to login
   - If 500: Server error - check terminal logs

7. Share screenshot of:
   - Browser console errors
   - Network tab showing API calls
   - Terminal/server logs

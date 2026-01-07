# Quick Start Guide - API Integration

## Prerequisites

1. **Backend Server**: Ensure your Laravel backend is running on `http://localhost/backend-service-provider`
2. **Node.js**: Version 18 or higher
3. **npm**: Version 9 or higher

## Step 1: Install Dependencies

Dependencies are already installed. If needed, run:

```bash
npm install
```

## Step 2: Configure API Base URL

The API base URL is already configured in `src/config/api.config.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost/backend-service-provider',
};
```

**To change for production:**
1. Edit `src/config/api.config.js`
2. Update `BASE_URL` to your production URL
3. Or use environment variables (see API_INTEGRATION.md)

## Step 3: Start Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173`

## Step 4: Test Login Flow

1. Open browser to `http://localhost:5173/login`

2. **Login Credentials:**
   - Email: `hussainmahamud.swe@gmail.com`
   - Password: `12345678`

3. Click "Sign In"
   - On success: Redirected to 2FA verification page
   - On error: Error message displayed below form

4. **2FA Verification:**
   - Code: `123456`
   - Enter the 6-digit code
   - Click "Verify & Continue"
   - On success: Redirected to dashboard

## API Request Flow

### Login Request
```
POST http://localhost/backend-service-provider/api/login
Content-Type: multipart/form-data

Form Data:
  email: hussainmahamud.swe@gmail.com
  password: 12345678
```

### 2FA Verification Request
```
POST http://localhost/backend-service-provider/api/verify-2fa
Content-Type: multipart/form-data

Form Data:
  email: hussainmahamud.swe@gmail.com
  code: 123456
```

## Debugging Tools

### 1. React Query DevTools

Access the floating icon in the bottom-right corner (development mode only).

Features:
- View all queries and mutations
- See query states (loading, success, error)
- Inspect cached data
- Manual refetch/invalidate

### 2. Browser Console

All API requests and responses are logged in development:

```
🚀 API Request: POST /api/login { email: "...", password: "..." }
✅ API Response: { status: 200, data: {...} }
```

### 3. Network Tab

Open DevTools → Network tab to inspect:
- Request headers
- Response data
- Status codes
- Timing

## Common Issues & Solutions

### 1. CORS Error

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:** Enable CORS in your Laravel backend:

```php
// In Laravel: config/cors.php or middleware
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
```

### 2. Connection Refused

**Error:** `ERR_CONNECTION_REFUSED`

**Solution:** 
- Ensure backend server is running
- Check correct URL in `api.config.js`
- Verify backend runs on port specified

### 3. 401 Unauthorized (After Login)

**Error:** API returns 401 on subsequent requests

**Solution:**
- Check if token is saved: `localStorage.getItem('authToken')`
- Verify token format in Authorization header
- Check backend expects `Bearer {token}` format

### 4. Network Error

**Error:** `Network error. Please check your connection.`

**Solution:**
- Backend server not running
- Wrong API base URL
- Firewall blocking requests

## Testing Checklist

- [ ] Backend server running
- [ ] Frontend dev server running (`npm run dev`)
- [ ] Login page loads
- [ ] Can submit login form
- [ ] Loading state shows
- [ ] Redirects to 2FA on success
- [ ] Error message shows on failure
- [ ] 2FA page loads
- [ ] Can enter 6-digit code
- [ ] Can verify code
- [ ] Redirects to dashboard on success
- [ ] Token saved in localStorage
- [ ] React Query DevTools accessible

## File Structure

```
src/
├── config/
│   └── api.config.js          ✅ API configuration
├── lib/
│   └── apiClient.js           ✅ Axios instance
├── services/
│   ├── auth.service.js        ✅ Auth API methods
│   └── index.js               ✅ Services export
├── hooks/
│   └── useAuth.js             ✅ React Query hooks
└── components/
    └── pages/
        ├── Login.js           ✅ Updated with useLogin
        └── TwoFactorAuth.js   ✅ Updated with useVerify2FA
```

## Next Steps

1. **Test with Backend:**
   ```bash
   # Start backend server
   php artisan serve
   
   # Start frontend
   npm run dev
   
   # Test login flow
   ```

2. **Create More Services:**
   - See `docs/API_INTEGRATION.md` for detailed guide
   - Create services for Users, Providers, Services, etc.

3. **Add Error Handling:**
   - Toast notifications for errors
   - Form validation
   - Retry logic

4. **Implement Logout:**
   ```javascript
   import { useLogout } from '../hooks/useAuth';
   
   const logoutMutation = useLogout();
   
   const handleLogout = () => {
     logoutMutation.mutate();
   };
   ```

## Need Help?

1. Check browser console for errors
2. Check React Query DevTools
3. Check Network tab for API responses
4. Review `docs/API_INTEGRATION.md` for detailed documentation
5. Ensure backend server is running and accessible

## Success Indicators

✅ **Login Working:**
- Form submits
- Loading spinner shows
- Redirects to 2FA page
- No errors in console

✅ **2FA Working:**
- Code can be entered
- Verification triggers
- Redirects to dashboard
- Token saved in localStorage

✅ **Authentication Persists:**
- Dashboard accessible after login
- Token included in API requests
- Protected routes work

---

**Last Updated:** October 24, 2025
**API Version:** v1.0
**Framework:** React 19 + TanStack Query v5

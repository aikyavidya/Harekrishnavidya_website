# PayU Not Showing - Troubleshooting Guide

## Issue
Only Razorpay option is visible, PayU option is not showing in payment gateway selection dialog.

## Quick Checks

### 1. Verify Frontend is Deployed
- Make sure you've built and deployed the latest frontend code
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private browsing mode
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)

### 2. Check if Payment Dialog is Showing
The payment dialog should show **both** options:
- ✅ Razorpay (blue button)
- ✅ PayU (green button)

If you're not seeing the dialog at all, check:
- Open browser console (F12)
- Look for any JavaScript errors
- Check if `showPaymentDialog` state is being set

### 3. Verify Code is Updated
Check that your deployed code includes:
- Line 1263: `{/* PayU Option */}`
- Lines 1264-1277: PayU button code

### 4. Check Build Output
After building, verify PayU code is included:
```bash
cd iskcon_website
npm run build
# Check the build output - PayU should be in the compiled code
```

### 5. Environment Variables
Make sure frontend environment variables are set:
```env
NEXT_PUBLIC_DONATION_API_URL=https://api.harekrishnavidya.org/api/donations
```

## Debugging Steps

### Step 1: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Click "Donate Now" button
4. Look for errors or logs

### Step 2: Inspect Payment Dialog
1. After clicking "Donate Now", if dialog appears
2. Right-click on the dialog
3. Select "Inspect Element"
4. Check if PayU button HTML is present

### Step 3: Check Network Requests
1. Open Network tab in DevTools
2. Click "Donate Now"
3. Look for `/submit-form` request
4. Check if it's successful
5. Look for `/create-payu-order` - shouldn't be called yet

### Step 4: Verify State
In browser console, run:
```javascript
// Check if payment dialog should show
document.querySelector('[class*="bg-black bg-opacity-50"]')
// Should find the dialog overlay

// Check PayU button
document.querySelector('button[onclick*="payu"]')
// Should find the PayU button
```

## Common Issues

### Issue 1: Old Code Cached
**Fix**: 
- Clear browser cache
- Redeploy frontend
- Use hard refresh (Ctrl+F5)

### Issue 2: Build Not Updated
**Fix**:
```bash
cd iskcon_website
npm run build
# Deploy the new build
```

### Issue 3: Conditional Logic (if any)
Check if there's any condition hiding PayU. Based on current code, both should always show.

### Issue 4: CSS Hiding PayU
**Fix**: Check if PayU button has `display: none` or is hidden by CSS

## Expected Behavior

When you click "Donate Now" after filling the form:
1. Form submits to `/submit-form`
2. Payment dialog appears with:
   - 💳 Choose Payment Method heading
   - Razorpay button (blue)
   - PayU button (green)
   - Cancel button
3. User can click either option

## If Still Not Working

1. **Check deployed code** - verify PayU button is in production build
2. **Check browser console** - look for JavaScript errors
3. **Check Network tab** - verify API calls are working
4. **Try different browser** - rule out browser-specific issues
5. **Check server logs** - verify backend is receiving requests

## Quick Test

Add a console log to verify PayU button renders:
```typescript
{/* PayU Option */}
<button
  onClick={() => {
    console.log('PayU button clicked');
    handlePaymentGatewaySelection('payu');
  }}
  ...
```


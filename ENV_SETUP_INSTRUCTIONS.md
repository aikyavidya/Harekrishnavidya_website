# Environment Setup Instructions

## 🔧 Create .env.local File

Since `.env.local` is blocked by global ignore, you need to manually create this file in your project root.

### Step 1: Create the file
Create a new file called `.env.local` in your project root directory (same level as `package.json`).

### Step 2: Add the following content to `.env.local`:

```env
# Donation API Configuration
NEXT_PUBLIC_DONATION_API_URL=https://harekrishnavidya.org/api/donations

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SRm4r1QeQbuoSE
RAZORPAY_SECRET_KEY=pRsEm4Gp7Qk7J7Sj4AC8A8Es
RAZORPAY_WEBHOOK_SECRET=https://harekrishnavidya.org/monthly-donation/verify-webhook.php

# Environment
NODE_ENV=production
```

### Step 3: Save the file
Make sure to save the file and restart your development server.

### Step 4: Verify the setup
After creating the `.env.local` file, restart your Next.js development server:

```bash
npm run dev
```

## 🔒 Security Notes

1. **Never commit `.env.local` to version control** - It's already in `.gitignore`
2. **Keep your secret keys secure** - Don't share them publicly
3. **Use different keys for development and production** - You're using live keys, so be careful during testing

## 🧪 Testing with Live Keys

Since you're using live Razorpay keys (`rzp_live_*`), be aware that:
- All transactions will be real and charge actual money
- Test with small amounts only
- Consider creating test keys for development

## 🔄 Environment Variables Explained

- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Public key used in the frontend (safe to expose)
- `RAZORPAY_SECRET_KEY`: Secret key used only on the server side (never exposed to frontend)
- `RAZORPAY_WEBHOOK_SECRET`: Webhook URL for payment verification
- `NEXT_PUBLIC_DONATION_API_URL`: Your backend API endpoint

## ✅ Verification

To verify the environment variables are loaded correctly:

1. Check the browser console for any errors
2. The donation form should now use your live Razorpay keys
3. API calls should go to your production server

## 🚨 Important

- These are **LIVE** Razorpay keys, so all transactions will be real
- Test with minimal amounts (₹1) to avoid charges
- Consider setting up test keys for development if needed

# Donation API Integration Setup Guide

This guide will help you set up the donation API integration with Razorpay payment processing.

## 🚀 Quick Setup

### 1. Environment Configuration

Create a `.env.local` file in your project root with the following variables:

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

### 2. Get Razorpay API Keys

1. Sign up for a Razorpay account at [razorpay.com](https://razorpay.com)
2. Go to your Razorpay Dashboard
3. Navigate to Settings > API Keys
4. Generate a new key pair
5. Copy the Key ID and Secret Key to your `.env.local` file

**Important Notes:**
- You are using **LIVE** keys (`rzp_live_*`) - all transactions will be real
- Test with minimal amounts (₹1) to avoid charges
- Never commit your secret key to version control
- Consider creating test keys for development if needed

### 3. Backend Server Setup

Ensure your backend server is running on `https://harekrishnavidya.org` with the donation API endpoints:

- `POST /api/donations/submit-form` - Submit donation form
- `POST /api/donations/verify-payment-form` - Verify payment
- `GET /api/donations/order/:orderId` - Get donation details

### 4. Test the Integration

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/donation` page
3. Select a donation option
4. Fill out the form and test the payment flow

## 🔧 Configuration Options

### API Base URL
Change `NEXT_PUBLIC_DONATION_API_URL` to point to your backend server:
- Development: `https://api.harekrishnavidya.org/api/donations`
- Staging: `https://staging-api.yourdomain.com/api/donations`
- Production: `https://api.yourdomain.com/api/donations`

### Payment Settings
You can modify payment settings in `app/config/donation.ts`:

```typescript
PAYMENT: {
  CURRENCY: 'INR',
  MIN_AMOUNT: 1, // Minimum donation amount
  MAX_AMOUNT: 1000000, // Maximum donation amount
}
```

### Organization Details
Update organization details in the config:

```typescript
ORGANIZATION: {
  NAME: 'ISKCON',
  DESCRIPTION: 'International Society for Krishna Consciousness',
  THEME_COLOR: '#FF6800',
}
```

## 🧪 Testing

### Test Payment Flow
1. Use Razorpay test cards for testing:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name

### Test Scenarios
- ✅ Valid donation form submission
- ✅ Payment processing with Razorpay
- ✅ Payment verification
- ✅ Success message display
- ✅ Form reset after successful payment
- ❌ Invalid form data handling
- ❌ Network error handling
- ❌ Payment failure handling

## 🔒 Security Considerations

1. **Environment Variables**: Never expose sensitive keys in client-side code
2. **HTTPS**: Use HTTPS in production for secure data transmission
3. **Input Validation**: All form inputs are validated on both client and server
4. **Payment Verification**: Always verify payment signatures on the server side
5. **Rate Limiting**: Implement rate limiting on your backend API

## 🐛 Troubleshooting

### Common Issues

1. **Razorpay not loading**
   - Check if the script is loading correctly
   - Verify your Razorpay key is correct
   - Check browser console for errors

2. **API connection errors**
   - Verify your backend server is running
   - Check the API base URL in your environment variables
   - Ensure CORS is configured on your backend

3. **Payment verification fails**
   - Check your Razorpay secret key
   - Verify the payment signature verification logic
   - Check server logs for detailed error messages

### Debug Mode
Enable debug logging by adding this to your `.env.local`:

```env
NEXT_PUBLIC_DEBUG=true
```

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your API keys and configuration
3. Test with the provided test cards
4. Check your backend server logs
5. Contact your development team for assistance

## 🔄 Updates

Keep your dependencies updated:

```bash
npm update
```

Check for updates to the Razorpay SDK and your backend API regularly.

# SMS Setup Guide

## Twilio SMS Configuration

The backend uses Twilio to send SMS OTP messages. Follow these steps to configure it properly:

### 1. Create a Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account
3. Verify your phone number during signup

### 2. Get Twilio Credentials
1. Go to your Twilio Console Dashboard
2. Note down your Account SID and Auth Token
3. Get a Twilio phone number (free trial accounts get one)

### 3. Environment Variables
Create a `.env` file in your backend root directory with:

```env
# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Development Settings
NODE_ENV=development
SKIP_SMS=true  # Set to false when you want real SMS
```

### 4. Development Mode
For testing without SMS setup:
- Set `SKIP_SMS=true` in your `.env` file
- OTP will be logged to console instead of sent via SMS
- Check your backend console for the OTP code

### 5. Production Mode
For production:
- Set `SKIP_SMS=false`
- Ensure proper Twilio credentials are configured
- Test SMS sending before deployment

## Phone Number Format

The system automatically formats phone numbers:
- If phone number doesn't start with '+', it adds '+91' (India)
- For other countries, modify the code in `sendSmsOtp.js`

## API Endpoints

### New Phone-based Authentication:
- `POST /api/user/send-signup-otp` - Send OTP for signup
- `POST /api/user/send-login-otp` - Send OTP for login
- `POST /api/user/signup` - Signup with phone, email, name, and OTP
- `POST /api/user/login` - Login with phone and OTP

### Legacy Email-based Authentication (for backward compatibility):
- `POST /api/user/send-otp` - Send email OTP
- `POST /api/user/login-email` - Login with email and password

## Request Examples

### Send Signup OTP:
```json
{
  "phone": "9876543210",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Send Login OTP:
```json
{
  "phone": "9876543210"
}
```

### Signup:
```json
{
  "phone": "9876543210",
  "email": "user@example.com",
  "name": "John Doe",
  "otp": "123456"
}
```

### Login:
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

## Troubleshooting

### Common Issues:
1. **"Invalid phone number"**
   - Ensure phone number is 10 digits
   - Check country code formatting

2. **"Twilio credentials not configured"**
   - Verify all environment variables are set
   - Check for typos in credentials

3. **"SMS sending failed"**
   - Verify Twilio account is active
   - Check if you have sufficient credits
   - Ensure phone number is verified (for trial accounts)

## Testing
1. Start your backend server
2. Try the new signup flow with phone number
3. Check backend console for OTP (if SKIP_SMS=true)
4. Verify the OTP works for account creation and login 
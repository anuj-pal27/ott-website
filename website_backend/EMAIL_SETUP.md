# Email Setup Guide

## Gmail SMTP Configuration

The backend uses Gmail SMTP to send OTP emails. Follow these steps to configure it properly:

### 1. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### 2. Generate App Password
1. Go to Google Account settings
2. Navigate to Security
3. Under "2-Step Verification", click on "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter a name like "Node.js App"
6. Copy the generated 16-character password

### 3. Environment Variables
Create a `.env` file in your backend root directory with:

```env
# Email Configuration
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_16_character_app_password

# Development Settings
NODE_ENV=development
SKIP_EMAIL=true  # Set to false when you want real emails
```

### 4. Development Mode
For testing without email setup:
- Set `SKIP_EMAIL=true` in your `.env` file
- OTP will be logged to console instead of sent via email
- Check your backend console for the OTP code

### 5. Production Mode
For production:
- Set `SKIP_EMAIL=false`
- Ensure proper Gmail credentials are configured
- Test email sending before deployment

## Troubleshooting

### Common Issues:
1. **"Username and Password not accepted"**
   - Use App Password, not regular Gmail password
   - Ensure 2FA is enabled
   - Check if App Password is correctly copied

2. **"Less secure app access"**
   - Gmail no longer supports less secure apps
   - Always use App Passwords

3. **"Authentication failed"**
   - Verify your Gmail address is correct
   - Ensure App Password is 16 characters
   - Check for extra spaces in credentials

## Testing
1. Start your backend server
2. Try the signup flow in your frontend
3. Check backend console for OTP (if SKIP_EMAIL=true)
4. Verify the OTP works for account creation 
const twilio = require('twilio');

const sendSmsOtp = async (phoneNumber, otp) => {
    try {
        // Development mode: Skip SMS sending and log OTP to console
        if (process.env.NODE_ENV === 'development' && process.env.SKIP_SMS === 'true') {
            console.log('🔧 DEVELOPMENT MODE: SMS sending skipped');
            console.log('📱 Would send SMS to:', phoneNumber);
            console.log('📱 OTP:', otp);
            console.log('✅ OTP logged to console for testing');
            return { success: true, messageId: 'dev-mode' };
        }

        // Check if Twilio credentials are configured
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
            console.log('⚠️ Twilio credentials not configured, logging OTP to console');
            console.log('📱 Would send SMS to:', phoneNumber);
            console.log('📱 OTP:', otp);
            return { success: true, messageId: 'no-twilio-config' };
        }

        // Create Twilio client
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        // Format phone number (add country code if not present)
        let formattedPhone = phoneNumber;
        if (!phoneNumber.startsWith('+')) {
            // Assuming Indian numbers, add +91
            formattedPhone = `+91${phoneNumber}`;
        }

        // Send SMS
        const message = await client.messages.create({
            body: `Your verification code is: ${otp}. Valid for 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone
        });

        console.log('✅ SMS sent successfully:', message.sid);
        return { success: true, messageId: message.sid };
    } catch (error) {
        console.error('❌ Error sending SMS:', error);
        
        // Fallback: log OTP to console for development
        console.log('📱 FALLBACK: OTP for', phoneNumber, 'is:', otp);
        
        return { 
            success: false, 
            error: error.message,
            fallback: true 
        };
    }
};

module.exports = sendSmsOtp; 
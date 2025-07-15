const nodemailer = require('nodemailer');

const sendEmailOtp = async (email, subject, text) => {
    try {
        // Development mode: Skip email sending and log OTP to console
        if (process.env.NODE_ENV === 'development' && process.env.SKIP_EMAIL === 'true') {
            console.log('🔧 DEVELOPMENT MODE: Email sending skipped');
            console.log('📧 Would send email to:', email);
            console.log('📧 Subject:', subject);
            console.log('📧 Content:', text);
            console.log('✅ OTP logged to console for testing');
            return { success: true, messageId: 'dev-mode' };
        }

        // Create a transporter object using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // your Gmail address
                pass: process.env.MAIL_PASS, // your Gmail App Password (not regular password)
            },
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log('✅ Email transporter verified successfully');

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER, // sender address (use your Gmail)
            to: `${email}`, // list of receivers
            subject: `${subject}`, // Subject line
            html: `${text}`, // HTML body
        });

        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        
        // Provide more specific error messages
        if (error.code === 'EAUTH') {
            console.error('❌ Authentication failed. Please check your Gmail credentials:');
            console.error('   - Make sure you\'re using an App Password, not your regular Gmail password');
            console.error('   - Enable 2-factor authentication on your Gmail account');
            console.error('   - Generate an App Password from Google Account settings');
        }
        
        return { success: false, error: error.message };
    }
}

module.exports = sendEmailOtp;
const nodemailer = require('nodemailer');

const sendEmailOtp = async (email, subject, text) => {
    try {
        // Create a transporter object using SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // e.g., smtp.example.com
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // your email address
                pass: process.env.MAIL_PASS, // your email password
            },
        });

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'noreply@gmail.com', // sender address
            to: `${email}`, // list of receivers
            subject: `${subject}`, // Subject line
            html: `${text}`, // HTML body
        });

        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error: error.message };
    }
}

module.exports = sendEmailOtp;
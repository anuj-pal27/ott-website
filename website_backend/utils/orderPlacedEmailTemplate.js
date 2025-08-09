// orderPlacedEmailTemplate.js

function orderPlacedEmailTemplate({ userName, orderId, orderDetails, orderDate }) {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 0;
          }
          .container {
            background: #fff;
            max-width: 600px;
            margin: 40px auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            padding: 32px 24px;
          }
          .header {
            color: #10b981;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 16px;
          }
          .success-badge {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 16px;
          }
          .order-info {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 24px;
          }
          .order-label {
            font-weight: bold;
            color: #333;
          }
          .footer {
            margin-top: 32px;
            color: #888;
            font-size: 13px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-badge">✅ Payment Successful!</div>
          <div class="header">Thank you for your purchase, ${userName}!</div>
          <div class="order-info">
            <div><span class="order-label">Order ID:</span> ${orderId}</div>
            <div><span class="order-label">Payment Date:</span> ${orderDate}</div>
            <div style="margin-top: 12px;">
              <span class="order-label">Subscription Details:</span>
              <div>${orderDetails}</div>
            </div>
          </div>
          <div>
            <p>Your subscription has been activated successfully! 🎉</p>
            <p>Our admin team will contact you on WhatsApp shortly to provide your subscription access credentials and setup instructions.</p>
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>You'll receive a WhatsApp message from our admin team</li>
              <li>They'll provide your login credentials and access details</li>
              <li>Any additional setup instructions will be shared</li>
              <li>Feel free to ask questions during the setup process</li>
            </ul>
            <p>If you don't receive a WhatsApp message within 30 minutes, please contact us at: <strong>+91 9353690229</strong></p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Vyapaar360. All rights reserved.<br/>
            Contact: goutham4391@gmail.com
          </div>
        </div>
      </body>
    </html>
  `;
}

module.exports = orderPlacedEmailTemplate; 
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
            color: #2d7ff9;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 16px;
          }
          .order-info {
            background: #f0f4fa;
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
          <div class="header">Thank you for your order, ${userName}!</div>
          <div class="order-info">
            <div><span class="order-label">Order ID:</span> ${orderId}</div>
            <div><span class="order-label">Order Date:</span> ${orderDate}</div>
            <div style="margin-top: 12px;">
              <span class="order-label">Order Details:</span>
              <div>${orderDetails}</div>
            </div>
          </div>
          <div>
            The details of your subscription are sent to your email shortly.<br/>
            If you have any questions, feel free to reply to this email.
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

module.exports = orderPlacedEmailTemplate; 
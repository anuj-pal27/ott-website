// adminEmailTemplate.js

function adminEmailTemplate({ orderDetails, orderDate }) {
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
            color: #dc2626;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 16px;
          }
          .new-order-badge {
            background: #dc2626;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 16px;
          }
          .order-info {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 24px;
          }
          .order-label {
            font-weight: bold;
            color: #333;
          }
          .action-required {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 24px;
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
          <div class="new-order-badge">🆕 New Order Received!</div>
          <div class="header">New Payment Success - Customer Details</div>
          
          <div class="action-required">
            <strong>⚠️ Action Required:</strong><br/>
            Please contact the customer on WhatsApp to provide subscription access and credentials.
          </div>
          
          <div class="order-info">
            <div style="margin-bottom: 12px;">
              <span class="order-label">Order Date:</span> ${orderDate}
            </div>
            <div style="margin-top: 12px;">
              <span class="order-label">Customer & Order Details:</span>
              <div>${orderDetails}</div>
            </div>
          </div>
          
          <div>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Contact customer on WhatsApp using the phone number above</li>
              <li>Provide subscription access credentials</li>
              <li>Share any additional setup instructions</li>
              <li>Confirm customer satisfaction</li>
            </ul>
          </div>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} Vyapaar360. All rights reserved.<br/>
            Admin Dashboard: www.vyapaar360.com/admin
          </div>
        </div>
      </body>
    </html>
  `;
}

module.exports = adminEmailTemplate; 
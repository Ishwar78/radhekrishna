import nodemailer from 'nodemailer';

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'shreeradhekrishnacollection2@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'drbd oprp iwpo bzck',
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Connection Success - Ready to send emails');
  }
});

/**
 * Send email utility function
 */
export async function sendEmail(to, subject, htmlContent) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'shreeradhekrishnacollection2@gmail.com',
      to,
      subject,
      html: htmlContent,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Email template: User Registration/Signup
 */
export function getSignupEmailTemplate(userName, userEmail) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; }
        .header { background-color: #7a2139; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 10px; }
        .button { background-color: #d4a574; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ShreeradheKrishnacollection</h1>
          <p>Premium Ethnic Fashion</p>
        </div>

        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Thank you for registering with <strong>ShreeradheKrishnacollection</strong>! We're excited to have you on board.</p>

          <p>Your account has been successfully created with the email: <strong>${userEmail}</strong></p>

          <p>You can now:</p>
          <ul>
            <li>Browse our exclusive collection of ethnic wear</li>
            <li>Add items to your wishlist</li>
            <li>Place orders with ease</li>
            <li>Track your purchases</li>
          </ul>

          <p>If you have any questions or need assistance, feel free to contact us at <strong>support@shreeradhekrishnacollection.com</strong></p>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/shop" class="button">Start Shopping</a>
          </p>
        </div>

        <div class="footer">
          <p>© 2024 ShreeradheKrishnacollection - Premium Ethnic Fashion. All rights reserved.</p>
          <p>This is an automated email, please do not reply to this address.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template: User Sign In Notification
 */
export function getSigninEmailTemplate(userName, userEmail, timestamp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; }
        .header { background-color: #7a2139; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 10px; }
        .alert { background-color: #f0f0f0; padding: 15px; border-left: 4px solid #d4a574; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ShreeradheKrishnacollection - Sign In Confirmation</h1>
        </div>

        <div class="content">
          <h2>Hello ${userName},</h2>

          <p>We've detected a sign-in to your ShreeradheKrishnacollection account.</p>

          <div class="alert">
            <p><strong>Sign-In Details:</strong></p>
            <ul style="margin: 10px 0;">
              <li><strong>Email:</strong> ${userEmail}</li>
              <li><strong>Time:</strong> ${new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</li>
            </ul>
          </div>

          <p>If this wasn't you, please change your password immediately.</p>

          <p style="margin-top: 20px;">Best regards,<br><strong>ShreeradheKrishnacollection Team</strong></p>
        </div>

        <div class="footer">
          <p>© 2024 ShreeradheKrishnacollection - Premium Ethnic Fashion. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template: Order Placed
 */
export function getOrderPlacedEmailTemplate(userName, orderId, orderAmount, items) {
  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; }
        .header { background-color: #7a2139; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 10px; }
        .order-info { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .button { background-color: #d4a574; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #7a2139; color: white; padding: 10px; text-align: left; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>

        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your order has been successfully placed. We're thrilled to have your business!</p>

          <div class="order-info">
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            <p><strong>Status:</strong> Confirmed</p>
          </div>

          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <div class="order-info">
            <p style="text-align: right; font-size: 18px;"><strong>Total Amount: ₹${orderAmount.toLocaleString('en-IN')}</strong></p>
          </div>

          <p>You will receive another email once your order is shipped.</p>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/orders" class="button">Track Order</a>
          </p>
        </div>

        <div class="footer">
          <p>© 2024 ShreeradheKrishnacollection - Premium Ethnic Fashion. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template: Order Confirmed
 */
export function getOrderConfirmedEmailTemplate(userName, orderId, orderAmount) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; }
        .header { background-color: #4a6741; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 10px; }
        .success-info { background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4a6741; border-radius: 3px; }
        .button { background-color: #d4a574; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Order Confirmed!</h1>
          <p>Your order has been confirmed</p>
        </div>

        <div class="content">
          <h2>Hello ${userName},</h2>

          <div class="success-info">
            <h3 style="margin-top: 0; color: #4a6741;">Your order has been confirmed!</h3>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Order Total:</strong> ₹${orderAmount.toLocaleString('en-IN')}</p>
            <p><strong>Status:</strong> Confirmed - Processing for Shipment</p>
          </div>

          <p>Your order is now being prepared for shipment. You will receive a tracking number via email as soon as your order ships.</p>

          <h3>What's Next?</h3>
          <ul>
            <li>Your order is being packed with care</li>
            <li>You'll receive a shipping notification with tracking details</li>
            <li>Track your shipment in real-time</li>
          </ul>

          <p>If you have any questions about your order, please don't hesitate to reach out to us at <strong>support@shreeradhekrishnacollection.com</strong></p>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/orders" class="button">Track Your Order</a>
          </p>
        </div>

        <div class="footer">
          <p>© 2024 ShreeradheKrishnacollection - Premium Ethnic Fashion. All rights reserved.</p>
          <p>Thank you for shopping with ShreeradheKrishnacollection!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template: Order Shipped
 */
export function getOrderShippedEmailTemplate(userName, orderId, trackingId, shippingProvider) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; }
        .header { background-color: #4a6741; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 10px; }
        .shipping-info { background-color: #e3f2fd; padding: 15px; border-left: 4px solid #1976d2; border-radius: 3px; margin: 15px 0; }
        .button { background-color: #d4a574; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Your Order Has Shipped!</h1>
        </div>

        <div class="content">
          <h2>Hello ${userName},</h2>

          <p>Great news! Your order has been shipped and is on its way to you.</p>

          <div class="shipping-info">
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Tracking ID:</strong> ${trackingId}</p>
            <p><strong>Shipping Provider:</strong> ${shippingProvider || 'Standard Shipping'}</p>
          </div>

          <p>You can track your shipment in real-time using the tracking number above. Click the button below to view detailed tracking information.</p>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/orders/track/${trackingId}" class="button">Track Shipment</a>
          </p>

          <h3>Estimated Delivery</h3>
          <p>Your package should arrive within 5-7 business days. You'll receive an email notification when your order is delivered.</p>
        </div>

        <div class="footer">
          <p>© 2024 ShreeradheKrishnacollection - Premium Ethnic Fashion. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template: Order Delivered
 */
export function getOrderDeliveredEmailTemplate(userName, orderId) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; }
        .header { background-color: #2e7d32; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 10px; }
        .delivery-info { background-color: #c8e6c9; padding: 15px; border-left: 4px solid #2e7d32; border-radius: 3px; margin: 15px 0; }
        .button { background-color: #d4a574; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Your Order Has Been Delivered!</h1>
        </div>

        <div class="content">
          <h2>Hello ${userName},</h2>

          <p>Wonderful news! Your order has been successfully delivered to your address.</p>

          <div class="delivery-info">
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Status:</strong> Delivered ✓</p>
            <p><strong>Delivery Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
          </div>

          <h3>Thank You!</h3>
          <p>We hope you love your purchase! Your satisfaction is our priority.</p>

          <h3>Share Your Feedback</h3>
          <p>We'd love to hear about your experience! Please take a moment to rate and review the products you received.</p>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/orders" class="button">View Order Details</a>
          </p>

          <h3>Need Help?</h3>
          <p>If you have any issues with your order or need to return an item, please contact us at <strong>support@shreeradhekrishnacollection.com</strong> or call us at <strong>+91 98765 43210</strong>.</p>

          <p>Thank you for shopping with <strong>ShreeradheKrishnacollection</strong>!</p>
        </div>

        <div class="footer">
          <p>© 2024 ShreeradheKrishnacollection - Premium Ethnic Fashion. All rights reserved.</p>
          <p>We appreciate your business!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default {
  sendEmail,
  getSignupEmailTemplate,
  getSigninEmailTemplate,
  getOrderPlacedEmailTemplate,
  getOrderConfirmedEmailTemplate,
  getOrderShippedEmailTemplate,
  getOrderDeliveredEmailTemplate,
};

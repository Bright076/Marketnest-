import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'brightchidubem87@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orders, customerInfo, deliveryInfo, paymentMethod, totalAmount, currency } = body;

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #16a34a 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">🎉 New Order Received!</h1>
    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">MarketNest Order Notification</p>
  </div>

  <!-- Content -->
  <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Order Summary -->
    <div style="margin-bottom: 30px; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 2px solid #bbf7d0;">
      <h2 style="margin: 0 0 15px 0; color: #166534; font-size: 20px;">📦 Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order Date:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111827;">${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Amount:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 800; color: #16a34a; font-size: 24px;">$${totalAmount.toFixed(2)} ${currency}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Method:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111827;">${paymentMethod === 'card' ? 'Card Payment' : 'Crypto Payment'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Status:</td>
          <td style="padding: 8px 0; text-align: right;"><span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 13px;">Pending</span></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order Status:</td>
          <td style="padding: 8px 0; text-align: right;"><span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 13px;">Pending</span></td>
        </tr>
      </table>
    </div>

    <!-- Customer Information -->
    <div style="margin-bottom: 30px;">
      <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">👤 Customer Information</h2>
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Full Name:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #111827;">${customerInfo.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email Address:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #111827;"><a href="mailto:${customerInfo.email}" style="color: #16a34a; text-decoration: none;">${customerInfo.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone Number:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #111827;"><a href="tel:${customerInfo.phone}" style="color: #16a34a; text-decoration: none;">${customerInfo.phone}</a></td>
        </tr>
      </table>
    </div>

    <!-- Delivery Information -->
    <div style="margin-bottom: 30px; padding: 20px; background: #eff6ff; border-radius: 8px; border: 2px solid #bfdbfe;">
      <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">🚚 Delivery Information</h2>
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #1e40af; font-size: 14px; width: 40%;">Country:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #111827;">${deliveryInfo.country}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #1e40af; font-size: 14px;">State/Province:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #111827;">${deliveryInfo.state}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #1e40af; font-size: 14px;">City:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #111827;">${deliveryInfo.city}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #1e40af; font-size: 14px; vertical-align: top;">Full Address:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #111827;">${deliveryInfo.address}</td>
        </tr>
        ${deliveryInfo.postalCode ? `
        <tr>
          <td style="padding: 8px 0; color: #1e40af; font-size: 14px;">Postal/ZIP Code:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #111827;">${deliveryInfo.postalCode}</td>
        </tr>
        ` : ''}
        ${deliveryInfo.notes ? `
        <tr>
          <td style="padding: 8px 0; color: #1e40af; font-size: 14px; vertical-align: top;">Order Notes:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #111827; font-style: italic;">${deliveryInfo.notes}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Ordered Products -->
    <div style="margin-bottom: 30px;">
      <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🛍️ Ordered Products</h2>
      ${orders.map((order: any, index: number) => `
        <div style="margin-bottom: 15px; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <table style="width: 100%;">
            <tr>
              <td style="color: #6b7280; font-size: 13px;">Order ID:</td>
              <td style="text-align: right; font-family: monospace; font-size: 12px; color: #6b7280;">${order.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Product ID:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111827;">${order.product_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Quantity:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111827;">${order.quantity || 1}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #16a34a; font-size: 18px;">$${parseFloat(order.amount_paid).toFixed(2)}</td>
            </tr>
          </table>
        </div>
      `).join('')}
    </div>

    <!-- Action Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://marketnest-shop-one.vercel.app/admin/orders" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #059669 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);">
        View Order in Admin Dashboard →
      </a>
    </div>

    <!-- Footer Note -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 13px;">
      <p style="margin: 0 0 10px 0;">This is an automated notification from MarketNest.</p>
      <p style="margin: 0;">Please process this order within 24 hours.</p>
    </div>

  </div>

</body>
</html>
    `;

    // For now, log the email (you'll need to integrate with an email service like Resend)
    console.log('=== ADMIN ORDER NOTIFICATION ===');
    console.log('To:', ADMIN_EMAIL);
    console.log('Subject: New Order - ' + customerInfo.name);
    console.log('Customer:', customerInfo);
    console.log('Delivery:', deliveryInfo);
    console.log('Orders:', orders);
    console.log('================================');

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // Example with Resend:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     from: 'MarketNest <orders@marketnest.com>',
    //     to: [ADMIN_EMAIL],
    //     subject: `🎉 New Order from ${customerInfo.name} - $${totalAmount.toFixed(2)} ${currency}`,
    //     html: emailHtml
    //   })
    // });

    return NextResponse.json({ 
      success: true, 
      message: 'Admin notification sent (currently logging only - integrate email service)'
    });

  } catch (error: any) {
    console.error('Error sending admin notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

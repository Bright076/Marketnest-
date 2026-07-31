import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerEmail, customerName, orderStatus, paymentStatus, totalAmount, currency, productTitle } = body;

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #16a34a 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">MarketNest</h1>
    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Order Status Update</p>
  </div>

  <!-- Content -->
  <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Greeting -->
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px;">Hello ${customerName}! 👋</h2>
    
    <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.8;">
      Your order status has been updated. Here are the latest details:
    </p>

    <!-- Order Status Card -->
    <div style="margin-bottom: 25px; padding: 20px; background: ${
      orderStatus === 'delivered' ? '#f0fdf4' : 
      orderStatus === 'shipped' ? '#eff6ff' : 
      orderStatus === 'processing' ? '#fef3c7' : 
      orderStatus === 'cancelled' ? '#fee2e2' : '#f9fafb'
    }; border-radius: 12px; border: 2px solid ${
      orderStatus === 'delivered' ? '#bbf7d0' : 
      orderStatus === 'shipped' ? '#bfdbfe' : 
      orderStatus === 'processing' ? '#fde047' : 
      orderStatus === 'cancelled' ? '#fecaca' : '#e5e7eb'
    };">
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">
          ${
            orderStatus === 'delivered' ? '🎉' : 
            orderStatus === 'shipped' ? '🚚' : 
            orderStatus === 'processing' ? '⏳' : 
            orderStatus === 'cancelled' ? '❌' : '📦'
          }
        </div>
        <h3 style="margin: 0 0 10px 0; color: ${
          orderStatus === 'delivered' ? '#166534' : 
          orderStatus === 'shipped' ? '#1e40af' : 
          orderStatus === 'processing' ? '#92400e' : 
          orderStatus === 'cancelled' ? '#991b1b' : '#374151'
        }; font-size: 24px; font-weight: 800; text-transform: capitalize;">
          ${orderStatus === 'delivered' ? 'Delivered!' : 
            orderStatus === 'shipped' ? 'Shipped!' : 
            orderStatus === 'processing' ? 'Processing' : 
            orderStatus === 'cancelled' ? 'Cancelled' : orderStatus}
        </h3>
        <p style="margin: 0; color: ${
          orderStatus === 'delivered' ? '#166534' : 
          orderStatus === 'shipped' ? '#1e40af' : 
          orderStatus === 'processing' ? '#92400e' : 
          orderStatus === 'cancelled' ? '#991b1b' : '#6b7280'
        }; font-size: 14px;">
          ${
            orderStatus === 'delivered' ? 'Your order has been delivered successfully!' : 
            orderStatus === 'shipped' ? 'Your order is on its way to you!' : 
            orderStatus === 'processing' ? 'We are preparing your order' : 
            orderStatus === 'cancelled' ? 'This order has been cancelled' : 
            'Your order is being processed'
          }
        </p>
      </div>
    </div>

    <!-- Order Details -->
    <div style="margin-bottom: 25px; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📦 Order Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order ID:</td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 13px; color: #111827; font-weight: 600;">${orderId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Product:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111827;">${productTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Amount:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 800; color: #16a34a; font-size: 20px;">$${totalAmount.toFixed(2)} ${currency}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Status:</td>
          <td style="padding: 8px 0; text-align: right;"><span style="background: ${paymentStatus === 'paid' ? '#dcfce7' : paymentStatus === 'failed' ? '#fee2e2' : '#fef3c7'}; color: ${paymentStatus === 'paid' ? '#166534' : paymentStatus === 'failed' ? '#991b1b' : '#92400e'}; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 13px; text-transform: capitalize;">${paymentStatus}</span></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order Status:</td>
          <td style="padding: 8px 0; text-align: right;"><span style="background: ${
            orderStatus === 'delivered' ? '#dcfce7' : 
            orderStatus === 'shipped' ? '#dbeafe' : 
            orderStatus === 'processing' ? '#fef3c7' : 
            orderStatus === 'cancelled' ? '#fee2e2' : '#f3f4f6'
          }; color: ${
            orderStatus === 'delivered' ? '#166534' : 
            orderStatus === 'shipped' ? '#1e40af' : 
            orderStatus === 'processing' ? '#92400e' : 
            orderStatus === 'cancelled' ? '#991b1b' : '#374151'
          }; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 13px; text-transform: capitalize;">${orderStatus}</span></td>
        </tr>
      </table>
    </div>

    <!-- Next Steps -->
    ${orderStatus === 'shipped' ? `
    <div style="margin-bottom: 25px; padding: 20px; background: #eff6ff; border-radius: 8px; border: 2px solid #bfdbfe;">
      <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">📍 What's Next?</h3>
      <ul style="margin: 0; padding-left: 20px; color: #1e40af; line-height: 1.8;">
        <li>Your package is on its way!</li>
        <li>Estimated delivery: 3-5 business days</li>
        <li>You'll receive your order soon</li>
        <li>Contact us if you have any questions</li>
      </ul>
    </div>
    ` : orderStatus === 'delivered' ? `
    <div style="margin-bottom: 25px; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 2px solid #bbf7d0;">
      <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 18px;">✨ Thank You!</h3>
      <p style="margin: 0; color: #166534; line-height: 1.8;">
        We hope you enjoy your purchase! If you have any questions or concerns about your order, please don't hesitate to contact us.
      </p>
    </div>
    ` : orderStatus === 'processing' ? `
    <div style="margin-bottom: 25px; padding: 20px; background: #fef3c7; border-radius: 8px; border: 2px solid #fde047;">
      <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px;">⏳ Processing Your Order</h3>
      <p style="margin: 0; color: #92400e; line-height: 1.8;">
        We're currently preparing your order for shipment. You'll receive another notification once it's shipped!
      </p>
    </div>
    ` : ''}

    <!-- View Order Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://marketnest-shop-one.vercel.app/my-orders" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #059669 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);">
        View My Orders →
      </a>
    </div>

    <!-- Contact Info -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
        Questions? We're here to help!
      </p>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        Contact us at <a href="mailto:support@marketnest.com" style="color: #16a34a; text-decoration: none; font-weight: 600;">support@marketnest.com</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 5px 0;">This is an automated notification from MarketNest.</p>
      <p style="margin: 0;">© ${new Date().getFullYear()} MarketNest. All rights reserved.</p>
    </div>

  </div>

</body>
</html>
    `;

    // For now, log the email (you'll need to integrate with an email service like Resend)
    console.log('=== CUSTOMER ORDER NOTIFICATION ===');
    console.log('To:', customerEmail);
    console.log('Subject: Order Update - ' + orderStatus);
    console.log('Order ID:', orderId);
    console.log('Status:', orderStatus);
    console.log('====================================');

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
    //     to: [customerEmail],
    //     subject: `Order ${orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)} - ${productTitle}`,
    //     html: emailHtml
    //   })
    // });

    return NextResponse.json({ 
      success: true, 
      message: 'Customer notification sent (currently logging only - integrate email service)'
    });

  } catch (error: any) {
    console.error('Error sending customer notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

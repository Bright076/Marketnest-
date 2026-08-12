import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orders, customerInfo, deliveryInfo, totalAmount, currency, paymentMethod } = body;

    // Get Telegram credentials from environment
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Check if Telegram is configured
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('⚠️ Telegram not configured - skipping notification');
      return NextResponse.json({ 
        success: false, 
        message: 'Telegram not configured' 
      });
    }

    // Determine if this is a USDT payment
    const isUSDT = paymentMethod === "USDT (TRC20)" || paymentMethod === "usdt_trc20";
    
    // Format amount display based on payment method
    const amountDisplay = isUSDT 
      ? `${totalAmount.toFixed(2)} USDT` 
      : `${totalAmount.toFixed(2)} ${currency}`;

    // USDT alert section (only for USDT payments)
    const usdtAlert = isUSDT ? `

⚠️ USDT PAYMENT ALERT:
This order was paid with USDT (TRC20). You MUST manually verify the payment in your Spenda account before marking as paid and processing the order.

USDT Wallet: ${process.env.NEXT_PUBLIC_USDT_TRC20_ADDRESS || "TP7h5qLNhXpfJ1PAS3swcobSQQc17E23fr"}
Expected Amount: ${totalAmount.toFixed(2)} USDT
Network: Tron (TRC20)

Do NOT process this order until payment is confirmed!
` : '';

    // Build simple plain text message (no special formatting)
    const message = `🎉 NEW ORDER RECEIVED!

Customer Details:
Name: ${customerInfo.name}
Email: ${customerInfo.email}
Phone: ${customerInfo.phone}

Order Summary:
Payment Method: ${paymentMethod || "Card Payment"}
Total Amount: ${amountDisplay}
Payment Status: ${isUSDT ? "⚠️ PENDING - Manual Confirmation Required" : "Processing"}
Number of Items: ${orders.length}

Delivery Address:
${deliveryInfo.address}
${deliveryInfo.city}, ${deliveryInfo.state}
${deliveryInfo.country}
${deliveryInfo.postalCode ? `Postal Code: ${deliveryInfo.postalCode}` : ''}

${deliveryInfo.notes ? `Order Notes: ${deliveryInfo.notes}` : ''}
${usdtAlert}
View in admin dashboard:
https://marketnest-shop-one.vercel.app/admin/orders

Time: ${new Date().toLocaleString('en-US', { 
  dateStyle: 'full', 
  timeStyle: 'short',
  timeZone: 'Africa/Lagos'
})}`;

    console.log('📤 Sending to Telegram...');
    console.log('Chat ID:', TELEGRAM_CHAT_ID);
    console.log('Message length:', message.length);

    // Send to Telegram (plain text, no formatting)
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    console.log('📥 Telegram API response:', JSON.stringify(telegramResult, null, 2));

    if (!telegramResult.ok) {
      console.error('❌ Telegram API error:', telegramResult);
      throw new Error(telegramResult.description || 'Failed to send Telegram message');
    }

    console.log('✅ Telegram notification sent successfully!');
    console.log('Message ID:', telegramResult.result?.message_id);

    return NextResponse.json({ 
      success: true, 
      message: 'Telegram notification sent',
      messageId: telegramResult.result?.message_id 
    });

  } catch (error: any) {
    console.error('❌ Error sending Telegram notification:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send notification' 
      },
      { status: 500 }
    );
  }
}

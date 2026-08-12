import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime (not Edge) for better compatibility
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Wrap everything in try-catch to ensure we always return JSON
  try {
    console.log('🔍 Payment API called');
    
    let body;
    try {
      body = await request.json();
    } catch (jsonError: any) {
      console.error('❌ Failed to parse request JSON:', jsonError.message);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { orderIds, customerInfo, deliveryInfo, totalAmountUSD } = body;
    
    console.log('📦 Request data:', { orderIds, totalAmountUSD });

    // Validate environment variables
    const VENDO_PARTNER_API_KEY = process.env.VENDO_PARTNER_API_KEY;
    const VENDO_BASE_URL = process.env.VENDO_BASE_URL || 'https://vendo.com.ng';
    const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketnest-shop-one.vercel.app';
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for server-side operations

    console.log('🔑 Environment check:', {
      hasApiKey: !!VENDO_PARTNER_API_KEY,
      hasSupabaseUrl: !!SUPABASE_URL,
      hasSupabaseServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
    });

    if (!VENDO_PARTNER_API_KEY) {
      console.error('❌ VENDO_PARTNER_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Supabase configuration missing');
      return NextResponse.json(
        { success: false, error: 'Database configuration error' },
        { status: 500 }
      );
    }

    // Validate order IDs
    if (!orderIds || orderIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No orders provided' },
        { status: 400 }
      );
    }

    const merchantOrderId = orderIds[0];

    console.log('🔍 Fetching orders:', orderIds);
    console.log('🔍 Order IDs type:', typeof orderIds, Array.isArray(orderIds));
    console.log('🔍 First order ID:', orderIds[0], 'Type:', typeof orderIds[0]);

    // Fetch orders using direct Supabase REST API
    // PostgREST syntax for UUIDs: id=in.(uuid1,uuid2,uuid3) - no quotes needed
    const orderIdsString = orderIds.join(',');
    const ordersUrl = `${SUPABASE_URL}/rest/v1/orders?id=in.(${orderIdsString})&select=id,amount_paid,payment_status`;
    
    console.log('📍 Full query URL:', ordersUrl);
    console.log('📍 Order IDs string:', orderIdsString);
    
    const ordersResponse = await fetch(ordersUrl, {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('📥 Orders response status:', ordersResponse.status);

    if (!ordersResponse.ok) {
      const errorText = await ordersResponse.text();
      console.error('❌ Failed to fetch orders. Status:', ordersResponse.status);
      console.error('❌ Error response:', errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to verify orders' },
        { status: 400 }
      );
    }

    const orders = await ordersResponse.json();
    
    console.log('📦 Orders found:', orders.length);
    console.log('📦 Orders data:', JSON.stringify(orders, null, 2));

    if (!orders || orders.length === 0) {
      console.error('❌ No orders found in database for IDs:', orderIds);
      return NextResponse.json(
        { success: false, error: 'Invalid order IDs' },
        { status: 400 }
      );
    }

    // Check if any order is already paid
    const paidOrder = orders.find((order: any) => order.payment_status === 'paid');
    if (paidOrder) {
      return NextResponse.json(
        { success: false, error: 'One or more orders already paid' },
        { status: 400 }
      );
    }

    // Calculate total from server-side data
    const serverTotalUSD = orders.reduce((sum: number, order: any) => sum + Number(order.amount_paid), 0);

    console.log('💰 Payment:', { totalUSD: serverTotalUSD, merchantOrderId });

    // Create payment request to Vendo
    const vendoPayload = {
      amount: serverTotalUSD,
      currency: 'USD',
      customer: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone
      },
      description: `MarketNest Order #${merchantOrderId}`,
      merchantOrderId: merchantOrderId,
      redirectUrl: `${NEXT_PUBLIC_SITE_URL}/payment-complete?order=${merchantOrderId}`,
      callbackUrl: `${NEXT_PUBLIC_SITE_URL}/api/payment/webhook`,
      metadata: {
        orderIds: orderIds,
        totalUSD: serverTotalUSD
      }
    };

    console.log('📤 Calling Vendo API...');
    console.log('📤 Vendo URL:', `${VENDO_BASE_URL}/api/partner/payments/create`);
    console.log('📤 Has API Key:', !!VENDO_PARTNER_API_KEY);

    const vendoResponse = await fetch(`${VENDO_BASE_URL}/api/partner/payments/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VENDO_PARTNER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendoPayload),
    });

    // Safely handle Vendo response
    const contentType = vendoResponse.headers.get('content-type') || '';
    const vendoResponseText = await vendoResponse.text();
    
    console.log('📥 Vendo response status:', vendoResponse.status);
    console.log('📥 Vendo content-type:', contentType);
    console.log('📥 Vendo response (first 500 chars):', vendoResponseText.substring(0, 500));

    // Check if response is OK before parsing
    if (!vendoResponse.ok) {
      console.error('❌ Vendo API failed with status:', vendoResponse.status);
      console.error('❌ Vendo error response:', vendoResponseText);
      return NextResponse.json(
        { 
          success: false, 
          error: `Payment provider error: ${vendoResponse.status}`,
          details: vendoResponseText.substring(0, 200)
        },
        { status: 500 }
      );
    }

    // Parse JSON safely
    let vendoResult;
    try {
      if (!contentType.includes('application/json')) {
        console.error('❌ Vendo returned non-JSON response. Content-Type:', contentType);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Payment provider returned invalid response format',
            details: `Expected JSON, got ${contentType}`
          },
          { status: 500 }
        );
      }
      
      vendoResult = JSON.parse(vendoResponseText);
      console.log('📥 Vendo parsed result:', { success: vendoResult.success, hasPaymentLink: !!vendoResult.paymentLink });
    } catch (parseError: any) {
      console.error('❌ Failed to parse Vendo JSON:', parseError.message);
      console.error('❌ Raw response:', vendoResponseText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment provider returned malformed response',
          details: parseError.message
        },
        { status: 500 }
      );
    }

    // Validate Vendo result
    if (!vendoResult.success) {
      console.error('❌ Vendo returned success=false:', vendoResult);
      return NextResponse.json(
        { 
          success: false, 
          error: vendoResult.message || 'Payment creation failed',
          details: vendoResult.error || 'Unknown error from payment provider'
        },
        { status: 400 }
      );
    }

    const { partnerReference, paymentLink, status } = vendoResult;

    if (!partnerReference || !paymentLink) {
      console.error('❌ Vendo response missing required fields:', { 
        hasPartnerReference: !!partnerReference, 
        hasPaymentLink: !!paymentLink 
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment provider response incomplete',
          details: 'Missing payment link or reference'
        },
        { status: 500 }
      );
    }

    console.log('✅ Vendo payment created:', { partnerReference, hasPaymentLink: !!paymentLink });

    // Update orders using direct REST API
    const updateUrl = `${SUPABASE_URL}/rest/v1/orders?id=in.(${orderIds.join(',')})`;
    
    console.log('📝 Updating orders in database...');
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        merchant_order_id: merchantOrderId,
        partner_reference: partnerReference,
        payment_method: 'vendo_flutterwave',
        currency: 'USD',
        payment_status: 'pending'
      })
    });

    if (!updateResponse.ok) {
      const updateError = await updateResponse.text();
      console.error('❌ Failed to update orders:', updateResponse.status, updateError);
      // Don't fail the payment - customer can still complete it
      // Admin can manually update order status after payment webhook
    } else {
      console.log('✅ Orders updated successfully');
    }

    console.log('✅ Payment created!');

    return NextResponse.json({
      success: true,
      partnerReference,
      paymentLink,
      status,
      merchantOrderId,
      amountUSD: serverTotalUSD
    });

  } catch (error: any) {
    // Ensure we always return JSON, never HTML
    console.error('❌ Payment API exception:', error);
    console.error('❌ Error type:', error.constructor.name);
    console.error('❌ Error message:', error.message);
    if (error.stack) {
      console.error('❌ Error stack:', error.stack);
    }
    
    // Determine appropriate status code
    let statusCode = 500;
    let errorMessage = 'Payment processing failed';
    
    if (error.message?.includes('JSON')) {
      errorMessage = 'Invalid request format';
      statusCode = 400;
    } else if (error.message?.includes('not configured')) {
      errorMessage = 'Payment system configuration error';
      statusCode = 500;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Payment API called');
    
    const body = await request.json();
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

    const vendoResponse = await fetch(`${VENDO_BASE_URL}/api/partner/payments/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VENDO_PARTNER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendoPayload),
    });

    const vendoResult = await vendoResponse.json();

    console.log('📥 Vendo response:', { success: vendoResult.success });

    if (!vendoResponse.ok || !vendoResult.success) {
      console.error('❌ Vendo error:', vendoResult);
      throw new Error(vendoResult.message || 'Failed to create payment');
    }

    const { partnerReference, paymentLink, status } = vendoResult;

    if (!partnerReference || !paymentLink) {
      throw new Error('Invalid Vendo response');
    }

    // Update orders using direct REST API
    const updateUrl = `${SUPABASE_URL}/rest/v1/orders?id=in.(${orderIds.join(',')})`;
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
      console.error('❌ Failed to update orders');
      // Don't fail the payment, just log
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
    console.error('❌ Payment error:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Payment failed'
      },
      { status: 500 }
    );
  }
}

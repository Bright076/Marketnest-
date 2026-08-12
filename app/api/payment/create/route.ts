import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Payment API called');
    
    const body = await request.json();
    const { orderIds, customerInfo, deliveryInfo, totalAmountUSD } = body;
    
    console.log('📦 Request data:', { orderIds, totalAmountUSD });

    // Validate and load environment variables
    const VENDO_PARTNER_API_KEY = process.env.VENDO_PARTNER_API_KEY;
    const VENDO_BASE_URL = process.env.VENDO_BASE_URL || 'https://vendo.com.ng';
    const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketnest-shop-one.vercel.app';
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔑 Environment check:', {
      hasApiKey: !!VENDO_PARTNER_API_KEY,
      hasSupabaseUrl: !!SUPABASE_URL,
      hasSupabaseKey: !!SUPABASE_SERVICE_KEY,
    });

    if (!VENDO_PARTNER_API_KEY) {
      console.error('❌ VENDO_PARTNER_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('❌ Supabase configuration missing');
      return NextResponse.json(
        { success: false, error: 'Database configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Validate order IDs
    if (!orderIds || orderIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No orders provided' },
        { status: 400 }
      );
    }

    // Get the first order ID to use as merchant order ID
    const merchantOrderId = orderIds[0];

    // Verify orders exist and calculate server-side total
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('id, amount_paid, payment_status')
      .in('id', orderIds);

    if (ordersError || !orders || orders.length === 0) {
      console.error('❌ Failed to fetch orders:', ordersError);
      return NextResponse.json(
        { success: false, error: 'Invalid order IDs' },
        { status: 400 }
      );
    }

    // Check if any order is already paid
    const paidOrder = orders.find(order => order.payment_status === 'paid');
    if (paidOrder) {
      return NextResponse.json(
        { success: false, error: 'One or more orders already paid' },
        { status: 400 }
      );
    }

    // Calculate total from server-side data (never trust client)
    const serverTotalUSD = orders.reduce((sum, order) => sum + Number(order.amount_paid), 0);
    const amountUSD = serverTotalUSD;

    console.log('💰 Payment calculation:', {
      serverTotalUSD,
      amountUSD,
      merchantOrderId
    });

    // Create payment request to Vendo
    const vendoPayload = {
      amount: amountUSD,
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

    console.log('📤 Sending payment request to Vendo...');

    const vendoResponse = await fetch(`${VENDO_BASE_URL}/api/partner/payments/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VENDO_PARTNER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendoPayload),
    });

    const vendoResult = await vendoResponse.json();

    console.log('📥 Vendo API response:', { success: vendoResult.success, status: vendoResponse.status });

    if (!vendoResponse.ok || !vendoResult.success) {
      console.error('❌ Vendo API error:', vendoResult);
      throw new Error(vendoResult.message || 'Failed to create payment with Vendo');
    }

    // Extract payment details from Vendo response
    const { partnerReference, paymentLink, status } = vendoResult;

    if (!partnerReference || !paymentLink) {
      throw new Error('Invalid response from Vendo - missing required fields');
    }

    // Update all orders with payment information
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        merchant_order_id: merchantOrderId,
        partner_reference: partnerReference,
        payment_method: 'vendo_flutterwave',
        currency: 'USD',
        payment_status: 'pending'
      })
      .in('id', orderIds);

    if (updateError) {
      console.error('❌ Failed to update orders:', updateError);
      throw new Error('Failed to save payment information');
    }

    console.log('✅ Payment created successfully!');

    return NextResponse.json({
      success: true,
      partnerReference,
      paymentLink,
      status,
      merchantOrderId,
      amountUSD
    });

  } catch (error: any) {
    console.error('❌ Error creating payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create payment' 
      },
      { status: 500 }
    );
  }
}

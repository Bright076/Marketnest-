import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Payment API called - START');
    
    // Test if we can even get here
    const body = await request.json();
    console.log('📦 Body parsed successfully');
    
    const { orderIds, customerInfo, deliveryInfo, totalAmountUSD } = body;
    console.log('📋 Extracted data:', { orderIds, totalAmountUSD });

    // Check environment variables
    const VENDO_PARTNER_API_KEY = process.env.VENDO_PARTNER_API_KEY;
    const VENDO_BASE_URL = process.env.VENDO_BASE_URL || 'https://vendo.com.ng';
    const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketnest-shop-one.vercel.app';
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔑 Environment check:', {
      hasApiKey: !!VENDO_PARTNER_API_KEY,
      hasSupabaseUrl: !!SUPABASE_URL,
      hasSupabaseKey: !!SUPABASE_SERVICE_KEY,
      vendoBaseUrl: VENDO_BASE_URL,
      siteUrl: NEXT_PUBLIC_SITE_URL
    });

    // Check what's missing
    if (!VENDO_PARTNER_API_KEY) {
      console.error('❌ VENDO_PARTNER_API_KEY missing');
      return NextResponse.json(
        { success: false, error: 'Payment system not configured (API key)' },
        { status: 500 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('❌ Supabase configuration missing');
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    console.log('✅ All environment variables present');

    // For now, just return success to test if we can get this far
    return NextResponse.json({
      success: false,
      error: 'Payment API reached successfully but not implemented yet (testing)',
      debug: {
        orderIds,
        totalAmountUSD,
        environmentOk: true
      }
    });

  } catch (error: any) {
    console.error('❌ Payment API Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Unknown error',
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

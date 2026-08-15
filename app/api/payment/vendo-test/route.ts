// Test endpoint to debug Vendo API 403 error
// This will help us verify authentication and see the exact error

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Vendo API Test Started');
    
    // 1. Check environment variables
    const VENDO_PARTNER_API_KEY = process.env.VENDO_PARTNER_API_KEY;
    const VENDO_BASE_URL = process.env.VENDO_BASE_URL || 'https://vendo.com.ng';
    
    console.log('🔍 Environment Check:');
    console.log('- Has API Key:', !!VENDO_PARTNER_API_KEY);
    console.log('- API Key Length:', VENDO_PARTNER_API_KEY?.length || 0);
    console.log('- API Key First 10 chars:', VENDO_PARTNER_API_KEY?.substring(0, 10) + '...');
    console.log('- API Key Last 10 chars:', '...' + VENDO_PARTNER_API_KEY?.substring(VENDO_PARTNER_API_KEY.length - 10));
    console.log('- Base URL:', VENDO_BASE_URL);
    
    if (!VENDO_PARTNER_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'VENDO_PARTNER_API_KEY not found in environment',
        hint: 'Check Vercel environment variables'
      });
    }
    
    // 2. Test minimal payment creation request
    const testPayload = {
      amount: 10.00,
      currency: 'USD',
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+2348012345678'
      },
      description: 'Test Payment',
      merchantOrderId: 'TEST-' + Date.now(),
      redirectUrl: 'https://example.com/success',
      callbackUrl: 'https://example.com/webhook'
    };
    
    console.log('📤 Test Payload:', JSON.stringify(testPayload, null, 2));
    console.log('📤 Request Details:');
    console.log('- URL:', `${VENDO_BASE_URL}/api/partner/payments/create`);
    console.log('- Method: POST');
    console.log('- Content-Type: application/json');
    console.log('- Authorization: Bearer <key>');
    
    // 3. Make the request
    const vendoResponse = await fetch(`${VENDO_BASE_URL}/api/partner/payments/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VENDO_PARTNER_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });
    
    // 4. Capture detailed response
    const status = vendoResponse.status;
    const statusText = vendoResponse.statusText;
    const headers = Object.fromEntries(vendoResponse.headers.entries());
    const contentType = vendoResponse.headers.get('content-type') || '';
    const responseText = await vendoResponse.text();
    
    console.log('📥 Vendo Response:');
    console.log('- Status:', status, statusText);
    console.log('- Content-Type:', contentType);
    console.log('- Headers:', JSON.stringify(headers, null, 2));
    console.log('- Body:', responseText);
    
    // 5. Parse response if JSON
    let parsedResponse = null;
    if (contentType.includes('application/json') && responseText) {
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        console.log('⚠️ Could not parse JSON response');
      }
    }
    
    // 6. Return diagnostic info
    return NextResponse.json({
      test: 'Vendo API Connection Test',
      timestamp: new Date().toISOString(),
      environment: {
        hasApiKey: !!VENDO_PARTNER_API_KEY,
        apiKeyLength: VENDO_PARTNER_API_KEY?.length || 0,
        apiKeyPreview: VENDO_PARTNER_API_KEY ? 
          `${VENDO_PARTNER_API_KEY.substring(0, 8)}...${VENDO_PARTNER_API_KEY.substring(VENDO_PARTNER_API_KEY.length - 4)}` : 
          'NOT_SET',
        baseUrl: VENDO_BASE_URL,
      },
      request: {
        url: `${VENDO_BASE_URL}/api/partner/payments/create`,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer <REDACTED>',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        payload: testPayload,
      },
      response: {
        status,
        statusText,
        headers,
        contentType,
        bodyRaw: responseText,
        bodyParsed: parsedResponse,
        isError: status >= 400,
      },
      diagnosis: {
        authentication: status === 403 ? 'FAILED - API Key Rejected' : 
                       status === 401 ? 'FAILED - Missing or Invalid Token' :
                       status === 200 ? 'SUCCESS' : 'UNKNOWN',
        possibleIssues: status === 403 ? [
          'API key is incorrect or expired',
          'API key not activated in Vendo dashboard',
          'Wrong API endpoint (vendo.com.ng vs different domain)',
          'IP whitelist restriction',
          'Account not approved for partner API access',
        ] : status === 401 ? [
          'Missing Authorization header',
          'Wrong header format (should be: Bearer <key>)',
        ] : [],
        nextSteps: status === 403 ? [
          '1. Verify API key is copied correctly from Vendo dashboard',
          '2. Check if API key needs to be activated/approved',
          '3. Confirm you have Partner API access (not just regular API)',
          '4. Contact Vendo support with this error log',
          '5. Verify the correct base URL (vendo.com.ng)',
        ] : [],
      }
    });
    
  } catch (error: any) {
    console.error('❌ Test Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.constructor.name,
      stack: error.stack,
    }, { status: 500 });
  }
}

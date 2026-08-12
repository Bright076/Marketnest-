// Debug endpoint to investigate CJ shipping calculation
// This will help us understand why our API returns different shipping than CJ website

import { NextRequest, NextResponse } from "next/server";
import { authenticateCJ } from "@/lib/cjService";

const CJ_API_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";

export async function POST(request: NextRequest) {
  try {
    const { pid, quantity = 1 } = await request.json();

    if (!pid) {
      return NextResponse.json(
        { success: false, error: "PID is required" },
        { status: 400 }
      );
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔍 DEBUG: Investigating shipping for PID: ${pid}`);
    console.log(`${'='.repeat(80)}\n`);

    const authResponse = await authenticateCJ();
    const accessToken = authResponse.data.accessToken;

    // Test 1: Basic freight calculation (what we're currently doing)
    console.log('\n📦 TEST 1: Basic Freight Calculate');
    console.log('─'.repeat(80));
    
    const basicRequest = {
      startCountryCode: 'CN',
      endCountryCode: 'US',
      products: [{ pid, quantity }],
    };
    
    console.log('Request:', JSON.stringify(basicRequest, null, 2));
    
    const basicResponse = await fetch(`${CJ_API_BASE_URL}/logistic/freightCalculate`, {
      method: 'POST',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(basicRequest),
    });

    const basicResult = await basicResponse.json();
    console.log('Response:', JSON.stringify(basicResult, null, 2));

    // Test 2: Get product details to see what shipping info is available
    console.log('\n📦 TEST 2: Product Details Query');
    console.log('─'.repeat(80));
    
    const productRequest = { pid };
    console.log('Request:', JSON.stringify(productRequest, null, 2));
    
    const productResponse = await fetch(`${CJ_API_BASE_URL}/product/query`, {
      method: 'POST',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productRequest),
    });

    const productResult = await productResponse.json();
    console.log('Response:', JSON.stringify(productResult, null, 2));

    // Test 3: Try freight calculation with specific shipping method
    console.log('\n📦 TEST 3: Freight Calculate with Shipping Method');
    console.log('─'.repeat(80));
    
    const withMethodRequest = {
      startCountryCode: 'CN',
      endCountryCode: 'US',
      products: [{ pid, quantity }],
      shippingMethod: 'CJPACKET_SA',  // Standard shipping
    };
    
    console.log('Request:', JSON.stringify(withMethodRequest, null, 2));
    
    const withMethodResponse = await fetch(`${CJ_API_BASE_URL}/logistic/freightCalculate`, {
      method: 'POST',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(withMethodRequest),
    });

    const withMethodResult = await withMethodResponse.json();
    console.log('Response:', JSON.stringify(withMethodResult, null, 2));

    // Test 4: Get shipping methods list
    console.log('\n📦 TEST 4: Get Shipping Methods');
    console.log('─'.repeat(80));
    
    const shippingMethodsRequest = {
      startCountryCode: 'CN',
      endCountryCode: 'US',
      products: [{ pid, quantity }],
    };
    
    console.log('Request:', JSON.stringify(shippingMethodsRequest, null, 2));
    
    const shippingMethodsResponse = await fetch(`${CJ_API_BASE_URL}/logistic/freightCalculate`, {
      method: 'POST',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shippingMethodsRequest),
    });

    const shippingMethodsResult = await shippingMethodsResponse.json();
    console.log('Response:', JSON.stringify(shippingMethodsResult, null, 2));

    console.log(`\n${'='.repeat(80)}`);
    console.log('🔍 DEBUG COMPLETE');
    console.log(`${'='.repeat(80)}\n`);

    // Return all test results
    return NextResponse.json({
      success: true,
      data: {
        pid,
        quantity,
        tests: {
          basicFreightCalculate: {
            request: basicRequest,
            response: basicResult,
            status: basicResponse.status,
          },
          productDetails: {
            request: productRequest,
            response: productResult,
            status: productResponse.status,
          },
          withShippingMethod: {
            request: withMethodRequest,
            response: withMethodResult,
            status: withMethodResponse.status,
          },
          shippingMethods: {
            request: shippingMethodsRequest,
            response: shippingMethodsResult,
            status: shippingMethodsResponse.status,
          },
        },
        analysis: {
          currentImplementation: 'Uses weight-based estimate formula',
          issue: 'Need to find correct API endpoint/parameters that return $8.28',
          expectedShipping: 8.28,
          note: 'Check response data structures for shipping fee fields',
        }
      },
    });
  } catch (error: any) {
    console.error('❌ Debug Shipping Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
      { status: 500 }
    );
  }
}

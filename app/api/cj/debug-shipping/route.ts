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

    // Test 2: Get product details and variants
    console.log('\n📦 TEST 2: Product List Query (Get Variants)');
    console.log('─'.repeat(80));
    
    const productRequest = {
      pid: pid,
      pageNum: 1,
      pageSize: 1,
    };
    console.log('Request:', JSON.stringify(productRequest, null, 2));
    
    const productResponse = await fetch(`${CJ_API_BASE_URL}/product/list`, {
      method: 'POST',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productRequest),
    });

    const productResult = await productResponse.json();
    console.log('Response:', JSON.stringify(productResult, null, 2));

    // Extract variants if available
    let variants = [];
    if (productResult.result && productResult.data?.list?.[0]?.variants) {
      variants = productResult.data.list[0].variants;
      console.log('\n✅ Found Variants:', variants.length);
      variants.forEach((v: any, idx: number) => {
        console.log(`  Variant ${idx + 1}:`, {
          vid: v.vid,
          variantSku: v.variantSku,
          variantName: v.variantName,
          price: v.variantSellPrice,
        });
      });
    }

    // Test 3: Try freight calculation with variant ID (if we found variants)
    console.log('\n📦 TEST 3: Freight Calculate with Variant ID');
    console.log('─'.repeat(80));
    
    let withVariantResult = { message: 'No variants found, skipped' };
    
    if (variants.length > 0) {
      // Use the first variant
      const firstVariant = variants[0];
      
      const withVariantRequest = {
        startCountryCode: 'CN',
        endCountryCode: 'US',
        products: [{
          vid: firstVariant.vid,
          quantity: quantity,
        }],
      };
      
      console.log('Request:', JSON.stringify(withVariantRequest, null, 2));
      
      // Add delay to avoid rate limit
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const withVariantResponse = await fetch(`${CJ_API_BASE_URL}/logistic/freightCalculate`, {
        method: 'POST',
        headers: {
          'CJ-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withVariantRequest),
      });

      withVariantResult = await withVariantResponse.json();
      console.log('Response:', JSON.stringify(withVariantResult, null, 2));
      
      if (withVariantResult.result && withVariantResult.data) {
        console.log('\n💰 SHIPPING FEE FOUND:', withVariantResult.data);
      }
    } else {
      console.log('⚠️ No variants found for this product, trying with PID only');
      
      // Retry basic freight calculate after delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const retryResponse = await fetch(`${CJ_API_BASE_URL}/logistic/freightCalculate`, {
        method: 'POST',
        headers: {
          'CJ-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basicRequest),
      });
      
      withVariantResult = await retryResponse.json();
      console.log('Response:', JSON.stringify(withVariantResult, null, 2));
    }

    // Test 4: Get all available shipping methods for first variant
    console.log('\n📦 TEST 4: Get All Shipping Methods for Variant');
    console.log('─'.repeat(80));
    
    let shippingMethodsResult = { message: 'Skipped or no variants' };
    
    if (variants.length > 0) {
      const firstVariant = variants[0];
      
      const shippingMethodsRequest = {
        startCountryCode: 'CN',
        endCountryCode: 'US',
        products: [{
          vid: firstVariant.vid,
          quantity: quantity,
        }],
      };
      
      console.log('Request:', JSON.stringify(shippingMethodsRequest, null, 2));
      
      // Add delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const shippingMethodsResponse = await fetch(`${CJ_API_BASE_URL}/logistic/freightCalculate`, {
        method: 'POST',
        headers: {
          'CJ-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingMethodsRequest),
      });

      shippingMethodsResult = await shippingMethodsResponse.json();
      console.log('Response:', JSON.stringify(shippingMethodsResult, null, 2));
    }

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
            variantsFound: variants.length,
            variants: variants.map((v: any) => ({
              vid: v.vid,
              variantSku: v.variantSku,
              variantName: v.variantName,
              price: v.variantSellPrice,
            })),
          },
          withVariantId: {
            request: variants.length > 0 ? {
              startCountryCode: 'CN',
              endCountryCode: 'US',
              products: [{ vid: variants[0]?.vid, quantity }],
            } : null,
            response: withVariantResult,
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

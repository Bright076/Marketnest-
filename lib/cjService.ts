// CJDropShipping API Service
// Server-side only - handles authentication and API requests

export interface CJAuthResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    openId: number;
    accessToken: string;
    accessTokenExpiryDate: string;
    refreshToken: string;
    refreshTokenExpiryDate: string;
    createDate: string;
  };
  requestId: string;
}

export interface CJApiResponse<T = any> {
  code: number;
  result: boolean;
  message: string;
  data: T;
}

export interface CJProduct {
  pid: string;
  productNameEn: string;
  productImage: string;
  sellPrice: number | string;
  productWeight: number | string;
  productSku: string;
  categoryName: string;
  description?: string;
  productImages?: string[];
  variants?: any[];
  isFreeShipping?: boolean;
}

export interface CJProductListResponse {
  list: CJProduct[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/**
 * CJDropShipping API Base URL
 */
const CJ_API_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";

/**
 * Get CJ API Key from environment variable
 * Server-side only
 */
function getCJApiKey(): string {
  const apiKey = process.env.CJ_API_KEY;
  
  if (!apiKey) {
    throw new Error("CJ_API_KEY not found in environment variables");
  }
  
  return apiKey.trim();
}

/**
 * Authenticate with CJDropShipping API
 * Returns access token for subsequent API calls
 * 
 * Uses API Key authentication (not email-based)
 * API Key must be obtained from CJ dashboard: Apps > API > Add API
 */
export async function authenticateCJ(): Promise<CJAuthResponse> {
  try {
    const apiKey = getCJApiKey();
    
    console.log('Authenticating with CJ API using API Key:', maskToken(apiKey));
    
    // CJ API expects apiKey parameter
    const requestBody = { apiKey };
    
    const response = await fetch(`${CJ_API_BASE_URL}/authentication/getAccessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CJ Auth Error ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: CJAuthResponse = await response.json();
    
    if (!data.result) {
      throw new Error(data.message || "Authentication failed");
    }

    console.log('CJ Authentication successful');
    return data;
  } catch (error: any) {
    console.error("CJ Authentication Error:", error);
    throw error;
  }
}

/**
 * Test CJ API connection by fetching basic info
 * This verifies that authentication and API access work
 */
export async function testCJConnection(): Promise<{
  authenticated: boolean;
  accessToken: string;
  message: string;
  timestamp: string;
}> {
  try {
    const startTime = Date.now();
    
    // Authenticate
    const authResponse = await authenticateCJ();
    
    const endTime = Date.now();
    const connectionTime = endTime - startTime;

    if (!authResponse.result || !authResponse.data.accessToken) {
      throw new Error("Failed to obtain access token");
    }

    return {
      authenticated: true,
      accessToken: authResponse.data.accessToken,
      message: `Connected successfully in ${connectionTime}ms`,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error(error.message || "Connection test failed");
  }
}

/**
 * Make authenticated request to CJ API
 * Automatically handles authentication
 */
export async function makeCJRequest<T = any>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
  } = {}
): Promise<CJApiResponse<T>> {
  try {
    // Get access token
    const authResponse = await authenticateCJ();
    const accessToken = authResponse.data.accessToken;

    console.log('Making CJ API request to:', `${CJ_API_BASE_URL}${endpoint}`);
    console.log('Using token (first 20 chars):', accessToken.substring(0, 20) + '...');

    // Make API request
    const response = await fetch(`${CJ_API_BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "CJ-Access-Token": accessToken,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CJ API Error ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: CJApiResponse<T> = await response.json();
    return data;
  } catch (error: any) {
    console.error("CJ API Request Error:", error);
    throw error;
  }
}

/**
 * Search CJ products with filters
 */
export async function searchCJProducts(params: {
  productName?: string;
  categoryId?: string;
  pageNum?: number;
  pageSize?: number;
}): Promise<CJApiResponse<CJProductListResponse>> {
  return makeCJRequest<CJProductListResponse>("/product/list", {
    method: "POST",
    body: {
      productName: params.productName || "",
      categoryId: params.categoryId || "",
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 20,
    },
  });
}

/**
 * Get product details by PID
 */
export async function getCJProductDetails(pid: string): Promise<CJApiResponse<CJProduct>> {
  return makeCJRequest<CJProduct>("/product/query", {
    method: "POST",
    body: {
      pid,
    },
  });
}

/**
 * Calculate US shipping fee for a product
 * Uses CJ's freight calculation API with variantSku (CJ requires vid or variantSku)
 */
export async function calculateUSShippingFee(productSku: string, quantity: number = 1): Promise<number> {
  try {
    console.log(`🚚 Calculating US shipping for SKU: ${productSku}, Quantity: ${quantity}`);
    
    const authResponse = await authenticateCJ();
    const accessToken = authResponse.data.accessToken;

    // CJ API requires "vid" or "variantSku" - we use variantSku (product SKU)
    const requestBody = {
      startCountryCode: 'CN', // Most CJ products ship from China
      endCountryCode: 'US',   // Always calculate for US
      products: [
        {
          variantSku: productSku,  // Use variantSku instead of pid
          quantity: quantity,
        }
      ],
    };

    console.log('📤 Freight Calculate Request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${CJ_API_BASE_URL}/logistic/freightCalculate`, {
      method: 'POST',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Freight Calculate Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ CJ Freight Calculate Error ${response.status}:`, errorText);
      throw new Error(`Failed to calculate shipping: ${errorText}`);
    }

    const result = await response.json();
    console.log('📦 CJ Freight Calculate Full Response:', JSON.stringify(result, null, 2));

    if (!result.result) {
      console.error('❌ CJ Freight Calculate returned result=false:', result.message);
      throw new Error(result.message || 'Freight calculation failed');
    }

    // Extract shipping fee from response
    // CJ may return different formats, handle common cases
    const shippingFee = result.data?.freightFee || 
                       result.data?.freight || 
                       result.data?.shippingFee ||
                       result.data?.logisticFee ||
                       result.data?.fee ||
                       0;

    console.log(`✅ US Shipping Fee for ${productSku}: $${shippingFee}`);
    
    if (shippingFee === 0) {
      console.log('🎉 Product has FREE SHIPPING to US!');
    }
    
    return Number(shippingFee);
  } catch (error: any) {
    console.error('❌ US Shipping Calculation Error:', error);
    console.error('Error details:', error.message, error.stack);
    throw error; // Throw so we know there's an issue
  }
}

/**
 * Get complete US dropshipping price for a product
 * Uses CJ freight API with variantSku for accurate shipping
 * Includes product price + US shipping fee
 */
export async function getCJProductUSDropshippingPrice(params: {
  pid: string;
  productSku: string;
  sellPrice: number | string;
  productWeight?: number | string;
  isFreeShipping?: boolean;
}): Promise<{
  productPrice: number;
  usShippingFee: number;
  usDropshippingPrice: number;
  shippingEstimated: boolean;
}> {
  try {
    const { pid, productSku, sellPrice, productWeight, isFreeShipping } = params;
    
    console.log(`Getting US dropshipping price for PID: ${pid}, SKU: ${productSku}`);

    // Parse product price (may be a range like "31.25 -- 37.85")
    let productPrice = 0;
    if (typeof sellPrice === 'string') {
      // If it's a range, use the lower price
      const priceMatch = sellPrice.match(/[\d.]+/);
      productPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
    } else {
      productPrice = Number(sellPrice);
    }

    console.log(`Product Price: ${productPrice}`);

    // Check if product has free shipping
    let usShippingFee = 0;
    let shippingEstimated = false;

    if (isFreeShipping) {
      console.log('✅ Product has FREE SHIPPING to US');
      usShippingFee = 0;
      shippingEstimated = false;
    } else {
      try {
        // Try to get actual shipping from CJ API using variantSku
        console.log('🚚 Calling CJ freight API with variantSku...');
        usShippingFee = await calculateUSShippingFee(productSku, 1);
        shippingEstimated = false; // It's from actual API
        console.log(`✅ Got actual CJ shipping: $${usShippingFee}`);
      } catch (error: any) {
        // If API fails, fall back to weight-based estimate
        console.warn('⚠️ CJ freight API failed, using weight-based estimate:', error.message);
        
        const weightInGrams = typeof productWeight === 'string' 
          ? parseFloat(productWeight) 
          : (productWeight || 0);

        if (weightInGrams > 0) {
          // Formula: $5 base + $0.015 per gram
          const estimatedFee = 5 + (weightInGrams * 0.015);
          usShippingFee = Math.min(Math.max(estimatedFee, 5), 50);
          shippingEstimated = true;
          console.log(`📦 Weight-based estimate: ${weightInGrams}g → $${usShippingFee.toFixed(2)}`);
        } else {
          usShippingFee = 5;
          shippingEstimated = true;
          console.log('⚠️ No weight data, using minimum $5 estimate');
        }
      }
    }

    const usDropshippingPrice = productPrice + usShippingFee;

    console.log('✅ US Dropshipping Price Breakdown:', {
      productPrice: productPrice.toFixed(2),
      usShippingFee: usShippingFee.toFixed(2),
      usDropshippingPrice: usDropshippingPrice.toFixed(2),
      isFreeShipping: isFreeShipping || false,
      shippingEstimated,
    });

    return {
      productPrice,
      usShippingFee,
      usDropshippingPrice,
      shippingEstimated,
    };
  } catch (error: any) {
    console.error('❌ Get US Dropshipping Price Error:', error);
    throw error;
  }
}

/**
 * Mask sensitive token for display
 * Shows first 10 and last 10 characters
 */
export function maskToken(token: string): string {
  if (token.length <= 20) {
    return "***";
  }
  const start = token.substring(0, 10);
  const end = token.substring(token.length - 10);
  return `${start}...${end}`;
}

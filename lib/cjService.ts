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
 * Uses CJ's freight calculation API
 */
export async function calculateUSShippingFee(pid: string, quantity: number = 1): Promise<number> {
  try {
    console.log(`Calculating US shipping for PID: ${pid}, Quantity: ${quantity}`);
    
    const authResponse = await authenticateCJ();
    const accessToken = authResponse.data.accessToken;

    const response = await fetch(`${CJ_API_BASE_URL}/logistic/freightCalculate`, {
      method: 'POST',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startCountryCode: 'CN', // Most CJ products ship from China
        endCountryCode: 'US',   // Always calculate for US
        products: [
          {
            pid: pid,
            quantity: quantity,
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CJ Freight Calculate Error ${response.status}:`, errorText);
      throw new Error(`Failed to calculate shipping: HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('CJ Freight Calculate Response:', JSON.stringify(result, null, 2));

    if (!result.result) {
      throw new Error(result.message || 'Shipping calculation failed');
    }

    // Extract shipping fee from response
    // CJ may return different formats, handle common cases
    const shippingFee = result.data?.freightFee || 
                       result.data?.freight || 
                       result.data?.shippingFee ||
                       0;

    console.log(`US Shipping Fee for ${pid}: $${shippingFee}`);
    return Number(shippingFee);
  } catch (error: any) {
    console.error('US Shipping Calculation Error:', error);
    // Don't fail silently - throw the error so caller can handle it
    throw new Error(`Failed to calculate US shipping: ${error.message}`);
  }
}

/**
 * Get complete US dropshipping price for a product
 * Includes product price + US shipping fee
 */
export async function getCJProductUSDropshippingPrice(pid: string): Promise<{
  productPrice: number;
  usShippingFee: number;
  usDropshippingPrice: number;
  productDetails: CJProduct;
}> {
  try {
    console.log(`Getting US dropshipping price for PID: ${pid}`);

    // Get product details
    const productResponse = await getCJProductDetails(pid);
    
    if (!productResponse.result || !productResponse.data) {
      throw new Error('Failed to fetch product details');
    }

    const product = productResponse.data;
    
    // Parse product price (may be a range like "31.25 -- 37.85")
    let productPrice = 0;
    if (typeof product.sellPrice === 'string') {
      // If it's a range, use the lower price
      const priceMatch = product.sellPrice.match(/[\d.]+/);
      productPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
    } else {
      productPrice = Number(product.sellPrice);
    }

    console.log(`Product Price: $${productPrice}`);

    // Check if product has free shipping
    const isFreeShipping = product.isFreeShipping === true;
    let usShippingFee = 0;

    if (!isFreeShipping) {
      // Calculate US shipping
      usShippingFee = await calculateUSShippingFee(pid, 1);
    } else {
      console.log('Product has FREE SHIPPING to US');
    }

    const usDropshippingPrice = productPrice + usShippingFee;

    console.log('US Dropshipping Price Breakdown:', {
      productPrice,
      usShippingFee,
      usDropshippingPrice,
      isFreeShipping,
    });

    return {
      productPrice,
      usShippingFee,
      usDropshippingPrice,
      productDetails: product,
    };
  } catch (error: any) {
    console.error('Get US Dropshipping Price Error:', error);
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

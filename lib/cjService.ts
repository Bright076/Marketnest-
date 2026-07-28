// CJDropShipping API Service
// Server-side only - handles authentication and API requests

export interface CJAuthResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  };
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
  sellPrice: number;
  productWeight: number;
  productSku: string;
  categoryName: string;
  description?: string;
  productImages?: string[];
  variants?: any[];
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
 */
export async function authenticateCJ(): Promise<CJAuthResponse> {
  try {
    const apiKey = getCJApiKey();
    
    const response = await fetch(`${CJ_API_BASE_URL}/authentication/getAccessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: apiKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: CJAuthResponse = await response.json();
    
    if (!data.result) {
      throw new Error(data.message || "Authentication failed");
    }

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
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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

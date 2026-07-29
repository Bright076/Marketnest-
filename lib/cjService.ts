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
 * Get CJ API credentials from environment variable
 * Server-side only
 * 
 * Supports multiple formats:
 * - Email:password: email@example.com:password_or_token
 * - CJ API format: CJ{userId}@api@{token}
 * - Email only: your-email@example.com
 */
function getCJCredentials(): { email: string; password?: string } {
  const apiKey = process.env.CJ_API_KEY;
  
  if (!apiKey) {
    throw new Error("CJ_API_KEY not found in environment variables");
  }
  
  const trimmed = apiKey.trim();
  
  // Check if it's CJ API format: CJ{userId}@api@{token}
  if (trimmed.includes('@api@')) {
    const parts = trimmed.split('@api@');
    const userId = parts[0]; // e.g., "CJ5366105"
    const token = parts[1];  // e.g., "465930408b5e4ce6a5802e538fbf01a7"
    
    // Use userId as email and token as password
    return { 
      email: userId, 
      password: token 
    };
  }
  
  // If it contains a colon after an email format, split into email and password
  // email@example.com:password
  const colonIndex = trimmed.lastIndexOf(':');
  if (colonIndex > 0 && trimmed.includes('@') && colonIndex > trimmed.indexOf('@')) {
    const email = trimmed.substring(0, colonIndex);
    const password = trimmed.substring(colonIndex + 1);
    return { email: email.trim(), password: password.trim() };
  }
  
  // Otherwise, just email (for email-only authentication)
  return { email: trimmed };
}

/**
 * Authenticate with CJDropShipping API
 * Returns access token for subsequent API calls
 * 
 * CJ API expects ONLY email for authentication
 */
export async function authenticateCJ(): Promise<CJAuthResponse> {
  try {
    const { email } = getCJCredentials();
    
    console.log('Authenticating with CJ API using email:', email);
    
    // CJ API expects ONLY email in the request body
    const requestBody = { email };
    
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

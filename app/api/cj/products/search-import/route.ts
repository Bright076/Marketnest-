// API Route: Search CJ Products for Import
// GET method with query parameters

import { NextRequest, NextResponse } from "next/server";
import { authenticateCJ } from "@/lib/cjService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword") || "";
    const pageNum = searchParams.get("pageNum") || "1";
    const pageSize = searchParams.get("pageSize") || "20";

    // Authenticate
    const authResponse = await authenticateCJ();
    const accessToken = authResponse.data.accessToken;

    // Build URL with query parameters
    const url = new URL("https://developers.cjdropshipping.com/api2.0/v1/product/list");
    url.searchParams.append("pageNum", pageNum);
    url.searchParams.append("pageSize", pageSize);
    
    // Add keyword to search in product name
    if (keyword) {
      url.searchParams.append("productNameEn", keyword);
      // Also search in product SKU for more results
      url.searchParams.append("productSku", keyword);
    }

    console.log('CJ API Request:', url.toString());

    // Fetch products
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "CJ-Access-Token": accessToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (!result.result) {
      throw new Error(result.message || "Failed to search products");
    }

    // Get products and sort them by relevance if keyword exists
    let products = result.data?.list || [];
    
    if (keyword && products.length > 0) {
      const searchLower = keyword.toLowerCase();
      
      // Sort products by relevance
      products = products.sort((a: any, b: any) => {
        const aName = (a.productNameEn || a.productName || '').toLowerCase();
        const bName = (b.productNameEn || b.productName || '').toLowerCase();
        
        // Priority 1: Exact match
        const aExact = aName === searchLower;
        const bExact = bName === searchLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Priority 2: Starts with search term
        const aStarts = aName.startsWith(searchLower);
        const bStarts = bName.startsWith(searchLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // Priority 3: Contains search term early in the name
        const aIndex = aName.indexOf(searchLower);
        const bIndex = bName.indexOf(searchLower);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        // Priority 4: Word boundary match (e.g., "phone" in "Smart Phone Case")
        const aWordMatch = aName.match(new RegExp(`\\b${searchLower}`, 'i'));
        const bWordMatch = bName.match(new RegExp(`\\b${searchLower}`, 'i'));
        if (aWordMatch && !bWordMatch) return -1;
        if (!aWordMatch && bWordMatch) return 1;
        
        // Default: keep original order
        return 0;
      });
      
      console.log(`Sorted ${products.length} products by relevance for keyword: "${keyword}"`);
    }

    return NextResponse.json({
      success: true,
      data: {
        products: products,
        total: result.data?.total || 0,
        pageNum: result.data?.pageNum || 1,
        pageSize: result.data?.pageSize || 20,
      },
    });
  } catch (error: any) {
    console.error("CJ Product Search Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || "Failed to search products",
          details: "Please try again or contact support",
        },
      },
      { status: 500 }
    );
  }
}

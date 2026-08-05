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

    console.log('🔍 CJ Search Request:', {
      keyword: keyword || '(empty - showing all products)',
      page: pageNum,
      size: pageSize,
      timestamp: new Date().toISOString()
    });

    // Authenticate
    const authResponse = await authenticateCJ();
    const accessToken = authResponse.data.accessToken;

    // Build URL with query parameters
    const url = new URL("https://developers.cjdropshipping.com/api2.0/v1/product/list");
    url.searchParams.append("pageNum", pageNum);
    url.searchParams.append("pageSize", pageSize);
    
    // Detect search type and add appropriate parameter
    if (keyword.trim()) {
      const trimmedKeyword = keyword.trim();
      
      // Check if it looks like a PID (CJ PIDs are typically long alphanumeric codes)
      // Examples: CJ12345678, AB123456CD
      const possiblyPID = /^[A-Z0-9]{8,}$/i.test(trimmedKeyword);
      
      // Check if it looks like a SKU (usually has dashes, underscores, or mixed format)
      // Examples: ABC-123, PROD_SKU_001, AB-CD-123
      const possiblySKU = /[A-Z0-9]+-[A-Z0-9]+|[A-Z0-9]+_[A-Z0-9]+/i.test(trimmedKeyword);
      
      if (possiblyPID && !possiblySKU) {
        // Likely a PID - long alphanumeric without separators
        url.searchParams.append("pid", trimmedKeyword);
        console.log('🆔 Detected PID format, searching by PID:', trimmedKeyword);
      } else if (possiblySKU) {
        // Has dashes or underscores - likely SKU
        url.searchParams.append("productSku", trimmedKeyword);
        console.log('🏷️ Detected SKU format, searching by SKU:', trimmedKeyword);
      } else {
        // Default: search by product name
        url.searchParams.append("productNameEn", trimmedKeyword);
        console.log('📝 Searching by product name:', trimmedKeyword);
      }
    } else {
      console.log('📋 No search keyword - fetching all products');
    }

    console.log('🌐 Full CJ API URL:', url.toString());

    // Fetch products
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "CJ-Access-Token": accessToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ CJ API HTTP Error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('📦 CJ API Response:', {
      success: result.result,
      message: result.message,
      productCount: result.data?.list?.length || 0,
      totalAvailable: result.data?.total || 0,
    });

    if (!result.result) {
      throw new Error(result.message || "Failed to search products");
    }

    // Get products and sort them by relevance if keyword exists
    let products = result.data?.list || [];
    let exactMatch = null;
    
    if (keyword.trim() && products.length > 0) {
      const searchLower = keyword.trim().toLowerCase();
      
      console.log('🎯 Sorting products by relevance for:', searchLower);
      
      // Check for exact match first
      exactMatch = products.find((p: any) => {
        const pName = (p.productNameEn || p.productName || '').toLowerCase();
        return pName === searchLower;
      });
      
      if (exactMatch) {
        console.log('✅ EXACT MATCH FOUND:', exactMatch.productNameEn || exactMatch.productName);
      } else {
        console.log('⚠️ NO EXACT MATCH - Showing related products with matching keywords');
      }
      
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
        
        // Priority 4: Word boundary match
        try {
          const escapedSearch = searchLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const aWordMatch = aName.match(new RegExp(`\\b${escapedSearch}`, 'i'));
          const bWordMatch = bName.match(new RegExp(`\\b${escapedSearch}`, 'i'));
          if (aWordMatch && !bWordMatch) return -1;
          if (!aWordMatch && bWordMatch) return 1;
        } catch (e) {
          // Regex error, skip this priority
        }
        
        // Default: keep original order
        return 0;
      });
      
      console.log(`✅ Sorted ${products.length} products by relevance`);
      
      // Log top 3 product names for debugging
      const topProducts = products.slice(0, 3).map((p: any) => p.productNameEn || p.productName);
      console.log('🏆 Top 3 results:', topProducts);
    }

    const responseData = {
      success: true,
      data: {
        products: products,
        total: result.data?.total || 0,
        pageNum: result.data?.pageNum || parseInt(pageNum),
        pageSize: result.data?.pageSize || parseInt(pageSize),
      },
      searchInfo: {
        keyword: keyword,
        resultsReturned: products.length,
        totalAvailable: result.data?.total || 0,
        sortedByRelevance: keyword.trim() !== '',
        exactMatchFound: exactMatch !== null,
        exactMatchName: exactMatch ? (exactMatch.productNameEn || exactMatch.productName) : null
      }
    };

    console.log('✅ Sending response:', {
      productsReturned: products.length,
      total: result.data?.total || 0,
    });

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("❌ CJ Product Search Error:", error);

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

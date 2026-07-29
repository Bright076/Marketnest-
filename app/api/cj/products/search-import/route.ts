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
    
    if (keyword) {
      url.searchParams.append("productNameEn", keyword);
    }

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

    return NextResponse.json({
      success: true,
      data: {
        products: result.data?.list || [],
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

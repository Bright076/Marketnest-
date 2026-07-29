// API Route: Test Fetch Products from CJ
// Just fetch and return raw data - no database saving

import { NextResponse } from "next/server";
import { authenticateCJ } from "@/lib/cjService";

export async function GET() {
  try {
    console.log("Starting CJ product fetch test...");

    // Authenticate first
    const authResponse = await authenticateCJ();
    const accessToken = authResponse.data.accessToken;

    // Fetch products using GET method with query parameters
    const url = new URL("https://developers.cjdropshipping.com/api2.0/v1/product/list");
    url.searchParams.append("pageNum", "1");
    url.searchParams.append("pageSize", "10");
    url.searchParams.append("productNameEn", "phone");  // Search for phones

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

    console.log("CJ API Response:", JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      message: "Successfully fetched products from CJ",
      raw_response: result,
      product_count: result.data?.list?.length || 0,
      products: result.data?.list || [],
    });
  } catch (error: any) {
    console.error("Product Fetch Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || "Failed to fetch products",
          details: error.toString(),
        },
      },
      { status: 500 }
    );
  }
}

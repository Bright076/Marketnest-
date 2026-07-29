// API Route: Test Fetch Products from CJ
// Just fetch and return raw data - no database saving

import { NextResponse } from "next/server";
import { makeCJRequest } from "@/lib/cjService";

export async function GET() {
  try {
    console.log("Starting CJ product fetch test...");

    // Fetch products - try generic electronics search
    const result = await makeCJRequest("/product/list", {
      method: "POST",
      body: {
        productName: "",  // Empty = get any products
        categoryId: "",
        pageNum: 1,
        pageSize: 10,
      },
    });

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

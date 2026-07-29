// API Route: Search CJ Products
// Server-side only

import { NextRequest, NextResponse } from "next/server";
import { searchCJProducts } from "@/lib/cjService";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, categoryId, pageNum, pageSize } = body;

    // Search CJ products
    const result = await searchCJProducts({
      productName,
      categoryId,
      pageNum: pageNum || 1,
      pageSize: pageSize || 20,
    });

    if (!result.result) {
      throw new Error(result.message || "Failed to search products");
    }

    return NextResponse.json({
      success: true,
      data: result.data,
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

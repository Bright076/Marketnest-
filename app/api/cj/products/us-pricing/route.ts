// API Route: Get US Dropshipping Price for CJ Product
// Calculates product price + US shipping fee

import { NextRequest, NextResponse } from "next/server";
import { getCJProductUSDropshippingPrice } from "@/lib/cjService";

export async function POST(request: NextRequest) {
  try {
    const { pid } = await request.json();

    if (!pid) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Product ID (pid) is required" },
        },
        { status: 400 }
      );
    }

    console.log(`📦 Calculating US dropshipping price for PID: ${pid}`);

    const pricing = await getCJProductUSDropshippingPrice(pid);

    console.log('✅ US Dropshipping Price calculated:', {
      productPrice: pricing.productPrice,
      usShippingFee: pricing.usShippingFee,
      total: pricing.usDropshippingPrice,
    });

    return NextResponse.json({
      success: true,
      data: {
        pid: pid,
        productPrice: pricing.productPrice,
        usShippingFee: pricing.usShippingFee,
        usDropshippingPrice: pricing.usDropshippingPrice,
        isFreeShipping: pricing.usShippingFee === 0,
      },
    });
  } catch (error: any) {
    console.error("❌ US Pricing Calculation Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || "Failed to calculate US dropshipping price",
          details: "Please try again or contact support if the issue persists",
        },
      },
      { status: 500 }
    );
  }
}

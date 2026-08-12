// API Route: Get US Dropshipping Price for CJ Product
// Calculates product price + US shipping fee

import { NextRequest, NextResponse } from "next/server";
import { getCJProductUSDropshippingPrice } from "@/lib/cjService";

export async function POST(request: NextRequest) {
  try {
    const { pid, productSku, sellPrice, productWeight, isFreeShipping } = await request.json();

    if (!pid) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Product ID (pid) is required" },
        },
        { status: 400 }
      );
    }

    if (!productSku) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Product SKU (productSku) is required" },
        },
        { status: 400 }
      );
    }

    if (!sellPrice) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Product price (sellPrice) is required" },
        },
        { status: 400 }
      );
    }

    console.log(`📦 Calculating US dropshipping price for PID: ${pid}, SKU: ${productSku}`);

    const pricing = await getCJProductUSDropshippingPrice({
      pid,
      productSku,
      sellPrice,
      productWeight: productWeight || 0,
      isFreeShipping: isFreeShipping || false,
    });

    console.log('✅ US Dropshipping Price calculated:', {
      productPrice: pricing.productPrice,
      usShippingFee: pricing.usShippingFee,
      total: pricing.usDropshippingPrice,
      estimated: pricing.shippingEstimated,
    });

    return NextResponse.json({
      success: true,
      data: {
        pid: pid,
        productPrice: pricing.productPrice,
        usShippingFee: pricing.usShippingFee,
        usDropshippingPrice: pricing.usDropshippingPrice,
        shippingEstimated: pricing.shippingEstimated,
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

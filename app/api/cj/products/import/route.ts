// API Route: Import CJ Product to Store
// Server-side only

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cj_pid,
      title,
      description,
      image_url,
      supplier_price,
      profit_amount,
      selling_price,
      category,
      stock,
    } = body;

    // Validation
    if (!title || !supplier_price || !selling_price) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Missing required fields",
            details: "Title, supplier price, and selling price are required",
          },
        },
        { status: 400 }
      );
    }

    // Check if product already exists (by CJ PID)
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id")
      .eq("cj_pid", cj_pid)
      .single();

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Product already imported",
            details: "This product is already in your store",
          },
        },
        { status: 409 }
      );
    }

    // Insert product
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          cj_pid,
          title,
          description: description || "",
          image_url: image_url || "",
          supplier_price: parseFloat(supplier_price),
          profit_amount: parseFloat(profit_amount) || 0,
          selling_price: parseFloat(selling_price),
          category: category || "Electronics",
          stock: parseInt(stock) || 0,
          product_type: "cj",
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Product imported successfully",
    });
  } catch (error: any) {
    console.error("CJ Product Import Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || "Failed to import product",
          details: "Please try again or contact support",
        },
      },
      { status: 500 }
    );
  }
}

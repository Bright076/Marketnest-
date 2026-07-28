// API Route: Test CJDropShipping Connection
// Server-side only - handles secure authentication

import { NextResponse } from "next/server";
import { testCJConnection, maskToken } from "@/lib/cjService";

export async function POST() {
  try {
    const startTime = Date.now();

    // Test CJ connection
    const result = await testCJConnection();
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Return success response with masked token
    return NextResponse.json({
      success: true,
      data: {
        authenticated: result.authenticated,
        accessToken: maskToken(result.accessToken),
        message: result.message,
        timestamp: result.timestamp,
        connectionTime: `${totalTime}ms`,
      },
    });
  } catch (error: any) {
    console.error("CJ Connection Test Error:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || "Failed to connect to CJDropShipping API",
          details: "Please check your CJ_API_KEY in environment variables",
        },
      },
      { status: 500 }
    );
  }
}

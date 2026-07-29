// API Route: Test CJDropshipping Connection
// Server-side only - handles secure authentication

import { NextResponse } from "next/server";
import { testCJConnection, maskToken } from "@/lib/cjService";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleTestConnection() {
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

// Support both GET and POST methods
export async function GET() {
  return handleTestConnection();
}

export async function POST() {
  return handleTestConnection();
}

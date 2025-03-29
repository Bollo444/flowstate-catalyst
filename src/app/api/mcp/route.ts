import { NextRequest, NextResponse } from "next/server";

const MCP_SERVER = process.env.MCP_SERVER_URL || "http://localhost:3001";
const IS_DEV = process.env.NODE_ENV === "development";

// Main API handler
export async function POST(request: NextRequest) {
  if (IS_DEV) {
    // Development mock response
    return NextResponse.json({
      status: "success",
      message: "Development mode - MCP server not required",
      data: { mock: true },
    });
  }

  const body = await request.json();
  const service = request.nextUrl.searchParams.get("service");

  try {
    const response = await fetch(`${MCP_SERVER}/api/${service}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("MCP service error:", error);
    return NextResponse.json({ error: "MCP service error" }, { status: 500 });
  }
}
// Health check endpoint
export async function GET(_request: NextRequest) {
  // Prefix unused parameter with underscore
  if (IS_DEV) {
    return NextResponse.json({
      status: "ok",
      mode: "development",
    });
  }

  try {
    const response = await fetch(`${MCP_SERVER}/api/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("MCP health check failed:", error);
    return NextResponse.json(
      { error: "MCP server is not responding" },
      { status: 503 }
    );
  }
}

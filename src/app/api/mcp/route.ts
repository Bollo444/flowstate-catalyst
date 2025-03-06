import { NextRequest, NextResponse } from 'next/server';

const MCP_SERVER = process.env.MCP_SERVER_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const service = request.nextUrl.searchParams.get('service');
  
  try {
    const response = await fetch(`${MCP_SERVER}/api/${service}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'MCP service error' },
      { status: 500 }
    );
  }
}
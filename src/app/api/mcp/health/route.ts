import { NextResponse } from 'next/server';

export async function GET() {
  const MCP_SERVER = process.env.MCP_SERVER_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${MCP_SERVER}/api/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('MCP health check failed:', error);
    return NextResponse.json(
      { error: 'MCP server is not responding' },
      { status: 503 }
    );
  }
}
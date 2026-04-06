import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  try {
    const { migrationClient } = await import('@/lib/db');
    // Check database connectivity with a simple query
    const result = await migrationClient`SELECT 1 as ok`;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Database connectivity check failed' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'error',
        message,
      },
      { status: 503 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { chainService } from '@/lib/supabase-chain-service';

// GET /api/chain/latest - Get latest event for a case
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const caseId = request.nextUrl.searchParams.get('caseId');

    if (!tenantId || !caseId) {
      return NextResponse.json(
        { error: 'Tenant ID and Case ID are required' },
        { status: 400 }
      );
    }

    const service = chainService(tenantId);
    const event = await service.getLatestEventForCase(caseId);

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error fetching latest event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch latest event' },
      { status: 500 }
    );
  }
}
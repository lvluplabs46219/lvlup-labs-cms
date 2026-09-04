import { NextRequest, NextResponse } from 'next/server';
import { chainService } from '@/lib/supabase-chain-service';

// GET /api/chain/events - Get chain events
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    const caseId = request.nextUrl.searchParams.get('caseId');
    const resourceType = request.nextUrl.searchParams.get('resourceType');
    const resourceId = request.nextUrl.searchParams.get('resourceId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const service = chainService(tenantId);

    let events;
    if (sessionId) {
      events = await service.getChainEvents(sessionId);
    } else if (caseId) {
      events = await service.getChainEventsForCase(caseId);
    } else if (resourceType && resourceId) {
      events = await service.getChainEventsForResource(resourceType, resourceId);
    } else {
      return NextResponse.json(
        { error: 'Either sessionId, caseId, or resourceType+resourceId must be provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching chain events:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chain events' },
      { status: 500 }
    );
  }
}
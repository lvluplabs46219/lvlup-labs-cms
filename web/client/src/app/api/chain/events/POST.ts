import { NextRequest, NextResponse } from 'next/server';
import { chainService } from '@/lib/supabase-chain-service';
import { ChainEventInput } from '@/lib/chain-of-command';

// POST /api/chain/events - Create a new chain event
export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const sessionId = request.headers.get('x-session-id');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const body: ChainEventInput = await request.json();
    const service = chainService(tenantId);

    // Get or create the chain session
    const chain = await service.getOrCreateSession(sessionId);

    // Create and save the event
    const event = await service.saveEvent(chain, body);

    return NextResponse.json({ event, chainState: chain.state });
  } catch (error) {
    console.error('Error creating chain event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create chain event' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { chainService } from '@/lib/supabase-chain-service';

// GET /api/chain/verify - Verify a chain
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    const caseId = request.nextUrl.searchParams.get('caseId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    if (!sessionId && !caseId) {
      return NextResponse.json(
        { error: 'Either sessionId or caseId must be provided' },
        { status: 400 }
      );
    }

    const service = chainService(tenantId);
    const result = sessionId
      ? await service.verifyChain(sessionId)
      : await service.verifyCaseChain(caseId!);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error verifying chain:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify chain' },
      { status: 500 }
    );
  }
}
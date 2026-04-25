import { NextResponse } from 'next/server';

import { DEMO_HORSE_ID } from '@/lib/pedigree/demo';
import { prepareMintPayload } from '@/lib/pedigree/service';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const payload = await prepareMintPayload(DEMO_HORSE_ID);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}


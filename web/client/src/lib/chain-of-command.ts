import 'server-only';
import { createHash, randomUUID } from 'node:crypto';

export const GENESIS_HASH = '0'.repeat(64);

export type ChainEventType =
  | 'CASE_CREATED'
  | 'CASE_UPDATED'
  | 'CASE_STATUS_CHANGED'
  | 'EVIDENCE_UPLOADED'
  | 'EVIDENCE_ACCESSED'
  | 'EVIDENCE_TRANSFERRED'
  | 'EVIDENCE_HASH_VERIFIED'
  | 'DOCUMENT_CREATED'
  | 'DOCUMENT_UPDATED'
  | 'DOCUMENT_EXPORTED'
  | 'AI_ANALYSIS_STARTED'
  | 'AI_TOOL_CALLED'
  | 'AI_ANALYSIS_COMPLETED'
  | 'SOURCE_RETRIEVED'
  | 'CITATION_VERIFIED'
  | 'MOTION_GENERATED'
  | 'FILING_PREPARED'
  | 'FILING_STATUS_CHANGED'
  | 'CONTINUANCE_REQUESTED'
  | 'PERMISSION_CHANGED'
  | 'TENANT_ACCESS_DENIED'
  | 'COMPLIANCE_CHECK'
  | 'EXPORT_CREATED'
  | 'CHAIN_VERIFICATION';

export interface ChainEventInput {
  tenantId: string;
  actorId: string;
  eventType: ChainEventType;
  caseId?: string;
  resourceType?: string;
  resourceId?: string;
  payload?: unknown;
  provenance?: unknown;
  compliance?: unknown;
  occurredAt?: string;
}

export interface ChainEvent extends ChainEventInput {
  id: string;
  sequenceNumber: number;
  occurredAt: string;
  previousHash: string;
  eventHash: string;
}

/**
 * Deterministic JSON serialization for audit hashing.
 * Object keys are sorted recursively so equivalent payloads hash identically.
 */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`)
    .join(',')}}`;
}

export function hashChainEvent(
  event: Omit<ChainEvent, 'eventHash'>,
): string {
  const payload = canonicalize({
    id: event.id,
    tenantId: event.tenantId,
    actorId: event.actorId,
    eventType: event.eventType,
    caseId: event.caseId ?? null,
    resourceType: event.resourceType ?? null,
    resourceId: event.resourceId ?? null,
    sequenceNumber: event.sequenceNumber,
    occurredAt: event.occurredAt,
    payload: event.payload ?? null,
    provenance: event.provenance ?? null,
    compliance: event.compliance ?? null,
  });

  return createHash('sha256')
    .update(`${event.previousHash}:${payload}`, 'utf8')
    .digest('hex');
}

/**
 * Server-side chain builder. Persistence should be performed transactionally
 * by the caller (Supabase/Postgres recommended); never trust client hashes.
 */
export class ChainOfCommand {
  private readonly sessionId: string;
  private previousHash: string;
  private nextSequence: number;

  constructor(options?: {
    sessionId?: string;
    previousHash?: string;
    nextSequence?: number;
  }) {
    this.sessionId = options?.sessionId ?? randomUUID();
    this.previousHash = options?.previousHash ?? GENESIS_HASH;
    this.nextSequence = options?.nextSequence ?? 1;
  }

  get state() {
    return {
      sessionId: this.sessionId,
      previousHash: this.previousHash,
      nextSequence: this.nextSequence,
    };
  }

  createEvent(input: ChainEventInput): ChainEvent {
    const occurredAt = input.occurredAt ?? new Date().toISOString();

    const event: Omit<ChainEvent, 'eventHash'> = {
      ...input,
      id: randomUUID(),
      occurredAt,
      sequenceNumber: this.nextSequence,
      previousHash: this.previousHash,
    };

    const eventHash = hashChainEvent(event);
    const completed: ChainEvent = { ...event, eventHash };

    this.previousHash = eventHash;
    this.nextSequence += 1;

    return completed;
  }
}

export interface ChainVerificationResult {
  verified: boolean;
  eventsChecked: number;
  brokenLinks: number;
  invalidHashes: number;
  sequenceGaps: number;
  errors: string[];
}

/**
 * Recomputes every event and verifies linkage, sequence continuity, and the
 * genesis anchor. This function never mutates the supplied events.
 */
export function verifyChain(events: readonly ChainEvent[]): ChainVerificationResult {
  const errors: string[] = [];
  let brokenLinks = 0;
  let invalidHashes = 0;
  let sequenceGaps = 0;

  const ordered = [...events].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  let expectedPreviousHash = GENESIS_HASH;
  let expectedSequence = ordered.length > 0 ? ordered[0].sequenceNumber : 1;

  for (const event of ordered) {
    if (event.sequenceNumber !== expectedSequence) {
      sequenceGaps += 1;
      errors.push(
        `Sequence gap: expected ${expectedSequence}, found ${event.sequenceNumber}.`,
      );
      expectedSequence = event.sequenceNumber;
    }

    if (event.previousHash !== expectedPreviousHash) {
      brokenLinks += 1;
      errors.push(`Broken link at event ${event.id}.`);
    }

    const expectedHash = hashChainEvent(event);
    if (event.eventHash !== expectedHash) {
      invalidHashes += 1;
      errors.push(`Invalid hash at event ${event.id}.`);
    }

    expectedPreviousHash = event.eventHash;
    expectedSequence += 1;
  }

  return {
    verified:
      errors.length === 0 &&
      brokenLinks === 0 &&
      invalidHashes === 0 &&
      sequenceGaps === 0,
    eventsChecked: ordered.length,
    brokenLinks,
    invalidHashes,
    sequenceGaps,
    errors,
  };
}

export function fingerprintEvidence(content: string | Uint8Array): string {
  return createHash('sha256').update(content).digest('hex');
}

# Chain of Command - Legal Document Verification System

## Overview

Chain of Command is a cryptographic verification infrastructure for legal documents that uses blockchain as a trust layer. It provides a universal verification layer for U.S. legal records with tamper-evident cryptographic linking.

## Architecture

The system implements a three-layer architecture:

### Layer 1: Evidence
- The actual PDF, image, video, filing, record, etc.

### Layer 2: Chain of Command  
- Internal cryptographically linked history
- Each event contains: Document -> Hash -> Event -> Previous Hash -> Next Event

### Layer 3: Public Blockchain Anchoring
- Periodic Merkle root / chain checkpoint anchoring to public blockchains
- Cryptographic commitments/fingerprints stored on-chain (never the actual documents)

## Implementation

### Core Components

1. **chain-of-command.ts** - Core cryptographic chain logic
   - SHA-256 chained events
   - Previous-hash linking
   - Deterministic/canonical serialization
   - Sequence numbers
   - Full-chain verification

2. **supabase.ts** - Supabase client configuration
3. **supabase-chain-service.ts** - Supabase persistence service
4. **ChainTrackingUI.tsx** - FedEx-style tracking UI component
5. **API Endpoints** - REST API for chain operations

### Database Schema

The system uses the following PostgreSQL tables:

- **chain_sessions** - Tracks active chain sessions with current state
- **chain_events** - Stores all cryptographically linked chain events
- **blockchain_anchors** - Anchors Merkle roots to public blockchains
- **chain_events_view** - Materialized view for easy querying

### Event Types

The system supports various event types including:
- CASE_CREATED, CASE_UPDATED, CASE_STATUS_CHANGED
- EVIDENCE_UPLOADED, EVIDENCE_ACCESSED, EVIDENCE_TRANSFERRED
- DOCUMENT_CREATED, DOCUMENT_UPDATED, DOCUMENT_EXPORTED
- AI_ANALYSIS_STARTED, AI_TOOL_CALLED, AI_ANALYSIS_COMPLETED
- SOURCE_RETRIEVED, CITATION_VERIFIED
- MOTION_GENERATED, FILING_PREPARED, FILING_STATUS_CHANGED
- CONTINUANCE_REQUESTED, PERMISSION_CHANGED
- COMPLIANCE_CHECK, EXPORT_CREATED, CHAIN_VERIFICATION

## API Endpoints

### GET /api/chain/events
Get chain events for a session, case, or resource.

Headers:
- x-tenant-id (required): Tenant identifier

Query Parameters:
- sessionId: Get events for a specific session
- caseId: Get events for a specific case
- resourceType + resourceId: Get events for a specific resource

Response:
```json
{
  "events": ["ChainEvent array"]
}
```

### POST /api/chain/events
Create a new chain event.

Headers:
- x-tenant-id (required): Tenant identifier
- x-session-id (optional): Session identifier

Body:
```json
{
  "tenantId": "string",
  "actorId": "string", 
  "eventType": "EVENT_TYPE",
  "caseId": "string",
  "resourceType": "string",
  "resourceId": "string",
  "payload": "any",
  "provenance": "any",
  "compliance": "any",
  "occurredAt": "string"
}
```

### GET /api/chain/verify
Verify a chain for a session or case.

Headers:
- x-tenant-id (required): Tenant identifier

Query Parameters:
- sessionId: Verify a specific session
- caseId: Verify a specific case

### GET /api/chain/latest
Get the latest event for a case.

Headers:
- x-tenant-id (required): Tenant identifier

Query Parameters:
- caseId (required): Case identifier

## Usage Examples

### Creating a Chain Event
```typescript
import { chainService } from '@/lib/supabase-chain-service';

const service = chainService('tenant-123');
const chain = await service.getOrCreateSession('session-456');

const event = await service.saveEvent(chain, {
  tenantId: 'tenant-123',
  actorId: 'user-789',
  eventType: 'DOCUMENT_UPLOADED',
  caseId: 'CR2026-123456',
  resourceType: 'COURT_DOCUMENT',
  resourceId: 'motion-to-suppress-001',
  payload: { documentName: 'Motion to Suppress', fileSize: 1024 },
  provenance: { source: 'Arizona Superior Court', verified: true },
});
```

### Verifying a Chain
```typescript
const result = await service.verifyChain('session-456');

if (result.verified) {
  console.log('Chain is cryptographically verified');
} else {
  console.log('Chain verification failed:', result.errors);
}
```

## Setup

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Migration
Run the SQL migration from api/db/migrate/chain_of_command_migration.sql

### Dependencies
```bash
npm install @supabase/supabase-js
```

## Security Features

- Server-only cryptographic operations
- SHA-256 cryptographic hashing
- Deterministic JSON serialization
- Cryptographic linking between events
- Sequence number validation
- Tamper detection
- Multi-tenant isolation

## License

Part of LvlUp Labs CMS for legal document verification.
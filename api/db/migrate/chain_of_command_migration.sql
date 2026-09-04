-- Chain of Command Database Schema
-- This migration creates the tables needed for the Chain of Command verification system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Chain sessions table - tracks active chain sessions
CREATE TABLE IF NOT EXISTS chain_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  current_hash TEXT NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
  sequence_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for chain_sessions
CREATE INDEX IF NOT EXISTS idx_chain_sessions_tenant_session ON chain_sessions(tenant_id, session_id);
CREATE INDEX IF NOT EXISTS idx_chain_sessions_tenant ON chain_sessions(tenant_id);

-- Chain events table - stores all chain events with their cryptographic hashes
CREATE TABLE IF NOT EXISTS chain_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (tenant_id, session_id) REFERENCES chain_sessions(tenant_id, session_id) ON DELETE CASCADE
);

-- Indexes for chain_events
CREATE INDEX IF NOT EXISTS idx_chain_events_tenant_session ON chain_events(tenant_id, session_id);
CREATE INDEX IF NOT EXISTS idx_chain_events_tenant ON chain_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_chain_events_session ON chain_events(session_id);
CREATE INDEX IF NOT EXISTS idx_chain_events_case_id ON chain_events ((event->>'caseId'));
CREATE INDEX IF NOT EXISTS idx_chain_events_resource ON chain_events ((event->>'resourceType'), (event->>'resourceId'));
CREATE INDEX IF NOT EXISTS idx_chain_events_sequence ON chain_events ((event->>'sequenceNumber'));
CREATE INDEX IF NOT EXISTS idx_chain_events_created ON chain_events(created_at DESC);

-- Blockchain anchors table - for anchoring Merkle roots to public blockchains
CREATE TABLE IF NOT EXISTS blockchain_anchors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL,
  anchor_type TEXT NOT NULL,
  blockchain_network TEXT NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  block_number INTEGER NOT NULL,
  merkle_root TEXT NOT NULL,
  anchor_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for blockchain_anchors
CREATE INDEX IF NOT EXISTS idx_blockchain_anchors_tenant ON blockchain_anchors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_anchors_tx_hash ON blockchain_anchors(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_anchors_created ON blockchain_anchors(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_chain_sessions_updated_at ON chain_sessions;
CREATE TRIGGER update_chain_sessions_updated_at
  BEFORE UPDATE ON chain_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chain_events_updated_at ON chain_events;
CREATE TRIGGER update_chain_events_updated_at
  BEFORE UPDATE ON chain_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- View for easy querying of chain events
CREATE OR REPLACE VIEW chain_events_view AS
SELECT 
  ce.id,
  ce.tenant_id,
  ce.session_id,
  ce.event->>'id' as event_id,
  ce.event->>'tenantId' as event_tenant_id,
  ce.event->>'actorId' as actor_id,
  ce.event->>'eventType' as event_type,
  ce.event->>'caseId' as case_id,
  ce.event->>'resourceType' as resource_type,
  ce.event->>'resourceId' as resource_id,
  ce.event->>'sequenceNumber' as sequence_number,
  ce.event->>'occurredAt' as occurred_at,
  ce.event->>'previousHash' as previous_hash,
  ce.event->>'eventHash' as event_hash,
  ce.event->'payload' as payload,
  ce.event->'provenance' as provenance,
  ce.event->'compliance' as compliance,
  ce.created_at,
  ce.updated_at
FROM chain_events ce;

-- Index on the view
CREATE INDEX IF NOT EXISTS idx_chain_events_view_case ON chain_events_view(case_id);
CREATE INDEX IF NOT EXISTS idx_chain_events_view_resource ON chain_events_view(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_chain_events_view_sequence ON chain_events_view(sequence_number);

COMMENT ON TABLE chain_sessions IS 'Tracks active Chain of Command sessions with current state';
COMMENT ON TABLE chain_events IS 'Stores all cryptographically linked chain events';
COMMENT ON TABLE blockchain_anchors IS 'Anchors Merkle roots of chain state to public blockchains';
COMMENT ON VIEW chain_events_view IS 'Materialized view for easy querying of chain events';
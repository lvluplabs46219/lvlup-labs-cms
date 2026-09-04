import 'server-only';
import { supabase } from './supabase';
import {
  ChainEvent,
  ChainEventInput,
  ChainOfCommand,
  GENESIS_HASH,
  verifyChain,
} from './chain-of-command';

export class SupabaseChainService {
  private readonly tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  async getOrCreateSession(sessionId?: string): Promise<ChainOfCommand> {
    const targetSessionId = sessionId ?? crypto.randomUUID();

    const { data: existingSession, error } = await supabase
      .from('chain_sessions')
      .select('*')
      .eq('tenant_id', this.tenantId)
      .eq('session_id', targetSessionId)
      .maybeSingle();

    if (error) {
      throw new Error('Failed to load chain session: ' + error.message);
    }

    if (existingSession) {
      return new ChainOfCommand({
        sessionId: existingSession.session_id,
        previousHash: existingSession.current_hash,
        nextSequence: existingSession.sequence_number,
      });
    }

    const newChain = new ChainOfCommand({
      sessionId: targetSessionId,
      previousHash: GENESIS_HASH,
      nextSequence: 1,
    });

    await supabase
      .from('chain_sessions')
      .insert({
        id: crypto.randomUUID(),
        tenant_id: this.tenantId,
        session_id: targetSessionId,
        current_hash: GENESIS_HASH,
        sequence_number: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    return newChain;
  }

  async saveEvent(chain: ChainOfCommand, input: ChainEventInput): Promise<ChainEvent> {
    const event = chain.createEvent(input);

    await supabase
      .from('chain_events')
      .insert({
        id: crypto.randomUUID(),
        tenant_id: this.tenantId,
        session_id: chain.state.sessionId,
        event: event,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    await supabase
      .from('chain_sessions')
      .update({
        current_hash: chain.state.previousHash,
        sequence_number: chain.state.nextSequence,
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', this.tenantId)
      .eq('session_id', chain.state.sessionId);

    return event;
  }

  async getChainEvents(sessionId: string): Promise<ChainEvent[]> {
    const { data, error } = await supabase
      .from('chain_events')
      .select('event')
      .eq('tenant_id', this.tenantId)
      .eq('session_id', sessionId)
      .order('event->sequenceNumber', { ascending: true });

    if (error) {
      throw new Error('Failed to load chain events: ' + error.message);
    }

    const typedData = data as Array<{ event: ChainEvent }>;
    return typedData.map((row) => row.event);
  }

  async getChainEventsForCase(caseId: string): Promise<ChainEvent[]> {
    const { data, error } = await supabase
      .from('chain_events')
      .select('event')
      .eq('tenant_id', this.tenantId)
      .eq('event->caseId', caseId)
      .order('event->sequenceNumber', { ascending: true });

    if (error) {
      throw new Error('Failed to load chain events for case: ' + error.message);
    }

    const typedData = data as Array<{ event: ChainEvent }>;
    return typedData.map((row) => row.event);
  }

  async getChainEventsForResource(resourceType: string, resourceId: string): Promise<ChainEvent[]> {
    const { data, error } = await supabase
      .from('chain_events')
      .select('event')
      .eq('tenant_id', this.tenantId)
      .eq('event->resourceType', resourceType)
      .eq('event->resourceId', resourceId)
      .order('event->sequenceNumber', { ascending: true });

    if (error) {
      throw new Error('Failed to load chain events for resource: ' + error.message);
    }

    const typedData = data as Array<{ event: ChainEvent }>;
    return typedData.map((row) => row.event);
  }

  async verifyChain(sessionId: string) {
    const events = await this.getChainEvents(sessionId);
    return verifyChain(events);
  }

  async verifyCaseChain(caseId: string) {
    const events = await this.getChainEventsForCase(caseId);
    return verifyChain(events);
  }

  async getLatestEventForCase(caseId: string): Promise<ChainEvent | null> {
    const { data, error } = await supabase
      .from('chain_events')
      .select('event')
      .eq('tenant_id', this.tenantId)
      .eq('event->caseId', caseId)
      .order('event->sequenceNumber', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error('Failed to load latest event: ' + error.message);
    }

    const typedData = data as { event: ChainEvent } | null;
    return typedData?.event ?? null;
  }
}

export const chainService = (tenantId: string) => new SupabaseChainService(tenantId);
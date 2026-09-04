"use client";

import { useState, useEffect } from 'react';
import { ChainEvent } from '@/lib/chain-of-command';
import { chainService } from '@/lib/supabase-chain-service';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Link, Hash, FileText, User, Calendar, ShieldCheck } from 'lucide-react';

interface TrackingUIProps {
  tenantId: string;
  caseId?: string;
  sessionId?: string;
  resourceType?: string;
  resourceId?: string;
}

interface VerificationStatus {
  authenticity: 'VERIFIED' | 'PENDING' | 'FAILED';
  integrity: 'VERIFIED' | 'PENDING' | 'FAILED';
  source: 'VERIFIED' | 'PENDING' | 'FAILED';
  chainOfCustody: number;
  signature: 'VERIFIED' | 'PENDING' | 'FAILED';
  currentness: 'VERIFIED' | 'REVIEW_NEEDED' | 'FAILED';
}

const statusColors = {
  VERIFIED: 'text-green-600 bg-green-50',
  PENDING: 'text-yellow-600 bg-yellow-50',
  FAILED: 'text-red-600 bg-red-50',
  REVIEW_NEEDED: 'text-orange-600 bg-orange-50',
};

const statusIcons = {
  VERIFIED: CheckCircle2,
  PENDING: Clock,
  FAILED: XCircle,
  REVIEW_NEEDED: AlertTriangle,
};

export function ChainTrackingUI({ tenantId, caseId, sessionId, resourceType, resourceId }: TrackingUIProps) {
  const [events, setEvents] = useState<ChainEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationStatus | null>(null);
  const [chainStats, setChainStats] = useState({
    totalEvents: 0,
    verifiedEvents: 0,
    brokenLinks: 0,
    sequenceGaps: 0,
  });

  useEffect(() => {
    loadChainData();
  }, [tenantId, caseId, sessionId, resourceType, resourceId]);

  const loadChainData = async () => {
    try {
      setLoading(true);
      setError(null);

      const service = chainService(tenantId);
      let loadedEvents: ChainEvent[] = [];

      if (sessionId) {
        loadedEvents = await service.getChainEvents(sessionId);
      } else if (caseId) {
        loadedEvents = await service.getChainEventsForCase(caseId);
      } else if (resourceType && resourceId) {
        loadedEvents = await service.getChainEventsForResource(resourceType, resourceId);
      }

      setEvents(loadedEvents);

      const verificationResult = await service.verifyChain(
        sessionId || loadedEvents[0]?.id || ''
      );

      setChainStats({
        totalEvents: loadedEvents.length,
        verifiedEvents: verificationResult.eventsChecked,
        brokenLinks: verificationResult.brokenLinks,
        sequenceGaps: verificationResult.sequenceGaps,
      });

      const newVerification: VerificationStatus = {
        authenticity: verificationResult.verified ? 'VERIFIED' : 'FAILED',
        integrity: verificationResult.invalidHashes === 0 ? 'VERIFIED' : 'FAILED',
        source: loadedEvents.length > 0 ? 'VERIFIED' : 'PENDING',
        chainOfCustody: verificationResult.verified ? 100 : Math.max(0, 100 - (verificationResult.brokenLinks * 20) - (verificationResult.sequenceGaps * 10)),
        signature: loadedEvents.some(e => e.eventType.includes('SIGNATURE') || e.eventType.includes('VERIFIED')) ? 'VERIFIED' : 'PENDING',
        currentness: verificationResult.verified ? 'VERIFIED' : 'REVIEW_NEEDED',
      };

      setVerification(newVerification);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chain data');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    const icons: Record<string, typeof FileText> = {
      CASE_CREATED: FileText,
      CASE_UPDATED: FileText,
      EVIDENCE_UPLOADED: FileText,
      EVIDENCE_ACCESSED: FileText,
      DOCUMENT_CREATED: FileText,
      DOCUMENT_UPDATED: FileText,
      AI_ANALYSIS_STARTED: User,
      AI_ANALYSIS_COMPLETED: ShieldCheck,
      SIGNATURE: ShieldCheck,
      VERIFIED: CheckCircle2,
    };
    return icons[eventType] || FileText;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error loading chain data: {error}</p>
        <button
          onClick={loadChainData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Verification Status Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chain of Command Verification</h2>
        
        {verification && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Authenticity */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">AUTHENTICITY</span>
                <span className={"text-xs font-bold px-2 py-1 rounded " + statusColors[verification.authenticity]}>
                  {verification.authenticity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={"h-2 rounded-full " + (verification.authenticity === 'VERIFIED' ? 'bg-green-500' : verification.authenticity === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500')}
                  style={{ width: verification.authenticity === 'VERIFIED' ? '100%' : verification.authenticity === 'PENDING' ? '50%' : '0%' }}
                ></div>
              </div>
            </div>

            {/* Integrity */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">INTEGRITY</span>
                <span className={"text-xs font-bold px-2 py-1 rounded " + statusColors[verification.integrity]}>
                  {verification.integrity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={"h-2 rounded-full " + (verification.integrity === 'VERIFIED' ? 'bg-green-500' : verification.integrity === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500')}
                  style={{ width: verification.integrity === 'VERIFIED' ? '100%' : verification.integrity === 'PENDING' ? '50%' : '0%' }}
                ></div>
              </div>
            </div>

            {/* Source */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">SOURCE</span>
                <span className={"text-xs font-bold px-2 py-1 rounded " + statusColors[verification.source]}>
                  {verification.source}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={"h-2 rounded-full " + (verification.source === 'VERIFIED' ? 'bg-green-500' : verification.source === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500')}
                  style={{ width: verification.source === 'VERIFIED' ? '100%' : verification.source === 'PENDING' ? '50%' : '0%' }}
                ></div>
              </div>
            </div>

            {/* Chain of Custody */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">CHAIN OF CUSTODY</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-50 text-blue-700">
                  {verification.chainOfCustody}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: verification.chainOfCustody + '%' }}
                ></div>
              </div>
            </div>

            {/* Signature */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">SIGNATURE</span>
                <span className={"text-xs font-bold px-2 py-1 rounded " + statusColors[verification.signature]}>
                  {verification.signature}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={"h-2 rounded-full " + (verification.signature === 'VERIFIED' ? 'bg-green-500' : verification.signature === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500')}
                  style={{ width: verification.signature === 'VERIFIED' ? '100%' : verification.signature === 'PENDING' ? '50%' : '0%' }}
                ></div>
              </div>
            </div>

            {/* Currentness */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">CURRENTNESS</span>
                <span className={"text-xs font-bold px-2 py-1 rounded " + statusColors[verification.currentness]}>
                  {verification.currentness}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={"h-2 rounded-full " + (verification.currentness === 'VERIFIED' ? 'bg-green-500' : verification.currentness === 'REVIEW_NEEDED' ? 'bg-orange-500' : 'bg-red-500')}
                  style={{ width: verification.currentness === 'VERIFIED' ? '100%' : verification.currentness === 'REVIEW_NEEDED' ? '75%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Overall Status */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {verification && verification.authenticity === 'VERIFIED' && verification.integrity === 'VERIFIED' && verification.source === 'VERIFIED' ? (
              <>
                <ShieldCheck className="h-8 w-8 text-green-600" />
                <span className="text-3xl font-bold text-green-600">VERIFIED</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <span className="text-3xl font-bold text-orange-600">REVIEW NEEDED</span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {chainStats.totalEvents} events tracked | {chainStats.brokenLinks} broken links | {chainStats.sequenceGaps} sequence gaps
          </p>
        </div>
      </div>

      {/* FedEx-Style Tracking Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tracking Timeline</h3>
        
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No chain events found</p>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => {
              const Icon = getEventIcon(event.eventType);
              const isLast = index === events.length - 1;
              const isFirst = index === 0;

              return (
                <div key={event.id} className="flex items-start gap-4">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    {!isFirst && (
                      <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                    )}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shadow">
                      {event.sequenceNumber}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                    )}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">{event.eventType.replace(/_/g, ' ')}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(event.occurredAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {event.caseId && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FileText className="h-4 w-4" />
                          <span>Case: {event.caseId}</span>
                        </div>
                      )}
                      {event.resourceType && event.resourceId && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FileText className="h-4 w-4" />
                          <span>{event.resourceType}: {event.resourceId}</span>
                        </div>
                      )}
                      {event.actorId && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="h-4 w-4" />
                          <span>Actor: {event.actorId}</span>
                        </div>
                      )}
                    </div>

                    {/* Hash information */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Hash className="h-3 w-3" />
                        <span className="font-mono">
                          Previous: {event.previousHash.substring(0, 16)}...
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <Link className="h-3 w-3" />
                        <span className="font-mono">
                          Current: {event.eventHash.substring(0, 16)}...
                        </span>
                      </div>
                    </div>

                    {/* Payload preview */}
                    {event.payload && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                        <pre className="text-xs text-gray-800 overflow-x-auto">
                          {JSON.stringify(event.payload, null, 2).substring(0, 200)}
                          {JSON.stringify(event.payload).length > 200 ? '...' : ''}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chain Verification Details */}
      {chainStats.totalEvents > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Chain Verification Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium">Events Checked</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{chainStats.verifiedEvents}</div>
              <div className="text-sm text-gray-500">Total events in chain</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                {chainStats.brokenLinks > 0 ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                <span className="font-medium">Broken Links</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{chainStats.brokenLinks}</div>
              <div className="text-sm text-gray-500">Cryptographic link breaks</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                {chainStats.sequenceGaps > 0 ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                <span className="font-medium">Sequence Gaps</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{chainStats.sequenceGaps}</div>
              <div className="text-sm text-gray-500">Missing sequence numbers</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Chain Integrity Status</span>
            </div>
            <p className="text-sm text-gray-600">
              {chainStats.brokenLinks === 0 && chainStats.sequenceGaps === 0
                ? 'Chain is cryptographically verified with no breaks or gaps.'
                : 'Chain has ' + chainStats.brokenLinks + ' broken link(s) and ' + chainStats.sequenceGaps + ' sequence gap(s).'}
            </p>
          </div>
        </div>
      )}

      {/* Verify Chain Button */}
      <div className="flex justify-center">
        <button
          onClick={loadChainData}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <ShieldCheck className="inline h-5 w-5 mr-2" />
          VERIFY CHAIN
        </button>
      </div>
    </div>
  );
}

export default ChainTrackingUI;
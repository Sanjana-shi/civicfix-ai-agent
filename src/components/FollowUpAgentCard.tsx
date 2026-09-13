import React, { useState, useEffect } from 'react';
import { CivicReport, FollowUpAgentResult } from '../types.ts';
import { fetchFollowUpPlan } from '../services/api.ts';
import {
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  Copy,
  Check,
  Building,
  FileText,
  ChevronDown,
  ChevronUp,
  Camera,
  RefreshCw,
} from 'lucide-react';

interface FollowUpAgentCardProps {
  report: CivicReport;
  onFollowUpSent?: (note: string) => void;
}

export const FollowUpAgentCard: React.FC<FollowUpAgentCardProps> = ({ report, onFollowUpSent }) => {
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState<FollowUpAgentResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDraft, setShowDraft] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const runFollowUpAgent = async () => {
    setLoading(true);
    try {
      const res = await fetchFollowUpPlan(report.id, report);
      setFollowUp(res.followUp);
    } catch (err) {
      console.error('Failed to run Follow-Up Agent:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runFollowUpAgent();
  }, [report.id, report.status]);

  const handleCopyNotice = () => {
    if (!followUp) return;
    navigator.clipboard.writeText(followUp.escalationNoticeDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendNotice = () => {
    if (!followUp) return;
    setSentSuccess(true);
    if (onFollowUpSent) {
      onFollowUpSent(
        `Automated Follow-Up Agent dispatched escalation notice to ${followUp.escalationTier.designatedOfficer} (${followUp.escalationTier.tierName}).`
      );
    }
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div id="follow-up-agent-card" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-gray-900">Follow-Up & Escalation Agent</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-800 uppercase">
                Autonomous SLA Monitor
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Continuously audits report lifecycle, detects resolution lag, and computes legal escalation paths
            </p>
          </div>
        </div>

        <button
          onClick={runFollowUpAgent}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-Audit SLA</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-gray-500">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Auditing resolution timeline and querying municipal escalation matrices...
        </div>
      ) : followUp ? (
        <div className="p-5 space-y-4">
          {/* Status & Urgency Banner */}
          <div
            className={`p-3.5 rounded-lg border text-xs flex items-start space-x-3 ${
              followUp.urgencyLevel === 'CRITICAL_ESCALATION'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : followUp.urgencyLevel === 'URGENT'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 mt-0.5 shrink-0 ${
                followUp.urgencyLevel === 'CRITICAL_ESCALATION'
                  ? 'text-rose-600'
                  : followUp.urgencyLevel === 'URGENT'
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`}
            />
            <div className="space-y-1">
              <div className="font-bold flex items-center space-x-2">
                <span>{followUp.assessmentSummary}</span>
              </div>
              <p className="text-[11px] opacity-90">
                Ticket Age: <strong>{followUp.daysElapsed} days</strong>. Current Status:{' '}
                <strong>{followUp.currentStatus}</strong>.
              </p>
            </div>
          </div>

          {/* Escalation Tier Designation */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200/80 space-y-2">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Statutory Escalation Routing
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{followUp.escalationTier.tierName}</span>
                </h4>
                <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                  Designated Officer: {followUp.escalationTier.designatedOfficer}
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-800 border border-indigo-200">
                {followUp.escalationTier.channel}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 border-t border-gray-200/60 pt-2 mt-1">
              <strong>Statutory Right:</strong> {followUp.escalationTier.statutoryRight}
            </p>
          </div>

          {/* Recommended Next Actions */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 mb-2">Agent Recommended Follow-Up Actions:</h5>
            <ul className="space-y-1.5">
              {followUp.recommendedActions.map((action, idx) => (
                <li key={idx} className="text-xs text-gray-700 flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Evidence Needed */}
          {followUp.additionalEvidenceNeeded?.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                <Camera className="w-3.5 h-3.5 text-amber-700" />
                <span>Recommended Additional Evidence to Accelerate Escalation:</span>
              </div>
              <ul className="space-y-1">
                {followUp.additionalEvidenceNeeded.map((ev, idx) => (
                  <li key={idx} className="text-[11px] text-amber-800 flex items-start space-x-2">
                    <span className="text-amber-500">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Draft Escalation Notice Dropdown */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowDraft(!showDraft)}
              className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-800 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center space-x-2">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pre-Drafted Formal Escalation Notice</span>
              </span>
              {showDraft ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>

            {showDraft && (
              <div className="p-4 bg-white border-t border-gray-200 space-y-3">
                <div className="bg-gray-900 text-gray-200 font-mono text-[11px] p-3.5 rounded-lg whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {followUp.escalationNoticeDraft}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    onClick={handleCopyNotice}
                    className="px-3.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center space-x-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Letter</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSendNotice}
                    className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Escalation Notice</span>
                  </button>
                </div>

                {sentSuccess && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs text-center font-medium">
                    Escalation notice officially dispatched to {followUp.escalationTier.designatedOfficer}. Reference logged in status history.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

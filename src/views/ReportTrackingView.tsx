import React, { useState, useEffect } from 'react';
import { CivicReport, ReportStatus } from '../types.ts';
import { fetchReportById, fetchReports } from '../services/api.ts';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge.tsx';
import { CategoryBadge } from '../components/CategoryBadge.tsx';
import { FollowUpAgentCard } from '../components/FollowUpAgentCard.tsx';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Phone,
  HelpCircle,
  FileText,
  Send,
  AlertCircle,
} from 'lucide-react';

interface ReportTrackingViewProps {
  reportId?: string;
  onBack: () => void;
  onNavigateDetails: (id: string) => void;
  onNavigateAssistant: (contextReportId: string) => void;
}

export const ReportTrackingView: React.FC<ReportTrackingViewProps> = ({
  reportId,
  onBack,
  onNavigateDetails,
  onNavigateAssistant,
}) => {
  const [selectedId, setSelectedId] = useState<string>(reportId || 'CFX-2026-0842');
  const [availableReports, setAvailableReports] = useState<CivicReport[]>([]);
  const [report, setReport] = useState<CivicReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Load available reports list for quick selection
  useEffect(() => {
    async function loadList() {
      try {
        const res = await fetchReports();
        setAvailableReports(res.reports);
        if (!reportId && res.reports.length > 0) {
          setSelectedId(res.reports[0].id);
        }
      } catch (err) {
        console.error('Failed to load report list:', err);
      }
    }
    loadList();
  }, [reportId]);

  // Load selected report details
  useEffect(() => {
    async function loadCurrentReport() {
      if (!selectedId) return;
      setLoading(true);
      try {
        const res = await fetchReportById(selectedId);
        setReport(res.report);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCurrentReport();
  }, [selectedId]);

  // Timeline steps
  const TIMELINE_STAGES: {
    status: ReportStatus;
    title: string;
    description: string;
    stageIndex: number;
  }[] = [
    {
      status: 'SUBMITTED',
      title: 'Report Submitted',
      description: 'Logged by citizen into CivicFix platform',
      stageIndex: 1,
    },
    {
      status: 'UNDER_REVIEW',
      title: 'AI Agent Triage',
      description: 'Entity extraction, severity reasoning, and docket generation',
      stageIndex: 2,
    },
    {
      status: 'ASSIGNED',
      title: 'Authority Assigned',
      description: 'Routed to competent engineer / sanitation inspector',
      stageIndex: 3,
    },
    {
      status: 'IN_PROGRESS',
      title: 'Work In Progress',
      description: 'Field inspection scheduled or repair crew mobilized',
      stageIndex: 4,
    },
    {
      status: 'RESOLVED',
      title: 'Resolved & Closed',
      description: 'Remediation completed and verified with photographic proof',
      stageIndex: 5,
    },
  ];

  const getStatusLevel = (status: ReportStatus): number => {
    switch (status) {
      case 'SUBMITTED':
        return 1;
      case 'UNDER_REVIEW':
        return 2;
      case 'ASSIGNED':
        return 3;
      case 'IN_PROGRESS':
        return 4;
      case 'RESOLVED':
        return 5;
      default:
        return 1;
    }
  };

  const currentLevel = report ? getStatusLevel(report.status) : 1;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top bar with selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {/* Report Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Select Tracked Docket:
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="text-xs font-mono font-bold py-1.5 px-3 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600"
          >
            {availableReports.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.aiAnalysis?.complaint_title?.slice(0, 35) || r.originalDescription.slice(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 text-sm">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading resolution milestones...
        </div>
      ) : !report ? (
        <div className="p-12 text-center text-slate-500">Report not found.</div>
      ) : (
        <div className="space-y-8">
          {/* Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded border border-slate-200">
                  {report.id}
                </span>
                <CategoryBadge category={report.category} size="md" />
                <SeverityBadge severity={report.severity} size="md" />
                <StatusBadge status={report.status} size="md" />
              </div>
              <button
                onClick={() => onNavigateDetails(report.id)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                View Full Docket & Notes →
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {report.aiAnalysis?.complaint_title || report.originalDescription}
            </h1>

            {/* Target SLA & Authority Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Assigned Authority
                </span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5 truncate">
                  {report.assignedAuthorityName}
                </span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {report.assignedAuthorityDept}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Target Resolution SLA
                </span>
                <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                  {report.targetResolutionDate
                    ? new Date(report.targetResolutionDate).toLocaleDateString()
                    : 'Within 48 hours'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Statutory civic turnaround target
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Citizen Reporter
                </span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {report.userName}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {report.area}, {report.city}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Progress Stepper */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-8">
              Resolution Pipeline Status
            </h2>

            {/* Stepper bar */}
            <div className="relative">
              {/* Desktop horizontal track */}
              <div className="hidden lg:grid grid-cols-5 gap-2 relative">
                <div
                  className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0"
                  aria-hidden="true"
                >
                  <div
                    className="h-full bg-emerald-600 transition-all duration-500"
                    style={{
                      width: `${((currentLevel - 1) / 4) * 100}%`,
                    }}
                  />
                </div>

                {TIMELINE_STAGES.map((stg) => {
                  const isDone = currentLevel >= stg.stageIndex;
                  const isCurrent = currentLevel === stg.stageIndex;
                  return (
                    <div key={stg.status} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : stg.stageIndex}
                      </div>
                      <span
                        className={`text-xs font-bold mt-3 ${
                          isCurrent ? 'text-emerald-700' : isDone ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {stg.title}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-[140px] leading-tight">
                        {stg.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Mobile vertical stepper */}
              <div className="lg:hidden space-y-4">
                {TIMELINE_STAGES.map((stg) => {
                  const isDone = currentLevel >= stg.stageIndex;
                  const isCurrent = currentLevel === stg.stageIndex;
                  return (
                    <div key={stg.status} className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : stg.stageIndex}
                      </div>
                      <div>
                        <span
                          className={`text-xs font-bold block ${
                            isCurrent ? 'text-emerald-700' : isDone ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {stg.title}
                        </span>
                        <p className="text-[11px] text-slate-500">{stg.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Autonomous Follow-Up & Escalation Agent */}
          <FollowUpAgentCard
            report={report}
            onFollowUpSent={(note) => {
              // Optionally reload report or update audit trail
              fetchReportById(report.id).then((res) => setReport(res.report));
            }}
          />

          {/* Historical Audit Milestones */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Audit Trail & Official Milestones
            </h2>

            <div className="space-y-3">
              {report.statusHistory?.map((hist, idx) => (
                <div
                  key={hist.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={hist.status} size="sm" />
                      <span className="text-slate-500 font-medium">by {hist.changedBy}</span>
                    </div>
                    <p className="text-slate-800 font-medium pt-1 leading-relaxed">{hist.note}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                    {new Date(hist.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation & Next Steps Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Citizen Escalation Protocols
              </span>
              <p className="text-xs text-emerald-900 leading-relaxed max-w-xl">
                Has the issue exceeded the estimated SLA without department action? You can ask CivicFix AI
                to generate an official Right to Information (RTI) petition or an Executive Escalation Notice.
              </p>
            </div>

            <button
              onClick={() => onNavigateAssistant(report.id)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0 inline-flex items-center gap-1.5"
            >
              Ask AI to Draft Escalation
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

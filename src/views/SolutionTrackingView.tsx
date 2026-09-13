import React, { useState, useEffect } from 'react';
import { CivicReport, ReportStatus } from '../types.ts';
import { fetchReportById, updateReportStatus } from '../services/api.ts';
import {
  Activity,
  CheckCircle2,
  Clock,
  Building,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  FileText,
  PlusCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface SolutionTrackingViewProps {
  reportId: string;
  onReportNewIssue: () => void;
  onNavigateAssistant?: (reportId: string) => void;
}

interface TrackingStage {
  id: string;
  label: string;
  sublabel: string;
  statusMatch?: ReportStatus[];
}

const SIX_STAGE_TIMELINE: TrackingStage[] = [
  {
    id: 'created',
    label: 'Report Created',
    sublabel: 'Committed to CivicFix database',
  },
  {
    id: 'ai_done',
    label: 'AI Analysis Completed',
    sublabel: 'Categorized & statutory docket synthesized',
  },
  {
    id: 'review',
    label: 'Under Review',
    sublabel: 'Field engineer triage & assessment',
    statusMatch: ['SUBMITTED', 'UNDER_REVIEW'],
  },
  {
    id: 'assigned',
    label: 'Assigned',
    sublabel: 'Work order routed to competent crew',
    statusMatch: ['ASSIGNED'],
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    sublabel: 'Repair equipment on-site & active remediation',
    statusMatch: ['IN_PROGRESS'],
  },
  {
    id: 'resolved',
    label: 'Resolved',
    sublabel: 'Defect fixed & verified with photo proof',
    statusMatch: ['RESOLVED'],
  },
];

export const SolutionTrackingView: React.FC<SolutionTrackingViewProps> = ({
  reportId,
  onReportNewIssue,
  onNavigateAssistant,
}) => {
  const [report, setReport] = useState<CivicReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState('');

  // Load report data from database
  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await fetchReportById(reportId);
      setReport(res.report);
    } catch (err: any) {
      console.error('Failed to load tracking report:', err);
      setError('Could not load report details from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      loadReport();
    }
  }, [reportId]);

  // Demo status transition simulation for judges
  const handleSimulateStatus = async (newStatus: ReportStatus, note: string) => {
    if (!report) return;
    setUpdatingStatus(true);
    try {
      await updateReportStatus(report.id, newStatus, note, 'Municipal Operations Officer');
      await loadReport();
    } catch (err) {
      console.error('Failed to simulate status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Determine stage progress level
  // 1 = Report Created (always done)
  // 2 = AI Analysis Completed (always done)
  // 3 = Under Review (if status == SUBMITTED or UNDER_REVIEW)
  // 4 = Assigned (if status == ASSIGNED)
  // 5 = In Progress (if status == IN_PROGRESS)
  // 6 = Resolved (if status == RESOLVED)
  const getTimelineLevel = (status: ReportStatus): number => {
    switch (status) {
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 3;
      case 'ASSIGNED':
        return 4;
      case 'IN_PROGRESS':
        return 5;
      case 'RESOLVED':
        return 6;
      default:
        return 3;
    }
  };

  const currentLevel = report ? getTimelineLevel(report.status) : 3;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Stage 5 of 5: Solution Tracking</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              CivicFix Report #{report?.id || reportId}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Live resolution milestone tracking and statutory turnaround audit.
            </p>
          </div>

          <button
            type="button"
            onClick={onReportNewIssue}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Another Issue</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Loading live report tracking from database...</span>
        </div>
      ) : !report ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
          Report not found. Please try again.
        </div>
      ) : (
        <>
          {/* CORE SPECIFICATION SUMMARY CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  CivicFix Report #{report.id}
                </span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wide ${
                    report.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : report.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-800'
                      : report.status === 'ASSIGNED'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {report.status.replace('_', ' ')}
                </span>
              </div>

              <span className="text-xs text-slate-500 font-mono">
                Logged: {new Date(report.createdAt).toLocaleDateString()} at{' '}
                {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Core Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Issue */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Issue
                </span>
                <span className="text-sm font-extrabold text-slate-900 block mt-1">
                  {report.aiAnalysis?.category_display || report.category.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-slate-500 block">Roads & Infrastructure</span>
              </div>

              {/* Severity */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Severity
                </span>
                <span
                  className={`text-sm font-black block mt-1 ${
                    report.severity === 'HIGH' || report.severity === 'CRITICAL'
                      ? 'text-orange-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {report.severity}
                </span>
                <span className="text-[11px] text-slate-500 block">Public safety hazard</span>
              </div>

              {/* Responsible Authority */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Responsible Authority
                </span>
                <span className="text-sm font-extrabold text-slate-900 block mt-1 truncate">
                  {report.assignedAuthorityName || 'Road/Municipal Maintenance'}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {report.assignedAuthorityDept || 'Civil Works'}
                </span>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Location
                </span>
                <span className="text-xs font-bold text-slate-900 block mt-1 truncate">
                  {report.address}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {report.landmark ? `Landmark: ${report.landmark}` : `${report.area}, ${report.city}`}
                </span>
              </div>
            </div>
          </div>

          {/* EXACT TRACKING TIMELINE REQUIRED IN USER PROMPT */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Tracking Timeline
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time municipal resolution progression
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                Current Level: Stage {currentLevel} of 6
              </span>
            </div>

            {/* Vertical 6-stage timeline with explicit down arrows */}
            <div className="space-y-2 relative">
              {SIX_STAGE_TIMELINE.map((item, index) => {
                const stageNum = index + 1;
                const isCompleted = stageNum < currentLevel;
                const isCurrent = stageNum === currentLevel;
                const isUpcoming = stageNum > currentLevel;

                return (
                  <React.Fragment key={item.id}>
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-100 shadow-xs'
                          : isCompleted
                          ? 'bg-slate-50/80 border-slate-200'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Status Icon */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isCurrent ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                          ) : (
                            <span>○</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs sm:text-sm font-extrabold ${
                                isCurrent
                                  ? 'text-emerald-950'
                                  : isCompleted
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              {isCompleted ? '✓ ' : isCurrent ? '● ' : '○ '}
                              {item.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                                ACTIVE NOW
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {item.sublabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Down arrow between stages */}
                    {index < SIX_STAGE_TIMELINE.length - 1 && (
                      <div className="flex justify-start pl-7 py-0.5 text-slate-400">
                        <span className="text-xs font-bold leading-none">↓</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* HACKATHON JUDGE INTERACTIVE STATUS SIMULATOR */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Judge Demo: Advance Resolution Milestones Live
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                SQLite Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Click any stage below to simulate municipal authority updates. The database and tracking timeline update immediately:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                id="sim-assigned-btn"
                disabled={updatingStatus}
                onClick={() =>
                  handleSimulateStatus(
                    'ASSIGNED',
                    'Work order #WO-4921 issued to Road Maintenance Division Crew 4.'
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                1. Advance to "Assigned"
              </button>

              <button
                type="button"
                id="sim-progress-btn"
                disabled={updatingStatus}
                onClick={() =>
                  handleSimulateStatus(
                    'IN_PROGRESS',
                    'Hot-mix bitumen compaction truck mobilized to college entrance.'
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-blue-900/80 hover:bg-blue-800 border border-blue-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                2. Advance to "In Progress"
              </button>

              <button
                type="button"
                id="sim-resolved-btn"
                disabled={updatingStatus}
                onClick={() =>
                  handleSimulateStatus(
                    'RESOLVED',
                    'Pothole crater excavated, refilled, and leveled to grade. Verified by Junior Engineer.'
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                3. Advance to "Resolved"
              </button>

              <button
                type="button"
                id="sim-reset-btn"
                disabled={updatingStatus}
                onClick={() =>
                  handleSimulateStatus(
                    'UNDER_REVIEW',
                    'Report reset to initial review state.'
                  )
                }
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                Reset
              </button>
            </div>
          </div>

          {/* STATUS HISTORY (FROM SQLITE) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Status History (Database Audit Trail)
            </h2>

            <div className="space-y-3">
              {report.statusHistory && report.statusHistory.length > 0 ? (
                report.statusHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 uppercase">
                          {hist.status.replace('_', ' ')}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          • by {hist.changedBy}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs">{hist.note}</p>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                      {new Date(hist.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Initial registration logged. No subsequent status transitions yet.
                </p>
              )}
            </div>
          </div>

          {/* RECOMMENDED FOLLOW-UP */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 sm:p-7 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950">
                Recommended Follow-up
              </h3>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              {report.aiAnalysis?.follow_up_recommendation ||
                `If ${report.assignedAuthorityName || 'Road Maintenance'} does not initiate on-site repairs within 48 hours, launch the automated Follow-Up Escalation Agent to petition the Ward Executive Engineer.`}
            </p>

            {onNavigateAssistant && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateAssistant(report.id)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Launch Follow-Up Escalation Assistant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

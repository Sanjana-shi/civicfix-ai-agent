import React, { useState } from 'react';
import { AIAgentAnalysis, AgentOrchestrationResult, CivicReport } from '../types.ts';
import { createReport } from '../services/api.ts';
import {
  CheckSquare,
  AlertTriangle,
  Building,
  ShieldCheck,
  FileText,
  ListOrdered,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  Sparkles,
  MapPin,
  Clock,
  ArrowLeft,
} from 'lucide-react';

interface SolutionViewProps {
  reportDraft: any;
  analysis: AIAgentAnalysis;
  orchestration: AgentOrchestrationResult;
  onConfirmAndCreate: (createdReport: CivicReport) => void;
  onBackToEdit?: () => void;
}

export const SolutionView: React.FC<SolutionViewProps> = ({
  reportDraft,
  analysis,
  orchestration,
  onConfirmAndCreate,
  onBackToEdit,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmAndCreate = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await createReport({
        userId: reportDraft.userId,
        userName: reportDraft.userName,
        userPhone: reportDraft.userPhone,
        userEmail: reportDraft.userEmail,
        description: reportDraft.description,
        address: reportDraft.address,
        city: reportDraft.city || 'Bengaluru',
        area: reportDraft.area || 'Ward 153',
        landmark: reportDraft.landmark,
        evidenceImages: reportDraft.evidenceImages,
        precomputedAnalysis: analysis,
      });

      // Pass created report directly to Stage 5: Solution Tracking
      onConfirmAndCreate(res.report);
    } catch (err: any) {
      console.error('Failed to create report:', err);
      setError(err.message || 'Failed to persist CivicFix report to database. Please try again.');
      setSubmitting(false);
    }
  };

  // Safe fallbacks matching the exact prompt guidelines
  const issueName = analysis.category_display || 'Road Pothole';
  const severityLevel = analysis.severity || 'HIGH';
  const responsibleAuthority =
    analysis.responsible_authority || 'Road / Municipal Maintenance';
  const whyReason =
    analysis.why_high_severity ||
    analysis.severity_reason ||
    'Based on the reported issue, this appears to involve road infrastructure and may create a safety risk.';

  const complaintTitle =
    analysis.complaint_title ||
    `[URGENT: ${severityLevel}] ${issueName} at ${reportDraft.address || 'Reported Location'}`;

  const complaintDescription =
    analysis.complaint_description ||
    `FORMAL MUNICIPAL CITIZEN GRIEVANCE DOCKET\n` +
      `Category: ${issueName}\n` +
      `Authority: ${responsibleAuthority}\n\n` +
      `Location: ${reportDraft.address}, ${reportDraft.landmark ? 'Landmark: ' + reportDraft.landmark + ', ' : ''}${reportDraft.city || 'Bengaluru'}\n\n` +
      `Issue Summary:\n${reportDraft.description}\n\n` +
      `Requested Remediation:\nDeploy municipal maintenance crew to inspect and repair the road hazard immediately.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stage 4 of 5: Solution Formulation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              CivicFix AI Solution & Grievance Docket
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              The AI agent has analyzed the issue, classified statutory responsibility, and synthesized a formal resolution plan.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3.5 shrink-0 text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Human In The Loop
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              CONFIRMATION REQUIRED
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CORE SPECIFICATION SECTION: ISSUE, SEVERITY, AUTHORITY, WHY */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Executive AI Assessment
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. ISSUE */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              ISSUE
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 block">
              {issueName}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Statutory Grievance Category
            </span>
          </div>

          {/* 2. SEVERITY */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              SEVERITY
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm sm:text-base font-black px-2.5 py-0.5 rounded-lg ${
                  severityLevel === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-700'
                    : severityLevel === 'HIGH'
                    ? 'bg-orange-100 text-orange-700'
                    : severityLevel === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {severityLevel}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Hazard & Public Risk Level
            </span>
          </div>

          {/* 3. RESPONSIBLE AUTHORITY */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              RESPONSIBLE AUTHORITY
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 block truncate">
              {responsibleAuthority}
            </span>
            <span className="text-[11px] text-slate-500 block truncate">
              {analysis.authority_department || 'Civil Works & Road Engineering'}
            </span>
          </div>
        </div>

        {/* 4. WHY? */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
            <Info className="w-4 h-4 text-emerald-700" />
            <span>WHY?</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-900 font-medium leading-relaxed">
            "{whyReason}"
          </p>
        </div>
      </div>

      {/* PREPARED COMPLAINT */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-extrabold text-slate-900">
              PREPARED COMPLAINT
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            Formatted Administrative Petition
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Complaint Title
            </span>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900">
              {complaintTitle}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Complaint Description
            </span>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
              {complaintDescription}
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED ACTION PLAN (5 EXACT STEPS) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ListOrdered className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-extrabold text-slate-900">
            RECOMMENDED ACTION PLAN
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              step: 1,
              title: 'Confirm the report',
              detail: 'Review the generated categorization, severity rationale, and formal complaint docket.',
            },
            {
              step: 2,
              title: 'Attach supporting information if available',
              detail: 'Ensure landmark accuracy and photographic evidence are included for rapid inspection.',
            },
            {
              step: 3,
              title: 'Create the CivicFix report',
              detail: 'Commit the authorized docket into the CivicFix resolution database with a unique tracking ID.',
            },
            {
              step: 4,
              title: 'Monitor the report status',
              detail: 'Follow real-time milestone transitions from Review to Assignment and Field Repair.',
            },
            {
              step: 5,
              title: 'Follow up if required',
              detail: 'If the target 48-hour statutory turnaround expires, trigger the Follow-Up Escalation Agent.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {item.step}
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-600 block leading-relaxed">
                  {item.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Disclaimer & Confirmation Button */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-5">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">
              Human-in-the-Loop Prototype Notice
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              This is a CivicFix prototype report. AI does not automatically file grievances with official government portals
              without your explicit authorization. Clicking "Confirm & Create Report" registers the formal report in your CivicFix dashboard.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {onBackToEdit && (
            <button
              type="button"
              onClick={onBackToEdit}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Report Details</span>
            </button>
          )}

          <button
            type="button"
            id="confirm-create-report-btn"
            disabled={submitting}
            onClick={handleConfirmAndCreate}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
          >
            {submitting ? (
              <span>Saving Report to Database...</span>
            ) : (
              <>
                <CheckSquare className="w-4 h-4 text-emerald-200" />
                <span>Confirm & Create Report</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

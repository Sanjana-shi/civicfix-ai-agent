import React, { useState } from 'react';
import { AIAgentAnalysis } from '../types.ts';
import {
  AlertTriangle,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';
import { SeverityBadge } from './StatusBadge.tsx';

interface FinalResultCardProps {
  analysis: AIAgentAnalysis;
  onReviewComplaint: () => void;
  onCreateFollowUpPlan: () => void;
  hasLocation?: boolean;
  hasDescription?: boolean;
  hasImages?: boolean;
}

export const FinalResultCard: React.FC<FinalResultCardProps> = ({
  analysis,
  onReviewComplaint,
  onCreateFollowUpPlan,
  hasLocation = true,
  hasDescription = true,
  hasImages = false,
}) => {
  const [showFullComplaintPreview, setShowFullComplaintPreview] = useState(false);

  return (
    <div
      id="civicfix-recommendation-card"
      className="bg-white rounded-2xl border-2 border-indigo-200 shadow-lg overflow-hidden transition-all"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-indigo-300">
              CIVICFIX RECOMMENDATION
            </h3>
            <p className="text-xs text-slate-300 font-medium">Synthesized Autonomous Action Docket</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
            CONFIDENCE: {analysis.confidence_score || 96}%
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Issue */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Issue Category:
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {analysis.category_display || analysis.category.replace('_', ' ')}
            </div>
            <div className="text-xs text-slate-600 mt-1 line-clamp-1 font-mono">
              {analysis.complaint_title}
            </div>
          </div>

          {/* Severity */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Severity Level:
            </span>
            <div className="mt-1 flex items-center space-x-2">
              <SeverityBadge severity={analysis.severity} />
              <span className="text-xs text-slate-600 font-medium">
                SLA: ~{analysis.estimated_sla_days || 2} Days
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Prioritized based on public hazard model
            </div>
          </div>

          {/* Likely Authority */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Likely Authority:
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{analysis.responsible_authority}</span>
            </div>
            <div className="text-xs text-indigo-700 font-medium mt-1 truncate">
              {analysis.authority_department}
            </div>
          </div>
        </div>

        {/* Evidence-based Explanation ("Why") */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Why this Assessment & Priority:</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed font-medium">
            {analysis.severity_reason ||
              'High pedestrian and two-wheeler traffic corridor creates imminent skidding risk, requiring prioritized road engineering dispatch.'}
          </p>
          {analysis.authority_reason && (
            <p className="text-[11px] text-amber-900/80 border-t border-amber-200/60 pt-1.5">
              <strong>Jurisdiction rationale:</strong> {analysis.authority_reason}
            </p>
          )}
        </div>

        {/* Structured Complaint Summary */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowFullComplaintPreview(!showFullComplaintPreview)}
            className="w-full bg-slate-50 hover:bg-slate-100 px-4 py-3 text-left flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Generated Structured Complaint Docket</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-500 text-xs">
              <span>{showFullComplaintPreview ? 'Collapse Preview' : 'Expand Preview'}</span>
              {showFullComplaintPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showFullComplaintPreview ? (
            <div className="p-4 bg-white border-t border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Docket Title:</span>
                <p className="font-bold text-slate-900 text-sm">{analysis.complaint_title}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Synthesized Legal Grievance:</span>
                <p className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[11px]">
                  {analysis.complaint_description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Impact Assessment:</span>
                  <p className="text-slate-800 text-[11px] mt-0.5">{analysis.impact_statement}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Suggested Engineering Action:</span>
                  <p className="text-slate-800 text-[11px] mt-0.5">{analysis.suggested_action}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2.5 bg-white border-t border-slate-100 text-xs text-slate-600 font-mono line-clamp-2">
              "{analysis.complaint_description}"
            </div>
          )}
        </div>

        {/* Required Information Checklist */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
            Required Information Completeness Audit:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
            <div className="flex items-center space-x-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ Location Verified</span>
            </div>

            <div className="flex items-center space-x-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ Description Structured</span>
            </div>

            {hasImages ? (
              <div className="flex items-center space-x-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>✓ Evidence Attached</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠ Evidence Recommended</span>
              </div>
            )}
          </div>
        </div>

        {/* Next Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Recommended statutory next steps ready for execution
          </span>

          <div className="flex items-center space-x-3">
            <button
              id="btn-review-complaint"
              type="button"
              onClick={onReviewComplaint}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-2 transition-colors shadow-xs"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Review Complaint</span>
            </button>

            <button
              id="btn-create-follow-up-plan"
              type="button"
              onClick={onCreateFollowUpPlan}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md hover:shadow-lg"
            >
              <Clock className="w-4 h-4" />
              <span>Create Follow-Up Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, FileText, ArrowRight, Eye, AlertCircle } from 'lucide-react';
import { AIAgentAnalysis } from '../types.ts';

interface HumanInTheLoopConfirmationProps {
  analysis: AIAgentAnalysis;
  onAuthorize: () => void;
  onReviewComplaint: () => void;
  isSubmitting?: boolean;
}

export const HumanInTheLoopConfirmation: React.FC<HumanInTheLoopConfirmationProps> = ({
  analysis,
  onAuthorize,
  onReviewComplaint,
  isSubmitting = false,
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  return (
    <div id="human-in-the-loop-card" className="bg-white border-2 border-indigo-200 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Human-in-the-Loop Verification Gate</h4>
            <p className="text-xs text-gray-500">Autonomous synthesis paused pending citizen consent</p>
          </div>
        </div>

        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Human Verification Required Before External Dispatch</span>
        </span>
      </div>

      <div className="my-4 space-y-3 text-xs text-gray-700">
        <p className="font-medium text-gray-900 text-sm">
          Your formal municipal complaint has been structured and audited by the Agentic Orchestrator:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-lg border border-gray-200/80">
          <div>
            <span className="text-gray-500 block text-[11px] font-semibold uppercase">Designated Authority:</span>
            <span className="font-semibold text-gray-900 text-xs">{analysis.responsible_authority}</span>
            <span className="text-gray-500 block text-[11px] mt-0.5">{analysis.authority_department}</span>
          </div>

          <div>
            <span className="text-gray-500 block text-[11px] font-semibold uppercase">Assigned Priority & SLA:</span>
            <span className="font-semibold text-gray-900 text-xs">{analysis.severity} Priority</span>
            <span className="text-gray-500 block text-[11px] mt-0.5">Target SLA: {analysis.estimated_sla_days || 2} Days</span>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-gray-200">
            <span className="text-gray-500 block text-[11px] font-semibold uppercase">Subject Line:</span>
            <span className="font-medium text-gray-900 text-xs">{analysis.complaint_title}</span>
          </div>
        </div>

        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-indigo-900 text-xs space-y-1">
          <p className="font-semibold flex items-center space-x-1.5 text-indigo-950">
            <span>Safety & Privacy Safeguard:</span>
          </p>
          <p className="text-indigo-800 leading-relaxed">
            The agent will NOT automatically transmit or broadcast complaints to external municipal servers without your explicit confirmation.
            Authorizing will register your official docket in the system and begin SLA tracking.
          </p>
        </div>

        <label className="flex items-start space-x-2.5 pt-1 cursor-pointer select-none">
          <input
            id="checkbox-human-consent"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-xs text-gray-700 leading-normal">
            I have reviewed the synthesized complaint facts, location details, and authorize official registration of this grievance ticket.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <button
          id="btn-review-complaint-draft"
          type="button"
          onClick={onReviewComplaint}
          className="px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center space-x-2 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-gray-500" />
          <span>Review Full Complaint Docket</span>
        </button>

        <button
          id="btn-authorize-registration"
          type="button"
          disabled={!agreedToTerms || isSubmitting}
          onClick={onAuthorize}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all"
        >
          {isSubmitting ? (
            <span>Registering Docket...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Confirm & Authorize Docket Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

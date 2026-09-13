import React, { useState } from 'react';
import { AIAgentAnalysis } from '../types.ts';
import { Copy, Check, Printer, FileText, Building, AlertCircle, ShieldCheck } from 'lucide-react';

interface StructuredComplaintCardProps {
  analysis: AIAgentAnalysis;
  reportId?: string;
  address?: string;
  city?: string;
  area?: string;
  landmark?: string;
  citizenName?: string;
  dateCreated?: string;
}

export const StructuredComplaintCard: React.FC<StructuredComplaintCardProps> = ({
  analysis,
  reportId = 'CFX-DRAFT',
  address = 'Specified civic location',
  city = 'Bengaluru',
  area = 'Metropolitan Zone',
  landmark,
  citizenName = 'Registered Citizen',
  dateCreated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}) => {
  const [copied, setCopied] = useState(false);

  const fullComplaintText = `OFFICIAL CIVIC COMPLAINT DOCKET
Reference ID: ${reportId}
Date of Filing: ${dateCreated}

ADDRESSED TO:
The Competent Officer / Executive Engineer
${analysis.responsible_authority}
Department: ${analysis.authority_department}
Jurisdiction: ${city} Municipal Corporation

SUBJECT:
${analysis.complaint_title}

GRIEVANCE DETAILS:
Category: ${analysis.category_display}
Assessed Severity: ${analysis.severity}
Location: ${address}, ${area}, ${city}${landmark ? ` (Landmark: ${landmark})` : ''}

STATEMENT OF IMPACT:
${analysis.impact_statement}

FACTUAL DESCRIPTION:
${analysis.complaint_description}

STATUTORY / CIVIC REMEDIATION REQUESTED:
${analysis.suggested_action}

COMPLIANCE & CITIZEN CHARTER SLA:
Expected Resolution SLA: ${analysis.estimated_sla_days || 2} Business Days.
Reporting Channel: ${analysis.reporting_channel}

Generated via CivicFix AI Agentic Resolution Platform on behalf of citizen: ${citizenName}.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullComplaintText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="structured-complaint-docket"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
    >
      {/* Header bar */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="font-semibold text-sm tracking-wide">
              Official Structured Complaint Docket
            </h4>
            <p className="text-xs text-slate-400 font-mono">Ref: {reportId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            id="copy-complaint-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Docket!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                Copy Formal Text
              </>
            )}
          </button>
          <button
            id="print-complaint-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Docket Body */}
      <div className="p-5 sm:p-6 space-y-5 text-sm text-slate-800">
        {/* Recipient box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Designated Addressee
          </div>
          <div className="font-bold text-slate-900 text-base">
            {analysis.responsible_authority}
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>{analysis.authority_department}</span> • <span>{city} Civic Jurisdiction</span>
          </div>
        </div>

        {/* Complaint Title */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Grievance Subject
          </div>
          <div className="font-semibold text-slate-900 text-base bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
            {analysis.complaint_title}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">Category</span>
            <p className="font-semibold text-slate-800 mt-0.5">{analysis.category_display}</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">Assessed Severity</span>
            <p className="font-semibold text-slate-800 mt-0.5">{analysis.severity}</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">Statutory SLA</span>
            <p className="font-semibold text-emerald-700 mt-0.5">
              {analysis.estimated_sla_days || 2} Business Days
            </p>
          </div>
        </div>

        {/* Location & Impact */}
        <div className="space-y-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Verified Location
            </span>
            <p className="text-slate-800 mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {address}, {area}, {city}
              {landmark && (
                <span className="block text-xs text-slate-600 mt-1 font-medium">
                  Landmark reference: {landmark}
                </span>
              )}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Assessed Public Impact
            </span>
            <p className="text-slate-700 mt-0.5 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60 text-xs sm:text-sm">
              {analysis.impact_statement}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Synthesized Factual Description
            </span>
            <div className="whitespace-pre-line text-slate-700 mt-0.5 p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs leading-relaxed">
              {analysis.complaint_description}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Requested Engineering / Sanitation Action
            </span>
            <p className="text-slate-900 font-medium mt-0.5 bg-blue-50/50 p-2.5 rounded-lg border border-blue-200 text-xs sm:text-sm">
              {analysis.suggested_action}
            </p>
          </div>
        </div>

        {/* Footer notice */}
        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            This structured complaint was generated using CivicFix Agentic Reasoning based strictly
            on user-verified observations and municipal engineering guidelines.
          </span>
        </div>
      </div>
    </div>
  );
};

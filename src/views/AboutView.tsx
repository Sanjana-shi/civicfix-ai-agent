import React from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  Building2,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  Cpu,
} from 'lucide-react';

export const AboutView: React.FC<{ onNavigateReport: () => void }> = ({ onNavigateReport }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />
          <span>Agentic AI Hackathon Technical Blueprint</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          CivicFix AI
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          An autonomous public issue resolution platform bridging citizens and municipal governance
          through structured reasoning, statutory routing, and automated accountability workflows.
        </p>
      </div>

      {/* Problem vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-rose-50/60 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-rose-950">The Civic Impasse</h2>
          <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
            In modern municipalities, citizens struggle to report infrastructure hazards because they are expected
            to know complex bureaucratic divisions (e.g. distinguishing PWD arterial roads from ward municipality streets,
            or stormwater drains from sewerage mains). Unstructured complaints are dropped, bounce between departments,
            or lack legal specificity, leading to citizen fatigue and unchecked urban decay.
          </p>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-emerald-950">The Agentic AI Solution</h2>
          <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
            CivicFix AI introduces an autonomous workflow agent powered by Gemini 2.5 Flash. The agent accepts raw
            citizen observations, parses spatial context, matches municipal charters, computes causal hazard severity,
            flags missing evidence, drafts legally formatted complaints, and establishes automated SLA tracking.
          </p>
        </div>
      </div>

      {/* Comparison Table: Chatbot vs Agentic Platform */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Architectural Contrast
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Why CivicFix AI is an Agentic System, Not a Chatbot
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            How autonomous multi-step reasoning differs from generic conversational LLMs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <th className="p-3.5">Capability Domain</th>
                <th className="p-3.5 text-slate-400">Traditional LLM Chatbot</th>
                <th className="p-3.5 text-emerald-800 bg-emerald-50/60">CivicFix AI Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Task Objective</td>
                <td className="p-3.5 text-slate-500">Generates polite text answers in a chat box</td>
                <td className="p-3.5 font-medium text-emerald-900 bg-emerald-50/20">Executes an end-to-end municipal grievance workflow</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Perception & Entities</td>
                <td className="p-3.5 text-slate-500">Echoes user words back in generic sentences</td>
                <td className="p-3.5 font-medium text-emerald-900 bg-emerald-50/20">Extracts landmarks, hazard types, GPS context, and impact</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Statutory Mapping</td>
                <td className="p-3.5 text-slate-500">Tells user "Please contact your local office"</td>
                <td className="p-3.5 font-medium text-emerald-900 bg-emerald-50/20">Identifies exact authority, department, filing channel, and helpline</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Severity Reasoning</td>
                <td className="p-3.5 text-slate-500">No objective risk rubric</td>
                <td className="p-3.5 font-medium text-emerald-900 bg-emerald-50/20">Evaluates traffic hazard, flooding danger, and school/hospital proximity</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Actionable Output</td>
                <td className="p-3.5 text-slate-500">Ephemeral chat transcript</td>
                <td className="p-3.5 font-medium text-emerald-900 bg-emerald-50/20">Official printable complaint docket, database record, and 6-step plan</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Lifecycle Tracking</td>
                <td className="p-3.5 text-slate-500">None; session forgotten upon close</td>
                <td className="p-3.5 font-medium text-emerald-900 bg-emerald-50/20">Database persistence, SLA watchdogs, and status milestones</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* The 6-Stage Loop Detail */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
            Execution Loop
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            The 6-Stage Agentic AI Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold block">01. GOAL</span>
            <h3 className="font-bold text-white text-sm">Grievance Objective Formulation</h3>
            <p className="text-slate-400 leading-relaxed">
              Accepts plain citizen complaints without bureaucratic jargon. Defines resolution criteria.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold block">02. PLANNING</span>
            <h3 className="font-bold text-white text-sm">Decomposition & Inspection</h3>
            <p className="text-slate-400 leading-relaxed">
              Splits problem into location verification, category classification, and severity appraisal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold block">03. TOOL / DATA USE</span>
            <h3 className="font-bold text-white text-sm">Jurisdiction Charter Matching</h3>
            <p className="text-slate-400 leading-relaxed">
              Queries municipal database charters to identify the statutory division (BBMP, BWSSB, BESCOM, etc.).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold block">04. REASONING</span>
            <h3 className="font-bold text-white text-sm">Causal Severity Assessment</h3>
            <p className="text-slate-400 leading-relaxed">
              Assigns LOW, MEDIUM, HIGH, or CRITICAL based on risk to human life, public property, and health.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold block">05. DECISION</span>
            <h3 className="font-bold text-white text-sm">Authority & Category Routing</h3>
            <p className="text-slate-400 leading-relaxed">
              Locks in designated engineering officer, official contact helpline, and statutory SLA deadline.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold block">06. ACTION PLAN</span>
            <h3 className="font-bold text-white text-sm">Docket Synthesis & Tracking</h3>
            <p className="text-slate-400 leading-relaxed">
              Generates legal complaint document, writes to SQLite, and initializes real-time SLA watchdog.
            </p>
          </div>
        </div>
      </div>

      {/* Prototype Notice & Civic Data Charter */}
      <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          Prototype Integrity & Data Privacy Disclaimer
        </h3>
        <p className="leading-relaxed">
          CivicFix AI is an assistance prototype developed for the Agentic AI Hackathon. It does not claim direct,
          unauthorized access to internal government clearance servers. All recommendations, authority mappings, and
          complaint text are generated via autonomous agent reasoning to assist citizens and municipal officers. No
          sensitive national identity credentials (e.g. Aadhaar, PAN) are requested, stored, or processed.
        </p>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onNavigateReport}
          className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          Experience the Agentic Resolution Workflow
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

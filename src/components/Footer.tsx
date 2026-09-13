import React from 'react';
import { ShieldAlert, Bot, CheckCircle2, AlertCircle, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4 text-emerald-100" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                CivicFix AI
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Agentic Hackathon Edition
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Transforming natural language citizen complaints into actionable resolution workflows,
              statutory authority routing, and real-time civic accountability using autonomous AI agents.
            </p>

            {/* Prototype Disclaimer Banner */}
            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-white">Prototype Notice:</strong> CivicFix AI is an assistance system.
                Authority identification and recommendations should be verified before official submission to government portals.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform Views
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Report a Civic Problem
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Citizen Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-reports')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Public Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('assistant')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  AI Resolution Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Municipal Authority Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture / Hackathon */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Agentic Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Goal Decomposition
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Jurisdiction Entity Mapping
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Causal Severity Reasoning
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Formal Complaint Synthesis
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Resolution Action Plan
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('about')}
                  className="text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  Read Technical Blueprint →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CivicFix AI — Agentic AI Public Issue Resolution Platform.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Gemini 3.8 Flash Agent Online
            </span>
            <span>•</span>
            <span>No Aadhaar/PAN required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

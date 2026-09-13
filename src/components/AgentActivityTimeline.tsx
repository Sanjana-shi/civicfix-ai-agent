import React, { useState } from 'react';
import { AgentTraceStep } from '../types.ts';
import {
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Info,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AgentActivityTimelineProps {
  currentStageIndex: number; // 0 to 7
  isExecuting: boolean;
  traceSteps: AgentTraceStep[];
  onSelectStep?: (stepIndex: number) => void;
}

export const STAGES = [
  { id: 'goal', title: 'Goal understood', agent: 'Master Orchestrator', action: 'Parse citizen natural language input & formulate goal' },
  { id: 'issue', title: 'Issue classified', agent: 'Issue Classification Agent', action: 'Map complaint to municipal statutory category taxonomy' },
  { id: 'severity', title: 'Severity assessed', agent: 'Severity Assessment Agent', action: 'Evaluate public hazard model, traffic risk, and urgency level' },
  { id: 'authority', title: 'Authority identified', agent: 'Authority Identification Agent', action: 'Query jurisdiction matrix and assign responsible municipal department' },
  { id: 'verify', title: 'Information verified', agent: 'Information Verification Agent', action: 'Audit location specificity, landmarks, and evidence completeness' },
  { id: 'complaint', title: 'Complaint generated', agent: 'Complaint Generation Agent', action: 'Synthesize formal municipal complaint docket for statutory filing' },
  { id: 'plan', title: 'Action plan prepared', agent: 'Resolution Planning Agent', action: 'Generate milestone execution roadmap with SLA and escalation thresholds' },
];

export const AgentActivityTimeline: React.FC<AgentActivityTimelineProps> = ({
  currentStageIndex,
  isExecuting,
  traceSteps,
}) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);

  const isComplete = currentStageIndex >= STAGES.length;

  return (
    <div
      id="agent-activity-timeline-card"
      className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-sans"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-300">CIVICFIX AI AGENT</h3>
            <p className="text-[11px] text-slate-400 font-mono">Autonomous Multi-Agent Lifecycle</p>
          </div>
        </div>

        <div>
          {isComplete ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
              <Check className="w-3 h-3 text-emerald-400" />
              ANALYSIS COMPLETE
            </span>
          ) : isExecuting ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              EXECUTING STAGE #{Math.min(currentStageIndex + 1, STAGES.length)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400">
              READY TO RUN
            </span>
          )}
        </div>
      </div>

      {/* Checklist Timeline */}
      <div className="p-4 sm:p-5 space-y-2">
        {STAGES.map((stage, idx) => {
          const isDone = currentStageIndex > idx || isComplete;
          const isCurrent = currentStageIndex === idx && isExecuting;
          const isPending = currentStageIndex < idx && !isComplete;
          const isExpanded = selectedStepIndex === idx;

          // Find corresponding trace step if available
          const matchingTrace = traceSteps[idx];

          return (
            <div key={stage.id} className="rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => isDone && setSelectedStepIndex(isExpanded ? null : idx)}
                disabled={!isDone}
                className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                  isDone
                    ? 'hover:bg-slate-800/40 cursor-pointer'
                    : 'cursor-default opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-950 text-emerald-400" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-400 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    </div>
                  )}

                  <span
                    className={`text-xs font-semibold ${
                      isDone
                        ? 'text-slate-200'
                        : isCurrent
                        ? 'text-indigo-300 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    ✓ {stage.title}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block">
                    {stage.agent}
                  </span>
                  {isDone && (
                    <span className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </div>
              </button>

              {/* Expandable Step Details (Shows Agent, Action, Result - strictly no private thoughts) */}
              {isExpanded && isDone && (
                <div className="px-4 pb-3 pt-1 border-t border-slate-800/80 bg-slate-900/60 text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Specialized Agent:</span>
                      <span className="text-indigo-300 font-medium">{matchingTrace?.agentName || stage.agent}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Action Executed:</span>
                      <span className="text-slate-200 font-medium">{matchingTrace?.action || stage.action}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Result Summary:</span>
                    <p className="text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[11px] leading-relaxed">
                      {matchingTrace?.result || 'Stage completed with validated output schema.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer status */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click any completed step to view Agent, Action & Result</span>
        <span className="text-emerald-400 font-mono font-semibold">
          {isComplete ? '7 / 7 COMPLETE' : `${Math.min(currentStageIndex, 7)} / 7 EXECUTED`}
        </span>
      </div>
    </div>
  );
};

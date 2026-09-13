import React, { useState } from 'react';
import { AgentTraceStep, AgentMemory, AgentToolCall } from '../types.ts';
import {
  BrainCircuit,
  CheckCircle2,
  Clock,
  Wrench,
  Database,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Code2,
  FileCheck2,
} from 'lucide-react';

interface AgentActivityPanelProps {
  trace: AgentTraceStep[];
  memory?: AgentMemory;
  toolsCalled?: AgentToolCall[];
  decisionExplanations?: {
    whySeverity?: string;
    whyAuthority?: string;
    whyResolutionPlan?: string;
  };
  currentStage?: string;
  isStreaming?: boolean;
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({
  trace,
  memory,
  toolsCalled = [],
  decisionExplanations,
  currentStage,
  isStreaming = false,
}) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'reasoning' | 'tools' | 'memory'>('trace');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const getAgentColor = (agentName: string) => {
    if (agentName.includes('Master')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (agentName.includes('Classification')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (agentName.includes('Severity')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (agentName.includes('Authority')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (agentName.includes('Verification')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (agentName.includes('Complaint')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (agentName.includes('Resolution')) return 'bg-teal-100 text-teal-800 border-teal-200';
    if (agentName.includes('Follow-Up')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div id="agent-activity-panel" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold tracking-tight text-white">Agent Activity & Execution Trace</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ORCHESTRATOR LIVE
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Autonomous multi-agent planning, tool invocation, and decision reasoning
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-2">
          {isStreaming ? (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>Agents Executing...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Action Plan Ready</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50/80 px-4 pt-2 gap-2 text-xs font-medium">
        <button
          id="btn-tab-trace"
          onClick={() => setActiveTab('trace')}
          className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
            activeTab === 'trace'
              ? 'border-indigo-600 text-indigo-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Execution Trace ({trace.length})</span>
        </button>

        <button
          id="btn-tab-reasoning"
          onClick={() => setActiveTab('reasoning')}
          className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
            activeTab === 'reasoning'
              ? 'border-indigo-600 text-indigo-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Decision Reasoning ("Why")</span>
        </button>

        <button
          id="btn-tab-tools"
          onClick={() => setActiveTab('tools')}
          className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
            activeTab === 'tools'
              ? 'border-indigo-600 text-indigo-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Backend Tools Called ({toolsCalled.length})</span>
        </button>

        <button
          id="btn-tab-memory"
          onClick={() => setActiveTab('memory')}
          className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
            activeTab === 'memory'
              ? 'border-indigo-600 text-indigo-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Session Memory</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-5">
        {activeTab === 'trace' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
              <span>Sequence of Autonomous Actions</span>
              <span>{trace.filter((t) => t.status === 'completed').length} / {trace.length} Completed</span>
            </div>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {trace.map((step, idx) => {
                const isExpanded = expandedTraceId === step.id;
                return (
                  <div key={step.id || idx} className="relative group">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                        step.status === 'completed'
                          ? 'border-emerald-500 text-emerald-600'
                          : step.status === 'warning'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-indigo-500 text-indigo-600 animate-pulse'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-3 h-3 fill-emerald-100" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      )}
                    </div>

                    <div className="bg-gray-50 hover:bg-gray-100/80 transition-all rounded-lg p-3 border border-gray-200/80">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getAgentColor(
                              step.agentName
                            )}`}
                          >
                            {step.agentName}
                          </span>
                          <span className="font-mono text-[11px] text-gray-500 bg-gray-200/60 px-1.5 py-0.5 rounded">
                            action: {step.action}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-xs text-gray-800 font-medium mt-1.5 leading-relaxed">
                        {step.result}
                      </p>

                      {step.decisionExplanation && (
                        <div className="mt-2 pt-2 border-t border-gray-200/70 text-xs">
                          {step.decisionExplanation.whySeverity && (
                            <div className="bg-amber-50/70 border border-amber-200/60 rounded p-2 text-amber-900 mt-1">
                              <span className="font-semibold text-amber-800">Why this severity: </span>
                              {step.decisionExplanation.whySeverity}
                            </div>
                          )}
                          {step.decisionExplanation.whyAuthority && (
                            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded p-2 text-emerald-900 mt-1">
                              <span className="font-semibold text-emerald-800">Why this authority: </span>
                              {step.decisionExplanation.whyAuthority}
                            </div>
                          )}
                          {step.decisionExplanation.whyPlan && (
                            <div className="bg-indigo-50/70 border border-indigo-200/60 rounded p-2 text-indigo-900 mt-1">
                              <span className="font-semibold text-indigo-800">Why this plan: </span>
                              {step.decisionExplanation.whyPlan}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'reasoning' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Clear explainability for critical decisions ensures algorithmic transparency for citizens and municipal reviewers.
            </p>

            {decisionExplanations?.whySeverity ? (
              <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Why this Severity Level?</span>
                </div>
                <p className="text-xs text-amber-950 mt-1.5 leading-relaxed">
                  {decisionExplanations.whySeverity}
                </p>
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded">
                Severity reasoning logged in step 3 of trace.
              </div>
            )}

            {decisionExplanations?.whyAuthority ? (
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Why this Authority & Department?</span>
                </div>
                <p className="text-xs text-emerald-950 mt-1.5 leading-relaxed">
                  {decisionExplanations.whyAuthority}
                </p>
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded">
                Authority jurisdiction rationale logged in step 4 of trace.
              </div>
            )}

            {decisionExplanations?.whyResolutionPlan && (
              <div className="border border-indigo-200 bg-indigo-50/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  <span>Why this Resolution Workflow & SLA?</span>
                </div>
                <p className="text-xs text-indigo-950 mt-1.5 leading-relaxed">
                  {decisionExplanations.whyResolutionPlan}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              The Master Agent autonomously calls concrete backend tools to fetch taxonomies, query authorities, audit data, and persist dockets.
            </p>

            {toolsCalled.length === 0 ? (
              <div className="text-xs text-gray-500 italic p-4 bg-gray-50 rounded text-center">
                Tool calls are recorded during orchestration.
              </div>
            ) : (
              <div className="space-y-2.5">
                {toolsCalled.map((tool, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-mono text-xs font-bold text-gray-900">
                          {tool.toolName}()
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(tool.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] font-mono bg-white p-2 rounded border border-gray-200/80 text-gray-700 overflow-x-auto">
                      <div className="text-gray-500 font-semibold mb-0.5">Parameters:</div>
                      <div>{JSON.stringify(tool.args)}</div>
                    </div>

                    <p className="mt-2 text-xs text-gray-800">
                      <span className="font-semibold text-gray-700">Return summary: </span>
                      {tool.outputSummary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">
                Short-term session memory maintained across the agentic lifecycle:
              </p>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                Ephemerally scoped (Safe)
              </span>
            </div>

            {memory ? (
              <div className="bg-gray-900 text-emerald-400 font-mono text-xs p-3.5 rounded-lg overflow-x-auto border border-gray-800">
                <pre>{JSON.stringify(memory, null, 2)}</pre>
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic p-4 bg-gray-50 rounded text-center">
                Session memory initialized per citizen session.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

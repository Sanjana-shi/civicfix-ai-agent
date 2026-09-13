import React, { useState, useEffect } from 'react';
import { AIAgentAnalysis, CivicReport, AgentOrchestrationResult } from '../types.ts';
import { orchestrateAgent, createReport } from '../services/api.ts';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge.tsx';
import { CategoryBadge } from '../components/CategoryBadge.tsx';
import { StructuredComplaintCard } from '../components/StructuredComplaintCard.tsx';
import { AgentActivityPanel } from '../components/AgentActivityPanel.tsx';
import { HumanInTheLoopConfirmation } from '../components/HumanInTheLoopConfirmation.tsx';
import {
  BrainCircuit,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  AlertTriangle,
  FileText,
  ListChecks,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Phone,
  Globe,
  RefreshCw,
  ExternalLink,
  Eye,
} from 'lucide-react';

interface AIAnalysisViewProps {
  reportDraft: any;
  onCompleted: (createdReport: CivicReport) => void;
  onBackToEdit: () => void;
}

export const AIAnalysisView: React.FC<AIAnalysisViewProps> = ({
  reportDraft,
  onCompleted,
  onBackToEdit,
}) => {
  const [orchestration, setOrchestration] = useState<AgentOrchestrationResult | null>(null);
  const [analysis, setAnalysis] = useState<AIAgentAnalysis | null>(null);
  const [createdReport, setCreatedReport] = useState<CivicReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isPersisting, setIsPersisting] = useState(false);
  const [showFullDocket, setShowFullDocket] = useState(false);
  const [error, setError] = useState('');
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function runAgentOrchestration() {
      setIsAnalyzing(true);
      setError('');
      try {
        const res = await orchestrateAgent({
          goal: `Analyze and resolve citizen report: ${reportDraft.description?.slice(0, 60)}`,
          description: reportDraft.description,
          address: reportDraft.address,
          city: reportDraft.city,
          area: reportDraft.area,
          landmark: reportDraft.landmark,
          hasImages: Boolean(reportDraft.evidenceImages && reportDraft.evidenceImages.length > 0),
          userPhone: reportDraft.userPhone,
          userId: reportDraft.userId,
          userName: reportDraft.userName,
        });

        if (isCancelled) return;

        setOrchestration(res.orchestration);
        setAnalysis(res.analysis);
        if (res.orchestration.isFallback) {
          setIsFallbackMode(true);
        }
      } catch (err: any) {
        if (isCancelled) return;
        console.error('Agent Orchestration Error, falling back gracefully:', err);
        setIsFallbackMode(true);
        setError('AI analysis is temporarily unavailable. Your report has been saved and can be reviewed manually.');
      } finally {
        if (!isCancelled) {
          setIsAnalyzing(false);
        }
      }
    }

    runAgentOrchestration();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Human in the loop confirmation handler
  const handleAuthorizeRegistration = async () => {
    if (!analysis && !isFallbackMode) return;
    setIsPersisting(true);

    try {
      const saved = await createReport({
        userId: reportDraft.userId,
        userName: reportDraft.userName,
        userPhone: reportDraft.userPhone,
        userEmail: reportDraft.userEmail,
        description: reportDraft.description,
        address: reportDraft.address,
        city: reportDraft.city,
        area: reportDraft.area,
        landmark: reportDraft.landmark,
        latitude: reportDraft.latitude,
        longitude: reportDraft.longitude,
        evidenceImages: reportDraft.evidenceImages,
        precomputedAnalysis: analysis || undefined,
      });

      setCreatedReport(saved.report);
      onCompleted(saved.report);
    } catch (err: any) {
      console.error('Failed to create report:', err);
      setError('Failed to persist authorized docket. Please try again.');
    } finally {
      setIsPersisting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-semibold mb-2">
              <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
              <span>Master Agent Orchestration Engine</span>
              <span>•</span>
              <span>Multi-Agent System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {isAnalyzing
                ? 'Master Agent Orchestration In Progress...'
                : analysis
                ? 'Action Plan & Grievance Docket Ready'
                : 'Manual Review Triage'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Transforming natural language citizen input into statutory categorization, causal severity reasoning,
              jurisdiction assignment, and a formal complaint docket.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-right shrink-0">
            <span className="text-[10px] text-slate-400 font-mono block">PIPELINE STATUS</span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {isAnalyzing ? 'ORCHESTRATING' : 'AWAITING HUMAN CONFIRMATION'}
            </span>
          </div>
        </div>

        {/* Dynamic Workflow Plan Nodes */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            { tag: 'GOAL', label: 'Goal Formulation' },
            { tag: 'CLASSIFIER', label: 'Taxonomy Match' },
            { tag: 'SEVERITY', label: 'Hazard Model' },
            { tag: 'AUTHORITY', label: 'Statutory Route' },
            { tag: 'VERIFIER', label: 'Data Audit' },
            { tag: 'COMPLAINT', label: 'Formal Docket' },
            { tag: 'ACTION PLAN', label: 'SLA Milestones' },
          ].map((loop, i) => (
            <div
              key={loop.tag}
              className={`p-2 rounded-lg border transition-all ${
                !isAnalyzing
                  ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[9px] font-bold tracking-wider uppercase opacity-75">{loop.tag}</div>
              <div className="text-[11px] font-semibold mt-0.5">{loop.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fallback or Error Notification */}
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleAuthorizeRegistration}
            disabled={isPersisting}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            {isPersisting ? 'Saving Report...' : 'Proceed with Manual Review'}
          </button>
        </div>
      )}

      {/* Agent Activity Trace Panel */}
      {orchestration && (
        <AgentActivityPanel
          trace={orchestration.trace}
          memory={orchestration.memory}
          toolsCalled={orchestration.toolsCalled}
          decisionExplanations={orchestration.decisionExplanations}
          currentStage={orchestration.memory.currentWorkflowStage}
          isStreaming={isAnalyzing}
        />
      )}

      {/* Human in the Loop Gate */}
      {analysis && !createdReport && (
        <HumanInTheLoopConfirmation
          analysis={analysis}
          onAuthorize={handleAuthorizeRegistration}
          onReviewComplaint={() => setShowFullDocket(!showFullDocket)}
          isSubmitting={isPersisting}
        />
      )}

      {/* Full Structured Complaint Docket Drawer */}
      {analysis && showFullDocket && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Formal Municipal Complaint Docket (Citizen Preview)
            </h3>
            <span className="text-xs text-slate-500">Ready for statutory transmission</span>
          </div>
          <StructuredComplaintCard
            analysis={analysis}
            address={reportDraft.address}
            city={reportDraft.city}
            area={reportDraft.area}
            landmark={reportDraft.landmark}
            citizenName={reportDraft.userName}
            dateCreated={new Date().toLocaleDateString()}
          />
        </div>
      )}
    </div>
  );
};

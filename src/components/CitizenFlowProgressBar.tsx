import React from 'react';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, FileText, BrainCircuit, CheckSquare, Activity } from 'lucide-react';

export type CitizenWorkflowStage = 'login' | 'report' | 'ai-assistant' | 'solution' | 'tracking';
export type CitizenFlowStage = CitizenWorkflowStage;

interface CitizenFlowProgressBarProps {
  currentStage: CitizenWorkflowStage;
  onNavigateStage?: (stage: CitizenWorkflowStage) => void;
  onSelectStage?: (stage: CitizenWorkflowStage) => void;
  reportId?: string;
}

interface StepItem {
  id: CitizenWorkflowStage;
  number: number;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: StepItem[] = [
  {
    id: 'login',
    number: 1,
    label: 'Login / Register',
    sublabel: 'Citizen Authentication',
    icon: ShieldCheck,
  },
  {
    id: 'report',
    number: 2,
    label: 'Report Issue',
    sublabel: 'Describe Problem',
    icon: FileText,
  },
  {
    id: 'ai-assistant',
    number: 3,
    label: 'AI Assistant',
    sublabel: 'Multi-Agent Analysis',
    icon: BrainCircuit,
  },
  {
    id: 'solution',
    number: 4,
    label: 'Solution',
    sublabel: 'Review Action Plan',
    icon: CheckSquare,
  },
  {
    id: 'tracking',
    number: 5,
    label: 'Tracking',
    sublabel: 'Resolution Status',
    icon: Activity,
  },
];

export const CitizenFlowProgressBar: React.FC<CitizenFlowProgressBarProps> = ({
  currentStage,
  onNavigateStage,
  onSelectStage,
  reportId,
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
  const handleStageClick = onSelectStage || onNavigateStage;

  return (
    <div className="bg-white border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        {/* Desktop / Tablet Stepper */}
        <div className="hidden sm:flex items-center justify-between gap-1">
          {STAGES.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;
            const isClickable = Boolean(handleStageClick && (isCompleted || isCurrent));

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && handleStageClick && handleStageClick(step.id)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left transition-all ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500/40 shadow-2xs font-semibold'
                      : isCompleted
                      ? 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                      : 'text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Step Indicator Bubble */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-transform ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100 scale-105'
                        : isCompleted
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold leading-tight ${
                        isCurrent
                          ? 'text-emerald-900'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-none">
                      {isCurrent
                        ? 'Active Stage'
                        : isCompleted
                        ? 'Completed'
                        : step.sublabel}
                    </span>
                  </div>
                </button>

                {/* Arrow connector */}
                {idx < STAGES.length - 1 && (
                  <div className="flex items-center text-slate-300 px-1">
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-colors ${
                        idx < currentIndex ? 'text-emerald-500' : 'text-slate-300'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Stepper */}
        <div className="sm:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              {currentIndex + 1}
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">
                Stage {currentIndex + 1}: {STAGES[currentIndex]?.label}
              </span>
              <span className="text-[10px] text-slate-500">
                Step {currentIndex + 1} of 5 in resolution flow
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {STAGES.map((s, i) => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  i < currentIndex
                    ? 'bg-emerald-600'
                    : i === currentIndex
                    ? 'bg-emerald-500 ring-2 ring-emerald-200'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

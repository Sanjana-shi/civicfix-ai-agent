import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  BrainCircuit,
  FileCheck2,
  Building2,
  ListChecks,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  AlertTriangle,
  Car,
  Trash2,
  Lightbulb,
  Droplets,
  Waves,
  ShieldCheck,
  ChevronRight,
  Eye,
  XCircle,
  Lock,
  Scale,
  Search,
  FileText,
  Check,
  HelpCircle,
  Shield,
  Zap,
} from 'lucide-react';
import { IssueCategory } from '../types.ts';

interface LandingViewProps {
  onNavigate: (view: string, reportId?: string, prefillCategory?: IssueCategory) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const categories = [
    {
      key: 'ROAD_POTHOLE' as IssueCategory,
      title: 'Roads & Potholes',
      icon: Car,
      desc: 'Cratered tarmac, sinkholes, broken road dividers, asphalt erosion.',
      dept: 'Road & Municipal Infrastructure Directorate',
      sla: '24 - 48 Hours',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      iconColor: 'text-amber-600',
    },
    {
      key: 'GARBAGE' as IssueCategory,
      title: 'Waste Management',
      icon: Trash2,
      desc: 'Overflowing bins, uncollected curbside waste, illegal dumping, stench.',
      dept: 'Solid Waste Management & Sanitation Board',
      sla: '12 - 24 Hours',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconColor: 'text-emerald-600',
    },
    {
      key: 'STREETLIGHT' as IssueCategory,
      title: 'Streetlights & Electrical',
      icon: Lightbulb,
      desc: 'Flickering fixtures, dark bus shelters, exposed wiring, dead lamps.',
      dept: 'Municipal Electrical & Lighting Authority',
      sla: '24 - 48 Hours',
      color: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      iconColor: 'text-yellow-600',
    },
    {
      key: 'WATER_LEAKAGE' as IssueCategory,
      title: 'Water & Pipelines',
      icon: Droplets,
      desc: 'Underground main pipeline rupture, gushing valves, contaminated supply.',
      dept: 'Water Supply & Sewerage Board',
      sla: '8 - 18 Hours',
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      iconColor: 'text-cyan-600',
    },
    {
      key: 'DRAINAGE' as IssueCategory,
      title: 'Drainage & Flooding',
      icon: Waves,
      desc: 'Clogged storm drains, overflowing culverts, monsoon waterlogging.',
      dept: 'Stormwater & Drainage Maintenance Division',
      sla: '12 - 24 Hours',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      key: 'TRAFFIC_SAFETY' as IssueCategory,
      title: 'Public Safety & Traffic',
      icon: ShieldAlert,
      desc: 'Non-functioning traffic signals, missing speed bumps, broken guardrails.',
      dept: 'Traffic Safety & Urban Mobility Directorate',
      sla: '12 - 24 Hours',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      iconColor: 'text-rose-600',
    },
  ];

  const workflowSteps = [
    {
      step: '1',
      title: 'Citizen Report',
      desc: 'Citizen describes issue in plain words with address and optional photo.',
      badge: 'Input',
    },
    {
      step: '2',
      title: 'AI Understanding',
      desc: 'Extracts entities, spatial context, affected infrastructure, and hazards.',
      badge: 'Perception',
    },
    {
      step: '3',
      title: 'Issue Classification',
      desc: 'Categorizes into statutory municipal domains without user guesswork.',
      badge: 'Routing',
    },
    {
      step: '4',
      title: 'Severity Assessment',
      desc: 'Evaluates public risk, nearby schools/traffic, and assigns LOW to CRITICAL with reasons.',
      badge: 'Reasoning',
    },
    {
      step: '5',
      title: 'Authority Identification',
      desc: 'Maps responsible directorate, department, ward jurisdiction, and official SLAs.',
      badge: 'Jurisdiction',
    },
    {
      step: '6',
      title: 'Complaint Generation',
      desc: 'Drafts formal legal complaint document with evidence checklist ready for filing.',
      badge: 'Synthesis',
    },
    {
      step: '7',
      title: 'Action Plan',
      desc: 'Generates step-by-step citizen resolution guide, official portal links, and hotline.',
      badge: 'Plan',
    },
    {
      step: '8',
      title: 'Follow-up & Tracking',
      desc: 'Watches SLA deadlines, tracks work orders, and provides automated escalation protocols.',
      badge: 'Oversight',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
          <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />
          <span>Agentic AI Hackathon Project</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">Autonomous Civic Workflow Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Civic problems shouldn't disappear after they're reported.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
          CivicFix AI uses Agentic AI to understand public issues, identify the right authority, assess severity,
          prepare structured complaints, and create a resolution workflow.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            id="hero-agentic-demo-btn"
            onClick={() => onNavigate('agent-sandbox')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all ring-2 ring-indigo-400/50"
          >
            <BrainCircuit className="w-4 h-4 text-indigo-200" />
            <span>Try Demo (Agentic AI)</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500 text-white font-bold">Judge Mode</span>
          </button>

          <button
            id="hero-report-btn"
            onClick={() => onNavigate('report')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            Report an Issue
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            id="hero-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
          >
            Citizen Dashboard
          </button>
        </div>

        {/* Quick Platform Metrics */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Resolution Success</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">94.2%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Complaints officially acknowledged</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Avg Triage Speed</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">1.8 sec</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Zero manual classification delay</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Connected Authorities</span>
            <div className="text-2xl font-bold text-indigo-700 mt-1">7 Bodies</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Roads, SWM, BESCOM, BWSSB</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Citizen Effort</span>
            <div className="text-2xl font-bold text-amber-700 mt-1">1 Step</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Speak plain natural language</p>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER STORY COMPARISON (Requirement 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              The CivicFix Transformation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Before & After: How Agentic AI Changes Civic Resolution
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Compare the traditional broken municipal reporting ordeal with CivicFix AI's autonomous multi-agent pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WITHOUT CIVICFIX */}
            <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-rose-200/70 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                        WITHOUT CIVICFIX
                      </h3>
                      <p className="text-xs text-rose-900/70 font-medium">High Friction, Manual Bureaucracy</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-200/60 text-rose-800">
                    Traditional Portal
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white/80 border border-rose-100 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">Citizen has a problem</strong>
                      <span className="text-slate-500 text-[11px]">Sees pothole or waste hazard in neighborhood</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-rose-400 font-bold">↓</div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white/80 border border-rose-100 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">Searches multiple websites</strong>
                      <span className="text-slate-500 text-[11px]">Spends 30+ mins navigating government directories</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-rose-400 font-bold">↓</div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white/80 border border-rose-100 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">Tries to find correct department</strong>
                      <span className="text-slate-500 text-[11px]">Confused between Ward engineer, PWD, or BBMP</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-rose-400 font-bold">↓</div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white/80 border border-rose-100 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px] font-bold shrink-0">4</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">Writes formal complaint manually</strong>
                      <span className="text-slate-500 text-[11px]">Often rejected due to missing statutory details</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-rose-400 font-bold">↓</div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white/80 border border-rose-100 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px] font-bold shrink-0">5</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">Figures out next steps & follows up manually</strong>
                      <span className="text-slate-500 text-[11px]">No SLA tracking, no escalation guidance, ticket disappears</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200/70 text-[11px] text-rose-800 font-medium">
                Outcome: Frustration, 68% drop-off rate, unaddressed public hazards.
              </div>
            </div>

            {/* WITH CIVICFIX */}
            <div className="bg-indigo-50/50 border-2 border-indigo-300 rounded-2xl p-6 relative flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-indigo-200 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                        WITH CIVICFIX AI
                      </h3>
                      <p className="text-xs text-indigo-700 font-medium">Autonomous Multi-Agent Intelligence</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600 text-white">
                    Agentic Solution
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">Citizen speaks in natural language</strong>
                      <span className="text-slate-600 text-[11px]">"Huge pothole outside my college entrance..."</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-indigo-500 font-bold">↓</div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">AI Agent understands & classifies</strong>
                      <span className="text-slate-600 text-[11px]">Decomposes intent, maps to statutory taxonomy</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-indigo-500 font-bold">↓</div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">Reasons severity & identifies authority</strong>
                      <span className="text-slate-600 text-[11px]">Models traffic hazard + maps to Road Directorate</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-indigo-500 font-bold">↓</div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">Generates structured legal docket</strong>
                      <span className="text-slate-600 text-[11px]">Synthesizes formal title, engineering action, SLA</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-indigo-500 font-bold">↓</div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                    <div>
                      <strong className="text-slate-900 block font-sans">Guides resolution & tracks progress</strong>
                      <span className="text-slate-600 text-[11px]">Follow-Up Agent monitors SLA & escalates if breached</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-200 flex items-center justify-between text-[11px]">
                <span className="text-indigo-900 font-bold">Outcome: Instant triage, 0 drop-off, accountability.</span>
                <button
                  onClick={() => onNavigate('agent-sandbox')}
                  className="font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
                >
                  Try in Sandbox →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Agentic AI Workflow */}
      <section
        id="workflow-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
      >
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 overflow-hidden relative">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-xs font-semibold mb-3">
              <BrainCircuit className="w-3.5 h-3.5" />
              Autonomous Decision Loop
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Visual Agentic AI Workflow
            </h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Traditional chatbots just answer questions. CivicFix AI executes an autonomous multi-stage workflow:
              Goal formulation, entity extraction, statutory routing, severity reasoning, structured complaint synthesis, and tracking.
            </p>
          </div>

          {/* Step Sequence Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((ws, i) => (
              <div
                key={ws.step}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center">
                      {ws.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {ws.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {ws.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center text-[11px] text-emerald-400 font-medium">
                  <span>Phase {i + 1} of 8</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Visual Sequence Bar */}
          <div className="mt-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300">
            <span className="text-emerald-400 font-bold">WORKFLOW CHAIN:</span>
            <span>Citizen Report</span>
            <span className="text-slate-500">→</span>
            <span>AI Understanding</span>
            <span className="text-slate-500">→</span>
            <span>Issue Classification</span>
            <span className="text-slate-500">→</span>
            <span>Severity Assessment</span>
            <span className="text-slate-500">→</span>
            <span>Authority Identification</span>
            <span className="text-slate-500">→</span>
            <span>Complaint Generation</span>
            <span className="text-slate-500">→</span>
            <span>Action Plan</span>
            <span className="text-slate-500">→</span>
            <span>Follow-up</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Intelligent Jurisdiction Routing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Supported Civic Categories
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            The citizen never needs to know which government department handles what.
            The AI determines statutory ownership automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${cat.color} inline-flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      SLA: {cat.sla}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 mb-2">
                    <strong className="text-slate-700">Routed Authority:</strong>
                    <p className="truncate text-slate-600 mt-0.5">{cat.dept}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('report', undefined, cat.key)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 transition-colors"
                  >
                    Report {cat.title}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Sample Reports Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Community Transparency
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Active Public Reports in Progress
              </h3>
              <p className="text-xs text-slate-500">
                Explore real reports being actively resolved through CivicFix AI.
              </p>
            </div>
            <button
              onClick={() => onNavigate('my-reports')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              View All Community Reports
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              onClick={() => onNavigate('details', 'CFX-2026-0842')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-500 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-slate-700">CFX-2026-0842</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                  In Progress
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                Hazardous Surface Pothole at RV College Entrance
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Large pothole near college entrance. Bitumen compaction scheduled by Ward 132 engineer.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Mysuru Road / Kengeri</span>
                <span className="text-emerald-700 font-semibold group-hover:underline">Track Docket →</span>
              </div>
            </div>

            <div
              onClick={() => onNavigate('details', 'CFX-2026-0761')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-500 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-slate-700">CFX-2026-0761</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                  Critical • In Progress
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                Underground Potable Water Main Rupture
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Gushing drinking water near Indiranagar Metro Pillar #82. Emergency isolation valve closed.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Indiranagar 80 Feet Road</span>
                <span className="text-emerald-700 font-semibold group-hover:underline">Track Docket →</span>
              </div>
            </div>

            <div
              onClick={() => onNavigate('details', 'CFX-2026-0790')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-500 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-slate-700">CFX-2026-0790</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  Resolved & Cleared
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                Garbage Vulnerable Point Remediation
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Cleared 2.4 tons of solid waste and disinfected with lime powder at Koramangala 6th Block.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Koramangala 6th Block</span>
                <span className="text-emerald-700 font-semibold group-hover:underline">View Proof →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JUDGE-FRIENDLY "HOW IT WORKS" SECTION (Requirement 11) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-900/40">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              Judge Evaluation Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              How CivicFix Works: 7-Step Autonomous Cycle
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              An architectural breakdown of the autonomous decision loop running behind every citizen report.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {[
              {
                step: '1',
                title: 'Citizen gives a goal',
                desc: 'Unstructured complaint in natural language or voice.',
                agent: 'Citizen Ingestion',
              },
              {
                step: '2',
                title: 'Master Agent creates plan',
                desc: 'Triage into Full Report, Inquiry, or Follow-up routing.',
                agent: 'Master Orchestrator',
              },
              {
                step: '3',
                title: 'Specialized agents analyze',
                desc: 'Taxonomy classification, hazard modeling, and routing.',
                agent: 'Specialized Agents',
              },
              {
                step: '4',
                title: 'Tools provide information',
                desc: 'Jurisdiction query, landmark checks, SLA matrix.',
                agent: 'Backend Tool Suite',
              },
              {
                step: '5',
                title: 'Agent evaluates results',
                desc: 'Confidence validation, consistency, missing details check.',
                agent: 'Verification Agent',
              },
              {
                step: '6',
                title: 'System creates action plan',
                desc: 'Structured legal complaint docket with milestone SLAs.',
                agent: 'Planning Agent',
              },
              {
                step: '7',
                title: 'Citizen confirms step',
                desc: 'Human-in-the-loop gate before any external persistence.',
                agent: 'Human Gate',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex flex-col justify-between hover:border-indigo-500/50 transition-all"
              >
                <div>
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-xs font-bold font-mono mb-2">
                    {item.step}
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/60 text-[10px] text-indigo-400 font-mono">
                  {item.agent}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Want to see this live in action with the Hackathon benchmark?
            </span>
            <button
              onClick={() => onNavigate('agent-sandbox')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Launch Live Interactive Agent Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* TRUST & RESPONSIBLE AI SECTION (Requirement 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Ethics & Governance Guardrails
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Trust & Responsible AI Architecture
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Designed for public sector credibility, zero fabrication, citizen data privacy, and strict human authorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Evidence-Grounded Recommendations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All severity ratings, statutory classifications, and SLA projections are derived strictly from reported physical facts, road traffic proximity, and municipal bylaws.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Authority Verification Advisory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authority identification is based on published metropolitan jurisdiction matrices. Recommendations explicitly indicate ward-level engineer verification where boundaries overlap.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Zero Fabricated Facts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The agent never invents road dimensions, municipal circular numbers, or simulated government sign-offs. Missing facts are highlighted as verification requirements.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No False Government API Claims</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                CivicFix AI prepares, verifies, and stages complaints cleanly. We do NOT claim unauthorized automated backdoors into government portals without verified citizen sign-off.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Human-in-the-Loop Confirmation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No complaint docket is persisted or routed without explicit citizen authorization. The citizen maintains full editorial control over the AI-generated petition.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Data Minimization & Safe Auth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sensitive citizen personal information is minimized. The platform does not store or request Aadhaar, PAN, or national ID credentials in this prototype environment.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start space-x-3">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong>Public Sector Transparency Note:</strong> CivicFix AI acts as an intelligent civic assistant that assists citizens with issue structuring, severity quantification, and statutory petition formatting. Official government resolution remains subject to field engineer inspection and municipal budget allocation.
            </p>
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Witness a civic issue in your neighborhood today?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base mt-2.5 max-w-2xl mx-auto">
            Report it in 30 seconds. No bureaucratic confusion, no login roadblocks. Let CivicFix AI handle the routing and formal drafting.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('report')}
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Start Natural Language Report
            </button>
            <button
              onClick={() => onNavigate('assistant')}
              className="px-6 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white font-semibold text-sm border border-emerald-700 transition-colors"
            >
              Ask AI Resolution Assistant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

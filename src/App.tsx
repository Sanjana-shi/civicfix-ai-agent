import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CitizenFlowProgressBar, CitizenFlowStage } from './components/CitizenFlowProgressBar.tsx';
import { LoginRegisterView } from './views/LoginRegisterView.tsx';
import { ReportIssueView } from './views/ReportIssueView.tsx';
import { AIAssistantWorkingView } from './views/AIAssistantWorkingView.tsx';
import { SolutionView } from './views/SolutionView.tsx';
import { SolutionTrackingView } from './views/SolutionTrackingView.tsx';
import { IssueDetailsView } from './views/IssueDetailsView.tsx';
import { MyReportsView } from './views/MyReportsView.tsx';
import { AssistantView } from './views/AssistantView.tsx';
import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { AIAgentAnalysis, AgentOrchestrationResult, CivicReport, IssueCategory } from './types.ts';

function AppContent() {
  const { currentUser, isAuthenticated, setIsAuthenticated } = useAuth();

  // The primary 5-stage citizen user flow:
  // 1. login -> 2. report -> 3. ai-assistant -> 4. solution -> 5. tracking
  const [currentView, setCurrentView] = useState<string>(
    isAuthenticated ? 'report' : 'login'
  );

  // Workflow state payloads
  const [reportDraftPayload, setReportDraftPayload] = useState<any>({
    description: 'There is a large pothole near my college entrance. It is dangerous for two-wheelers and pedestrians.',
    address: '7th Block, Jayanagar Main Road',
    city: 'Bengaluru',
    area: 'Ward 153, South Zone',
    landmark: 'Near National College Main Gate',
    category: 'ROAD_POTHOLE',
    evidenceImages: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'],
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIAgentAnalysis | null>(null);
  const [agentOrchestration, setAgentOrchestration] = useState<AgentOrchestrationResult | null>(null);
  const [activeReportId, setActiveReportId] = useState<string>('CF1024');
  const [prefillCategory, setPrefillCategory] = useState<IssueCategory | undefined>(undefined);
  const [assistantContextId, setAssistantContextId] = useState<string>('');

  // Keep view aligned if authentication status toggles
  useEffect(() => {
    if (!isAuthenticated && currentView !== 'login') {
      setCurrentView('login');
    }
  }, [isAuthenticated]);

  // Scroll to top upon view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Compute active stage for CitizenFlowProgressBar
  const getActiveStage = (): CitizenFlowStage => {
    if (!isAuthenticated || currentView === 'login') return 'login';
    if (currentView === 'report') return 'report';
    if (currentView === 'ai-assistant' || currentView === 'analysis') return 'ai-assistant';
    if (currentView === 'solution') return 'solution';
    if (currentView === 'tracking') return 'tracking';
    return 'report';
  };

  const handleStageSelect = (stage: CitizenFlowStage) => {
    if (stage === 'login') {
      setCurrentView('login');
      return;
    }
    if (!isAuthenticated) {
      setCurrentView('login');
      return;
    }

    if (stage === 'report') {
      setCurrentView('report');
    } else if (stage === 'ai-assistant') {
      setCurrentView('ai-assistant');
    } else if (stage === 'solution') {
      setCurrentView('solution');
    } else if (stage === 'tracking') {
      setCurrentView('tracking');
    }
  };

  const handleNavigate = (view: string, reportId?: string, category?: IssueCategory) => {
    if (reportId) {
      setActiveReportId(reportId);
    }
    if (category) {
      setPrefillCategory(category);
    }
    setCurrentView(view);
  };

  // STAGE 1 -> STAGE 2: Login Success
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('report');
  };

  // STAGE 2 -> STAGE 3: Report Submitted for AI Analysis
  const handleStartAnalysis = (draftData: any) => {
    setReportDraftPayload(draftData);
    setCurrentView('ai-assistant');
  };

  // STAGE 3 -> STAGE 4: AI Analysis Complete, Move to Solution
  const handleAIAssistantCompleted = (
    analysis: AIAgentAnalysis,
    orchestration: AgentOrchestrationResult,
    updatedDraft: any
  ) => {
    setAiAnalysis(analysis);
    setAgentOrchestration(orchestration);
    setReportDraftPayload(updatedDraft);
    setCurrentView('solution');
  };

  // STAGE 4 -> STAGE 5: Solution Confirmed, Move to Solution Tracking
  const handleSolutionConfirmed = (createdReport: CivicReport) => {
    setActiveReportId(createdReport.id);
    setCurrentView('tracking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Global Navigation */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* 5-STAGE CITIZEN USER FLOW PROGRESS BAR */}
      <CitizenFlowProgressBar
        currentStage={getActiveStage()}
        onSelectStage={handleStageSelect}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {/* STAGE 1: LOGIN / REGISTER (FIRST SCREEN) */}
        {(!isAuthenticated || currentView === 'login') && (
          <LoginRegisterView onLoginSuccess={handleLoginSuccess} />
        )}

        {/* STAGE 2: REPORT AN ISSUE */}
        {isAuthenticated && currentView === 'report' && (
          <ReportIssueView
            initialCategory={prefillCategory}
            onAnalysisStarted={handleStartAnalysis}
            onCancel={() => handleStageSelect('tracking')}
          />
        )}

        {/* STAGE 3: AI ASSISTANT (MAIN FEATURE WITH 8 REAL-TIME STAGES & MISSING INFO PROMPT) */}
        {isAuthenticated && (currentView === 'ai-assistant' || currentView === 'analysis') && (
          <AIAssistantWorkingView
            reportDraft={reportDraftPayload}
            onContinueToSolution={handleAIAssistantCompleted}
          />
        )}

        {/* STAGE 4: SOLUTION (EXECUTIVE ASSESSMENT, WHY REASON, PREPARED COMPLAINT, 5-STEP PLAN) */}
        {isAuthenticated && currentView === 'solution' && (
          <SolutionView
            reportDraft={reportDraftPayload}
            analysis={
              aiAnalysis || {
                category: 'ROAD_POTHOLE',
                category_display: 'Road Pothole',
                severity: 'HIGH',
                severity_score: 85,
                severity_reason: 'Potential road safety risk identified from the description.',
                responsible_authority: 'Road / Municipal Maintenance',
                authority_department: 'Civil Works & Road Engineering',
                why_high_severity:
                  'Based on the reported issue, this appears to involve road infrastructure and may create a safety risk.',
                complaint_title:
                  'URGENT HAZARD: Severe road surface pothole creating imminent safety risk for two-wheelers and pedestrians',
                complaint_description:
                  'FORMAL MUNICIPAL CITIZEN GRIEVANCE DOCKET\nCategory: Road Pothole\nAuthority: Road / Municipal Maintenance\nLocation: Near College Entrance, Jayanagar Main Road\nDescription: Large deep pothole causing vehicle deviation and ped safety hazard.\nRequested Remediation: Immediate cold/hot bitumen compaction within statutory 48-hour turnaround.',
                resolution_plan: [
                  '1. Confirm the report',
                  '2. Attach supporting information if available',
                  '3. Create the CivicFix report',
                  '4. Monitor the report status',
                  '5. Follow up if required',
                ],
                estimated_sla_days: 2,
                required_information_missing: false,
              }
            }
            orchestration={
              agentOrchestration || {
                goal: 'Resolve reported road pothole infrastructure hazard',
                totalSteps: 8,
                completedSteps: 8,
                overallStatus: 'COMPLETED',
                agentsInvolved: [
                  'ClassificationAgent',
                  'SeverityRiskAgent',
                  'AuthorityRoutingAgent',
                  'VerificationAgent',
                  'ComplaintDocketAgent',
                ],
                timeline: [],
              }
            }
            onConfirmAndCreate={handleSolutionConfirmed}
            onBackToEdit={() => setCurrentView('report')}
          />
        )}

        {/* STAGE 5: SOLUTION TRACKING (6-STAGE TIMELINE, STATUS HISTORY, DEMO SIMULATION) */}
        {isAuthenticated && currentView === 'tracking' && (
          <SolutionTrackingView
            reportId={activeReportId}
            onReportNewIssue={() => setCurrentView('report')}
            onNavigateAssistant={(id) => {
              setAssistantContextId(id);
              setCurrentView('assistant');
            }}
          />
        )}

        {/* SECONDARY SCREENS (ACCESSIBLE VIA NAVBAR) */}
        {isAuthenticated && currentView === 'my-reports' && (
          <MyReportsView onNavigate={handleNavigate} />
        )}

        {isAuthenticated && currentView === 'details' && (
          <IssueDetailsView
            reportId={activeReportId}
            onBack={() => handleNavigate('tracking')}
            onNavigateTracking={(id) => handleNavigate('tracking', id)}
          />
        )}

        {isAuthenticated && currentView === 'assistant' && (
          <AssistantView
            initialContextReportId={assistantContextId}
            onNavigateReport={(id) => handleNavigate('details', id)}
          />
        )}

        {isAuthenticated && currentView === 'admin' && (
          <AdminDashboardView
            onNavigateDetails={(id) => handleNavigate('details', id)}
            onNavigateTracking={(id) => handleNavigate('tracking', id)}
          />
        )}

        {isAuthenticated && currentView === 'about' && (
          <AboutView onNavigateReport={() => handleNavigate('report')} />
        )}
      </main>

      {/* Clean Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

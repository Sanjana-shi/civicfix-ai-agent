export type IssueCategory =
  | 'ROAD_POTHOLE'
  | 'GARBAGE'
  | 'STREETLIGHT'
  | 'WATER_LEAKAGE'
  | 'DRAINAGE'
  | 'TRAFFIC_SAFETY'
  | 'PUBLIC_PROPERTY'
  | 'OTHER';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  preferredLanguage: string;
  role: 'citizen' | 'admin' | 'officer';
  avatar?: string;
  createdAt: string;
}

export interface AgentStepResult {
  id: string;
  phase: 'GOAL' | 'PLANNING' | 'TOOL_DATA_USE' | 'REASONING' | 'DECISION' | 'ACTION_PLAN';
  label: string;
  status: 'pending' | 'running' | 'completed' | 'warning';
  detail: string;
  timestamp?: string;
}

export interface AgentTraceStep {
  id: string;
  agentName: string;
  action: string;
  result: string;
  timestamp: string;
  status: 'pending' | 'active' | 'completed' | 'warning';
  decisionExplanation?: {
    whySeverity?: string;
    whyAuthority?: string;
    whyPlan?: string;
  };
}

export type AgentWorkflowType = 'FULL_REPORT' | 'INQUIRY_GUIDANCE' | 'STATUS_FOLLOWUP';

export interface AgentMemory {
  goal: string;
  workflowType: AgentWorkflowType;
  rawDescription: string;
  location: {
    address: string;
    area: string;
    city: string;
    landmark?: string;
  };
  category?: IssueCategory;
  severity?: SeverityLevel;
  authority?: string;
  missingInformation?: string[];
  complaintDraft?: {
    title: string;
    description: string;
    impact: string;
    remediation: string;
  };
  actionPlan?: string[];
  currentWorkflowStage: string;
  humanConfirmationRequired: boolean;
  humanConfirmed: boolean;
}

export interface AgentToolCall {
  toolName: string;
  args: any;
  outputSummary: string;
  timestamp: string;
}

export interface AgentOrchestrationResult {
  goalUnderstood: string;
  workflowSelected: AgentWorkflowType;
  plan: string[];
  trace: AgentTraceStep[];
  memory: AgentMemory;
  decisionExplanations: {
    whySeverity: string;
    whyAuthority: string;
    whyResolutionPlan: string;
  };
  toolsCalled: AgentToolCall[];
  analysis: AIAgentAnalysis;
  isFallback?: boolean;
  fallbackReason?: string;
}

export interface FollowUpAgentResult {
  reportId: string;
  status: ReportStatus;
  daysElapsed: number;
  targetSlaDate?: string;
  isOverdue: boolean;
  urgencyLevel: 'NORMAL' | 'URGENT' | 'CRITICAL_ESCALATION';
  assessmentSummary: string;
  recommendedActions: string[];
  additionalEvidenceNeeded: string[];
  escalationTier: {
    tierName: string;
    designatedOfficer: string;
    channel: string;
    statutoryRight: string;
  };
  escalationNoticeDraft: string;
  trace: AgentTraceStep[];
}

export interface AIAgentAnalysis {
  category: IssueCategory;
  category_display: string;
  severity: SeverityLevel;
  severity_reason: string;
  responsible_authority: string;
  authority_department: string;
  authority_reason: string;
  why_this_authority?: string;
  why_high_severity?: string;
  missing_information: string[];
  complaint_title: string;
  complaint_description: string;
  suggested_action: string;
  impact_statement: string;
  recommended_actions: string[];
  resolution_steps?: { step: number; title: string; description: string }[];
  reporting_channel: string;
  evidence_checklist: string[];
  follow_up_recommendation: string;
  estimated_sla_days?: number;
  confidence_score?: number;
  agent_steps?: AgentStepResult[];
  agent_trace?: AgentTraceStep[];
  orchestration?: AgentOrchestrationResult;
}

export interface StatusHistoryItem {
  id: string;
  status: ReportStatus;
  timestamp: string;
  changedBy: string;
  note: string;
}

export interface ReportComment {
  id: string;
  authorName: string;
  authorRole: 'citizen' | 'admin' | 'officer' | 'ai_agent';
  content: string;
  timestamp: string;
}

export interface CivicReport {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  originalDescription: string;
  address: string;
  city: string;
  area: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  evidenceImages: string[];
  category: IssueCategory;
  severity: SeverityLevel;
  status: ReportStatus;
  assignedAuthorityId: string;
  assignedAuthorityName: string;
  assignedAuthorityDept: string;
  createdAt: string;
  updatedAt: string;
  targetResolutionDate?: string;
  aiAnalysis?: AIAgentAnalysis;
  statusHistory: StatusHistoryItem[];
  comments?: ReportComment[];
}

export interface CivicAuthority {
  id: string;
  name: string;
  department: string;
  jurisdiction: string;
  categoriesHandled: IssueCategory[];
  contactEmail: string;
  helpline: string;
  portalUrl: string;
  slaHours: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
}

export interface CategoryInfo {
  key: IssueCategory;
  label: string;
  icon: string;
  description: string;
  primaryDepartment: string;
  color: string;
}

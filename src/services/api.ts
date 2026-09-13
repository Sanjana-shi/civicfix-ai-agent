import {
  CivicReport,
  User,
  AIAgentAnalysis,
  CivicAuthority,
  ReportStatus,
  AgentOrchestrationResult,
  FollowUpAgentResult,
  AgentWorkflowType,
} from '../types.ts';

export async function fetchHealth() {
  const res = await fetch('/api/health');
  return res.json();
}

export async function loginUser(email: string): Promise<{ user: User }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function registerUser(userData: Partial<User>): Promise<{ user: User }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function fetchReports(filters?: {
  userId?: string;
  status?: string;
  category?: string;
  severity?: string;
  search?: string;
}): Promise<{ reports: CivicReport[] }> {
  const params = new URLSearchParams();
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.severity) params.append('severity', filters.severity);
  if (filters?.search) params.append('search', filters.search);

  const res = await fetch(`/api/reports?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export async function fetchReportById(id: string): Promise<{ report: CivicReport }> {
  const res = await fetch(`/api/reports/${id}`);
  if (!res.ok) throw new Error('Report not found');
  return res.json();
}

export async function createReport(data: {
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  description: string;
  address: string;
  city: string;
  area: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  evidenceImages?: string[];
  precomputedAnalysis?: AIAgentAnalysis;
}): Promise<{ report: CivicReport }> {
  const res = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit report');
  return res.json();
}

export async function analyzeIssue(data: {
  description: string;
  address?: string;
  city?: string;
  area?: string;
  landmark?: string;
  hasImages?: boolean;
}): Promise<{ analysis: AIAgentAnalysis }> {
  const res = await fetch('/api/analyze-issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to analyze issue');
  return res.json();
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
  note?: string,
  changedBy?: string
): Promise<{ report: CivicReport }> {
  const res = await fetch(`/api/reports/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note, changedBy }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function addReportComment(
  id: string,
  data: { authorName: string; authorRole: 'citizen' | 'admin' | 'officer' | 'ai_agent'; content: string }
) {
  const res = await fetch(`/api/reports/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export async function askAssistant(question: string, context?: string): Promise<{ reply: string }> {
  const res = await fetch('/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, context }),
  });
  if (!res.ok) throw new Error('Assistant request failed');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchAuthorities(): Promise<{ authorities: CivicAuthority[] }> {
  const res = await fetch('/api/authorities');
  if (!res.ok) throw new Error('Failed to fetch authorities');
  return res.json();
}

export async function orchestrateAgent(data: {
  goal?: string;
  description: string;
  address?: string;
  city?: string;
  area?: string;
  landmark?: string;
  hasImages?: boolean;
  userPhone?: string;
  userId?: string;
  userName?: string;
  reportId?: string;
  forceWorkflow?: AgentWorkflowType;
  humanConfirmed?: boolean;
}): Promise<{ orchestration: AgentOrchestrationResult; analysis: AIAgentAnalysis }> {
  const res = await fetch('/api/agent/orchestrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Agent orchestration failed');
  return res.json();
}

export async function fetchFollowUpPlan(reportId: string, currentReport?: any): Promise<{ followUp: FollowUpAgentResult }> {
  const res = await fetch('/api/agent/follow-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId, currentReport }),
  });
  if (!res.ok) throw new Error('Failed to run Follow-Up Agent');
  return res.json();
}

export async function fetchAgentTools(): Promise<{
  tools: { name: string; description: string; parameters: string[]; category: string }[];
  orchestrator: string;
  activeAgents: string[];
}> {
  const res = await fetch('/api/agent/tools');
  if (!res.ok) throw new Error('Failed to fetch agent tools');
  return res.json();
}


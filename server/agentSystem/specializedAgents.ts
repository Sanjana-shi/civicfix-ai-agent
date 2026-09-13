import {
  searchIssueCategories,
  getAuthorityForCategory,
  validateReportInformation,
  generateComplaint,
  createFollowUpPlan,
  getAuthorityGuidance,
  CategorySearchResult,
  AuthorityLookupResult,
  ValidationResult,
  ComplaintSynthesisResult,
  FollowUpPlanResult,
} from './tools.ts';
import {
  IssueCategory,
  SeverityLevel,
  AgentTraceStep,
  AgentMemory,
  AgentToolCall,
} from '../../src/types.ts';

export interface AgentContext {
  memory: AgentMemory;
  trace: AgentTraceStep[];
  toolsCalled: AgentToolCall[];
}

/**
 * Helper to record a tool call in the execution context
 */
export function recordToolCall(
  context: AgentContext,
  toolName: string,
  args: any,
  outputSummary: string
) {
  context.toolsCalled.push({
    toolName,
    args,
    outputSummary,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Helper to push an agent trace step
 */
export function pushTraceStep(
  context: AgentContext,
  step: Omit<AgentTraceStep, 'id' | 'timestamp'>
) {
  const id = `trace-${context.trace.length + 1}-${Date.now().toString(36)}`;
  context.trace.push({
    ...step,
    id,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 1. Issue Classification Agent
 */
export async function runIssueClassificationAgent(
  context: AgentContext,
  input: { description: string }
): Promise<CategorySearchResult> {
  const toolResult = searchIssueCategories(input.description);
  recordToolCall(
    context,
    'searchIssueCategories',
    { query: input.description.slice(0, 80) },
    `Matched category ${toolResult.category} (${toolResult.categoryDisplay}) with ${toolResult.confidence}% confidence. Keywords: [${toolResult.matchedKeywords.join(', ')}]`
  );

  context.memory.category = toolResult.category;
  context.memory.currentWorkflowStage = 'CLASSIFICATION_COMPLETED';

  pushTraceStep(context, {
    agentName: 'Issue Classification Agent',
    action: 'classify_issue',
    result: `Classified as "${toolResult.categoryDisplay}" (${toolResult.category}) based on linguistic cues [${toolResult.matchedKeywords.join(', ')}].`,
    status: 'completed',
  });

  return toolResult;
}

/**
 * 2. Severity Assessment Agent
 */
export async function runSeverityAssessmentAgent(
  context: AgentContext,
  input: {
    description: string;
    category: IssueCategory;
    landmark?: string;
    address: string;
  }
): Promise<{ severity: SeverityLevel; severityReason: string; whyHighSeverity: string }> {
  const text = `${input.description} ${input.landmark || ''} ${input.address}`.toLowerCase();

  let severity: SeverityLevel = 'MEDIUM';
  let severityReason = 'Standard municipal maintenance issue requiring scheduled operational intervention.';
  let whyHighSeverity = 'Evaluated based on standard municipal hazard criteria.';

  const isCritical =
    text.includes('burst') ||
    text.includes('live wire') ||
    text.includes('severe accident') ||
    text.includes('immediate danger') ||
    text.includes('electric shock') ||
    text.includes('collapse') ||
    text.includes('casualty');

  const isHigh =
    text.includes('accident') ||
    text.includes('danger') ||
    text.includes('school') ||
    text.includes('college') ||
    text.includes('hospital') ||
    text.includes('two-wheeler') ||
    text.includes('skid') ||
    text.includes('urgent') ||
    text.includes('blind spot') ||
    text.includes('overflowing') ||
    text.includes('flooding') ||
    text.includes('elderly') ||
    text.includes('pedestrian');

  const isLow =
    text.includes('minor') ||
    text.includes('slight') ||
    text.includes('faint') ||
    text.includes('small patch');

  if (isCritical) {
    severity = 'CRITICAL';
    severityReason = 'Imminent catastrophic infrastructural hazard posing immediate physical harm or severe public utility collapse.';
    whyHighSeverity = 'Triggered by critical safety markers (structural hazard, open electrical hazard, or water main rupture requiring immediate containment).';
  } else if (isHigh) {
    severity = 'HIGH';
    severityReason = 'High-risk civic hazard in proximity to sensitive public access points (college/school/hospital) or acute vehicular skidding danger.';
    whyHighSeverity = `Based on the citizen's report, this issue creates a direct safety vulnerability (e.g. risk to commuters/two-wheelers or proximity to high footfall institutions), necessitating priority municipal escalation.`;
  } else if (isLow) {
    severity = 'LOW';
    severityReason = 'Non-hazardous aesthetic or minor defect with low immediate disruption to public mobility.';
    whyHighSeverity = 'Defect is minor and not located in a critical transit hazard corridor.';
  } else {
    severity = 'MEDIUM';
    severityReason = 'Active public inconvenience disrupting normal civic access or neighborhood hygiene.';
    whyHighSeverity = 'Moderate operational impact without immediate life-safety peril, scheduled for standard municipal turnaround.';
  }

  context.memory.severity = severity;
  context.memory.currentWorkflowStage = 'SEVERITY_ASSESSED';

  pushTraceStep(context, {
    agentName: 'Severity Assessment Agent',
    action: 'assess_severity',
    result: `Assessed severity as ${severity}. Rationale: ${severityReason}`,
    status: 'completed',
    decisionExplanation: {
      whySeverity: whyHighSeverity,
    },
  });

  return { severity, severityReason, whyHighSeverity };
}

/**
 * 3. Authority Identification Agent
 */
export async function runAuthorityIdentificationAgent(
  context: AgentContext,
  category: IssueCategory,
  city = 'Bengaluru'
): Promise<{ authority: AuthorityLookupResult; whyAuthority: string }> {
  const authority = getAuthorityForCategory(category, city);

  recordToolCall(
    context,
    'getAuthorityForCategory',
    { category, city },
    `Identified statutory authority: ${authority.name} (${authority.department}), Helpline: ${authority.helpline}`
  );

  const whyAuthority = `The issue is categorized under ${category}, which falls under the statutory legal and maintenance jurisdiction of the ${authority.name} (${authority.department}) under the Municipal Public Works charter.`;

  context.memory.authority = `${authority.name} (${authority.department})`;
  context.memory.currentWorkflowStage = 'AUTHORITY_ROUTED';

  pushTraceStep(context, {
    agentName: 'Authority Identification Agent',
    action: 'identify_authority',
    result: `Assigned statutory jurisdiction to ${authority.name} [Dept: ${authority.department}].`,
    status: 'completed',
    decisionExplanation: {
      whyAuthority,
    },
  });

  return { authority, whyAuthority };
}

/**
 * 4. Information Verification Agent
 */
export async function runInformationVerificationAgent(
  context: AgentContext,
  input: {
    description: string;
    address?: string;
    area?: string;
    city?: string;
    landmark?: string;
    hasImages?: boolean;
    userPhone?: string;
  }
): Promise<ValidationResult> {
  const result = validateReportInformation(input);

  recordToolCall(
    context,
    'validateReportInformation',
    {
      hasLandmark: Boolean(input.landmark),
      hasAddress: Boolean(input.address),
      hasImages: Boolean(input.hasImages),
    },
    `Audit completed. Completeness score: ${result.completenessScore}%. Missing items: ${result.missingFields.length}`
  );

  context.memory.missingInformation = result.missingFields;
  context.memory.currentWorkflowStage = 'VERIFICATION_COMPLETED';

  pushTraceStep(context, {
    agentName: 'Information Verification Agent',
    action: 'verify_information',
    result: result.isComplete
      ? 'All essential evidentiary parameters (address, landmark reference, visual evidence) verified.'
      : `Audit flagged ${result.missingFields.length} optional precision item(s) to optimize crew turnaround: ${result.missingFields.join('; ')}`,
    status: result.criticalMissing ? 'warning' : 'completed',
  });

  return result;
}

/**
 * 5. Complaint Generation Agent
 */
export async function runComplaintGenerationAgent(
  context: AgentContext,
  params: {
    description: string;
    address: string;
    area: string;
    city: string;
    landmark?: string;
    category: IssueCategory;
    severity: SeverityLevel;
    authorityName: string;
    departmentName: string;
  }
): Promise<ComplaintSynthesisResult> {
  const complaint = generateComplaint(params);

  recordToolCall(
    context,
    'generateComplaint',
    { category: params.category, severity: params.severity, authority: params.authorityName },
    `Synthesized formal docket "${complaint.title}" with statutory relief prayer.`
  );

  context.memory.complaintDraft = {
    title: complaint.title,
    description: complaint.formalDescription,
    impact: complaint.impactStatement,
    remediation: complaint.requestedAction,
  };
  context.memory.currentWorkflowStage = 'COMPLAINT_SYNTHESIZED';

  pushTraceStep(context, {
    agentName: 'Complaint Generation Agent',
    action: 'generate_complaint',
    result: `Synthesized formal municipal docket titled: "${complaint.title}". Structured into 5 formal grievance clauses.`,
    status: 'completed',
  });

  return complaint;
}

/**
 * 6. Resolution Planning Agent
 */
export async function runResolutionPlanningAgent(
  context: AgentContext,
  params: {
    category: IssueCategory;
    severity: SeverityLevel;
    authorityName: string;
    reportingChannel: string;
    estimatedSlaDays: number;
  }
): Promise<{
  planSteps: { step: number; title: string; description: string }[];
  evidenceChecklist: string[];
  recommendedActions: string[];
  whyPlan: string;
}> {
  const planSteps = [
    {
      step: 1,
      title: 'Citizen Verification & Authorization',
      description: 'Citizen reviews AI-synthesized grievance docket and provides explicit consent for transmission.',
    },
    {
      step: 2,
      title: 'Municipal Docket Transmission',
      description: `Formal grievance dispatched to ${params.authorityName} via ${params.reportingChannel}.`,
    },
    {
      step: 3,
      title: 'Jurisdictional Field Inspection',
      description: `Dispatched field crew inspects physical coordinates within ${params.estimatedSlaDays <= 1 ? '12 hours' : '24-48 hours'}.`,
    },
    {
      step: 4,
      title: 'Work Order Execution & Rectification',
      description: `Target on-site remediation completion within ${params.estimatedSlaDays} days statutory window.`,
    },
    {
      step: 5,
      title: 'Citizen Quality Verification & Closure',
      description: 'Citizen confirms successful defect rectification or triggers automated escalation.',
    },
  ];

  const evidenceChecklist = [
    'Clear wide-angle and close-up photographs showing the defect in physical relation to the roadway or structure',
    'Visible permanent landmark (shop signboard, bus stop, electric pole number, or metro pillar) in the frame',
    'GPS coordinates verified by device location sensor at time of observation',
  ];

  const recommendedActions = [
    'Review the generated complaint document for factual correctness',
    'Authorize docket generation (Human-in-the-Loop approval required)',
    `Track reference ticket status against committed ${params.estimatedSlaDays}-day resolution SLA`,
    `If status remains unacknowledged after 48 hours, trigger the automated Follow-Up Agent for escalation`,
  ];

  const whyPlan = `This 5-phase resolution plan enforces statutory accountability under the Citizen Services Charter, pairing target SLA tracking with milestone-driven citizen verification.`;

  context.memory.actionPlan = recommendedActions;
  context.memory.currentWorkflowStage = 'ACTION_PLAN_READY';

  pushTraceStep(context, {
    agentName: 'Resolution Planning Agent',
    action: 'plan_resolution',
    result: `Constructed ${planSteps.length}-step execution workflow with ${params.estimatedSlaDays}-day resolution target.`,
    status: 'completed',
    decisionExplanation: {
      whyPlan,
    },
  });

  return { planSteps, evidenceChecklist, recommendedActions, whyPlan };
}

/**
 * 7. Follow-Up Agent
 */
export async function runFollowUpAgent(
  context: AgentContext,
  reportId: string,
  existingReport?: any
): Promise<FollowUpPlanResult> {
  const followUpResult = createFollowUpPlan(reportId, existingReport);

  recordToolCall(
    context,
    'createFollowUpPlan',
    { reportId, currentStatus: followUpResult.currentStatus },
    `Evaluated report timeline: ${followUpResult.daysElapsed} days elapsed. SLA Overdue: ${followUpResult.isOverdue}. Urgency: ${followUpResult.urgencyLevel}.`
  );

  pushTraceStep(context, {
    agentName: 'Follow-Up Agent',
    action: 'audit_and_escalate',
    result: `${followUpResult.assessmentSummary} Generated escalation recommendation targeting ${followUpResult.escalationTier.designatedOfficer}.`,
    status: followUpResult.isOverdue ? 'warning' : 'completed',
    decisionExplanation: {
      whyPlan: `Escalation triggered because public infrastructure hazards left unresolved beyond statutory SLA represent compounding liability.`,
    },
  });

  return followUpResult;
}

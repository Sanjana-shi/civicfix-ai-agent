import {
  AgentWorkflowType,
  AgentMemory,
  AgentTraceStep,
  AgentToolCall,
  AgentOrchestrationResult,
  AIAgentAnalysis,
  IssueCategory,
  SeverityLevel,
} from '../../src/types.ts';
import {
  AgentContext,
  pushTraceStep,
  recordToolCall,
  runIssueClassificationAgent,
  runSeverityAssessmentAgent,
  runAuthorityIdentificationAgent,
  runInformationVerificationAgent,
  runComplaintGenerationAgent,
  runResolutionPlanningAgent,
  runFollowUpAgent,
} from './specializedAgents.ts';
import { createReportInDb } from './tools.ts';

export interface OrchestrationInput {
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
}

export class MasterAgentOrchestrator {
  /**
   * Determine the most appropriate workflow based on citizen goal and context.
   */
  public static determineWorkflow(input: OrchestrationInput): AgentWorkflowType {
    if (input.forceWorkflow) return input.forceWorkflow;
    if (input.reportId) return 'STATUS_FOLLOWUP';

    const text = `${input.goal || ''} ${input.description || ''}`.toLowerCase().trim();
    if (
      (text.startsWith('how to') ||
        text.startsWith('who') ||
        text.startsWith('what authority') ||
        text.startsWith('where do i') ||
        text.includes('helpline') ||
        text.includes('guidance')) &&
      (!input.address || input.address.trim().length < 4)
    ) {
      return 'INQUIRY_GUIDANCE';
    }

    return 'FULL_REPORT';
  }

  /**
   * Main agent orchestration entry point
   */
  public static async orchestrate(input: OrchestrationInput): Promise<AgentOrchestrationResult> {
    const rawGoal = input.goal || `Resolve civic issue: ${input.description.slice(0, 70)}`;
    const workflow = this.determineWorkflow(input);

    const memory: AgentMemory = {
      goal: rawGoal,
      workflowType: workflow,
      rawDescription: input.description,
      location: {
        address: input.address || 'Address not specified',
        area: input.area || 'Metro Area',
        city: input.city || 'Bengaluru',
        landmark: input.landmark,
      },
      currentWorkflowStage: 'INITIALIZED',
      humanConfirmationRequired: true,
      humanConfirmed: Boolean(input.humanConfirmed),
    };

    const trace: AgentTraceStep[] = [];
    const toolsCalled: AgentToolCall[] = [];
    const context: AgentContext = { memory, trace, toolsCalled };

    let isFallback = false;
    let fallbackReason = '';

    try {
      // Step 1: Goal Understanding & Orchestrator Planning
      let plan: string[] = [];
      if (workflow === 'FULL_REPORT') {
        plan = [
          'Goal Understanding & Linguistic Entity Extraction',
          'Issue Classification Agent (Taxonomy Matching)',
          'Severity Assessment Agent (Public Hazard & Risk Modeling)',
          'Authority Identification Agent (Statutory Jurisdiction Routing)',
          'Information Verification Agent (Evidentiary Completeness Audit)',
          'Complaint Generation Agent (Structured Formal Grievance Docket)',
          'Resolution Planning Agent (SLA Targets & Milestone Generation)',
        ];
      } else if (workflow === 'INQUIRY_GUIDANCE') {
        plan = [
          'Goal Understanding & Inquiry Parsing',
          'Issue Classification Agent (Category Identification)',
          'Authority Identification Agent (Jurisdiction Lookup)',
          'Authority Guidance Synthesis (Statutory Rights & Helplines)',
        ];
      } else {
        plan = [
          'Goal Understanding & Report Status Audit',
          'Follow-Up Agent (SLA Timeline Evaluation & Escalation Roadmap)',
        ];
      }

      pushTraceStep(context, {
        agentName: 'Master Orchestrator',
        action: 'plan_workflow',
        result: `Goal understood: "${rawGoal}". Selected ${workflow} workflow with ${plan.length} specialized agent steps.`,
        status: 'completed',
      });

      // Execute Workflow
      if (workflow === 'FULL_REPORT') {
        // 1. Issue Classification Agent
        const classification = await runIssueClassificationAgent(context, {
          description: input.description,
        });

        // 2. Severity Assessment Agent
        const severityResult = await runSeverityAssessmentAgent(context, {
          description: input.description,
          category: classification.category,
          landmark: input.landmark,
          address: input.address || '',
        });

        // 3. Authority Identification Agent
        const authorityResult = await runAuthorityIdentificationAgent(
          context,
          classification.category,
          input.city || 'Bengaluru'
        );

        // 4. Information Verification Agent
        const verification = await runInformationVerificationAgent(context, {
          description: input.description,
          address: input.address,
          area: input.area,
          city: input.city,
          landmark: input.landmark,
          hasImages: input.hasImages,
          userPhone: input.userPhone,
        });

        // 5. Complaint Generation Agent
        const complaint = await runComplaintGenerationAgent(context, {
          description: input.description,
          address: input.address || 'Reported Location',
          area: input.area || 'Ward Area',
          city: input.city || 'Bengaluru',
          landmark: input.landmark,
          category: classification.category,
          severity: severityResult.severity,
          authorityName: authorityResult.authority.name,
          departmentName: authorityResult.authority.department,
        });

        // 6. Resolution Planning Agent
        const estimatedSlaDays =
          severityResult.severity === 'CRITICAL'
            ? 1
            : severityResult.severity === 'HIGH'
            ? 2
            : 4;

        const resolutionPlan = await runResolutionPlanningAgent(context, {
          category: classification.category,
          severity: severityResult.severity,
          authorityName: authorityResult.authority.name,
          reportingChannel: complaint.reportingChannel,
          estimatedSlaDays,
        });

        // Construct master analysis
        const analysis: AIAgentAnalysis = {
          category: classification.category,
          category_display: classification.categoryDisplay,
          severity: severityResult.severity,
          severity_reason: severityResult.severityReason,
          why_high_severity: severityResult.whyHighSeverity,
          responsible_authority: authorityResult.authority.name,
          authority_department: authorityResult.authority.department,
          authority_reason: authorityResult.authority.statutoryCharterReason,
          why_this_authority: authorityResult.whyAuthority,
          missing_information: verification.missingFields,
          complaint_title: complaint.title,
          complaint_description: complaint.formalDescription,
          suggested_action: complaint.requestedAction,
          impact_statement: complaint.impactStatement,
          recommended_actions: resolutionPlan.recommendedActions,
          resolution_steps: resolutionPlan.planSteps,
          reporting_channel: complaint.reportingChannel,
          evidence_checklist: resolutionPlan.evidenceChecklist,
          follow_up_recommendation: `If ${authorityResult.authority.name} has not initiated action within 48 hours, launch the automated Follow-Up Agent for escalation.`,
          estimated_sla_days: estimatedSlaDays,
          confidence_score: classification.confidence,
          agent_steps: trace.map((t, idx) => ({
            id: `step-${idx + 1}`,
            phase: idx === 0 ? 'GOAL' : idx === 1 ? 'PLANNING' : idx === 2 ? 'REASONING' : idx === 3 ? 'TOOL_DATA_USE' : idx === 4 ? 'REASONING' : idx === 5 ? 'DECISION' : 'ACTION_PLAN',
            label: t.agentName,
            status: t.status === 'active' ? 'running' : t.status === 'warning' ? 'warning' : 'completed',
            detail: t.result,
            timestamp: t.timestamp,
          })),
          agent_trace: trace,
        };

        const result: AgentOrchestrationResult = {
          goalUnderstood: rawGoal,
          workflowSelected: workflow,
          plan,
          trace,
          memory,
          decisionExplanations: {
            whySeverity: severityResult.whyHighSeverity,
            whyAuthority: authorityResult.whyAuthority,
            whyResolutionPlan: resolutionPlan.whyPlan,
          },
          toolsCalled,
          analysis,
        };

        analysis.orchestration = result;
        return result;
      } else if (workflow === 'STATUS_FOLLOWUP' && input.reportId) {
        // Execute Follow-Up Agent
        const followUp = await runFollowUpAgent(context, input.reportId);

        const analysis: AIAgentAnalysis = {
          category: 'OTHER',
          category_display: 'Follow-Up & Escalation Audit',
          severity: followUp.isOverdue ? 'HIGH' : 'MEDIUM',
          severity_reason: followUp.assessmentSummary,
          responsible_authority: followUp.escalationTier.designatedOfficer,
          authority_department: 'Appellate & Supervisory Oversight',
          authority_reason: followUp.escalationTier.statutoryRight,
          why_this_authority: `Escalated directly to ${followUp.escalationTier.designatedOfficer} due to ticket status: ${followUp.currentStatus}.`,
          missing_information: followUp.additionalEvidenceNeeded,
          complaint_title: `Urgent Escalation Notice: Ticket #${followUp.reportId}`,
          complaint_description: followUp.escalationNoticeDraft,
          suggested_action: `Dispatch formal notice to ${followUp.escalationTier.designatedOfficer}.`,
          impact_statement: `Continued delay beyond statutory turnaround worsens civic safety hazard.`,
          recommended_actions: followUp.recommendedActions,
          reporting_channel: followUp.escalationTier.channel,
          evidence_checklist: followUp.additionalEvidenceNeeded,
          follow_up_recommendation: `Monitor immediate acknowledgment within 24 hours of escalation delivery.`,
          confidence_score: 96,
          agent_trace: trace,
        };

        return {
          goalUnderstood: rawGoal,
          workflowSelected: workflow,
          plan,
          trace,
          memory,
          decisionExplanations: {
            whySeverity: followUp.assessmentSummary,
            whyAuthority: `Assigned to ${followUp.escalationTier.designatedOfficer} as the authorized statutory appellate tier.`,
            whyResolutionPlan: `Milestones scheduled based on ${followUp.daysElapsed} days elapsed since initial docketing.`,
          },
          toolsCalled,
          analysis,
        };
      } else {
        // INQUIRY_GUIDANCE
        const classification = await runIssueClassificationAgent(context, {
          description: input.description,
        });
        const authorityResult = await runAuthorityIdentificationAgent(
          context,
          classification.category,
          input.city || 'Bengaluru'
        );

        const analysis: AIAgentAnalysis = {
          category: classification.category,
          category_display: classification.categoryDisplay,
          severity: 'MEDIUM',
          severity_reason: 'Informational municipal jurisdiction inquiry.',
          responsible_authority: authorityResult.authority.name,
          authority_department: authorityResult.authority.department,
          authority_reason: authorityResult.authority.statutoryCharterReason,
          why_this_authority: authorityResult.whyAuthority,
          missing_information: ['Specific street address or photo if filing an active grievance'],
          complaint_title: `Civic Information: ${classification.categoryDisplay}`,
          complaint_description: `Citizen inquiry regarding ${classification.categoryDisplay} in ${input.city || 'Bengaluru'}. Official redressal channel: ${authorityResult.authority.name}.`,
          suggested_action: `Contact ${authorityResult.authority.helpline} or submit a formal report via CivicFix AI.`,
          impact_statement: 'Empowering citizen with immediate jurisdictional transparency.',
          recommended_actions: [
            `Submit a formal report with location coordinates to generate an official docket`,
            `Call the direct helpline: ${authorityResult.authority.helpline}`,
            `Access the municipal web portal: ${authorityResult.authority.portalUrl}`,
          ],
          reporting_channel: `${authorityResult.authority.name} Helpline ${authorityResult.authority.helpline}`,
          evidence_checklist: ['Photo of infrastructure defect', 'Nearby landmark'],
          follow_up_recommendation: 'You can submit this grievance anytime to auto-route it to field engineers.',
          confidence_score: classification.confidence,
          agent_trace: trace,
        };

        return {
          goalUnderstood: rawGoal,
          workflowSelected: workflow,
          plan,
          trace,
          memory,
          decisionExplanations: {
            whySeverity: 'Informational queries default to standard priority.',
            whyAuthority: authorityResult.whyAuthority,
            whyResolutionPlan: 'Direct connection to statutory department helplines.',
          },
          toolsCalled,
          analysis,
        };
      }
    } catch (err: any) {
      console.error('Agent Orchestration Error, gracefully activating fallback:', err);
      isFallback = true;
      fallbackReason = 'AI analysis is temporarily unavailable. Your report has been saved and can be reviewed manually.';

      // Fallback response with clean default values
      const fallbackAnalysis: AIAgentAnalysis = {
        category: 'OTHER',
        category_display: 'General Civic Grievance',
        severity: 'MEDIUM',
        severity_reason: 'Fallback baseline priority assigned for manual review.',
        why_high_severity: 'Assigned standard medium priority awaiting field inspection.',
        responsible_authority: 'Central Citizen Grievance Redressal Cell',
        authority_department: 'Public Grievance Coordination',
        authority_reason: 'Central municipal grievance bureau for unclassified submissions.',
        why_this_authority: 'Routed to central bureau for manual inspection and verification.',
        missing_information: ['Visual photo verification'],
        complaint_title: `Citizen Grievance at ${input.address || 'Local Ward'}`,
        complaint_description: input.description,
        suggested_action: 'Manual municipal triage and site survey.',
        impact_statement: 'Public convenience affected.',
        recommended_actions: ['Manual verification by municipal desk officer'],
        reporting_channel: 'Municipal Helpdesk 1905',
        evidence_checklist: ['Photographic evidence'],
        follow_up_recommendation: 'Review manually within 48 hours.',
        confidence_score: 75,
      };

      return {
        goalUnderstood: rawGoal,
        workflowSelected: workflow,
        plan: ['Manual Triage Fallback'],
        trace: [
          {
            id: 'fallback-trace',
            agentName: 'Master Orchestrator',
            action: 'fallback_handler',
            result: fallbackReason,
            status: 'warning',
            timestamp: new Date().toISOString(),
          },
        ],
        memory,
        decisionExplanations: {
          whySeverity: 'Standard operational queue priority.',
          whyAuthority: 'Central grievance bureau for manual triage.',
          whyResolutionPlan: 'Manual dispatch upon review.',
        },
        toolsCalled,
        analysis: fallbackAnalysis,
        isFallback,
        fallbackReason,
      };
    }
  }
}

import { db } from '../db.ts';
import { IssueCategory, SeverityLevel, ReportStatus, CivicAuthority } from '../../src/types.ts';

export interface CategorySearchResult {
  category: IssueCategory;
  categoryDisplay: string;
  confidence: number;
  matchedKeywords: string[];
  departmentJurisdiction: string;
}

export interface AuthorityLookupResult {
  authorityId: string;
  name: string;
  department: string;
  jurisdiction: string;
  helpline: string;
  contactEmail: string;
  portalUrl: string;
  slaHours: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  statutoryCharterReason: string;
}

export interface ValidationResult {
  isComplete: boolean;
  completenessScore: number;
  missingFields: string[];
  recommendations: string[];
  criticalMissing: boolean;
}

export interface ComplaintSynthesisResult {
  title: string;
  formalDescription: string;
  impactStatement: string;
  requestedAction: string;
  reportingChannel: string;
}

export interface ReportStatusResult {
  reportId: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  targetResolutionDate: string | null;
  daysElapsed: number;
  hoursElapsed: number;
  isOverdue: boolean;
  daysOverdue: number;
  assignedAuthorityName: string;
  assignedAuthorityDept: string;
  originalDescription: string;
  category: IssueCategory;
  severity: SeverityLevel;
}

export interface FollowUpPlanResult {
  reportId: string;
  currentStatus: ReportStatus;
  urgencyLevel: 'NORMAL' | 'URGENT' | 'CRITICAL_ESCALATION';
  daysElapsed: number;
  isOverdue: boolean;
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
}

const CATEGORY_DEFINITIONS: Record<IssueCategory, { name: string; dept: string; keywords: string[] }> = {
  ROAD_POTHOLE: {
    name: 'Roads & Potholes',
    dept: 'Civil Works & Road Engineering',
    keywords: ['pothole', 'road', 'asphalt', 'crater', 'tarmac', 'bitumen', 'pavement', 'sinkhole', 'divider', 'cobblestone', 'patch'],
  },
  GARBAGE: {
    name: 'Waste Management & Sanitation',
    dept: 'Public Health & Urban Sanitation',
    keywords: ['garbage', 'waste', 'trash', 'dump', 'litter', 'bin', 'stench', 'odor', 'debris', 'decay', 'sanitation', 'cleanliness'],
  },
  STREETLIGHT: {
    name: 'Streetlights & Electrical',
    dept: 'Street Lighting & Urban Power Grid',
    keywords: ['light', 'streetlight', 'dark', 'lamp', 'bulb', 'pole', 'illumination', 'fixture', 'blackout', 'wire', 'luminaire'],
  },
  WATER_LEAKAGE: {
    name: 'Water Supply & Pipelines',
    dept: 'Potable Water Distribution & Pipe Infrastructure',
    keywords: ['water', 'leak', 'burst', 'pipe', 'potable', 'supply', 'gushing', 'faucet', 'valve', 'main', 'spill'],
  },
  DRAINAGE: {
    name: 'Drainage & Stormwater',
    dept: 'Flood Prevention & Underground Drainage Systems',
    keywords: ['drain', 'drainage', 'gutter', 'clog', 'waterlog', 'flood', 'sewage', 'overflow', 'manhole', 'culvert', 'silt'],
  },
  TRAFFIC_SAFETY: {
    name: 'Traffic Safety & Signals',
    dept: 'Traffic Engineering & Pedestrian Protection',
    keywords: ['traffic', 'signal', 'speed', 'zebra', 'signboard', 'barrier', 'crossing', 'blinker', 'junction', 'divider', 'pedestrian'],
  },
  PUBLIC_PROPERTY: {
    name: 'Public Property & Infrastructure',
    dept: 'Municipal Public Assets & Parks Division',
    keywords: ['park', 'bench', 'footpath', 'wall', 'bus shelter', 'fence', 'public toilet', 'railing', 'statue', 'garden'],
  },
  OTHER: {
    name: 'Other Civic Grievance',
    dept: 'Public Grievance Coordination',
    keywords: ['noise', 'encroachment', 'tree', 'branch', 'stray', 'nuisance', 'civic'],
  },
};

/**
 * Tool 1: searchIssueCategories
 * Searches and ranks municipal grievance categories based on citizen description.
 */
export function searchIssueCategories(query: string): CategorySearchResult {
  const lower = query.toLowerCase();
  let bestCategory: IssueCategory = 'OTHER';
  let highestScore = 0;
  let matchedKeywords: string[] = [];

  for (const [cat, def] of Object.entries(CATEGORY_DEFINITIONS) as [IssueCategory, typeof CATEGORY_DEFINITIONS[IssueCategory]][]) {
    const hits = def.keywords.filter((kw) => lower.includes(kw));
    const score = hits.length * 15 + (lower.includes(def.name.toLowerCase()) ? 30 : 0);
    if (score > highestScore) {
      highestScore = score;
      bestCategory = cat;
      matchedKeywords = hits;
    }
  }

  if (highestScore === 0) {
    bestCategory = 'OTHER';
    matchedKeywords = ['civic_inquiry'];
  }

  const confidence = Math.min(98, Math.max(70, 70 + matchedKeywords.length * 7));

  return {
    category: bestCategory,
    categoryDisplay: CATEGORY_DEFINITIONS[bestCategory].name,
    confidence,
    matchedKeywords,
    departmentJurisdiction: CATEGORY_DEFINITIONS[bestCategory].dept,
  };
}

/**
 * Tool 2: getAuthorityForCategory
 * Looks up the statutory municipal authority responsible for the specific issue category.
 */
export function getAuthorityForCategory(category: IssueCategory, city = 'Bengaluru'): AuthorityLookupResult {
  const authorities = db.prepare('SELECT * FROM authorities').all() as any[];
  let matched = authorities.find((a) => {
    try {
      const cats = JSON.parse(a.categoriesHandled || '[]');
      return cats.includes(category);
    } catch {
      return false;
    }
  });

  if (!matched) {
    matched = authorities.find((a) => a.id === 'AUTH-GEN-07') || authorities[0];
  }

  const slaHours = JSON.parse(matched.slaHours || '{"LOW":72,"MEDIUM":48,"HIGH":24,"CRITICAL":12}');

  const RATIONALE_BY_CAT: Record<IssueCategory, string> = {
    ROAD_POTHOLE: 'Statutory mandate under Municipal Highways & Arterial Pavement Maintenance Code, holding sole right-of-way engineering jurisdiction.',
    GARBAGE: 'Solid Waste Management Rules 2016 statutory mandate for daily conservancy, landfill transport, and public sanitation zoning.',
    STREETLIGHT: 'Municipal Electricity Supply & Public Lighting Charter holding operational control over poles, cabling, and transformer feeds.',
    WATER_LEAKAGE: 'Metropolitan Water Supply Act granting statutory rights over potable pipeline networks, feeder mains, and pressure regulating valves.',
    DRAINAGE: 'Urban Stormwater & Flood Abatement Division statutory charter for major nallahs, culverts, and roadside runoff channels.',
    TRAFFIC_SAFETY: 'Joint Traffic Police & Municipal Engineering Directorate statutory mandate for pedestrian safety signals and physical road barricades.',
    PUBLIC_PROPERTY: 'Municipal Asset Protection Directorate governing public parks, pedestrian plazas, and civil fixtures.',
    OTHER: 'Central Citizen Grievance Bureau for cross-departmental coordination and ward level triage.',
  };

  return {
    authorityId: matched.id,
    name: matched.name,
    department: matched.department,
    jurisdiction: `${matched.jurisdiction} (${city})`,
    helpline: matched.helpline || '1905',
    contactEmail: matched.contactEmail || 'grievance@municipal.gov.in',
    portalUrl: matched.portalUrl || 'https://civicportal.gov.in',
    slaHours,
    statutoryCharterReason: RATIONALE_BY_CAT[category] || 'General municipal civic charter.',
  };
}

/**
 * Tool 3: validateReportInformation
 * Audits description, landmark, address, and evidentiary completeness.
 */
export function validateReportInformation(input: {
  description: string;
  address?: string;
  area?: string;
  city?: string;
  landmark?: string;
  hasImages?: boolean;
  userPhone?: string;
}): ValidationResult {
  const missing: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  if (!input.landmark || input.landmark.trim().length < 3) {
    missing.push('Specific landmark or cross-junction to guide rapid field inspection crews');
    recommendations.push('Add a prominent landmark (e.g., opposite metro pillar #142, near community park)');
    score -= 15;
  }

  if (!input.address || input.address.trim().length < 8) {
    missing.push('Precise street address with building or road name');
    recommendations.push('Provide specific house number, lane name, or cross street');
    score -= 20;
  }

  if (!input.hasImages) {
    missing.push('Photographic evidence of defect');
    recommendations.push('Upload at least one daytime/nighttime photo to fast-track approval without preliminary field survey delay');
    score -= 15;
  }

  if (input.description && input.description.trim().length < 25) {
    missing.push('Detailed description of hazard dimensions or duration');
    recommendations.push('State whether this hazard has persisted for days or occurred suddenly');
    score -= 10;
  }

  const criticalMissing = !input.address || input.address.trim().length < 5;

  return {
    isComplete: missing.length === 0,
    completenessScore: Math.max(30, score),
    missingFields: missing,
    recommendations,
    criticalMissing,
  };
}

/**
 * Tool 4: generateComplaint
 * Synthesizes a formal municipal complaint document from raw citizen input and agent findings.
 */
export function generateComplaint(params: {
  description: string;
  address: string;
  area: string;
  city: string;
  landmark?: string;
  category: IssueCategory;
  severity: SeverityLevel;
  authorityName: string;
  departmentName: string;
}): ComplaintSynthesisResult {
  const categoryName = CATEGORY_DEFINITIONS[params.category]?.name || 'Civic Grievance';
  const cleanDesc = params.description.trim();
  const title = `[URGENT: ${params.severity}] ${categoryName} at ${params.area}, ${params.city}`;

  const impactMap: Record<IssueCategory, string> = {
    ROAD_POTHOLE: 'Imminent vehicular crash risk, severe shock absorber damage, and acute danger to two-wheeler commuters in heavy traffic conditions.',
    GARBAGE: 'Public health crisis, uncontrolled vector breeding (mosquitoes/rodents), and severe environmental contamination impacting neighboring residents.',
    STREETLIGHT: 'Complete nocturnal darkness creating acute vulnerability for pedestrians, women commuters, and increased risk of petty crime.',
    WATER_LEAKAGE: 'Extensive waste of treated potable water, localized sub-base soil erosion beneath road asphalt, and drop in residential water pressure.',
    DRAINAGE: 'Severe stagnant waterlogging, foul sewage overflow into pedestrian footpaths, and immediate waterborne disease threat.',
    TRAFFIC_SAFETY: 'Acute risk of pedestrian knock-downs, chaotic traffic congestion, and severe vehicular collisions at unmanaged intersection.',
    PUBLIC_PROPERTY: 'Degradation of shared public amenity and physical injury hazard from dilapidated public infrastructure.',
    OTHER: 'Public disruption and diminished urban living standards requiring prompt municipal remediation.',
  };

  const remediationMap: Record<IssueCategory, string> = {
    ROAD_POTHOLE: 'Immediate deployment of hot-mix bitumen compaction crew to excavate, clean, and patch the road surface to level grade.',
    GARBAGE: 'Dispatch of heavy tipper compaction vehicle to clear refuse heap, followed by chemical bleaching/disinfection of the site.',
    STREETLIGHT: 'Dispatch of hydraulic hoist van to inspect cable terminal faults, replace defective LED drivers, and restore grid circuit.',
    WATER_LEAKAGE: 'Depressurize supply segment, excavate pipe junction, and install high-pressure cast ductile iron mechanical repair clamp.',
    DRAINAGE: 'Deploy super-sucker suction desilting truck to extract trapped sludge and restore gravity stormwater flow.',
    TRAFFIC_SAFETY: 'Emergency deployment of traffic wardens, replacement of damaged blinker/signal modules, and repainting of pedestrian zebra markings.',
    PUBLIC_PROPERTY: 'Conduct civil safety audit and schedule restoration or structural replacement of damaged public amenity.',
    OTHER: 'Dispatch designated municipal field inspector for on-site assessment and issuance of work order.',
  };

  const formalDescription = `FORMAL MUNICIPAL CITIZEN GRIEVANCE DOCKET\n` +
    `Filed Under: Right to Public Services Charter\n` +
    `Category: ${categoryName} (${params.category})\n` +
    `Assigned Authority: ${params.authorityName} (${params.departmentName})\n` +
    `Assessed Severity: ${params.severity}\n\n` +
    `1. LOCATION SPECIFICATION:\n` +
    `Street Address: ${params.address}\n` +
    `Ward / Area: ${params.area}\n` +
    `City: ${params.city}\n` +
    `Landmark / Reference: ${params.landmark || 'Identified along main transit spine'}\n\n` +
    `2. CITIZEN GRIEVANCE OBSERVATION:\n` +
    `"${cleanDesc}"\n\n` +
    `3. PUBLIC IMPACT & HAZARD EVALUATION:\n` +
    `${impactMap[params.category] || 'General municipal inconvenience.'}\n\n` +
    `4. PRAYER FOR RELIEF & REQUIRED INTERVENTION:\n` +
    `${remediationMap[params.category] || 'Prompt municipal inspection and remediation.'}\n\n` +
    `5. COMPLIANCE MANDATE:\n` +
    `The assigned department is requested to register this docket and initiate rectification within statutory SLA hours.`;

  return {
    title,
    formalDescription,
    impactStatement: impactMap[params.category] || 'General civic disruption.',
    requestedAction: remediationMap[params.category] || 'Urgent municipal site inspection and repair.',
    reportingChannel: `${params.authorityName} Integrated Redressal Portal & Central Helpline`,
  };
}

/**
 * Tool 5: createReport
 * Persists report and registers initial timeline milestones into SQLite.
 */
export function createReportInDb(data: {
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
  category: IssueCategory;
  severity: SeverityLevel;
  authorityId: string;
  authorityName: string;
  authorityDept: string;
  aiAnalysis: any;
  slaDays?: number;
}) {
  const reportNumber = Math.floor(1000 + Math.random() * 9000);
  const id = `CFX-2026-${reportNumber}`;
  const now = new Date().toISOString();
  const slaDays = data.slaDays || (data.severity === 'CRITICAL' ? 1 : data.severity === 'HIGH' ? 2 : 4);
  const targetDate = new Date(Date.now() + slaDays * 86400000).toISOString();

  db.prepare(`
    INSERT INTO reports (
      id, userId, userName, userPhone, userEmail, originalDescription,
      address, city, area, landmark, latitude, longitude, evidenceImages,
      category, severity, status, assignedAuthorityId, assignedAuthorityName,
      assignedAuthorityDept, aiAnalysis, createdAt, updatedAt, targetResolutionDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.userId || 'usr_citizen_01',
    data.userName || 'Citizen Reporter',
    data.userPhone || '',
    data.userEmail || '',
    data.description,
    data.address,
    data.city || 'Bengaluru',
    data.area || 'Local Ward',
    data.landmark || '',
    data.latitude || null,
    data.longitude || null,
    JSON.stringify(data.evidenceImages || []),
    data.category,
    data.severity,
    'UNDER_REVIEW',
    data.authorityId,
    data.authorityName,
    data.authorityDept,
    JSON.stringify(data.aiAnalysis || {}),
    now,
    now,
    targetDate
  );

  db.prepare(`
    INSERT INTO status_history (id, reportId, status, timestamp, changedBy, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    `${id}-h-1`,
    id,
    'SUBMITTED',
    now,
    'Master Agent Orchestrator',
    'Citizen goal processed and grievance docket generated.'
  );

  db.prepare(`
    INSERT INTO status_history (id, reportId, status, timestamp, changedBy, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    `${id}-h-2`,
    id,
    'UNDER_REVIEW',
    now,
    'Authority Routing Engine',
    `Routed to ${data.authorityName} (${data.authorityDept}) with target resolution within ${slaDays} days.`
  );

  const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
  return {
    ...row,
    evidenceImages: JSON.parse(row.evidenceImages || '[]'),
    aiAnalysis: row.aiAnalysis ? JSON.parse(row.aiAnalysis) : null,
  };
}

/**
 * Tool 6: getReportStatus
 * Retrieves report status, timeline, and SLA calculation.
 */
export function getReportStatus(reportId: string): ReportStatusResult | null {
  const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId) as any;
  if (!row) return null;

  const now = Date.now();
  const created = new Date(row.createdAt).getTime();
  const hoursElapsed = Math.max(0, Math.round((now - created) / (1000 * 60 * 60)));
  const daysElapsed = Math.max(0, Math.round(hoursElapsed / 24));

  let isOverdue = false;
  let daysOverdue = 0;

  if (row.targetResolutionDate && row.status !== 'RESOLVED') {
    const target = new Date(row.targetResolutionDate).getTime();
    if (now > target) {
      isOverdue = true;
      daysOverdue = Math.ceil((now - target) / (1000 * 60 * 60 * 24));
    }
  }

  return {
    reportId: row.id,
    status: row.status as ReportStatus,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    targetResolutionDate: row.targetResolutionDate,
    daysElapsed,
    hoursElapsed,
    isOverdue,
    daysOverdue,
    assignedAuthorityName: row.assignedAuthorityName,
    assignedAuthorityDept: row.assignedAuthorityDept,
    originalDescription: row.originalDescription,
    category: row.category as IssueCategory,
    severity: row.severity as SeverityLevel,
  };
}

/**
 * Tool 7: getAuthorityGuidance
 * Retrieves statutory guidance, escalation rights, and procedure for a given category.
 */
export function getAuthorityGuidance(category: IssueCategory, query = ''): {
  statutoryRight: string;
  charterSla: string;
  recommendedNextStep: string;
  escalationOfficer: string;
} {
  const GUIDANCE: Record<IssueCategory, any> = {
    ROAD_POTHOLE: {
      statutoryRight: 'Citizens have a statutory right to pothole-free safe public highways under the Municipal Corporations Act.',
      charterSla: 'Emergency road hazards must receive temporary cold patch within 24-48 hours; full resurfacing within 7 days.',
      recommendedNextStep: 'File reference docket number with the Ward Assistant Executive Engineer (Roads Division).',
      escalationOfficer: 'Superintending Engineer (Infrastructure & Major Roads)',
    },
    GARBAGE: {
      statutoryRight: 'Municipal Solid Waste Management Mandate ensures daily garbage collection and clearance of secondary dumping points.',
      charterSla: 'Garbage Vulnerable Points (GVPs) must be cleared within 12-24 hours of citizen notification.',
      recommendedNextStep: 'Contact Ward Health Inspector and register on the Swachhata Citizen App.',
      escalationOfficer: 'Joint Commissioner (Solid Waste Management)',
    },
    STREETLIGHT: {
      statutoryRight: 'Public Safety Illumination Charter mandates functional nocturnal lighting on all designated municipal streets.',
      charterSla: 'Blown luminaire or fixture circuit must be rectified within 24 to 48 hours.',
      recommendedNextStep: 'Quote the nearest pole numbering tag to the Electricity Distribution Substation.',
      escalationOfficer: 'Executive Engineer (Electrical Undertaking)',
    },
    WATER_LEAKAGE: {
      statutoryRight: 'Conservation of Public Water & Essential Utility Mandate prioritizes transmission leak plugging.',
      charterSla: 'Distribution main bursts must be isolated within 4 hours; repair sleeve fitted within 18 hours.',
      recommendedNextStep: 'Call 24x7 Water Leakage Rapid Response Control Room.',
      escalationOfficer: 'Chief Engineer (Water Transmission & Quality Assurance)',
    },
    DRAINAGE: {
      statutoryRight: 'Right to Safe Sanitation and Flood Mitigation ensures periodic desilting of roadside culverts.',
      charterSla: 'Sewage backflow or road waterlogging must be desilted mechanically within 24 hours.',
      recommendedNextStep: 'Request deployment of suction jetting machine via Ward Drainage Control Unit.',
      escalationOfficer: 'Chief Engineer (Stormwater Drains & River Valley)',
    },
    TRAFFIC_SAFETY: {
      statutoryRight: 'Pedestrian and Road User Safety Code ensures calibrated signals and safe pedestrian crossways.',
      charterSla: 'Defective blinkers/signals must receive emergency technical diagnosis within 12 hours.',
      recommendedNextStep: 'Alert Traffic Management Centre and Ward Traffic Police Inspector.',
      escalationOfficer: 'Deputy Commissioner of Police (Traffic)',
    },
    PUBLIC_PROPERTY: {
      statutoryRight: 'Maintenance of Public Amenities & Parks Act.',
      charterSla: 'Inspection within 3 business days; structural repair within 14 days.',
      recommendedNextStep: 'Submit physical inspection request to Assistant Director of Horticulture & Public Works.',
      escalationOfficer: 'Zonal Chief Engineer',
    },
    OTHER: {
      statutoryRight: 'Right to Timely Redressal of Citizen Grievances Act.',
      charterSla: 'First acknowledgment within 24 hours; initial resolution review within 5 business days.',
      recommendedNextStep: 'Submit reference to Municipal Public Grievance Ombudsman.',
      escalationOfficer: 'Municipal Additional Commissioner (Administration)',
    },
  };

  return GUIDANCE[category] || GUIDANCE.OTHER;
}

/**
 * Tool 8: createFollowUpPlan
 * Analyzes report progress, SLA compliance, and generates actionable escalation strategy.
 */
export function createFollowUpPlan(reportId: string, currentReport?: any): FollowUpPlanResult {
  const statusInfo = getReportStatus(reportId);
  const report = currentReport || (statusInfo ? {
    id: statusInfo.reportId,
    status: statusInfo.status,
    category: statusInfo.category,
    severity: statusInfo.severity,
    assignedAuthorityName: statusInfo.assignedAuthorityName,
    assignedAuthorityDept: statusInfo.assignedAuthorityDept,
    originalDescription: statusInfo.originalDescription,
    createdAt: statusInfo.createdAt,
    targetResolutionDate: statusInfo.targetResolutionDate,
    isOverdue: statusInfo.isOverdue,
    daysElapsed: statusInfo.daysElapsed,
    daysOverdue: statusInfo.daysOverdue,
  } : null);

  if (!report) {
    throw new Error(`Report with id ${reportId} not found`);
  }

  const daysElapsed = statusInfo ? statusInfo.daysElapsed : 2;
  const isOverdue = statusInfo ? statusInfo.isOverdue : false;
  const daysOverdue = statusInfo ? statusInfo.daysOverdue : 0;
  const category: IssueCategory = report.category || 'ROAD_POTHOLE';
  const guidance = getAuthorityGuidance(category);

  let urgencyLevel: 'NORMAL' | 'URGENT' | 'CRITICAL_ESCALATION' = 'NORMAL';
  if (isOverdue && daysOverdue > 2) {
    urgencyLevel = 'CRITICAL_ESCALATION';
  } else if (isOverdue || daysElapsed >= 2) {
    urgencyLevel = 'URGENT';
  }

  let tierName = 'Tier 1: Ward Level Field Follow-Up';
  let designatedOfficer = `Ward Assistant Executive Engineer (${report.assignedAuthorityDept})`;
  let statutoryRight = guidance.statutoryRight;

  if (urgencyLevel === 'CRITICAL_ESCALATION') {
    tierName = 'Tier 3: Statutory Ombudsman & Public Services Appellate';
    designatedOfficer = guidance.escalationOfficer;
  } else if (urgencyLevel === 'URGENT') {
    tierName = 'Tier 2: Zonal Executive Directorate';
    designatedOfficer = `Zonal Joint Commissioner (${report.assignedAuthorityName})`;
  }

  const additionalEvidenceNeeded: string[] = [
    'Recent timestamped photograph showing current unresolved state at the exact coordinates',
    'Logged dates and times of peak hazard (e.g. school hours, dusk lighting failure, water surge)',
    'Neighbor or community co-signers affirming persistent disruption',
  ];

  const recommendedActions = [
    `Reference docket ID ${reportId} directly with ${designatedOfficer}`,
    isOverdue
      ? `Cite SLA breach (${daysOverdue} days past committed target date)`
      : `Verify ticket dispatch on the ${report.assignedAuthorityName} dispatch log`,
    'Transmit follow-up notice via formal citizen grievance portal',
    `If unaddressed within 48 hours, invoke formal appellate under Citizen Charter`,
  ];

  const escalationNoticeDraft = `FORMAL ESCALATION NOTICE: UNRESOLVED CIVIC GRIEVANCE\n` +
    `Reference Docket ID: ${report.id}\n` +
    `To: ${designatedOfficer}\n` +
    `Department: ${report.assignedAuthorityDept}, ${report.assignedAuthorityName}\n` +
    `Subject: Urgent Notice of Overdue Grievance Redressal — Docket #${report.id}\n\n` +
    `Respected Sir/Madam,\n\n` +
    `I am writing to draw your urgent attention to civic grievance ticket #${report.id}, originally lodged on ${new Date(report.createdAt).toLocaleDateString()}.\n\n` +
    `Issue Domain: ${CATEGORY_DEFINITIONS[category]?.name || category}\n` +
    `Location: ${report.address || report.area || 'Reported Location'}\n` +
    `Current Docket Status: ${report.status} (Days Elapsed: ${daysElapsed})\n` +
    `${isOverdue ? `CRITICAL NOTE: Statutory SLA lapsed ${daysOverdue} days ago without ground remediation.` : 'Status remains pending inspection.'}\n\n` +
    `Citizen Observation:\n"${report.originalDescription?.slice(0, 200)}..."\n\n` +
    `Under the Citizen Charter and Right to Public Services, citizens are entitled to prompt remediation of hazardous infrastructure defects. Continued delay increases public hazard and safety liability.\n\n` +
    `Kindly direct the concerned engineering squad for immediate on-site intervention and provide a formal compliance update within 24 hours.\n\n` +
    `Respectfully submitted,\nCitizen Complainant (via CivicFix AI Platform)`;

  return {
    reportId: report.id,
    currentStatus: report.status,
    urgencyLevel,
    daysElapsed,
    isOverdue,
    assessmentSummary: isOverdue
      ? `SLA Breach Detected: Resolution is ${daysOverdue} day(s) overdue. Escalation to ${designatedOfficer} is strongly advised.`
      : `Ticket is within normal operational window (${daysElapsed} days elapsed). Routine status monitoring and evidence refresh advised.`,
    recommendedActions,
    additionalEvidenceNeeded,
    escalationTier: {
      tierName,
      designatedOfficer,
      channel: `Official Redressal Appellate & ${report.assignedAuthorityName} Helpline`,
      statutoryRight,
    },
    escalationNoticeDraft,
  };
}

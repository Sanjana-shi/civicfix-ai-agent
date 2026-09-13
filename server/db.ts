import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.join(process.cwd(), 'civicfix.db');

// Ensure database file directory exists
const db = new DatabaseSync(DB_PATH);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    city TEXT,
    preferredLanguage TEXT DEFAULT 'English',
    role TEXT DEFAULT 'citizen',
    avatar TEXT,
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS authorities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    categoriesHandled TEXT NOT NULL,
    contactEmail TEXT,
    helpline TEXT,
    portalUrl TEXT,
    slaHours TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    userName TEXT NOT NULL,
    userPhone TEXT,
    userEmail TEXT,
    originalDescription TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    landmark TEXT,
    latitude REAL,
    longitude REAL,
    evidenceImages TEXT,
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT NOT NULL,
    assignedAuthorityId TEXT NOT NULL,
    assignedAuthorityName TEXT NOT NULL,
    assignedAuthorityDept TEXT NOT NULL,
    aiAnalysis TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    targetResolutionDate TEXT
  );

  CREATE TABLE IF NOT EXISTS status_history (
    id TEXT PRIMARY KEY,
    reportId TEXT NOT NULL,
    status TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    changedBy TEXT NOT NULL,
    note TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS report_comments (
    id TEXT PRIMARY KEY,
    reportId TEXT NOT NULL,
    authorName TEXT NOT NULL,
    authorRole TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );
`);

// Seed initial authorities
const authorityCount = (db.prepare('SELECT COUNT(*) as count FROM authorities').get() as { count: number }).count;
if (authorityCount === 0) {
  const authoritiesSeed = [
    {
      id: 'AUTH-ENG-01',
      name: 'Road & Municipal Infrastructure Directorate',
      department: 'Civil Works & Road Engineering',
      jurisdiction: 'Greater Municipal Metropolitan Region',
      categoriesHandled: JSON.stringify(['ROAD_POTHOLE', 'PUBLIC_PROPERTY']),
      contactEmail: 'roads.grievance@municipal.gov.in',
      helpline: '1800-425-7623',
      portalUrl: 'https://roads.civicportal.gov.in',
      slaHours: JSON.stringify({ LOW: 168, MEDIUM: 96, HIGH: 48, CRITICAL: 24 }),
    },
    {
      id: 'AUTH-SWM-02',
      name: 'Solid Waste Management & Sanitation Board',
      department: 'Public Health & Urban Sanitation',
      jurisdiction: 'Greater Municipal Metropolitan Region',
      categoriesHandled: JSON.stringify(['GARBAGE']),
      contactEmail: 'sanitation.clean@municipal.gov.in',
      helpline: '1800-425-7927',
      portalUrl: 'https://cleanwaste.civicportal.gov.in',
      slaHours: JSON.stringify({ LOW: 72, MEDIUM: 48, HIGH: 24, CRITICAL: 12 }),
    },
    {
      id: 'AUTH-ELEC-03',
      name: 'Municipal Electrical & Lighting Authority',
      department: 'Street Lighting & Urban Power Grid',
      jurisdiction: 'Metropolitan Electricity Supply Undertaking',
      categoriesHandled: JSON.stringify(['STREETLIGHT']),
      contactEmail: 'streetlights@urbanpower.gov.in',
      helpline: '1912',
      portalUrl: 'https://lightgrid.civicportal.gov.in',
      slaHours: JSON.stringify({ LOW: 96, MEDIUM: 48, HIGH: 24, CRITICAL: 12 }),
    },
    {
      id: 'AUTH-WATER-04',
      name: 'Water Supply & Sewerage Board',
      department: 'Potable Water Distribution & Pipe Infrastructure',
      jurisdiction: 'Metro Water Supply Zone',
      categoriesHandled: JSON.stringify(['WATER_LEAKAGE']),
      contactEmail: 'waterleak.alert@metrowater.gov.in',
      helpline: '1800-425-9283',
      portalUrl: 'https://metrowater.civicportal.gov.in',
      slaHours: JSON.stringify({ LOW: 72, MEDIUM: 36, HIGH: 18, CRITICAL: 8 }),
    },
    {
      id: 'AUTH-DRAIN-05',
      name: 'Stormwater & Drainage Maintenance Division',
      department: 'Flood Prevention & Underground Drainage Systems',
      jurisdiction: 'Greater Municipal Stormwater Network',
      categoriesHandled: JSON.stringify(['DRAINAGE']),
      contactEmail: 'drainage.support@municipal.gov.in',
      helpline: '1800-425-3724',
      portalUrl: 'https://stormdrain.civicportal.gov.in',
      slaHours: JSON.stringify({ LOW: 96, MEDIUM: 48, HIGH: 24, CRITICAL: 12 }),
    },
    {
      id: 'AUTH-TRAF-06',
      name: 'Traffic Safety & Urban Mobility Directorate',
      department: 'Traffic Engineering & Pedestrian Protection',
      jurisdiction: 'City Traffic Police & Municipal Mobility Wing',
      categoriesHandled: JSON.stringify(['TRAFFIC_SAFETY']),
      contactEmail: 'trafficsafety@citypolice.gov.in',
      helpline: '103',
      portalUrl: 'https://trafficsafety.civicportal.gov.in',
      slaHours: JSON.stringify({ LOW: 72, MEDIUM: 48, HIGH: 24, CRITICAL: 12 }),
    },
    {
      id: 'AUTH-GEN-07',
      name: 'Central Citizen Grievance Redressal Cell',
      department: 'Public Grievance Coordination',
      jurisdiction: 'All Municipal Wards',
      categoriesHandled: JSON.stringify(['OTHER', 'PUBLIC_PROPERTY']),
      contactEmail: 'publicgrievance@municipal.gov.in',
      helpline: '1905',
      portalUrl: 'https://grievance.civicportal.gov.in',
      slaHours: JSON.stringify({ LOW: 120, MEDIUM: 72, HIGH: 48, CRITICAL: 24 }),
    },
  ];

  const stmt = db.prepare(`
    INSERT INTO authorities (id, name, department, jurisdiction, categoriesHandled, contactEmail, helpline, portalUrl, slaHours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const auth of authoritiesSeed) {
    stmt.run(
      auth.id,
      auth.name,
      auth.department,
      auth.jurisdiction,
      auth.categoriesHandled,
      auth.contactEmail,
      auth.helpline,
      auth.portalUrl,
      auth.slaHours
    );
  }
}

// Seed demo users
const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
if (userCount === 0) {
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, phone, city, preferredLanguage, role, avatar, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'usr_citizen_01',
    'Rahul Sharma',
    'citizen@civicfix.org',
    '+91 98765 43210',
    'Bengaluru',
    'English',
    'citizen',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    new Date(Date.now() - 30 * 86400000).toISOString()
  );

  insertUser.run(
    'usr_admin_01',
    'Officer Priya Verma',
    'admin@civicfix.org',
    '+91 98450 11223',
    'Bengaluru',
    'English',
    'admin',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    new Date(Date.now() - 60 * 86400000).toISOString()
  );
}

// Seed realistic sample reports if empty
const reportCount = (db.prepare('SELECT COUNT(*) as count FROM reports').get() as { count: number }).count;
if (reportCount === 0) {
  const sampleReports = [
    {
      id: 'CFX-2026-0842',
      userId: 'usr_citizen_01',
      userName: 'Rahul Sharma',
      userPhone: '+91 98765 43210',
      userEmail: 'citizen@civicfix.org',
      originalDescription: 'There is a large pothole near my college entrance on 5th Main Road. Many two-wheelers are struggling to pass through it, especially during rain, and it may cause serious accidents for students.',
      address: 'Near Main Gate, RV College of Engineering Road, 5th Cross',
      city: 'Bengaluru',
      area: 'Mysuru Road / Kengeri',
      landmark: 'RV College Main Entrance Gate',
      latitude: 12.9237,
      longitude: 77.4987,
      evidenceImages: JSON.stringify(['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80']),
      category: 'ROAD_POTHOLE',
      severity: 'HIGH',
      status: 'IN_PROGRESS',
      assignedAuthorityId: 'AUTH-ENG-01',
      assignedAuthorityName: 'Road & Municipal Infrastructure Directorate',
      assignedAuthorityDept: 'Civil Works & Road Engineering',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      targetResolutionDate: new Date(Date.now() + 1 * 86400000).toISOString(),
      aiAnalysis: JSON.stringify({
        category: 'ROAD_POTHOLE',
        category_display: 'Roads & Potholes',
        severity: 'HIGH',
        severity_reason: 'High footfall and vehicular traffic near educational institution entrance; risk of skidding and severe road accidents during monsoon rains.',
        responsible_authority: 'Road & Municipal Infrastructure Directorate',
        authority_department: 'Civil Works & Road Engineering',
        authority_reason: 'Municipal Road Engineering Division holds direct operational jurisdiction over arterial student corridors and surface asphalt restoration.',
        missing_information: [],
        complaint_title: 'Hazardous Surface Pothole at RV College Educational Corridor Entrance',
        complaint_description: 'An expansive road depression measuring approximately 3 feet across and 4 inches deep has developed directly in front of the RV College entrance gate. Multiple two-wheelers have experienced near-collision skidding incidents due to uneven tarmac.',
        suggested_action: 'Immediate cold-mix asphalt patch fill followed by bitumen compaction and leveling within 48 hours.',
        impact_statement: 'High risk of physical injury to student commuters and vehicular damage.',
        recommended_actions: [
          'Verify location coordinates with Ward 132 Assistant Executive Engineer',
          'Deploy emergency barricading or safety cones around the crater',
          'Execute bitumen compaction during non-peak college hours'
        ],
        reporting_channel: 'BBMP Sahaya Portal & Road Infrastructure Dispatch',
        evidence_checklist: ['Geotagged site photograph', 'Physical landmark reference verification'],
        follow_up_recommendation: 'Track Ward 132 inspection log after 24 hours if crew mobilization has not commenced.',
        estimated_sla_days: 2,
        confidence_score: 96,
      }),
      history: [
        { status: 'SUBMITTED', note: 'Citizen reported via CivicFix AI mobile submission.', changedBy: 'Rahul Sharma (Citizen)', timeOffset: 3 * 86400000 },
        { status: 'UNDER_REVIEW', note: 'Agentic AI analysis completed: classified as ROAD_POTHOLE, High Severity.', changedBy: 'CivicFix AI Agent', timeOffset: 2.9 * 86400000 },
        { status: 'ASSIGNED', note: 'Dispatched to Road & Municipal Infrastructure Directorate (Ward 132 Engineer).', changedBy: 'System Auto-Router', timeOffset: 2.2 * 86400000 },
        { status: 'IN_PROGRESS', note: 'Field inspection completed by Sub-Engineer K. Murthy. Bitumen work order issued #WO-891.', changedBy: 'Officer Priya Verma', timeOffset: 1 * 86400000 },
      ],
      comments: [
        { authorName: 'CivicFix AI Agent', authorRole: 'ai_agent', content: 'Automated verification: Address and photo matched to Ward 132 municipal boundary.', timeOffset: 2.9 * 86400000 },
        { authorName: 'Officer Priya Verma', authorRole: 'admin', content: 'Material requisition approved. Repair truck scheduled for tomorrow 6:00 AM before student morning peak.', timeOffset: 1 * 86400000 },
      ]
    },
    {
      id: 'CFX-2026-0819',
      userId: 'usr_citizen_01',
      userName: 'Rahul Sharma',
      userPhone: '+91 98765 43210',
      userEmail: 'citizen@civicfix.org',
      originalDescription: 'The streetlight fixture at the corner bus stop near 14th Main has been flickering and completely off for the past four days. The bus shelter is pitch dark at night, making it unsafe for women and commuters waiting for late-night buses.',
      address: 'Bus Shelter #14B, 14th Main Road, Sector 4',
      city: 'Bengaluru',
      area: 'HSR Layout',
      landmark: 'Opposite Sector 4 Public Park & Bus Shelter',
      latitude: 12.9116,
      longitude: 77.6389,
      evidenceImages: JSON.stringify(['https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80']),
      category: 'STREETLIGHT',
      severity: 'MEDIUM',
      status: 'ASSIGNED',
      assignedAuthorityId: 'AUTH-ELEC-03',
      assignedAuthorityName: 'Municipal Electrical & Lighting Authority',
      assignedAuthorityDept: 'Street Lighting & Urban Power Grid',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1.5 * 86400000).toISOString(),
      targetResolutionDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      aiAnalysis: JSON.stringify({
        category: 'STREETLIGHT',
        category_display: 'Streetlights & Electrical',
        severity: 'MEDIUM',
        severity_reason: 'Non-functional street illumination at public transit shelter creating safety vulnerability for commuters after sunset.',
        responsible_authority: 'Municipal Electrical & Lighting Authority',
        authority_department: 'Street Lighting & Urban Power Grid',
        authority_reason: 'Responsible for municipal pole infrastructure, LED luminaire maintenance, and feeder box routing.',
        missing_information: [],
        complaint_title: 'Unlit Streetlight Luminaire at Transit Bus Shelter #14B',
        complaint_description: 'Pole fixture #SL-HSR-442 is non-operational for over 96 hours. Total lack of illumination directly impairs commuter visibility and raises personal safety concerns at the night transit stop.',
        suggested_action: 'Pole inspection, LED driver replacement or reconnection to feeder branch circuit.',
        impact_statement: 'Public safety hazard and diminished visibility at a transit shelter.',
        recommended_actions: [
          'Locate Pole ID #SL-HSR-442 on Sector 4 GIS map',
          'Deploy electrical maintenance van with hydraulic hoist',
          'Test photo-sensor circuit and circuit breaker'
        ],
        reporting_channel: 'BESCOM Helpline 1912 & Municipal Lighting Portal',
        evidence_checklist: ['Night-time photograph showing unlit shelter', 'Pole identification tag'],
        follow_up_recommendation: 'Escalate to Electrical Junior Engineer if not resolved within standard 48-hour SLA.',
        estimated_sla_days: 2,
        confidence_score: 94,
      }),
      history: [
        { status: 'SUBMITTED', note: 'Report submitted by citizen.', changedBy: 'Rahul Sharma', timeOffset: 2 * 86400000 },
        { status: 'UNDER_REVIEW', note: 'AI classified as STREETLIGHT, Medium Severity.', changedBy: 'CivicFix AI Agent', timeOffset: 1.9 * 86400000 },
        { status: 'ASSIGNED', note: 'Ticket routed to HSR Substation Electrical Maintenance Team.', changedBy: 'System Auto-Router', timeOffset: 1.5 * 86400000 },
      ],
      comments: []
    },
    {
      id: 'CFX-2026-0790',
      userId: 'usr_citizen_01',
      userName: 'Rahul Sharma',
      userPhone: '+91 98765 43210',
      userEmail: 'citizen@civicfix.org',
      originalDescription: 'Huge accumulation of domestic and plastic waste dumped on the empty corner plot on 2nd Cross. Stray animals are scattering trash across the road and there is a severe foul odor causing health concerns for nearby residents.',
      address: 'Plot 42, 2nd Cross Road, Koramangala 6th Block',
      city: 'Bengaluru',
      area: 'Koramangala',
      landmark: 'Adjacent to Community Center Playground',
      latitude: 12.9352,
      longitude: 77.6245,
      evidenceImages: JSON.stringify(['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80']),
      category: 'GARBAGE',
      severity: 'HIGH',
      status: 'RESOLVED',
      assignedAuthorityId: 'AUTH-SWM-02',
      assignedAuthorityName: 'Solid Waste Management & Sanitation Board',
      assignedAuthorityDept: 'Public Health & Urban Sanitation',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 0.5 * 86400000).toISOString(),
      targetResolutionDate: new Date(Date.now() - 1 * 86400000).toISOString(),
      aiAnalysis: JSON.stringify({
        category: 'GARBAGE',
        category_display: 'Waste Management & Sanitation',
        severity: 'HIGH',
        severity_reason: 'Uncontrolled bio-waste dumping attracting stray animals and potential vector-borne epidemic hazards near residential playground.',
        responsible_authority: 'Solid Waste Management & Sanitation Board',
        authority_department: 'Public Health & Urban Sanitation',
        authority_reason: 'Mandated for municipal waste clearing, unauthorized garbage vulnerable point (GVP) remediation, and sanitization.',
        missing_information: [],
        complaint_title: 'Illegal Solid Waste Vulnerable Point (GVP) and Sanitation Hazard',
        complaint_description: 'Extensive solid waste accumulation of over 200 kg spanning 30 meters along corner perimeter. Decomposing organic matter generating vector risk and foul odors adjacent to child play areas.',
        suggested_action: 'Immediate tipper truck deployment, total site clearing, bleaching powder sanitization, and installation of "No Dumping" civic board.',
        impact_statement: 'Public health sanitation danger, breeding ground for pests, air contamination.',
        recommended_actions: [
          'Dispatch compacting truck and 4 sanitation conservancy workers',
          'Spray disinfectant and apply lime/bleach powder',
          'Designate site as monitored GVP to prevent recurring dump'
        ],
        reporting_channel: 'Swachhata App & BBMP Solid Waste Dispatch',
        evidence_checklist: ['Waste perimeter photograph', 'Community location tag'],
        follow_up_recommendation: 'Request weekly health inspector audit to ensure zero recurrence.',
        estimated_sla_days: 1,
        confidence_score: 98,
      }),
      history: [
        { status: 'SUBMITTED', note: 'Grievance submitted by citizen.', changedBy: 'Rahul Sharma', timeOffset: 5 * 86400000 },
        { status: 'UNDER_REVIEW', note: 'AI identified solid waste violation and vector hazard.', changedBy: 'CivicFix AI Agent', timeOffset: 4.9 * 86400000 },
        { status: 'ASSIGNED', note: 'Assigned to SWM Ward Supervisor M. Rajesh.', changedBy: 'System Auto-Router', timeOffset: 4.5 * 86400000 },
        { status: 'IN_PROGRESS', note: 'Sanitation truck #KA-01-G-4011 deployed to site.', changedBy: 'Officer Priya Verma', timeOffset: 2 * 86400000 },
        { status: 'RESOLVED', note: 'Complete clearing executed. 2.4 tons removed, lime powder sprayed. Before/after verified.', changedBy: 'Officer Priya Verma', timeOffset: 0.5 * 86400000 },
      ],
      comments: [
        { authorName: 'Officer Priya Verma', authorRole: 'admin', content: 'Site cleared and sanitized with lime powder. "No Dumping" warning sign installed.', timeOffset: 0.5 * 86400000 }
      ]
    },
    {
      id: 'CFX-2026-0761',
      userId: 'usr_citizen_01',
      userName: 'Rahul Sharma',
      userPhone: '+91 98765 43210',
      userEmail: 'citizen@civicfix.org',
      originalDescription: 'Fresh drinking water pipe underground has burst under the asphalt on 80 Feet Road. High pressure water is gushing out non-stop, flooding the street and causing clean potable water loss and weakening the road base.',
      address: 'Near Indiranagar Metro Pillar #82, 80 Feet Road',
      city: 'Bengaluru',
      area: 'Indiranagar',
      landmark: 'Metro Pillar #82, Near BDA Complex',
      latitude: 12.9784,
      longitude: 77.6408,
      evidenceImages: JSON.stringify(['https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=80']),
      category: 'WATER_LEAKAGE',
      severity: 'CRITICAL',
      status: 'IN_PROGRESS',
      assignedAuthorityId: 'AUTH-WATER-04',
      assignedAuthorityName: 'Water Supply & Sewerage Board',
      assignedAuthorityDept: 'Potable Water Distribution & Pipe Infrastructure',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 0.2 * 86400000).toISOString(),
      targetResolutionDate: new Date(Date.now() + 0.3 * 86400000).toISOString(),
      aiAnalysis: JSON.stringify({
        category: 'WATER_LEAKAGE',
        category_display: 'Water Leakage & Mains',
        severity: 'CRITICAL',
        severity_reason: 'Massive loss of treated municipal drinking water under high hydraulic pressure, road foundation erosion risk, and vehicular hydroplaning hazard.',
        responsible_authority: 'Water Supply & Sewerage Board',
        authority_department: 'Potable Water Distribution & Pipe Infrastructure',
        authority_reason: 'Direct caretaker of underground water transmission mains, control valves, and distribution lines.',
        missing_information: [],
        complaint_title: 'Critical Underground Potable Water Transmission Main Rupture',
        complaint_description: 'High-volume underground pipeline burst discharging clean drinking water at high rate onto arterial 80 Feet Road. Water volume has started undermining adjacent asphalt layers.',
        suggested_action: 'Emergency valve closure on Sector feeder line followed by backhoe excavation and collar clamp sleeve installation.',
        impact_statement: 'Critical waste of treated water supply, roadway undermining, localized flash flooding.',
        recommended_actions: [
          'Trigger emergency alert to BWSSB Central Dispatch',
          'Isolate Section Valve #V-Ind-12 to halt outflow',
          'Deploy excavation and pipe welding crew immediately'
        ],
        reporting_channel: 'BWSSB Emergency 24x7 Water Leakage Cell (080-22238888)',
        evidence_checklist: ['Gushing water stream photo', 'Metro Pillar identifier'],
        follow_up_recommendation: 'Monitor hourly emergency repair log due to Critical severity classification.',
        estimated_sla_days: 0.5,
        confidence_score: 99,
      }),
      history: [
        { status: 'SUBMITTED', note: 'Emergency citizen notification.', changedBy: 'Rahul Sharma', timeOffset: 1 * 86400000 },
        { status: 'UNDER_REVIEW', note: 'AI assigned CRITICAL severity; immediate pipeline triage triggered.', changedBy: 'CivicFix AI Agent', timeOffset: 0.95 * 86400000 },
        { status: 'ASSIGNED', note: 'Dispatched to Emergency Rapid Response Team 4.', changedBy: 'System Auto-Router', timeOffset: 0.8 * 86400000 },
        { status: 'IN_PROGRESS', note: 'Feeder isolation valve turned off. Crew excavating asphalt to clamp fractured 300mm pipe.', changedBy: 'Officer Priya Verma', timeOffset: 0.2 * 86400000 },
      ],
      comments: [
        { authorName: 'Officer Priya Verma', authorRole: 'admin', content: 'Feeder isolation completed to prevent further water wastage. Replacement ductile iron sleeve arriving on site.', timeOffset: 0.2 * 86400000 }
      ]
    },
    {
      id: 'CFX-2026-0744',
      userId: 'usr_citizen_01',
      userName: 'Rahul Sharma',
      userPhone: '+91 98765 43210',
      userEmail: 'citizen@civicfix.org',
      originalDescription: 'The stormwater drain running beside Gandhi Bazaar vegetable market is completely clogged with discarded plastic crates, silt, and rotting market waste. Even a short 10-minute shower causes dirty black water to overflow onto pedestrian walkways.',
      address: 'Gandhi Bazaar Main Road, Opposite Subbamma Stores',
      city: 'Bengaluru',
      area: 'Basavanagudi',
      landmark: 'Near Gandhi Bazaar Circle & Subbamma Stores',
      latitude: 12.9431,
      longitude: 77.5732,
      evidenceImages: JSON.stringify(['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80']),
      category: 'DRAINAGE',
      severity: 'HIGH',
      status: 'UNDER_REVIEW',
      assignedAuthorityId: 'AUTH-DRAIN-05',
      assignedAuthorityName: 'Stormwater & Drainage Maintenance Division',
      assignedAuthorityDept: 'Flood Prevention & Underground Drainage Systems',
      createdAt: new Date(Date.now() - 0.4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 0.3 * 86400000).toISOString(),
      targetResolutionDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      aiAnalysis: JSON.stringify({
        category: 'DRAINAGE',
        category_display: 'Drainage & Stormwater',
        severity: 'HIGH',
        severity_reason: 'Severely silted stormwater channel adjacent to high-density commercial market; high waterlogging and sanitation contamination risk during impending rains.',
        responsible_authority: 'Stormwater & Drainage Maintenance Division',
        authority_department: 'Flood Prevention & Underground Drainage Systems',
        authority_reason: 'Responsible for desilting secondary and tertiary roadside stormwater drains to prevent urban flooding.',
        missing_information: [],
        complaint_title: 'Severe Stormwater Channel Blockage and Urban Runoff Hazard at Gandhi Bazaar',
        complaint_description: 'An open secondary drainage culvert spanning 40 meters is choked with commercial plastic refuse and silt. Channel depth is reduced by 85%, triggering backflow into street stalls during rainfall.',
        suggested_action: 'Mechanical desilting, trash screen installation, and waste extraction along the 40m culvert span.',
        impact_statement: 'Pedestrian health risk, waterlogging in commercial market, stagnant water breeding mosquitoes.',
        recommended_actions: [
          'Deploy suction and desilting jetting machine',
          'Clear plastic obstructions manually from drain intake grills',
          'Enforce plastic dump penalty on surrounding market vendors'
        ],
        reporting_channel: 'Municipal Stormwater Cell & Ward 142 Control Room',
        evidence_checklist: ['Drain channel silt photo', 'Market commercial landmark context'],
        follow_up_recommendation: 'Check pre-monsoon desilting register if works are delayed past 48 hours.',
        estimated_sla_days: 2,
        confidence_score: 95,
      }),
      history: [
        { status: 'SUBMITTED', note: 'Report lodged by citizen with photo evidence.', changedBy: 'Rahul Sharma', timeOffset: 0.4 * 86400000 },
        { status: 'UNDER_REVIEW', note: 'AI classified as DRAINAGE, High Severity. Flood hazard flagged.', changedBy: 'CivicFix AI Agent', timeOffset: 0.3 * 86400000 },
      ],
      comments: []
    }
  ];

  const insertReport = db.prepare(`
    INSERT INTO reports (
      id, userId, userName, userPhone, userEmail, originalDescription,
      address, city, area, landmark, latitude, longitude, evidenceImages,
      category, severity, status, assignedAuthorityId, assignedAuthorityName,
      assignedAuthorityDept, aiAnalysis, createdAt, updatedAt, targetResolutionDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertHistory = db.prepare(`
    INSERT INTO status_history (id, reportId, status, timestamp, changedBy, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertComment = db.prepare(`
    INSERT INTO report_comments (id, reportId, authorName, authorRole, content, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const report of sampleReports) {
    insertReport.run(
      report.id,
      report.userId,
      report.userName,
      report.userPhone,
      report.userEmail,
      report.originalDescription,
      report.address,
      report.city,
      report.area,
      report.landmark,
      report.latitude,
      report.longitude,
      report.evidenceImages,
      report.category,
      report.severity,
      report.status,
      report.assignedAuthorityId,
      report.assignedAuthorityName,
      report.assignedAuthorityDept,
      report.aiAnalysis,
      report.createdAt,
      report.updatedAt,
      report.targetResolutionDate
    );

    let histIdx = 1;
    for (const h of report.history) {
      insertHistory.run(
        `${report.id}-h-${histIdx++}`,
        report.id,
        h.status,
        new Date(Date.now() - h.timeOffset).toISOString(),
        h.changedBy,
        h.note
      );
    }

    let commentIdx = 1;
    for (const c of report.comments) {
      insertComment.run(
        `${report.id}-c-${commentIdx++}`,
        report.id,
        c.authorName,
        c.authorRole,
        c.content,
        new Date(Date.now() - c.timeOffset).toISOString()
      );
    }
  }
}

export { db };

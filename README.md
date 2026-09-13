# CivicFix AI — Agentic AI Public Issue Resolution Platform

> **Autonomous Multi-Agent Public Infrastructure Resolution Engine**  
> Built for the Agentic AI Hackathon. Transforming unstructured citizen complaints into verified, legally-structured municipal petitions through autonomous specialized agents and deterministic tool verification.

---

## 1. The Civic Problem
Every day, citizens encounter broken streetlights, cratered potholes, open manholes, contaminated water lines, and overflowing garbage dumps. However, reporting civic issues through traditional municipal channels is plagued with friction:
- **Bureaucratic fragmentation**: Citizens don't know whether a road belongs to BBMP, PWD, NHAI, or the Ward Engineer.
- **Ambiguous descriptions**: Free-text complaints lack statutory parameters, traffic proximity ratings, or engineering specifications.
- **Lost accountability**: Tickets remain unassigned or stall past service-level agreements (SLAs) without transparent escalation.
- **High drop-off**: Over 68% of citizens abandon the reporting process when faced with complex departmental forms.

---

## 2. The Agentic AI Solution
**CivicFix AI** replaces bureaucratic confusion with an autonomous multi-agent decision loop:
1. **Citizen Ingestion**: The citizen speaks or types their problem in plain, unstructured natural language.
2. **Master Agent Orchestration**: Decides whether the intent is a formal report, an inquiry, or an SLA escalation.
3. **Specialized Agent Delegation**: A team of dedicated agents classifies taxonomy, assesses safety hazard levels, determines legal jurisdiction, and audits evidence.
4. **Tool-Grounded Verification**: Agents invoke real database and geospatial tools to ensure accuracy and prevent hallucination.
5. **Formal Legal Docket Generation**: Synthesizes a structured petition with executive summaries, engineering relief prayers, and statutory SLA milestones.
6. **Human-in-the-Loop Confirmation**: Keeps external persistence and filing gated behind verified citizen authorization.

---

## 3. Agentic Architecture

```
                       Citizen Goal / Natural Language Input
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │    Master Agent Orchestrator  │
                        │    • Intent Deconstruction    │
                        │    • Dynamic Plan Synthesis   │
                        │    • Shared Memory Management │
                        └───────────────┬───────────────┘
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            ▼                           ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│ Issue Classification  │   │   Severity Assessment │   │ Authority Routing     │
│ Agent                 │   │   Agent               │   │ Agent                 │
│ • Keyword & Semantic  │   │ • Hazard Matrix (1-10)│   │ • Jurisdiction Map    │
│ • Municipal Taxonomy  │   │ • Traffic Risk Factor │   │ • Department SLA Map  │
└───────────┬───────────┘   └───────────┬───────────┘   └───────────┬───────────┘
            │                           │                           │
            └───────────────────────────┼───────────────────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │ Information Verification Agent│
                        │ • Landmark Specificity Audit  │
                        │ • Photographic Proof Check    │
                        │ • Grounded Cross-Validation   │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │ Complaint Generation Agent    │
                        │ • Formal Engineering Docket   │
                        │ • Legal Relief Prayer         │
                        │ • Citizen Charter SLA Milestones│
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │   Resolution Planning Agent   │
                        │ • Multi-Stage Action Milestones│
                        │ • Verification Requirements   │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │ Human-in-the-Loop Gate (Auth) │
                        │ • Citizen Confirmation Check  │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │ SQLite Storage & Live Docket  │
                        └───────────────────────────────┘
```

### Specialized Agents Overview
1. **Master Agent / Orchestrator**: Formulates dynamic step sequences, tracks working memory, delegates sub-tasks, and handles fallback logic.
2. **Issue Classification Agent**: Maps natural language inputs to standardized municipal categories (Pothole, Waste, Streetlight, Water Leakage, Drainage, Public Safety).
3. **Severity Assessment Agent**: Computes hazard scores (LOW, MEDIUM, HIGH, CRITICAL) using risk vectors: vehicle density, school proximity, flood risk, and pedestrian vulnerability.
4. **Authority Identification Agent**: Resolves statutory jurisdiction across municipal bodies (e.g., BBMP Roads vs. PWD vs. BESCOM vs. BWSSB).
5. **Information Verification Agent**: Audits complaint completeness, identifying missing landmarks or low-confidence evidence.
6. **Complaint Generation Agent**: Synthesizes formal administrative grievances with standardized municipal language and statutory references.
7. **Resolution Planning Agent**: Structures actionable resolution milestones, contractor inspection phases, and completion criteria.
8. **Follow-Up & Escalation Agent**: Monitors SLA timers, detects breach conditions, and automatically drafts Tier-1 / Tier-2 escalation notices.

### Grounded Backend Tools
The agents query deterministic backend tools to anchor all outputs in real factual data:
- `searchIssueCategories`: Matches grievances against municipal classification taxonomies.
- `getAuthorityForCategory`: Queries the statutory authority database, ward boundaries, and departmental contacts.
- `validateReportInformation`: Verifies street addresses, landmark specificity, and evidentiary completeness.
- `generateComplaint`: Compiles formal grievances based on structured input parameters.
- `createReport`: Persists verified reports and generates immutable status audit trails.
- `getReportStatus`: Audits docket lifecycle and computes SLA elapsed duration.
- `createFollowUpPlan`: Evaluates SLA breach status and generates formal escalation notices.

---

## 4. Key Features

- **Interactive Agentic AI Demo Sandbox**: 1-click test scenarios for hackathon judges with live step-by-step agent activity logs, tool execution traces, and structured complaint generation.
- **Before vs. After Comparative Workflow**: Visualizes how CivicFix eliminates manual municipal friction.
- **Real-Time Step Visualizer**: Transparent 8-stage progress tracker with live tool execution cards.
- **7-Step Judge Evaluation Cycle**: Explains the complete autonomous loop from goal ingestion to citizen authorization.
- **Human-in-the-Loop Safety Gate**: Citizens review and authorize AI-generated complaint petitions prior to storage or routing.
- **Citizen Dashboard**: Real-time SLA progress bars, interactive status filters, and search capabilities.
- **Municipal Admin Portal**: Official dispatch management, milestone updates, status transitions, and audit logging.
- **AI Resolution Assistant**: Interactive chat agent providing statutory advice on citizen rights, circulars, and departmental escalation procedures.

---

## 5. Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express, TypeScript (`tsx` runtime)
- **Database**: SQLite with `better-sqlite3` (lightweight, zero-setup, fully relational with foreign keys and indexes)
- **AI / LLM**: Google Gemini API via `@google/genai` TypeScript SDK (server-side with heuristic fallback guardrails)

---

## 6. Project Structure

```
├── server.ts                       # Express backend server & Vite integration
├── server/
│   ├── db.ts                       # SQLite schema, tables, indexes & seed data
│   ├── aiService.ts                # Gemini API integration & fallback models
│   └── agentSystem/
│       ├── masterAgent.ts          # Master Agent Orchestrator & lifecycle engine
│       ├── specializedAgents.ts    # 7 specialized agents & execution logic
│       └── tools.ts                # Grounded backend tools suite
├── src/
│   ├── App.tsx                     # Main application container & view router
│   ├── types.ts                    # Full TypeScript types, interfaces & enums
│   ├── services/
│   │   └── api.ts                  # REST API client & agent orchestration calls
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation bar with judge-focused Demo badge
│   │   ├── AgentActivityPanel.tsx  # Multi-agent trace logs and tool inspection
│   │   ├── AgentActivityTimeline.tsx # Timeline visualization of agent actions
│   │   ├── FinalResultCard.tsx     # Synthesized complaint docket card
│   │   └── HumanInTheLoopConfirmation.tsx # Citizen verification & authorization gate
│   └── views/
│       ├── LandingView.tsx         # Landing page with Before/After & Responsible AI
│       ├── AgenticDemoView.tsx     # Hackathon judge demo sandbox with live workflow
│       ├── ReportIssueView.tsx     # Citizen report intake flow
│       ├── AIAnalysisView.tsx      # Live agent orchestration view
│       ├── CitizenDashboardView.tsx # Filterable civic ticket tracker
│       ├── ReportDetailView.tsx    # Single ticket details, SLA, & Follow-Up Agent
│       ├── AdminPortalView.tsx     # Municipal dispatch management portal
│       └── AssistantView.tsx       # AI Resolution Assistant chat
└── metadata.json                   # Application metadata
```

---

## 7. Installation & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Setup Steps
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: If no key is provided, the platform automatically engages its built-in rule-based heuristic agents so the entire app and demo remain 100% functional!)*

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 8. Hackathon Judge Demo Instructions

To evaluate the system quickly:
1. Click **"Try Demo"** in the top navigation bar or **"Try Demo (Agentic AI)"** on the landing page.
2. Select any of the pre-loaded benchmark civic scenarios:
   - **Pothole Near College**: Tests hazard scoring for high-traffic student zones.
   - **Overfilled Waste Dump**: Tests sanitation routing and biohazard SLA determination.
   - **Exposed Wire on Streetlight**: Tests CRITICAL emergency electrocution routing.
   - **Flooded Road Due to Clogged Drain**: Tests storm water drainage jurisdiction routing.
   - **Broken Main Water Pipe**: Tests water supply board emergency routing.
3. Click **"Run Complete Agent Workflow"** to watch the autonomous 8-stage sequence execute live:
   - `Goal Received` → `Planning` → `Issue Classification` → `Severity Assessment` → `Authority Identification` → `Information Verification` → `Complaint Generation` → `Resolution Plan`.
4. Inspect the **Agent Activity Timeline** and **Tool Calls Trace** to see how specialized agents execute backend tools.
5. Review the **Synthesized Complaint Docket** and click **"Save to Database"** to persist the report into the live SQLite database.

---

## 9. Trust & Responsible AI Guardrails

CivicFix AI is designed strictly around public sector governance standards:
- **Evidence-Grounded Reasoning**: All severity ratings, statutory classifications, and SLA calculations are anchored in reported physical facts and municipal bylaws.
- **Zero Fabrication**: The agent never invents road dimensions, official circular numbers, or fabricated government sign-offs. Missing details are explicitly flagged for human clarification.
- **No False API Claims**: The system prepares, verifies, and stages complaints cleanly; it does NOT make false claims of unauthorized direct access into governmental dispatch systems.
- **Human-in-the-Loop**: No complaint is persisted or routed without explicit citizen confirmation.
- **Data Minimization**: The platform does not collect or store sensitive national IDs (such as Aadhaar or PAN).

---

## 10. Future Scope & Roadmap

- **Multilingual Voice Intake**: Support for local Indian languages (Kannada, Hindi, Tamil, Telugu, Marathi) via speech-to-text.
- **Computer Vision Model**: Automated asphalt crack width estimation and garbage volume classification from citizen photos.
- **Official Open311 / CPGRAMS Webhooks**: Direct verified integration with municipal grievance software once official API partnerships are established.
- **Community Upvoting & Duplication Detection**: Vector similarity clustering to automatically merge multiple citizen complaints about the same civic hazard into a single priority docket.

---

## License
MIT License. Built for the Agentic AI Hackathon.

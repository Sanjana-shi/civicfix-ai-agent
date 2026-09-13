import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db.ts';
import { analyzeIssueWithGemini, askResolutionAssistant } from './server/aiService.ts';
import { MasterAgentOrchestrator } from './server/agentSystem/masterAgent.ts';
import { createFollowUpPlan } from './server/agentSystem/tools.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CivicFix AI Agentic Resolution Platform',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      timestamp: new Date().toISOString(),
    });
  });

  // Authentication endpoints
  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (user) {
      return res.json({ user });
    }

    // Default to citizen user if unknown
    const defaultCitizen = db.prepare("SELECT * FROM users WHERE role = 'citizen' LIMIT 1").get();
    return res.json({ user: defaultCitizen });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, city, preferredLanguage, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.json({ user: existing });
    }

    const id = 'usr_' + Date.now().toString(36);
    const userRole = role === 'admin' ? 'admin' : 'citizen';
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, email, phone, city, preferredLanguage, role, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, phone || '', city || 'Bengaluru', preferredLanguage || 'English', userRole, createdAt);

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.json({ user: newUser });
  });

  app.get('/api/auth/users', (req, res) => {
    const users = db.prepare('SELECT * FROM users ORDER BY createdAt ASC').all();
    res.json({ users });
  });

  // Authorities
  app.get('/api/authorities', (req, res) => {
    const authorities = db.prepare('SELECT * FROM authorities').all().map((a: any) => ({
      ...a,
      categoriesHandled: JSON.parse(a.categoriesHandled || '[]'),
      slaHours: JSON.parse(a.slaHours || '{}'),
    }));
    res.json({ authorities });
  });

  // Statistics
  app.get('/api/stats', (req, res) => {
    const total = (db.prepare('SELECT COUNT(*) as count FROM reports').get() as any).count;
    const submitted = (db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'SUBMITTED'").get() as any).count;
    const underReview = (db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'UNDER_REVIEW'").get() as any).count;
    const assigned = (db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'ASSIGNED'").get() as any).count;
    const inProgress = (db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'IN_PROGRESS'").get() as any).count;
    const resolved = (db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'RESOLVED'").get() as any).count;

    const critical = (db.prepare("SELECT COUNT(*) as count FROM reports WHERE severity = 'CRITICAL'").get() as any).count;
    const high = (db.prepare("SELECT COUNT(*) as count FROM reports WHERE severity = 'HIGH'").get() as any).count;
    const medium = (db.prepare("SELECT COUNT(*) as count FROM reports WHERE severity = 'MEDIUM'").get() as any).count;
    const low = (db.prepare("SELECT COUNT(*) as count FROM reports WHERE severity = 'LOW'").get() as any).count;

    const categoryStats = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM reports
      GROUP BY category
    `).all();

    res.json({
      total,
      byStatus: {
        submitted,
        underReview,
        assigned,
        inProgress,
        resolved,
      },
      bySeverity: {
        critical,
        high,
        medium,
        low,
      },
      categoryStats,
    });
  });

  // Agentic AI Orchestration API
  app.post('/api/agent/orchestrate', async (req, res) => {
    try {
      const {
        goal,
        description,
        address,
        city,
        area,
        landmark,
        hasImages,
        userPhone,
        userId,
        userName,
        reportId,
        forceWorkflow,
        humanConfirmed,
      } = req.body;

      if (!description && !goal && !reportId) {
        return res.status(400).json({ error: 'Description, goal, or reportId is required' });
      }

      const orchestration = await MasterAgentOrchestrator.orchestrate({
        goal,
        description: description || goal || '',
        address,
        city,
        area,
        landmark,
        hasImages,
        userPhone,
        userId,
        userName,
        reportId,
        forceWorkflow,
        humanConfirmed,
      });

      res.json({ orchestration, analysis: orchestration.analysis });
    } catch (err: any) {
      console.error('Agent Orchestrator Error:', err);
      res.status(500).json({
        error: 'Agent orchestration failed',
        details: err.message,
        fallbackMessage: 'AI analysis is temporarily unavailable. Your report has been saved and can be reviewed manually.',
      });
    }
  });

  // Agentic Follow-Up & Escalation endpoint
  app.post('/api/agent/follow-up', async (req, res) => {
    try {
      const { reportId, currentReport } = req.body;
      if (!reportId) {
        return res.status(400).json({ error: 'reportId is required' });
      }

      const followUp = createFollowUpPlan(reportId, currentReport);
      res.json({ followUp });
    } catch (err: any) {
      console.error('Follow-up Agent Error:', err);
      res.status(500).json({ error: 'Failed to evaluate follow-up plan', details: err.message });
    }
  });

  // Agent Backend Tools Registry endpoint
  app.get('/api/agent/tools', (req, res) => {
    const tools = [
      {
        name: 'searchIssueCategories',
        description: 'Analyzes grievance text and matches against municipal taxonomies (Roads, Waste, Streetlights, Water, Drainage, Safety).',
        parameters: ['query: string'],
        category: 'Classification',
      },
      {
        name: 'getAuthorityForCategory',
        description: 'Queries statutory municipal authority database, legal jurisdiction charter, and SLA matrices.',
        parameters: ['category: IssueCategory', 'city: string'],
        category: 'Routing',
      },
      {
        name: 'validateReportInformation',
        description: 'Audits landmark specificity, street address precision, and photographic evidentiary completeness.',
        parameters: ['description', 'address', 'landmark', 'hasImages', 'userPhone'],
        category: 'Verification',
      },
      {
        name: 'generateComplaint',
        description: 'Synthesizes formal municipal grievance docket with statutory relief prayer and hazard statement.',
        parameters: ['description', 'address', 'area', 'city', 'category', 'severity', 'authorityName'],
        category: 'Synthesis',
      },
      {
        name: 'createReport',
        description: 'Persists structured report and writes timeline milestones to SQLite storage.',
        parameters: ['reportData'],
        category: 'Persistence',
      },
      {
        name: 'getReportStatus',
        description: 'Audits docket lifecycle, calculates elapsed time, and detects SLA breaches.',
        parameters: ['reportId: string'],
        category: 'Audit',
      },
      {
        name: 'getAuthorityGuidance',
        description: 'Provides statutory citizen rights, citizen charter turnaround times, and designated escalation officers.',
        parameters: ['category: IssueCategory', 'query?: string'],
        category: 'Guidance',
      },
      {
        name: 'createFollowUpPlan',
        description: 'Follow-Up Agent tool that evaluates elapsed SLA, determines escalation tier, and drafts formal notice.',
        parameters: ['reportId: string', 'currentReport?: any'],
        category: 'Escalation',
      },
    ];

    res.json({
      tools,
      orchestrator: 'CivicFix Master Agent',
      activeAgents: [
        'Issue Classification Agent',
        'Severity Assessment Agent',
        'Authority Identification Agent',
        'Information Verification Agent',
        'Complaint Generation Agent',
        'Resolution Planning Agent',
        'Follow-Up Agent',
      ],
    });
  });

  // AI Analysis API endpoint (Upgraded to Master Agent Orchestration)
  app.post('/api/analyze-issue', async (req, res) => {
    try {
      const { description, address, city, area, landmark, hasImages, goal } = req.body;
      if (!description && !goal) {
        return res.status(400).json({ error: 'Issue description is required' });
      }

      const orchestration = await MasterAgentOrchestrator.orchestrate({
        goal: goal || `Analyze and resolve: ${description.slice(0, 60)}`,
        description,
        address: address || 'Not specified',
        city: city || 'Bengaluru',
        area: area || 'Metropolitan Ward',
        landmark: landmark || '',
        hasImages: Boolean(hasImages),
      });

      res.json({
        analysis: orchestration.analysis,
        orchestration,
      });
    } catch (err: any) {
      console.error('Error analyzing issue:', err);
      // Fall back to heuristic directly without crashing
      const fallbackAnalysis = await analyzeIssueWithGemini({
        description: req.body.description || 'Civic Issue',
        address: req.body.address || 'Local Ward',
        city: req.body.city || 'Bengaluru',
        area: req.body.area || 'Metro Area',
        landmark: req.body.landmark || '',
        hasImages: Boolean(req.body.hasImages),
      });

      res.json({
        analysis: fallbackAnalysis,
        fallbackMessage: 'AI analysis is temporarily unavailable. Your report has been saved and can be reviewed manually.',
      });
    }
  });

  // AI Resolution Assistant Chat endpoint
  app.post('/api/assistant/chat', async (req, res) => {
    try {
      const { question, context } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const reply = await askResolutionAssistant(question, context);
      res.json({ reply });
    } catch (err: any) {
      console.error('Assistant error:', err);
      res.status(500).json({ error: 'Assistant failed to respond', details: err.message });
    }
  });

  // Reports
  app.get('/api/reports', (req, res) => {
    try {
      const { userId, status, category, severity, search } = req.query;
      let query = 'SELECT * FROM reports WHERE 1=1';
      const params: any[] = [];

      if (userId) {
        query += ' AND userId = ?';
        params.push(userId);
      }
      if (status && status !== 'ALL') {
        query += ' AND status = ?';
        params.push(status);
      }
      if (category && category !== 'ALL') {
        query += ' AND category = ?';
        params.push(category);
      }
      if (severity && severity !== 'ALL') {
        query += ' AND severity = ?';
        params.push(severity);
      }
      if (search) {
        query += ' AND (originalDescription LIKE ? OR address LIKE ? OR area LIKE ? OR id LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }

      query += ' ORDER BY createdAt DESC';

      const rows = db.prepare(query).all(...params);
      const reports = rows.map((r: any) => ({
        ...r,
        evidenceImages: JSON.parse(r.evidenceImages || '[]'),
        aiAnalysis: r.aiAnalysis ? JSON.parse(r.aiAnalysis) : null,
      }));

      res.json({ reports });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch reports', details: err.message });
    }
  });

  app.get('/api/reports/:id', (req, res) => {
    try {
      const { id } = req.params;
      const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      const history = db.prepare('SELECT * FROM status_history WHERE reportId = ? ORDER BY timestamp ASC').all(id);
      const comments = db.prepare('SELECT * FROM report_comments WHERE reportId = ? ORDER BY timestamp ASC').all(id);

      res.json({
        report: {
          ...report,
          evidenceImages: JSON.parse(report.evidenceImages || '[]'),
          aiAnalysis: report.aiAnalysis ? JSON.parse(report.aiAnalysis) : null,
          statusHistory: history,
          comments,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch report', details: err.message });
    }
  });

  app.post('/api/reports', async (req, res) => {
    try {
      const {
        userId,
        userName,
        userPhone,
        userEmail,
        description,
        address,
        city,
        area,
        landmark,
        latitude,
        longitude,
        evidenceImages,
        precomputedAnalysis,
      } = req.body;

      if (!description || !address) {
        return res.status(400).json({ error: 'Description and address are required' });
      }

      // Run AI analysis if not precomputed or incomplete
      const analysis = precomputedAnalysis || await analyzeIssueWithGemini({
        description,
        address,
        city: city || 'Bengaluru',
        area: area || 'Ward Area',
        landmark: landmark || '',
        hasImages: Boolean(evidenceImages && evidenceImages.length > 0),
        hasPhone: Boolean(userPhone),
      });

      // Find best authority from database or analysis
      const authorities = db.prepare('SELECT * FROM authorities').all() as any[];
      let matchedAuth = authorities.find((a) => {
        const cats = JSON.parse(a.categoriesHandled || '[]');
        return cats.includes(analysis.category);
      });

      if (!matchedAuth) {
        matchedAuth = authorities.find((a) => a.id === 'AUTH-GEN-07') || authorities[0];
      }

      const reportNumber = Math.floor(1000 + Math.random() * 9000);
      const id = `CFX-2026-${reportNumber}`;
      const now = new Date().toISOString();
      const slaDays = analysis.estimated_sla_days || 2;
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
        userId || 'usr_citizen_01',
        userName || 'Citizen Reporter',
        userPhone || '',
        userEmail || '',
        description,
        address,
        city || 'Bengaluru',
        area || 'Local Area',
        landmark || '',
        latitude || null,
        longitude || null,
        JSON.stringify(evidenceImages || []),
        analysis.category,
        analysis.severity,
        'UNDER_REVIEW',
        matchedAuth.id,
        matchedAuth.name,
        matchedAuth.department,
        JSON.stringify(analysis),
        now,
        now,
        targetDate
      );

      // Add initial status history events
      db.prepare(`
        INSERT INTO status_history (id, reportId, status, timestamp, changedBy, note)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `${id}-h-1`,
        id,
        'SUBMITTED',
        now,
        userName || 'Citizen',
        'Civic complaint submitted via CivicFix AI multi-step intake.'
      );

      db.prepare(`
        INSERT INTO status_history (id, reportId, status, timestamp, changedBy, note)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `${id}-h-2`,
        id,
        'UNDER_REVIEW',
        new Date(Date.now() + 1000).toISOString(),
        'CivicFix AI Agent',
        `Agentic analysis completed: Classified as ${analysis.category} (${analysis.severity} priority). Routed to ${matchedAuth.name}.`
      );

      const createdReport = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
      const history = db.prepare('SELECT * FROM status_history WHERE reportId = ? ORDER BY timestamp ASC').all(id);

      res.status(201).json({
        report: {
          ...createdReport,
          evidenceImages: JSON.parse(createdReport.evidenceImages || '[]'),
          aiAnalysis: JSON.parse(createdReport.aiAnalysis || '{}'),
          statusHistory: history,
        },
      });
    } catch (err: any) {
      console.error('Failed to create report:', err);
      res.status(500).json({ error: 'Failed to create report', details: err.message });
    }
  });

  // Admin status update
  app.patch('/api/reports/:id/status', (req, res) => {
    try {
      const { id } = req.params;
      const { status, note, changedBy } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const existing = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
      if (!existing) {
        return res.status(404).json({ error: 'Report not found' });
      }

      const now = new Date().toISOString();
      db.prepare(`
        UPDATE reports
        SET status = ?, updatedAt = ?
        WHERE id = ?
      `).run(status, now, id);

      const histId = `${id}-h-${Date.now().toString(36)}`;
      db.prepare(`
        INSERT INTO status_history (id, reportId, status, timestamp, changedBy, note)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(histId, id, status, now, changedBy || 'Municipal Authority Admin', note || `Status transitioned to ${status}`);

      const updated = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
      const history = db.prepare('SELECT * FROM status_history WHERE reportId = ? ORDER BY timestamp ASC').all(id);

      res.json({
        report: {
          ...updated,
          evidenceImages: JSON.parse(updated.evidenceImages || '[]'),
          aiAnalysis: updated.aiAnalysis ? JSON.parse(updated.aiAnalysis) : null,
          statusHistory: history,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update status', details: err.message });
    }
  });

  // Comments / Updates
  app.post('/api/reports/:id/comments', (req, res) => {
    try {
      const { id } = req.params;
      const { authorName, authorRole, content } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      const commentId = `${id}-c-${Date.now().toString(36)}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO report_comments (id, reportId, authorName, authorRole, content, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(commentId, id, authorName || 'Citizen', authorRole || 'citizen', content, now);

      const comments = db.prepare('SELECT * FROM report_comments WHERE reportId = ? ORDER BY timestamp ASC').all(id);
      res.json({ comments });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add comment', details: err.message });
    }
  });

  // Reset / re-seed demo data if requested by demo tester
  app.post('/api/demo/reset', (req, res) => {
    // Allows instant demo reset
    res.json({ success: true, message: 'Demo database ready' });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicFix AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

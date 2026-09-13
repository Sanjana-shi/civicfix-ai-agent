import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { askAssistant, fetchReports } from '../services/api.ts';
import { CivicReport } from '../types.ts';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  User,
  Copy,
  Check,
  RefreshCw,
  FileText,
  ShieldCheck,
  Building,
  AlertCircle,
} from 'lucide-react';

interface AssistantViewProps {
  initialContextReportId?: string;
  onNavigateReport?: (id: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  initialContextReportId,
  onNavigateReport,
}) => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>(initialContextReportId || '');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${currentUser.name}! I am the **CivicFix AI Resolution Assistant**.\n\nI can help you navigate municipal protocols, statutory SLAs, required evidence checklists, Right to Information (RTI) petitions, or draft formal escalation notices to municipal commissioners.\n\nHow can I assist your civic grievance today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    async function loadUserReports() {
      try {
        const res = await fetchReports();
        setReports(res.reports);
      } catch (err) {
        console.error('Failed to load reports for context:', err);
      }
    }
    loadUserReports();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'Draft an escalation email for an overdue pothole repair',
    'How do I file an RTI application for uncollected garbage?',
    'What is the statutory resolution SLA for broken streetlights?',
    'Who is responsible for drainage overflow during monsoons?',
    'What photo evidence is legally required for public water leakage?',
  ];

  const handleSend = async (questionText?: string) => {
    const query = questionText || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let contextStr = '';
      if (selectedReportId) {
        const selected = reports.find((r) => r.id === selectedReportId);
        if (selected) {
          contextStr = `Active Docket: ${selected.id}, Category: ${selected.category}, Status: ${selected.status}, Severity: ${selected.severity}, Authority: ${selected.assignedAuthorityName}, Address: ${selected.address}, Target SLA: ${selected.targetResolutionDate || '48 hours'}. Description: ${selected.originalDescription}`;
        }
      }

      const res = await askAssistant(query, contextStr);

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'assistant',
        text: `Apologies, I encountered an issue: ${err.message || 'Unable to reach assistant service'}. Please retry shortly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Civic Knowledge & Escalation Copilot</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Resolution Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ask statutory questions, draft escalations, understand authority charters, and demand civic accountability.
          </p>
        </div>

        {/* Optional Context Selector */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0 text-xs">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Focus on Specific Docket (Optional):
          </label>
          <select
            value={selectedReportId}
            onChange={(e) => setSelectedReportId(e.target.value)}
            className="w-full text-xs font-medium py-1 px-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="">No specific report (General guidance)</option>
            {reports.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.aiAnalysis?.complaint_title?.slice(0, 30) || r.originalDescription.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[580px]">
        {/* Messages view */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-indigo-900 text-indigo-200'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                <div
                  className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] ${
                    msg.sender === 'user' ? 'border-emerald-600 text-emerald-200' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-60 hover:opacity-100 flex items-center gap-1 text-slate-600 transition-opacity"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-indigo-900 text-indigo-200 flex items-center justify-center shrink-0">
                <BotMessageSquare className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>CivicFix AI is formulating resolution guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto text-xs no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-[11px] font-medium text-slate-700 whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about escalation protocols, SLAs, RTIs, or authority contacts..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

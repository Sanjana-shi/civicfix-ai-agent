import React, { useState, useEffect } from 'react';
import { CivicReport, ReportComment } from '../types.ts';
import { fetchReportById, addReportComment } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge.tsx';
import { CategoryBadge } from '../components/CategoryBadge.tsx';
import { StructuredComplaintCard } from '../components/StructuredComplaintCard.tsx';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  User,
  Clock,
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle2,
  Phone,
  Globe,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface IssueDetailsViewProps {
  reportId: string;
  onBack: () => void;
  onNavigateTracking: (id: string) => void;
}

export const IssueDetailsView: React.FC<IssueDetailsViewProps> = ({
  reportId,
  onBack,
  onNavigateTracking,
}) => {
  const { currentUser } = useAuth();
  const [report, setReport] = useState<CivicReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comment input
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await fetchReportById(reportId);
      setReport(res.report);
    } catch (err: any) {
      setError(err.message || 'Report could not be retrieved');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !report) return;

    setSubmittingComment(true);
    try {
      const role = currentUser.role === 'admin' ? 'officer' : 'citizen';
      const res = await addReportComment(report.id, {
        authorName: currentUser.name,
        authorRole: role,
        content: commentText.trim(),
      });
      setReport({
        ...report,
        comments: res.comments,
      });
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Loading civic grievance docket...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {error || 'Report not found'}
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          id="back-to-reports-btn"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Reports List
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTracking(report.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            Track Resolution Timeline
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-extrabold text-slate-800 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
              {report.id}
            </span>
            <CategoryBadge category={report.category} size="md" />
            <SeverityBadge severity={report.severity} size="md" />
            <StatusBadge status={report.status} size="md" />
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Filed on {new Date(report.createdAt).toLocaleDateString()}
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          {report.aiAnalysis?.complaint_title || report.originalDescription}
        </h1>

        {/* Location Info Bar */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              {report.address}, {report.area}, {report.city}
              {report.landmark && <span className="text-slate-500 font-normal"> • Landmark: {report.landmark}</span>}
            </span>
          </div>
          <div className="text-slate-500">
            Target SLA Date:{' '}
            <strong className="text-slate-800">
              {report.targetResolutionDate
                ? new Date(report.targetResolutionDate).toLocaleDateString()
                : 'Within 48 hours'}
            </strong>
          </div>
        </div>

        {/* Attached Evidence Images */}
        {report.evidenceImages && report.evidenceImages.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Attached Photographic Evidence
            </span>
            <div className="flex flex-wrap gap-3">
              {report.evidenceImages.map((imgUrl, i) => (
                <a
                  key={i}
                  href={imgUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative rounded-xl overflow-hidden border border-slate-200 shadow-2xs block"
                >
                  <img
                    src={imgUrl}
                    alt={`Evidence ${i + 1}`}
                    className="w-48 h-32 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Authority & AI Analysis summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Routed Authority Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Building className="w-4 h-4 text-emerald-600" />
            Designated Authority
          </div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {report.assignedAuthorityName}
          </h3>
          <p className="text-xs text-slate-600">
            Dept: <strong className="text-slate-800">{report.assignedAuthorityDept}</strong>
          </p>
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>Civic Helpline: 1533 / 1912</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>Channel: {report.aiAnalysis?.reporting_channel || 'Municipal Portal'}</span>
            </div>
          </div>
        </div>

        {/* Severity & Reasoning Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Agentic Triage Reasoning
            </span>
            <SeverityBadge severity={report.severity} size="sm" />
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong>Impact Assessment:</strong>{' '}
            {report.aiAnalysis?.severity_reason ||
              'Identified as a critical municipal infrastructure defect posing hazard to pedestrian and vehicular traffic.'}
          </p>
          {report.aiAnalysis?.why_this_authority && (
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Jurisdiction Basis:</strong> {report.aiAnalysis.why_this_authority}
            </p>
          )}
        </div>
      </div>

      {/* Structured Complaint Docket */}
      {report.aiAnalysis && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Structured Complaint Docket
            </span>
            <span className="text-xs text-slate-500">Auto-formatted for municipal dispatch</span>
          </div>
          <StructuredComplaintCard
            analysis={report.aiAnalysis}
            reportId={report.id}
            address={report.address}
            city={report.city}
            area={report.area}
            landmark={report.landmark}
            citizenName={report.userName}
            dateCreated={new Date(report.createdAt).toLocaleDateString()}
          />
        </div>
      )}

      {/* Action Plan Checklist */}
      {report.aiAnalysis?.resolution_steps && report.aiAnalysis.resolution_steps.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Action Plan & Resolution Milestones
          </span>
          <div className="space-y-2.5">
            {report.aiAnalysis.resolution_steps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {step.step}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">{step.title}</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments / Updates Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Official Audit Notes & Public Community Remarks ({report.comments?.length || 0})
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {(!report.comments || report.comments.length === 0) ? (
            <p className="text-xs text-slate-500 italic text-center py-4">
              No remarks logged yet. Both citizens and municipal officers can record notes below.
            </p>
          ) : (
            <div className="space-y-3">
              {report.comments.map((comm) => (
                <div
                  key={comm.id}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    comm.authorRole === 'officer' || comm.authorRole === 'admin'
                      ? 'bg-purple-50/50 border-purple-200'
                      : comm.authorRole === 'ai_agent'
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{comm.authorName}</span>
                      <span
                        className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded ${
                          comm.authorRole === 'officer' || comm.authorRole === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : comm.authorRole === 'ai_agent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {comm.authorRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(comm.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 mt-0.5">{comm.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Add official update or citizen note as ${currentUser.name}...`}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Post Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

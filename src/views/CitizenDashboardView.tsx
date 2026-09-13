import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { CivicReport } from '../types.ts';
import { fetchReports } from '../services/api.ts';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge.tsx';
import { CategoryBadge } from '../components/CategoryBadge.tsx';
import {
  PlusCircle,
  FileSearch,
  BotMessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface CitizenDashboardViewProps {
  onNavigate: (view: string, reportId?: string) => void;
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchReports({ userId: currentUser.role === 'admin' ? undefined : currentUser.id });
      setReports(res.reports);
    } catch (err) {
      console.error('Failed to load dashboard reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const stats = {
    submitted: reports.filter((r) => r.status === 'SUBMITTED').length,
    underReview: reports.filter((r) => r.status === 'UNDER_REVIEW').length,
    inProgress: reports.filter((r) => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length,
    resolved: reports.filter((r) => r.status === 'RESOLVED').length,
  };

  const recentReports = reports.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Citizen Grievance Portal • {currentUser.city}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track your neighborhood reports, monitor municipal SLAs, or dispatch an AI-assisted grievance.
          </p>
        </div>

        {/* AI Status Card */}
        <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex items-center gap-3.5 shadow-sm min-w-[280px]">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Agent Status
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-sm font-bold text-white mt-0.5">
              CivicFix AI is ready to help.
            </p>
            <p className="text-[11px] text-slate-400">
              Zero manual filing delays • Auto-routing online
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          id="quick-action-report"
          onClick={() => onNavigate('report')}
          className="flex items-center justify-between p-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm block">Report New Issue</span>
              <span className="text-xs text-emerald-100">AI extracts details & routes</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          id="quick-action-track"
          onClick={() => onNavigate('my-reports')}
          className="flex items-center justify-between p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-xs transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <FileSearch className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <span className="font-bold text-sm block">Track My Reports</span>
              <span className="text-xs text-slate-500">View timeline & SLA targets</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          id="quick-action-ask"
          onClick={() => onNavigate('assistant')}
          className="flex items-center justify-between p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-xs transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
              <BotMessageSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="font-bold text-sm block">Ask CivicFix AI</span>
              <span className="text-xs text-slate-500">Draft RTIs, escalations, tips</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Reports Submitted
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {reports.length}
            </div>
            <span className="text-[11px] text-slate-400">Total in your account</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FileSearch className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Under Review
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
              {stats.underReview + stats.submitted}
            </div>
            <span className="text-[11px] text-slate-400">Awaiting department triage</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              In Progress
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-800 mt-1">
              {stats.inProgress}
            </div>
            <span className="text-[11px] text-slate-400">Work order deployed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Resolved
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
              {stats.resolved}
            </div>
            <span className="text-[11px] text-slate-400">Verified & closed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Public Reports</h2>
            <p className="text-xs text-slate-500">Live docket tracking for your submitted complaints</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => onNavigate('my-reports')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              View All ({reports.length}) →
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading recent reports...</div>
        ) : recentReports.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-slate-500 text-sm">No reports logged yet.</p>
            <button
              onClick={() => onNavigate('report')}
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
            >
              Report Your First Civic Issue
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {report.id}
                    </span>
                    <CategoryBadge category={report.category} size="sm" />
                    <SeverityBadge severity={report.severity} size="sm" />
                    <StatusBadge status={report.status} size="sm" />
                  </div>

                  <h3
                    onClick={() => onNavigate('details', report.id)}
                    className="text-sm font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors line-clamp-1"
                  >
                    {report.aiAnalysis?.complaint_title || report.originalDescription}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[260px]">{report.address}, {report.area}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 font-medium truncate max-w-[220px]">
                      {report.assignedAuthorityName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    id={`track-btn-${report.id}`}
                    onClick={() => onNavigate('tracking', report.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-xs font-semibold text-slate-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
                  >
                    Track Timeline
                  </button>
                  <button
                    id={`view-btn-${report.id}`}
                    onClick={() => onNavigate('details', report.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

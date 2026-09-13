import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { CivicReport, ReportStatus, IssueCategory, SeverityLevel } from '../types.ts';
import { fetchReports, fetchStats, updateReportStatus } from '../services/api.ts';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge.tsx';
import { CategoryBadge } from '../components/CategoryBadge.tsx';
import {
  Building,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  MapPin,
  Search,
  ExternalLink,
  Edit3,
  X,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigateDetails: (id: string) => void;
  onNavigateTracking: (id: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateDetails,
  onNavigateTracking,
}) => {
  const { currentUser, switchDemoUser } = useAuth();
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Status update modal
  const [editingReport, setEditingReport] = useState<CivicReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('IN_PROGRESS');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [repRes, statRes] = await Promise.all([
        fetchReports({
          category: categoryFilter,
          status: statusFilter,
          severity: severityFilter,
          search,
        }),
        fetchStats(),
      ]);
      setReports(repRes.reports);
      setStats(statRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [categoryFilter, statusFilter, severityFilter]);

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;
    setUpdating(true);
    try {
      await updateReportStatus(
        editingReport.id,
        newStatus,
        statusNote || `Status updated to ${newStatus} by ${currentUser.name}`,
        currentUser.name
      );
      setEditingReport(null);
      setStatusNote('');
      loadAll();
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Portal Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-xs font-semibold mb-2">
            <Building className="w-3.5 h-3.5 text-purple-400" />
            <span>Municipal Authority Operations Portal</span>
            <span>•</span>
            <span>{currentUser.city} Civic Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Work Order & Triage Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.role === 'admin' ? 'Designated Municipal Officer' : 'Citizen View Mode'}).
            Manage civic work orders, transition SLA statuses, and review AI entity categorizations.
          </p>
        </div>

        {/* Quick Demo Switcher Pill for judges */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 shrink-0 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Reviewer Role Toggle:
          </span>
          <button
            onClick={() => switchDemoUser(currentUser.role === 'admin' ? 'citizen' : 'admin')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Switch to {currentUser.role === 'admin' ? 'Citizen (Rahul)' : 'Admin (Officer Priya)'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Dockets
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Across all municipal wards</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Critical / High Hazard
            </span>
            <div className="text-3xl font-extrabold text-rose-700 mt-1">
              {(stats.bySeverity?.critical || 0) + (stats.bySeverity?.high || 0)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Requiring immediate engineering crew</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Active In-Flight
            </span>
            <div className="text-3xl font-extrabold text-amber-800 mt-1">
              {(stats.byStatus?.underReview || 0) + (stats.byStatus?.assigned || 0) + (stats.byStatus?.inProgress || 0)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">In triage or active repair</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Resolved & Verified
            </span>
            <div className="text-3xl font-extrabold text-emerald-700 mt-1">
              {stats.byStatus?.resolved || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Civic works finalized</p>
          </div>
        </div>
      )}

      {/* Category Breakdown Progress */}
      {stats?.categoryStats && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Departmental Issue Volume
              </h2>
              <p className="text-xs text-slate-500">Distribution across municipal jurisdictions</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700">Live Telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.categoryStats.map((item: any) => (
              <div key={item.category} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.category.replace('_', ' ')}</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {item.count}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${Math.min(100, (item.count / (stats.total || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dockets..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <button
          onClick={loadAll}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          title="Refresh table"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Docket ID</th>
                <th className="px-4 py-3">Category & Title</th>
                <th className="px-4 py-3">Ward / Location</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Assigned Authority</th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {r.id}
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CategoryBadge category={r.category} size="sm" />
                    </div>
                    <span className="font-bold text-slate-900 line-clamp-1 block">
                      {r.aiAnalysis?.complaint_title || r.originalDescription}
                    </span>
                  </td>
                  <td className="px-4 py-4 max-w-[180px]">
                    <span className="font-medium text-slate-800 line-clamp-1">{r.address}</span>
                    <span className="text-[11px] text-slate-400 block">{r.area}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <SeverityBadge severity={r.severity} size="sm" />
                  </td>
                  <td className="px-4 py-4 max-w-[180px]">
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {r.assignedAuthorityName}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {r.assignedAuthorityDept}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                    <button
                      onClick={() => {
                        setEditingReport(r);
                        setNewStatus(r.status);
                        setStatusNote('');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors"
                      title="Update official status"
                    >
                      <Edit3 className="w-3 h-3" />
                      Status
                    </button>
                    <button
                      onClick={() => onNavigateDetails(r.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
                    >
                      Docket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {editingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-mono">Updating {editingReport.id}</span>
                <h3 className="font-bold text-sm text-white">Transition Docket Status</h3>
              </div>
              <button
                onClick={() => setEditingReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  New Official Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl font-semibold bg-white"
                >
                  <option value="SUBMITTED">SUBMITTED — Initial citizen filing</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW — In AI / manual triage</option>
                  <option value="ASSIGNED">ASSIGNED — Delegated to field division</option>
                  <option value="IN_PROGRESS">IN_PROGRESS — Field crew deployed / work underway</option>
                  <option value="RESOLVED">RESOLVED — Remediated and verified</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Official Work Order Note / Remarks
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Work order #WO-2026-44 issued. Contractor mobilized with cold-mix asphalt patch team. Expected completion 18:00 hrs."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px]">
                Signed by: <strong>{currentUser.name}</strong> ({currentUser.role})
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold"
                >
                  {updating ? 'Saving...' : 'Commit Status Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { CivicReport, IssueCategory, ReportStatus, SeverityLevel } from '../types.ts';
import { fetchReports } from '../services/api.ts';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge.tsx';
import { CategoryBadge } from '../components/CategoryBadge.tsx';
import {
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  Eye,
  Clock,
  RefreshCw,
  Building,
} from 'lucide-react';

interface MyReportsViewProps {
  onNavigate: (view: string, reportId?: string) => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [viewScope, setViewScope] = useState<'my' | 'community'>('my');

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchReports({
        userId: viewScope === 'my' && currentUser.role === 'citizen' ? currentUser.id : undefined,
        status: statusFilter,
        category: categoryFilter,
        severity: severityFilter,
        search: searchTerm,
      });
      setReports(res.reports);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [statusFilter, categoryFilter, severityFilter, viewScope, currentUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadReports();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & New Report CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Civic Issue Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor reported civic problems, track municipal resolution progress, and audit formal dockets.
          </p>
        </div>

        <button
          id="new-report-btn"
          onClick={() => onNavigate('report')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Report Civic Issue
        </button>
      </div>

      {/* Scope Toggle (My vs All Community) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setViewScope('my')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewScope === 'my'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Submissions ({currentUser.name})
        </button>
        <button
          onClick={() => setViewScope('community')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewScope === 'community'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Public Community Reports
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, keyword, street address, or ward..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under AI Review</option>
              <option value="ASSIGNED">Authority Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved & Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Category Filter
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="ROAD_POTHOLE">Roads & Potholes</option>
              <option value="GARBAGE">Waste Management</option>
              <option value="STREETLIGHT">Streetlights</option>
              <option value="WATER_LEAKAGE">Water Leakage</option>
              <option value="DRAINAGE">Drainage</option>
              <option value="TRAFFIC_SAFETY">Public Safety</option>
              <option value="PUBLIC_PROPERTY">Public Infrastructure</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Severity Level
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Hazard</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Severity</option>
              <option value="LOW">Low Severity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {reports.length} reports</span>
          <button
            onClick={loadReports}
            className="hover:text-slate-900 inline-flex items-center gap-1 font-medium"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Filtering public reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-slate-500 text-sm">No reports matching selected filters.</p>
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
                setSeverityFilter('ALL');
                setSearchTerm('');
              }}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {report.id}
                    </span>
                    <CategoryBadge category={report.category} size="sm" />
                    <SeverityBadge severity={report.severity} size="sm" />
                    <StatusBadge status={report.status} size="sm" />
                  </div>

                  <h3
                    onClick={() => onNavigate('details', report.id)}
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors line-clamp-1"
                  >
                    {report.aiAnalysis?.complaint_title || report.originalDescription}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {report.originalDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[220px]">{report.address}, {report.area}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{report.assignedAuthorityName}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onNavigate('tracking', report.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-xs font-semibold text-slate-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Track SLA
                  </button>
                  <button
                    onClick={() => onNavigate('details', report.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
                  >
                    View Docket
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

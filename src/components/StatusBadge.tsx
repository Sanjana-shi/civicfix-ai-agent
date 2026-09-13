import React from 'react';
import { ReportStatus, SeverityLevel } from '../types.ts';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, Flame, Info } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = {
    SUBMITTED: {
      label: 'Submitted',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Clock,
    },
    UNDER_REVIEW: {
      label: 'Under AI Review',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Info,
    },
    ASSIGNED: {
      label: 'Authority Assigned',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: ShieldCheck,
    },
    IN_PROGRESS: {
      label: 'Work In Progress',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertTriangle,
    },
    RESOLVED: {
      label: 'Resolved & Closed',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
    },
  }[status] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };

  const Icon = config.icon;
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <span
      id={`status-badge-${status.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border whitespace-nowrap ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const config = {
    LOW: {
      label: 'Low Severity',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    MEDIUM: {
      label: 'Medium Severity',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    HIGH: {
      label: 'High Priority',
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      dot: 'bg-amber-500',
    },
    CRITICAL: {
      label: 'Critical Hazard',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-600',
    },
  }[severity] || {
    label: severity,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <span
      id={`severity-badge-${severity.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border whitespace-nowrap ${config.bg} ${sizeClasses}`}
    >
      <span className={`rounded-full ${config.dot} ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      {config.label}
    </span>
  );
};

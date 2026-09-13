import React from 'react';
import { IssueCategory } from '../types.ts';
import {
  Car,
  Trash2,
  Lightbulb,
  Droplets,
  Waves,
  ShieldAlert,
  Building2,
  HelpCircle,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: IssueCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const CATEGORY_META: Record<
  IssueCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string }
> = {
  ROAD_POTHOLE: {
    label: 'Roads & Potholes',
    icon: Car,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  GARBAGE: {
    label: 'Waste Management',
    icon: Trash2,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  STREETLIGHT: {
    label: 'Streetlights & Power',
    icon: Lightbulb,
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
  WATER_LEAKAGE: {
    label: 'Water Supply & Mains',
    icon: Droplets,
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
  },
  DRAINAGE: {
    label: 'Drainage & Stormwater',
    icon: Waves,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  TRAFFIC_SAFETY: {
    label: 'Traffic & Pedestrian Safety',
    icon: ShieldAlert,
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  PUBLIC_PROPERTY: {
    label: 'Public Infrastructure',
    icon: Building2,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  OTHER: {
    label: 'General Civic Issue',
    icon: HelpCircle,
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
}) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.OTHER;
  const Icon = meta.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <span
      id={`cat-badge-${category.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border whitespace-nowrap ${meta.bg} ${meta.color} ${meta.border} ${sizeClasses}`}
    >
      {showIcon && (
        <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      )}
      {meta.label}
    </span>
  );
};

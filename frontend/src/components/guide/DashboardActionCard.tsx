import type { ReactNode } from 'react';

interface DashboardActionCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onClick?: () => void;
  icon: ReactNode;
}

export function DashboardActionCard({ title, description, actionLabel, onClick, icon }: DashboardActionCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/50 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition group-hover:border-brand-primary group-hover:text-brand-primary"
      >
        {actionLabel}
        <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
      </button>
    </div>
  );
}

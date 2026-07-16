'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Tab = {
  key: string;
  label: string;
  count?: number;
  content: ReactNode;
};

export function ProfileTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div>
      <div className="flex items-center gap-8 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={cn(
              'relative pb-3 text-sm font-semibold text-slate-400 transition-colors hover:text-slate-700',
              active === tab.key && 'text-slate-900'
            )}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <sup className="ml-1 text-xs font-semibold text-slate-400">{tab.count}</sup>
            )}
            {active === tab.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-primary" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-8">{tabs.find((tab) => tab.key === active)?.content}</div>
    </div>
  );
}

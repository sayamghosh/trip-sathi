"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CheckCheck, Edit, Eye, Map, Phone, Plus, Layers, TrendingUp } from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';
import tourPlanService from '../../../services/tourPlan.service';
import callbackService from '../../../services/callback.service';
import type { TourPlanSummary } from '../../../types/tourPlan';
import type { GuideCallbackItem } from '../../../services/callback.service';
import { DashboardActionCard } from '../../../components/guide/DashboardActionCard';
import { InsightChart } from '../../../components/guide/InsightChart';

const viewsData = [
  { week: 'Mon', views: 0 },
  { week: 'Tue', views: 0 },
  { week: 'Wed', views: 0 },
  { week: 'Thu', views: 0 },
  { week: 'Fri', views: 0 },
  { week: 'Sat', views: 0 },
  { week: 'Sun', views: 0 },
];

const ctrData = [
  { week: 'Mon', ctr: 0 },
  { week: 'Tue', ctr: 0 },
  { week: 'Wed', ctr: 0 },
  { week: 'Thu', ctr: 0 },
  { week: 'Fri', ctr: 0 },
  { week: 'Sat', ctr: 0 },
  { week: 'Sun', ctr: 0 },
];

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const TIME_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Infinity, unit: 'year' },
];

const formatCurrency = (amount?: number) => currencyFormatter.format(typeof amount === 'number' ? amount : 0);

const parseDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatRelativeDate = (value?: string) => {
  const date = parseDate(value);
  if (!date) return 'just now';
  let duration = (date.getTime() - Date.now()) / 1000;
  for (const division of TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount || division.amount === Infinity) {
      return relativeTimeFormatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return 'soon';
};

type GuidePlan = TourPlanSummary & { createdAt?: string; updatedAt?: string; views?: number };

const formatPlanDuration = (plan: GuidePlan) => {
  if (plan?.durationDays && plan?.durationNights != null) {
    return `${plan.durationDays}D / ${plan.durationNights}N`;
  }
  if (plan?.durationDays) return `${plan.durationDays} days`;
  return 'Flexible';
};

const planTimestamp = (plan: GuidePlan) => parseDate(plan?.updatedAt)?.getTime() ?? parseDate(plan?.createdAt)?.getTime() ?? 0;

export default function GuideDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<GuidePlan[]>([]);
  const [callbacks, setCallbacks] = useState<GuideCallbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [plansResponse, callbacksResponse] = await Promise.all([
        tourPlanService.getTourPlansByGuide(),
        callbackService.getGuideCallbacks(),
      ]);
      setPlans(plansResponse || []);
      setCallbacks(callbacksResponse || []);
    } catch (loadError) {
      console.error('Failed to load dashboard', loadError);
      setError('We could not load your dashboard data. Please try again.');
      toast.error('Unable to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/become-a-guide');
      return;
    }
    if (user?.role !== 'guide') {
      router.push('/');
      return;
    }
    loadDashboard();
  }, [isAuthenticated, user, router, loadDashboard]);

  const totalViews = useMemo(
    () => plans.reduce((acc, plan) => acc + (plan?.views || 0), 0),
    [plans],
  );

  const plansByViews = useMemo(
    () =>
      [...plans]
        .sort((a, b) => (b?.views || 0) - (a?.views || 0))
        .slice(0, 5)
        .map((plan) => ({
          name: plan.title?.split(' ').slice(0, 2).join(' ') || 'Plan',
          views: plan.views || 0,
        })),
    [plans],
  );

  const recentPlans = useMemo(
    () => [...plans].sort((a, b) => planTimestamp(b) - planTimestamp(a)).slice(0, 6),
    [plans],
  );

  const sortedCallbacks = useMemo(
    () =>
      [...callbacks].sort((a, b) => {
        const first = parseDate(a?.createdAt)?.getTime() ?? 0;
        const second = parseDate(b?.createdAt)?.getTime() ?? 0;
        return first - second;
      }),
    [callbacks],
  );

  const pendingQueue = useMemo(
    () => sortedCallbacks.filter((callback) => callback.status !== 'contacted'),
    [sortedCallbacks],
  );

  const pendingCallbacksCount = pendingQueue.length;
  const nextCallback = pendingQueue[0] || null;
  const callbacksList = nextCallback ? sortedCallbacks.filter((callback) => callback._id !== nextCallback._id) : sortedCallbacks;
  const hasCallbacks = sortedCallbacks.length > 0;

  const stats = [
    {
      label: 'Active plans',
      value: plans.length,
      helper: 'Published packages',
      icon: <Map size={18} className="text-brand-primary" />,
    },
    {
      label: 'Total views',
      value: totalViews,
      helper: 'All time',
      icon: <Eye size={18} className="text-sky-500" />,
    },
    {
      label: 'Callback queue',
      value: pendingCallbacksCount,
      helper: 'Awaiting reply',
      icon: <Phone size={18} className="text-emerald-500" />,
    },
  ];

  const handleNewPlan = useCallback(() => router.push('/guide/tour-plans/create'), [router]);
  const handleProfile = useCallback(() => router.push('/dashboard/profile'), [router]);

  const scrollToSection = useCallback((id: string) => {
    if (typeof window === 'undefined') return;
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleScrollToPlans = useCallback(() => scrollToSection('guide-plans'), [scrollToSection]);
  const handleScrollToCallbacks = useCallback(() => scrollToSection('guide-callbacks'), [scrollToSection]);

  const handleMarkCallback = useCallback(
    async (id: string) => {
      if (!id) return;
      try {
        setMarkingId(id);
        await callbackService.markCallbackAsRead(id);
        setCallbacks((prev) => prev.map((callback) => (callback._id === id ? { ...callback, status: 'contacted' } : callback)));
        toast.success('Marked as read');
      } catch (markError) {
        console.error('Failed to mark callback as read', markError);
        toast.error('Could not mark this request, please retry');
      } finally {
        setMarkingId(null);
      }
    },
    [],
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-start gap-4">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="h-16 w-16 rounded-2xl border border-white object-cover shadow"
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-2xl font-semibold text-white shadow">
                  {user.name?.charAt(0) || 'G'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-500">Guide workspace</p>
                <h1 className="text-2xl font-semibold text-slate-900">Welcome back, {user.name?.split(' ')[0] || 'Guide'}!</h1>
                <p className="text-sm text-slate-500">Manage your plans, responses, and performance in one place.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleProfile}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              >
                <Edit size={16} /> Update profile
              </button>
              <button
                onClick={handleNewPlan}
                className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                <Plus size={16} /> New tour plan
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2">{stat.icon}</div>
              </div>
              <p className="mt-2 text-xs text-slate-400">{stat.helper}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Plan Performance</h2>
                <p className="text-sm text-slate-500">Track your plan views for the week.</p>
              </div>
              <button
                onClick={handleScrollToPlans}
                className="text-sm font-semibold text-brand-primary hover:text-brand-dark"
              >
                See plans
              </button>
            </div>
            <div className="mt-6 h-55">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewsData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(2, 132, 199, 0.1)' }} />
                  <Bar dataKey="views" fill="#0284C7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InsightChart
              title="Top plans"
              subtitle="Views by package"
              data={plansByViews}
              dataKey="views"
              icon={<Eye size={16} className="text-sky-500" />}
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Click-through rate</h2>
                <p className="text-sm text-slate-500">Engagement in the last 7 days.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Avg 3.2%</span>
            </div>
            <div className="mt-6 h-55">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ctrData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(15, 23, 42, 0.06)' }} />
                  <Bar dataKey="ctr" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
              Upload more itineraries and complete your profile to improve conversions.
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" id="guide-callbacks">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Callback Requests</h2>
                <p className="text-sm text-slate-500">Respond quickly to keep travelers engaged.</p>
              </div>
              <button
                onClick={handleScrollToCallbacks}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary"
              >
                <CheckCheck size={16} /> Pending {pendingCallbacksCount}
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {!hasCallbacks ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  No callback requests yet. Keep sharing your plans!
                </div>
              ) : (
                <>
                  {nextCallback && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-emerald-900">Next up</p>
                          <p className="mt-1 text-lg font-semibold text-slate-900">{nextCallback.requesterName || 'Traveler'}</p>
                          <p className="text-sm text-emerald-900/70">{nextCallback.requesterPhone}</p>
                          <p className="text-xs text-emerald-900/60">Requested {formatRelativeDate(nextCallback.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => handleMarkCallback(nextCallback._id)}
                          disabled={markingId === nextCallback._id}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
                        >
                          <CheckCheck size={14} /> {markingId === nextCallback._id ? 'Marking...' : 'Mark as contacted'}
                        </button>
                      </div>
                    </div>
                  )}

                  {callbacksList.map((callback) => (
                    <div key={callback._id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{callback.requesterName || 'Traveler'}</p>
                          <p className="text-xs text-slate-500">{callback.requesterPhone}</p>
                          <p className="text-xs text-slate-400">Requested {formatRelativeDate(callback.createdAt)}</p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${callback.status === 'contacted' ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>
                          {callback.status === 'contacted' ? 'Contacted' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Next steps</h2>
                <p className="text-sm text-slate-500">Suggested actions to grow bookings.</p>
              </div>
              <TrendingUp size={20} className="text-brand-primary" />
            </div>
            <div className="mt-6 grid gap-4">
              <DashboardActionCard
                title="Publish a new plan"
                description="Add another tour plan and attract more travelers."
                actionLabel="Start building"
                icon={<Plus size={18} />}
                onClick={handleNewPlan}
              />
              <DashboardActionCard
                title="Review profile"
                description="Keep your phone and address updated."
                actionLabel="Update profile"
                icon={<Edit size={18} />}
                onClick={handleProfile}
              />
              <DashboardActionCard
                title="View your plans"
                description="Jump to your latest tours in the list below."
                actionLabel="See plans"
                icon={<Layers size={18} />}
                onClick={handleScrollToPlans}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" id="guide-plans">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Your Plans</h2>
              <p className="text-sm text-slate-500">Recently updated itineraries.</p>
            </div>
            <button
              onClick={handleNewPlan}
              className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              <Plus size={16} /> Add plan
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-2xl border border-slate-100 bg-slate-50" />
              ))
            ) : error ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                {error}
              </div>
            ) : recentPlans.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                No plans yet. Create your first tour plan.
              </div>
            ) : (
              recentPlans.map((plan) => (
                <div key={plan._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Updated {formatRelativeDate(plan.updatedAt || plan.createdAt)}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
                      <p className="text-sm text-slate-500">{formatPlanDuration(plan)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{formatCurrency(plan.basePrice)}</span>
                      <Link
                        href={`/guide/tour-plans/${plan._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:text-brand-dark"
                      >
                        <Eye size={14} /> View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

import { createLazyFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState, useMemo, useCallback } from 'react';
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

import { useAuth } from '../../context/AuthContext';
import tourPlanService from '../../services/tourPlan.service';
import callbackService from '../../services/callback.service';
import { DashboardActionCard } from '../../components/guide/DashboardActionCard';
import { InsightChart } from '../../components/guide/InsightChart';

export const Route = createLazyFileRoute('/guide/dashboard')({
  component: GuideDashboardPage,
});

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

const formatDateTime = (value?: string) => {
  const date = parseDate(value);
  if (!date) return 'Not scheduled';
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const formatPlanDuration = (plan: any) => {
  if (plan?.durationDays && plan?.durationNights != null) {
    return `${plan.durationDays}D / ${plan.durationNights}N`;
  }
  if (plan?.durationDays) return `${plan.durationDays} days`;
  return 'Flexible';
};

const planTimestamp = (plan: any) => parseDate(plan?.updatedAt)?.getTime() ?? parseDate(plan?.createdAt)?.getTime() ?? 0;

function GuideDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
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
      navigate({ to: '/become-a-guide' });
      return;
    }
    if (user?.role !== 'guide') {
      navigate({ to: '/' });
      return;
    }
    loadDashboard();
  }, [isAuthenticated, user, navigate, loadDashboard]);

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

  const handleNewPlan = useCallback(() => navigate({ to: '/guide/tour-plans/create' }), [navigate]);
  const handleProfile = useCallback(() => navigate({ to: '/dashboard/profile' }), [navigate]);

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
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-2xl font-semibold text-white shadow">
                  {user.name?.charAt(0) || 'G'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-500">Guide workspace</p>
                <h1 className="mt-1 text-3xl font-semibold text-slate-900">
                  Good to see you, {user.name?.split(' ')[0] || 'Guide'}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Keep your packages fresh, follow up travelers quickly, and stay on top of this week’s opportunities.
                </p>
                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Verified guide
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end md:w-auto">
              <button
                onClick={handleProfile}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-primary hover:text-brand-primary"
              >
                <Edit size={16} />
                Edit profile
              </button>
              <button
                onClick={handleNewPlan}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30 transition hover:bg-brand-dark"
              >
                <Plus size={16} />
                New package
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                  {stat.icon}
                </div>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.helper}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <p className="text-xs text-slate-500">Jump into the most frequent guide tasks</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardActionCard
              title="Publish a new experience"
              description="Build a trip in minutes with saved day templates."
              actionLabel="Start building"
              onClick={handleNewPlan}
              icon={<Plus size={18} />}
            />
            <DashboardActionCard
              title="Manage current plans"
              description="Tweak pricing, update itineraries, or duplicate a package."
              actionLabel="Go to packages"
              onClick={handleScrollToPlans}
              icon={<Layers size={18} />}
            />
            <DashboardActionCard
              title="Call interested travellers"
              description="Respond before someone else picks up the lead."
              actionLabel="Review callbacks"
              onClick={handleScrollToCallbacks}
              icon={<Phone size={18} />}
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Plan views</h3>
                <p className="text-xs text-slate-500">Last 7 days · Placeholder data</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Preview</span>
            </div>
            <div className="mt-4">
              <InsightChart
                title="Daily views"
                subtitle="Guide analytics"
                data={viewsData}
                dataKey="views"
                icon={<Eye size={16} className="text-sky-500" />}
              />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Click-through rate</h3>
                <p className="text-xs text-slate-500">Visitors who opened your package</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Preview</span>
            </div>
            <div className="mt-4">
              <InsightChart
                title="CTR"
                subtitle="Placeholder analytics"
                data={ctrData}
                dataKey="ctr"
                stroke="#8b5cf6"
                icon={<TrendingUp size={16} className="text-violet-500" />}
                suffix="%"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div id="guide-plans" className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Your tour plans</h2>
                <p className="text-sm text-slate-500">Latest updates appear first</p>
              </div>
              <button
                onClick={handleNewPlan}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-primary hover:text-brand-primary"
              >
                <Plus size={14} />
                Create plan
              </button>
            </div>

            <div className="mt-6">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((placeholder) => (
                    <div key={placeholder} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {error}
                  <button
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700"
                    onClick={loadDashboard}
                  >
                    Retry
                  </button>
                </div>
              ) : recentPlans.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-10 text-center">
                  <p className="font-semibold text-slate-700">You have not created any packages yet.</p>
                  <p className="mt-2 text-sm text-slate-500">Create your first tour plan to start sharing it with travellers.</p>
                  <button
                    onClick={handleNewPlan}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-brand-primary/30 hover:bg-brand-dark"
                  >
                    <Plus size={16} />
                    Create your first plan
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPlans.map((plan) => (
                    <div
                      key={plan._id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-brand-primary/50 hover:shadow"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">{plan.title}</p>
                          <p className="text-xs text-slate-500">
                            {formatPlanDuration(plan)} · {formatCurrency(plan.basePrice)}
                          </p>
                        </div>
                        <div className="flex items-center gap-6 text-right">
                          <div>
                            <p className="text-lg font-semibold text-slate-900">{plan.views || 0}</p>
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">Views</p>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">Published</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to="/guide/tour-plans/$id"
                          params={{ id: plan._id }}
                          className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-primary hover:text-brand-primary"
                        >
                          <Eye size={14} />
                          Preview
                        </Link>
                        <Link
                          to="/guide/tour-plans/$id/edit"
                          params={{ id: plan._id }}
                          className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600"
                        >
                          <Edit size={14} />
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {plansByViews.length > 0 && (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Views snapshot</p>
                    <p className="text-xs text-slate-500">Top packages this week</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    <TrendingUp size={14} />
                    Placeholder data
                  </span>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={plansByViews} layout="vertical" barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={90} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(15,23,42,0.15)' }} />
                      <Bar dataKey="views" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          <div id="guide-callbacks" className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Callback queue</h3>
                  <p className="text-xs text-slate-500">Travellers waiting to talk</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {pendingCallbacksCount} pending
                </span>
              </div>

              {isLoading ? (
                <div className="mt-4 space-y-3">
                  {[1, 2].map((placeholder) => (
                    <div key={placeholder} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              ) : !hasCallbacks ? (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">
                  No callback requests yet.
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {nextCallback ? (
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Next in line</p>
                      <p className="mt-2 text-base font-semibold text-slate-900">{nextCallback.requesterName || 'Traveller'}</p>
                      <p className="text-sm text-slate-600">{nextCallback.requesterPhone || 'Phone not shared'}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        Requested {formatRelativeDate(nextCallback.createdAt)} · {formatDateTime(nextCallback.createdAt)}
                      </p>
                      {nextCallback.tourPlanId && (
                        <p className="mt-1 text-xs text-slate-500">
                          Plan: {nextCallback.tourPlanId.title || 'Tour plan'}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleMarkCallback(nextCallback._id)}
                        disabled={markingId === nextCallback._id}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-60"
                      >
                        {markingId === nextCallback._id ? 'Marking…' : 'Mark as read'}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-600">
                      All callbacks are marked as read. Stay ready for the next traveller.
                    </div>
                  )}

                  {callbacksList.length > 0 && (
                    <div className="space-y-3">
                      {callbacksList.map((callback) => {
                        const isContacted = callback.status === 'contacted';
                        return (
                          <div key={callback._id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-900">{callback.requesterName || 'Traveller'}</p>
                                {isContacted && <CheckCheck size={14} className="text-sky-500" aria-label="Read" />}
                              </div>
                              <span className="text-xs text-slate-500">{formatRelativeDate(callback.createdAt)}</span>
                            </div>
                            {callback.tourPlanId?.title && (
                              <p className="text-xs text-slate-500">Plan: {callback.tourPlanId.title}</p>
                            )}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                {callback.requesterPhone || 'No phone'}
                              </span>
                              {callback.tourPlanId?._id && (
                                <Link
                                  to="/guide/tour-plans/$id"
                                  params={{ id: callback.tourPlanId._id }}
                                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-brand-primary hover:text-brand-primary"
                                >
                                  View plan
                                </Link>
                              )}
                              {!isContacted ? (
                                <button
                                  type="button"
                                  onClick={() => handleMarkCallback(callback._id)}
                                  disabled={markingId === callback._id}
                                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition disabled:opacity-60"
                                >
                                  {markingId === callback._id ? 'Marking…' : 'Mark as read'}
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
                                  <CheckCheck size={14} />
                                  Read
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
        </section>
      </div>
    </div>
  );
}

import { createLazyFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import tourPlanService from '../../services/tourPlan.service';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Star, Eye, MousePointerClick, Edit, TrendingUp, Map,
} from 'lucide-react';

export const Route = createLazyFileRoute('/guide/dashboard')({
  component: GuideDashboardPage,
});

// ── Dummy Chart Data (Since real tracking data is not yet available) ─────────
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

function GuideDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/become-a-guide' });
    } else if (user?.role !== 'guide') {
      navigate({ to: '/' });
    } else {
      fetchPlans();
    }
  }, [isAuthenticated, user]);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const data = await tourPlanService.getTourPlansByGuide();
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans', error);
      toast.error('Failed to load tour plans');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const plansBarData = plans.slice(0, 5).map(p => ({
    name: p.title.split(' ').slice(0, 2).join(' '),
    views: p.views || 0
  }));

  const stats = [
    { label: 'Total Views', value: plans.reduce((acc, p) => acc + (p.views || 0), 0).toString(), change: '0%', icon: <Eye className="text-sky-500" size={20} />, bg: 'bg-sky-50', color: 'text-sky-600' },
    { label: 'Avg CTR', value: '0%', change: '0%', icon: <MousePointerClick className="text-violet-500" size={20} />, bg: 'bg-violet-50', color: 'text-violet-600' },
    { label: 'Avg Rating', value: '0★', change: '0', icon: <Star className="text-amber-500" size={20} />, bg: 'bg-amber-50', color: 'text-amber-600' },
    { label: 'Active Plans', value: `${plans.length}`, change: '0 drafts', icon: <Map className="text-emerald-500" size={20} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-16 px-4 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            {user.picture ? (
              <img src={user.picture} alt="Profile" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {user.name?.charAt(0) || 'G'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Welcome back, {user.name?.split(' ')[0]}!</h1>
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-0.5 rounded-full mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Verified Guide
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: '/dashboard/profile' })}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-brand-primary hover:text-white hover:border-brand-primary px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Edit size={16} /> Edit Profile
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-white shadow-sm`}>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mb-3">
                {s.icon}
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
              <p className={`text-xs font-bold mt-1 ${s.color}`}>{s.change} this week</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Views Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Plan Views</h2>
                <p className="text-xs text-gray-400 mt-0.5">This week</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                <TrendingUp size={12} /> 0%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Area type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#viewsGrad)" dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* CTR Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Click-Through Rate</h2>
                <p className="text-xs text-gray-400 mt-0.5">% of viewers who clicked</p>
              </div>
              <div className="flex items-center gap-1 text-violet-600 text-xs font-bold bg-violet-50 px-2.5 py-1 rounded-full">
                <TrendingUp size={12} /> 0%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ctrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip formatter={(val: any) => [`${val}%`, 'CTR'] as any} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Line type="monotone" dataKey="ctr" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Bottom Row: Plan Views Bar + Plan List */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Views per Plan Bar Chart */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-1">Views by Plan</h2>
            <p className="text-xs text-gray-400 mb-6">All-time</p>
            {plans.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={plansBarData} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                  <Bar dataKey="views" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm italic">
                No plans yet
              </div>
            )}
          </div>

          {/* My Tour Plans Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-gray-900">My Tour Packages</h2>
              <button onClick={() => navigate({ to: '/guide/tour-plans/create' })} className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors shadow-sm">+ Create New Package</button>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>
                ))}
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">You haven't created any tour plans yet.</p>
                <button
                  onClick={() => navigate({ to: '/guide/tour-plans/create' })}
                  className="mt-3 text-brand-primary font-bold text-sm hover:underline"
                >
                  Create your first plan →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {plans.map(plan => (
                  <div key={plan._id} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-sky-50 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-semibold text-gray-800 truncate">{plan.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{plan.durationDays}D/{plan.durationNights}N · ₹{plan.basePrice}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-5 text-center pr-4 border-r border-gray-200">
                        <div>
                          <p className="text-sm font-bold text-gray-700">{plan.views || 0}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Views</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700`}>
                          Published
                        </span>
                      </div>
                      <div className="flex items-center gap-2 transition-opacity">
                        <Link
                          to="/guide/tour-plans/$id"
                          params={{ id: plan._id }}
                          className="p-2 bg-white rounded-lg text-gray-600 hover:text-blue-600 hover:bg-white shadow-sm transition-all border border-gray-100"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to="/guide/tour-plans/$id/edit"
                          params={{ id: plan._id }}
                          className="p-2 bg-white rounded-lg text-gray-600 hover:text-amber-600 hover:bg-white shadow-sm transition-all border border-gray-100"
                          title="Edit Plan"
                        >
                          <Edit size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

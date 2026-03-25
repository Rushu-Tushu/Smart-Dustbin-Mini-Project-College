import { Trash2, AlertTriangle, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { useBins } from '../hooks/useBins';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import FillLevelBar from '../components/ui/FillLevelBar';
import Button from '../components/ui/Button';
import { SkeletonCard, SkeletonRow } from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { bins, stats, loading, fetchBins } = useBins();

  const fullBins = bins.filter(b => b.status === 'full').slice(0, 5);

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Good {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening across your bin network.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<RefreshCw size={14} />}
          onClick={fetchBins}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <div className="animate-fade-in stagger-1">
              <StatCard label="Total Bins" value={stats.total} icon={Trash2} color="teal" sub="Active bins" />
            </div>
            <div className="animate-fade-in stagger-2">
              <StatCard label="Full Bins" value={stats.full} icon={AlertTriangle} color="red" sub="Need collection" />
            </div>
            <div className="animate-fade-in stagger-3">
              <StatCard label="Medium Bins" value={stats.medium} icon={Clock} color="yellow" sub="Monitor closely" />
            </div>
            <div className="animate-fade-in stagger-4">
              <StatCard label="Low Bins" value={stats.low} icon={TrendingUp} color="slate" sub="All good" />
            </div>
          </>
        )}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Full bins alert */}
        <div className="lg:col-span-2 animate-fade-in stagger-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Full Bins — Immediate Action</h2>
                <p className="text-xs text-slate-400 mt-0.5">Bins above 75% fill level</p>
              </div>
              <Link to="/admin/bins">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    {['Bin ID', 'Location', 'Fill Level', 'Status', 'Worker'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
                  ) : fullBins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                        🎉 No full bins right now!
                      </td>
                    </tr>
                  ) : (
                    fullBins.map(bin => (
                      <tr key={bin._id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 text-xs font-mono font-medium text-slate-700">{bin.binId}</td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 max-w-[140px] truncate">{bin.location}</td>
                        <td className="px-5 py-3.5 w-36">
                          <FillLevelBar level={bin.fillLevel} />
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={bin.status} />
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          {bin.assignedWorker?.name || <span className="text-slate-300">—</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary panel */}
        <div className="animate-fade-in stagger-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Fleet Health</h2>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-8 rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { label: 'Low (< 40%)', count: stats.low, total: stats.total, color: 'bg-green-400' },
                  { label: 'Medium (40–74%)', count: stats.medium, total: stats.total, color: 'bg-yellow-400' },
                  { label: 'Full (≥ 75%)', count: stats.full, total: stats.total, color: 'bg-red-400' },
                ].map(({ label, count, total, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-medium text-slate-700">{count} / {total}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-700`}
                        style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">Quick actions</p>
                  <Link to="/admin/bins">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage all bins
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

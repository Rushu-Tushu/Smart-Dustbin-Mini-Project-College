import { useState } from 'react';
import { CheckCircle2, MapPin, RefreshCw, AlertTriangle, Clock, Trash2 } from 'lucide-react';
import { useWorkerTasks } from '../hooks/useWorkerTasks';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatusBadge from '../components/ui/StatusBadge';
import FillLevelBar from '../components/ui/FillLevelBar';
import Button from '../components/ui/Button';
import { SkeletonTaskCard } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks, markCleaned } = useWorkerTasks();
  const [cleaningId, setCleaningId] = useState(null);

  const handleMarkCleaned = async (id) => {
    setCleaningId(id);
    try {
      await markCleaned(id);
    } catch {
      toast.error('Failed to update bin status');
    } finally {
      setCleaningId(null);
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'low' || t.fillLevel > 10);
  const doneTasks = tasks.filter(t => t.status === 'low' && t.fillLevel <= 10);

  const priorityColor = (status) => ({
    full: 'border-l-red-400',
    medium: 'border-l-yellow-400',
    low: 'border-l-green-400',
  }[status]);

  const priorityLabel = (status) => ({
    full: '🔴 High Priority',
    medium: '🟡 Medium Priority',
    low: '🟢 Low Priority',
  }[status]);

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              My Tasks
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Hello, {user?.name?.split(' ')[0]}! You have{' '}
              <span className="font-semibold text-slate-700">{pendingTasks.length}</span>{' '}
              {pendingTasks.length === 1 ? 'bin' : 'bins'} needing attention.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={fetchTasks}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Assigned', value: tasks.length, icon: Trash2, bg: 'bg-slate-100', text: 'text-slate-600' },
            { label: 'Need Cleaning', value: pendingTasks.length, icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600' },
            { label: 'Cleaned Today', value: doneTasks.length, icon: CheckCircle2, bg: 'bg-green-50', text: 'text-green-600' },
          ].map(({ label, value, icon: Icon, bg, text }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
              <div className={`size-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={16} className={text} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`text-lg font-bold ${text}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonTaskCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 py-16 text-center shadow-sm">
            <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">No bins assigned</h3>
            <p className="text-xs text-slate-400">Ask your admin to assign bins to your account.</p>
          </div>
        )}

        {/* Task cards — pending */}
        {!loading && pendingTasks.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              Needs Cleaning
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {pendingTasks.map((task, i) => (
                <div
                  key={task._id}
                  className={`bg-white rounded-xl border border-slate-200 border-l-4 ${priorityColor(task.status)} shadow-sm p-5 flex flex-col gap-4 animate-fade-in`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-900">{task.binId}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{priorityLabel(task.status)}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{task.location}</span>
                  </div>

                  {/* Fill level */}
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Fill Level</p>
                    <FillLevelBar level={task.fillLevel} />
                  </div>

                  {/* Last updated */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={11} />
                    Updated {formatDate(task.updatedAt)}
                  </div>

                  {/* Action */}
                  <Button
                    size="sm"
                    className="w-full"
                    loading={cleaningId === task._id}
                    onClick={() => handleMarkCleaned(task._id)}
                    icon={<CheckCircle2 size={14} />}
                  >
                    Mark as Cleaned
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Task cards — done */}
        {!loading && doneTasks.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" />
              Cleaned / Low Level
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
              {doneTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-green-300 p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono font-bold text-slate-700">{task.binId}</p>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin size={12} />
                    <span className="truncate">{task.location}</span>
                  </div>
                  <FillLevelBar level={task.fillLevel} />
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={12} />
                    Cleaned ✓
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, RefreshCw, Filter } from 'lucide-react';
import { useBins } from '../hooks/useBins';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import FillLevelBar from '../components/ui/FillLevelBar';
import BinFormModal from '../components/ui/BinFormModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { SkeletonRow } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['all', 'low', 'medium', 'full'];

export default function AdminBins() {
  const { bins, loading, fetchBins, createBin, updateBin, deleteBin } = useBins();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editBin, setEditBin] = useState(null);
  const [deletingBin, setDeletingBin] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = useMemo(() => {
    return bins.filter(b => {
      const matchSearch =
        b.binId.toLowerCase().includes(search.toLowerCase()) ||
        b.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bins, search, statusFilter]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteBin(deletingBin._id);
      setDeletingBin(null);
    } catch {
      toast.error('Failed to delete bin');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Manage Bins</h1>
            <p className="text-sm text-slate-500 mt-0.5">{bins.length} bins in your network</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={fetchBins} loading={loading}>
              Refresh
            </Button>
            <Button size="sm" icon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
              Add bin
            </Button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-wrap gap-3 items-center mb-5 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
              placeholder="Search by ID or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-400" />
            <div className="flex gap-1">
              {STATUS_FILTERS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    statusFilter === s
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Bin ID', 'Location', 'Fill Level', 'Status', 'Assigned Worker', 'Last Updated', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Trash2 size={18} className="text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">No bins found</p>
                        <p className="text-xs text-slate-400">
                          {search || statusFilter !== 'all' ? 'Try adjusting filters' : 'Add your first bin'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(bin => (
                    <tr key={bin._id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-3.5 text-xs font-mono font-semibold text-slate-800">{bin.binId}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 max-w-[160px]">
                        <span className="truncate block">{bin.location}</span>
                      </td>
                      <td className="px-5 py-3.5 w-40">
                        <FillLevelBar level={bin.fillLevel} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={bin.status} />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {bin.assignedWorker?.name
                          ? <span className="font-medium text-slate-700">{bin.assignedWorker.name}</span>
                          : <span className="text-slate-300 italic">Unassigned</span>
                        }
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap font-mono">
                        {formatDate(bin.updatedAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditBin(bin)}
                            className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingBin(bin)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing {filtered.length} of {bins.length} bins
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BinFormModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={createBin}
      />
      <BinFormModal
        isOpen={Boolean(editBin)}
        onClose={() => setEditBin(null)}
        onSubmit={(data) => updateBin(editBin._id, data)}
        bin={editBin}
      />
      <ConfirmModal
        isOpen={Boolean(deletingBin)}
        onClose={() => setDeletingBin(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Remove Bin"
        message={`Are you sure you want to remove bin "${deletingBin?.binId}"? This action cannot be undone.`}
      />
    </DashboardLayout>
  );
}

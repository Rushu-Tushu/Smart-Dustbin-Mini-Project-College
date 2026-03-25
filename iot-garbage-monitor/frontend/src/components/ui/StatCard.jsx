export default function StatCard({ label, value, icon: Icon, color = 'teal', sub }) {
  const colors = {
    teal:   { bg: 'bg-teal-50',   icon: 'text-teal-600',   val: 'text-teal-700' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-500',    val: 'text-red-600'  },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-500', val: 'text-yellow-600' },
    slate:  { bg: 'bg-slate-100', icon: 'text-slate-500',  val: 'text-slate-700' },
  };
  const c = colors[color] || colors.teal;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-start gap-4">
      <div className={`size-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={c.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
        <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

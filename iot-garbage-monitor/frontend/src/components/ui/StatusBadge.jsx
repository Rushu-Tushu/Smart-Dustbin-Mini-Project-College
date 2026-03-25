const config = {
  low:    { label: 'Low',    cls: 'status-low' },
  medium: { label: 'Medium', cls: 'status-medium' },
  full:   { label: 'Full',   cls: 'status-full' },
};

export default function StatusBadge({ status }) {
  const { label, cls } = config[status] || config.low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-slate-50">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="skeleton h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="skeleton h-3 w-24 mb-3" />
      <div className="skeleton h-8 w-16 mb-1" />
      <div className="skeleton h-3 w-32" />
    </div>
  );
}

export function SkeletonTaskCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex justify-between mb-3">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton h-3 w-full mb-4" />
      <div className="skeleton h-1.5 w-full rounded-full mb-4" />
      <div className="skeleton h-9 w-full rounded-lg" />
    </div>
  );
}

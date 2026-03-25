export default function FillLevelBar({ level = 0, showLabel = true }) {
  const barClass =
    level < 40 ? 'fill-bar-low' :
    level < 75 ? 'fill-bar-medium' :
    'fill-bar-full';

  const textColor =
    level < 40 ? 'text-green-600' :
    level < 75 ? 'text-yellow-600' :
    'text-red-600';

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClass}`}
          style={{ width: `${Math.min(100, Math.max(0, level))}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-mono font-medium w-10 text-right ${textColor}`}>
          {level}%
        </span>
      )}
    </div>
  );
}

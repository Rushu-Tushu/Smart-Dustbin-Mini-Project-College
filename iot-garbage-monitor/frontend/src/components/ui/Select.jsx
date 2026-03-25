export default function Select({
  label,
  error,
  className = '',
  options = [],
  placeholder,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <select
        className={`
          w-full px-3 py-2.5 rounded-lg text-sm
          border bg-white text-slate-900
          transition-colors duration-150 outline-none cursor-pointer
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-50'
          }
        `}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

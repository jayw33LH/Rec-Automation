import CopyButton from './CopyButton';
import LoadingDots from './LoadingDots';

export default function OutputBlock({ label, value, onChange, isLoading, error, rows = 12 }) {
  if (!isLoading && !value && !error) return null;

  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {label}
          {isLoading && <LoadingDots />}
        </span>
        {!isLoading && value && <CopyButton getText={() => value} />}
      </div>

      {error ? (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={e => onChange?.(e.target.value)}
          rows={rows}
          className={`w-full px-3 py-2.5 rounded-lg border text-sm font-mono leading-relaxed resize-y
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30
            ${isLoading
              ? 'border-blue-200 bg-blue-50/30 text-gray-700'
              : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
            }`}
        />
      )}
    </div>
  );
}

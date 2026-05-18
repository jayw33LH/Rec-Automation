import CopyButton from './CopyButton';
import LoadingDots from './LoadingDots';

export default function OutputBlock({ label, value, onChange, isLoading, error, rows = 12 }) {
  if (!isLoading && !value && !error) return null;

  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-lh-500 uppercase tracking-widest flex items-center gap-2">
          {label}
          {isLoading && <LoadingDots />}
        </span>
        {!isLoading && value && <CopyButton getText={() => value} />}
      </div>

      {error ? (
        <div className="p-3 rounded border border-red-800/50 bg-red-950/30 text-red-400 text-sm font-mono">
          {error}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={e => onChange?.(e.target.value)}
          rows={rows}
          className={`w-full px-4 py-3 rounded border text-sm leading-relaxed resize-y
            transition-colors focus:outline-none focus:ring-1 focus:ring-lh-500/40
            font-sans
            ${isLoading
              ? 'border-lh-800/50 bg-lh-950/20 text-gray-600'
              : 'border-gray-200 bg-white text-gray-800 hover:border-lh-300/50 focus:border-lh-400/60'
            }`}
        />
      )}
    </div>
  );
}

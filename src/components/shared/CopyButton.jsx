import { useState } from 'react';

export default function CopyButton({ getText, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = typeof getText === 'function' ? getText() : getText;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-xs font-mono rounded border transition-all duration-150 tracking-wide
        ${copied
          ? 'bg-lh-500/10 border-lh-500/50 text-lh-400'
          : 'bg-transparent border-lh-800 text-lh-500 hover:border-lh-500 hover:text-lh-300 hover:bg-lh-900/30'
        } ${className}`}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

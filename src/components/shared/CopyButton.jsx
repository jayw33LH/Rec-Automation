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
      className={`px-3 py-1.5 text-sm rounded-md border transition-all duration-150
        ${copied
          ? 'bg-green-50 border-green-300 text-green-700'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
        } ${className}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

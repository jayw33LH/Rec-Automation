import { useState } from 'react';
import { getApiKey, saveApiKey } from '../anthropic';

export default function ApiKeyGate({ children }) {
  const [hasKey, setHasKey] = useState(Boolean(getApiKey()));
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  if (hasKey) return children;

  const handleSubmit = e => {
    e.preventDefault();
    const key = input.trim();
    if (!key) return;
    if (!key.startsWith('sk-')) {
      setError('Key should start with sk-ant-...');
      return;
    }
    saveApiKey(key);
    setHasKey(true);
  };

  return (
    <div className="min-h-screen bg-lh-950 flex items-center justify-center p-4"
      style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #1e104010 0%, transparent 60%), radial-gradient(circle at 70% 20%, #7b5cbf08 0%, transparent 50%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="text-lh-400 text-sm font-light tracking-[0.3em] uppercase leading-none mb-1">
            lawrence
          </div>
          <div className="inline-block bg-white px-3 py-1">
            <span className="text-lh-950 text-xl font-black tracking-[0.25em] uppercase leading-none">
              HARVEY
            </span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-lh-600 tracking-widest uppercase">
            Recruiting OS
          </div>
        </div>

        <div className="bg-lh-900/60 rounded-lg border border-lh-800/60 p-8 backdrop-blur-sm">
          <h2 className="text-white text-base font-semibold mb-1 tracking-wide">API Key Required</h2>
          <p className="text-lh-400 text-sm mb-6 leading-relaxed">
            Enter your Anthropic API key to continue. Stored in sessionStorage for this tab only.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              placeholder="sk-ant-api03-..."
              autoFocus
              className="w-full px-3 py-2.5 rounded bg-lh-950 border border-lh-800 text-white text-sm
                font-mono placeholder-lh-700 focus:outline-none focus:border-lh-500
                focus:ring-1 focus:ring-lh-500/40 transition-colors"
            />
            {error && <p className="text-sm text-red-400 font-mono">{error}</p>}
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-full py-2.5 rounded bg-lh-600 text-white text-sm font-semibold
                hover:bg-lh-500 active:bg-lh-700 transition-colors tracking-wide
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </form>

          <p className="text-xs text-lh-700 mt-4 text-center font-mono">
            console.anthropic.com
          </p>
        </div>
      </div>
    </div>
  );
}

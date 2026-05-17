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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Recruiting Workflow</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your Anthropic API key to get started. It's kept in sessionStorage for this tab only and never sent anywhere except the Anthropic API.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(''); }}
            placeholder="sk-ant-api03-..."
            autoFocus
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
              hover:bg-blue-700 active:bg-blue-800 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Get your key at console.anthropic.com
        </p>
      </div>
    </div>
  );
}

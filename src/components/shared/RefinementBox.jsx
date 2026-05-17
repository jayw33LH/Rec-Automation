import { useState, useRef } from 'react';
import { createClient, MODEL, MAX_TOKENS } from '../../anthropic';
import LoadingDots from './LoadingDots';

export default function RefinementBox({ currentOutput, onRefined, maxTokens = MAX_TOKENS }) {
  const [feedback, setFeedback] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  if (!currentOutput) return null;

  const handleRefine = async () => {
    const fb = feedback.trim();
    if (!fb) return;

    mountedRef.current = true;
    setIsRefining(true);
    setError(null);

    let refined = '';
    try {
      const stream = createClient().messages.stream({
        model: MODEL,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: `Here is content that was previously generated:

${currentOutput}

Please revise it based on this feedback:
${fb}

Output ONLY the revised content. Keep exactly the same format and structure as the original. No preamble, no explanation, nothing else.`,
          },
        ],
      });

      for await (const chunk of stream) {
        if (!mountedRef.current) break;
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          refined += chunk.delta.text;
          onRefined(refined);
        }
      }

      if (mountedRef.current) setFeedback('');
    } catch (err) {
      if (mountedRef.current) setError(err.message || 'Something went wrong');
    } finally {
      if (mountedRef.current) setIsRefining(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-700">Refine this output</span>
        {isRefining && <LoadingDots />}
      </div>
      <textarea
        value={feedback}
        onChange={e => { setFeedback(e.target.value); setError(null); }}
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRefine(); }}
        placeholder="Describe what's off — Claude will revise the output above based on your notes..."
        rows={3}
        disabled={isRefining}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
          resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300
          disabled:opacity-50 disabled:bg-gray-50"
      />
      {error && <p className="text-sm text-red-600 mt-1.5">{error}</p>}
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={handleRefine}
          disabled={!feedback.trim() || isRefining}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium
            hover:bg-slate-700 active:bg-slate-900 transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isRefining ? 'Refining...' : 'Refine'}
        </button>
        <span className="text-xs text-gray-400">or Cmd+Enter</span>
      </div>
    </div>
  );
}

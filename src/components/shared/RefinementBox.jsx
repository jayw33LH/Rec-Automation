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
        <span className="text-xs font-mono font-medium text-lh-500 uppercase tracking-widest">
          Refine output
        </span>
        {isRefining && <LoadingDots />}
      </div>
      <textarea
        value={feedback}
        onChange={e => { setFeedback(e.target.value); setError(null); }}
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRefine(); }}
        placeholder="Describe what's off — Claude will revise the output above..."
        rows={3}
        disabled={isRefining}
        className="w-full px-3 py-2.5 rounded border border-gray-200 text-sm leading-relaxed
          resize-y focus:outline-none focus:ring-1 focus:ring-lh-500/30 focus:border-lh-400/50
          hover:border-lh-300/50 disabled:opacity-50 disabled:bg-gray-50 transition-colors"
      />
      {error && <p className="text-sm text-red-500 mt-1.5 font-mono">{error}</p>}
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={handleRefine}
          disabled={!feedback.trim() || isRefining}
          className="px-4 py-2 rounded bg-lh-950 text-white text-sm font-medium
            hover:bg-lh-900 border border-lh-800 hover:border-lh-600 transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
        >
          {isRefining ? 'Refining...' : 'Refine'}
        </button>
        <span className="text-xs text-gray-400 font-mono">or ⌘+Enter</span>
      </div>
    </div>
  );
}

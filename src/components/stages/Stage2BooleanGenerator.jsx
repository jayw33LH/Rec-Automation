import { useState, useEffect } from 'react';
import { client, MODEL, MAX_TOKENS } from '../../anthropic';
import CopyButton from '../shared/CopyButton';
import LoadingDots from '../shared/LoadingDots';

const LABELS = [
  'Title Search 1',
  'Title Search 2',
  'Keyword Search 1',
  'Keyword Search 2',
  'Keyword Search 3',
];

function parseBooleans(raw) {
  const results = {};
  const lines = raw.split('\n');
  let current = null;
  let buffer = [];

  for (const line of lines) {
    const labelMatch = LABELS.find(l => line.trim().startsWith(l + ':') || line.trim() === l + ':');
    if (labelMatch) {
      if (current && buffer.length) {
        results[current] = buffer.join(' ').trim();
      }
      current = labelMatch;
      const afterColon = line.trim().slice(labelMatch.length + 1).trim();
      buffer = afterColon ? [afterColon] : [];
    } else if (current && line.trim()) {
      buffer.push(line.trim());
    }
  }
  if (current && buffer.length) {
    results[current] = buffer.join(' ').trim();
  }
  return results;
}

export default function Stage2BooleanGenerator({ jobDescription }) {
  const [strings, setStrings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingRaw, setStreamingRaw] = useState('');

  useEffect(() => {
    if (streamingRaw) {
      setStrings(parseBooleans(streamingRaw));
    }
  }, [streamingRaw]);

  const handleGenerate = async () => {
    if (!jobDescription) return;
    setIsLoading(true);
    setError(null);
    setStrings({});
    setStreamingRaw('');

    try {
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          {
            role: 'user',
            content: `You are a recruiting specialist. Based on the job description below, generate 5 distinct Boolean search strings for LinkedIn Recruiter.

Requirements:
- Title Search 1: Primary job title with its closest synonyms using OR. Include seniority variants.
- Title Search 2: Alternative or adjacent titles someone in this role might hold. Broader net, different angle.
- Keyword Search 1: Core technical skills, tools, or platforms explicitly named in the JD. Use AND to combine must-haves, OR within synonym groups.
- Keyword Search 2: Domain knowledge, industry-specific terms, methodologies from the JD.
- Keyword Search 3: Seniority signals, leadership indicators, cross-functional scope markers from the JD.

Format each as a ready-to-paste LinkedIn Recruiter Boolean using OR, AND, NOT and parentheses.
Output using EXACTLY these labels and format:

Title Search 1:
[boolean string]

Title Search 2:
[boolean string]

Keyword Search 1:
[boolean string]

Keyword Search 2:
[boolean string]

Keyword Search 3:
[boolean string]

JOB DESCRIPTION:
${jobDescription}`,
          },
        ],
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          setStreamingRaw(prev => prev + chunk.delta.text);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Boolean Generator</h1>
      <p className="text-sm text-gray-500 mb-6">
        Generates 5 LinkedIn Recruiter Boolean strings from the stored JD — 2 title-focused, 3 keyword-focused.
      </p>

      {!jobDescription && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Complete Stage 1 first to load a job description.
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isLoading || !jobDescription}
        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
          hover:bg-blue-700 active:bg-blue-800 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Boolean Strings'}
      </button>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {(isLoading || Object.keys(strings).length > 0) && (
        <div className="mt-6 space-y-5">
          {LABELS.map(label => {
            const value = strings[label] || '';
            const hasValue = Boolean(value);
            const isStreaming = isLoading && !hasValue;

            return (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    {label}
                    {isStreaming && <LoadingDots />}
                  </span>
                  {hasValue && <CopyButton getText={() => value} />}
                </div>
                <textarea
                  value={value}
                  onChange={e => setStrings(prev => ({ ...prev, [label]: e.target.value }))}
                  rows={3}
                  placeholder={isStreaming ? 'Generating...' : ''}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm font-mono leading-relaxed resize-y
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30
                    ${isStreaming
                      ? 'border-blue-200 bg-blue-50/30 text-gray-600'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                    }`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

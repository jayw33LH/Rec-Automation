import { useState } from 'react';
import { useStreamingMessage } from '../../hooks/useStreamingMessage';
import CopyButton from '../shared/CopyButton';
import LoadingDots from '../shared/LoadingDots';
import RefinementBox from '../shared/RefinementBox';

function parseScreeningRows(raw) {
  const rows = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split('|').map(p => p.trim());
    if (parts.length >= 4) {
      const decision = parts[0].toUpperCase();
      if (['YES', 'MAYBE', 'NO'].includes(decision)) {
        rows.push({ decision, name: parts[1], titleCompany: parts[2], reason: parts[3] });
      }
    }
  }
  return rows;
}

const DECISION_STYLES = {
  YES: 'bg-green-50 text-green-800 border-green-200',
  MAYBE: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  NO: 'bg-red-50 text-red-700 border-red-200',
};

function formatResultsAsText(rows) {
  if (!rows.length) return '';
  const header = 'DECISION | NAME | TITLE / COMPANY | REASON';
  const separator = '---------+------+-----------------+--------';
  const dataRows = rows.map(r => `${r.decision} | ${r.name} | ${r.titleCompany} | ${r.reason}`);
  return [header, separator, ...dataRows].join('\n');
}

export default function Stage3CandidateScreener({ jobDescription }) {
  const [candidateInput, setCandidateInput] = useState('');
  const [results, setResults] = useState([]);
  const { output, isLoading, error, generate } = useStreamingMessage();

  const handleScreen = async () => {
    if (!candidateInput.trim() || !jobDescription) return;

    const accumulated = [];
    await generate(
      [
        {
          role: 'user',
          content: `You are a senior recruiting specialist conducting a rigorous first-pass screen. Evaluate each candidate below strictly against the job requirements.

JOB DESCRIPTION:
${jobDescription}

CANDIDATES:
${candidateInput}

For each candidate, output one line in this exact pipe-delimited format:
DECISION | Full Name | Current Title / Current Company | Reason (one line)

Decisions:
- YES: Strong, clear match. The candidate's background directly maps to core requirements. Be demanding — only give YES when the evidence is solid.
- MAYBE: Worth a conversation but has a specific, nameable gap or ambiguity. State the gap precisely.
- NO: Not a fit. State why in one line.

Rules:
- Default to MAYBE when tenure is unclear, the match is ambiguous, or background is relevant but something key is missing.
- Do not be generous with YES.
- Output ONLY the pipe-delimited lines. No header, no explanation, no blank lines between entries.`,
        },
      ],
      {
        onDone: fullText => {
          const newRows = parseScreeningRows(fullText);
          setResults(prev => {
            const updated = [...prev, ...newRows];
            accumulated.push(...newRows);
            return updated;
          });
        },
      }
    );
    setCandidateInput('');
  };

  const handleClear = () => {
    setResults([]);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Candidate Screener</h1>
      <p className="text-sm text-gray-500 mb-6">
        Paste raw LinkedIn results (up to 25 per batch). Results accumulate across batches.
        Claude rates each candidate YES / MAYBE / NO against the stored JD.
      </p>

      {!jobDescription && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Complete Stage 1 first to load a job description.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Paste LinkedIn search results
          </label>
          <textarea
            value={candidateInput}
            onChange={e => setCandidateInput(e.target.value)}
            placeholder="Name, title, company, any snippet — paste raw LinkedIn results here..."
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <button
          onClick={handleScreen}
          disabled={isLoading || !candidateInput.trim() || !jobDescription}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700 active:bg-blue-800 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Screening...' : 'Screen Candidates'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <LoadingDots />
          <span>Screening candidates...</span>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Results ({results.length} candidates)
            </span>
            <div className="flex items-center gap-2">
              <CopyButton getText={() => formatResultsAsText(results)} />
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white
                  text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
              >
                Clear list
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
                    Decision
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Title / Company
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${DECISION_STYLES[row.decision] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {row.decision}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                    <td className="px-4 py-3 text-gray-600">{row.titleCompany}</td>
                    <td className="px-4 py-3 text-gray-700">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RefinementBox
        currentOutput={results.length ? formatResultsAsText(results) : ''}
        onRefined={text => setResults(parseScreeningRows(text))}
      />
    </div>
  );
}

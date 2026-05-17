import { useState } from 'react';
import { useStreamingMessage } from '../../hooks/useStreamingMessage';
import OutputBlock from '../shared/OutputBlock';
import RefinementBox from '../shared/RefinementBox';
import { useDebouncedSave } from '../../hooks/useDebouncedSave';

export default function Stage6CandidateWriteup({ jobDescription, savedData, onSave }) {
  const [name, setName] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [comp, setComp] = useState('');
  const [notes, setNotes] = useState('');
  const { output, setOutput, isLoading, error, generate } = useStreamingMessage(undefined, savedData?.output || '');
  useDebouncedSave(output, (val) => onSave({ output: val }));

  const handleGenerate = async () => {
    if (!name.trim() || !notes.trim()) return;

    await generate([
      {
        role: 'user',
        content: `You are a recruiting specialist writing a candidate summary for a hiring manager submission.

CANDIDATE:
- Name: ${name.trim()}
- Current title: ${currentTitle.trim() || 'not provided'}
- Current company: ${currentCompany.trim() || 'not provided'}
- Citizenship: ${citizenship.trim() || 'not provided'}
- Compensation expectation: ${comp.trim() || 'not provided'}

RAW CALL NOTES:
${notes.trim()}

JOB DESCRIPTION (for context):
${jobDescription || 'Not provided'}

Output the writeup in EXACTLY this format:

${name.trim()}
${currentTitle.trim() || '[Current Title]'} / ${currentCompany.trim() || '[Current Company]'}
Citizenship: ${citizenship.trim() || '[status]'}
Compensation Expectation: ${comp.trim() || '[comp]'}

- [bullet 1]
- [bullet 2]
- [bullet 3]
- [bullet 4]
- [bullet 5]
- [bullet 6]

RULES:
- Exactly 6 bullets. Not 5, not 7.
- Each bullet maps a specific aspect of the candidate's background to what the role requires.
- Bullets are factual and grounded in the call notes. No overselling, no editorializing.
- Do not mention weaknesses or gaps.
- Keep bullets concise — one clear idea each.
- Output ONLY the writeup in the exact format above. Nothing else.`,
      },
    ]);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Candidate Writeup</h1>
      <p className="text-sm text-gray-500 mb-6">
        Post-call candidate summary for HM submission. Exactly 6 bullets mapping background to role.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah Chen"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current title
            </label>
            <input
              value={currentTitle}
              onChange={e => setCurrentTitle(e.target.value)}
              placeholder="e.g. Director of Engineering"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current company
            </label>
            <input
              value={currentCompany}
              onChange={e => setCurrentCompany(e.target.value)}
              placeholder="e.g. Stripe"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Citizenship status
            </label>
            <input
              value={citizenship}
              onChange={e => setCitizenship(e.target.value)}
              placeholder="e.g. US Citizen"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Compensation expectation
          </label>
          <input
            value={comp}
            onChange={e => setComp(e.target.value)}
            placeholder="e.g. $220K base + equity"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Raw call notes <span className="text-red-500">*</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Paste your raw notes from the call..."
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !name.trim() || !notes.trim()}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700 active:bg-blue-800 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Writeup'}
        </button>
      </div>

      <OutputBlock
        label="Candidate writeup — edit as needed"
        value={output}
        onChange={setOutput}
        isLoading={isLoading}
        error={error}
        rows={14}
      />
      <RefinementBox currentOutput={output} onRefined={setOutput} />
    </div>
  );
}

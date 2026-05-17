import { useState } from 'react';
import { useStreamingMessage } from '../../hooks/useStreamingMessage';
import OutputBlock from '../shared/OutputBlock';

export default function Stage5ClarificationMessage({ jobDescription }) {
  const [candidateName, setCandidateName] = useState('');
  const [relevantDetail, setRelevantDetail] = useState('');
  const [gap, setGap] = useState('');
  const { output, setOutput, isLoading, error, generate } = useStreamingMessage();

  const handleGenerate = async () => {
    if (!candidateName.trim() || !relevantDetail.trim() || !gap.trim()) return;

    await generate([
      {
        role: 'user',
        content: `You are writing a pre-call clarification message to a candidate you're unsure about. It should be respectful, direct, and under 200 words.

CANDIDATE: ${candidateName.trim()}
WHAT WAS RELEVANT ABOUT THEIR PROFILE: ${relevantDetail.trim()}
THE SPECIFIC CONCERN OR GAP: ${gap.trim()}

JOB DESCRIPTION (for context):
${jobDescription || 'Not provided'}

Output the message using this EXACT structure:

Hi [Name] - really appreciate you responding and I want to be respectful of your time before we jump on a call, especially since I came to you.

The reason I reached out was [1-2 sentences on what specifically on their profile was relevant — their background, companies, domain experience. Be specific, not generic].

That said I want to be upfront. Looking more closely at your experience, [1-2 sentences identifying the specific gap or mismatch between their background and what this role actually requires. Name it clearly without being harsh].

Before I put time on the calendar I just want to gut-check - [one direct question asking whether they have hands-on experience in the specific area that isn't visible on their profile, framed around whether the conversation would actually be worth their time].

RULES:
- No em dashes anywhere. Use commas or sentence breaks instead.
- No bold formatting.
- Tone: direct and respectful, not apologetic, not salesy.
- The gap must be named specifically, not hedged vaguely.
- The closing must be exactly one question, not a list.
- Total message must be under 200 words.
- Output ONLY the message. Nothing else.`,
      },
    ]);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Clarification Message</h1>
      <p className="text-sm text-gray-500 mb-6">
        For MAYBE candidates before booking a call. Names the gap directly and asks a single gut-check question.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Candidate name <span className="text-red-500">*</span>
          </label>
          <input
            value={candidateName}
            onChange={e => setCandidateName(e.target.value)}
            placeholder="e.g. Marcus"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            What was relevant about their profile that prompted outreach <span className="text-red-500">*</span>
          </label>
          <textarea
            value={relevantDetail}
            onChange={e => setRelevantDetail(e.target.value)}
            placeholder="e.g. 6 years in enterprise SaaS sales, previously at Salesforce and Workday, strong mid-market AE background"
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            The specific concern or gap <span className="text-red-500">*</span>
          </label>
          <textarea
            value={gap}
            onChange={e => setGap(e.target.value)}
            placeholder="e.g. the role requires enterprise deal cycles of $500K+, but all visible experience is mid-market. No evidence of strategic account management at that scale."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !candidateName.trim() || !relevantDetail.trim() || !gap.trim()}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700 active:bg-blue-800 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Clarification Message'}
        </button>
      </div>

      <OutputBlock
        label="Clarification message — edit as needed"
        value={output}
        onChange={setOutput}
        isLoading={isLoading}
        error={error}
        rows={12}
      />
    </div>
  );
}

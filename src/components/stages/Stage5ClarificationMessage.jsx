import { useState } from 'react';
import { useStreamingMessage } from '../../hooks/useStreamingMessage';
import OutputBlock from '../shared/OutputBlock';
import RefinementBox from '../shared/RefinementBox';

export default function Stage5ClarificationMessage({ jobDescription }) {
  const [candidateName, setCandidateName] = useState('');
  const [candidateInfo, setCandidateInfo] = useState('');
  const { output, setOutput, isLoading, error, generate } = useStreamingMessage();

  const handleGenerate = async () => {
    if (!candidateInfo.trim() || !jobDescription) return;

    await generate([
      {
        role: 'user',
        content: `You are a recruiting specialist. Analyze the candidate below against the job description. Identify what made them interesting enough to reach out to, and what the specific gap or concern is that's making you hesitant. Then write a direct pre-call clarification message.

CANDIDATE NAME: ${candidateName.trim() || 'the candidate'}

CANDIDATE PROFILE / BACKGROUND INFO:
${candidateInfo.trim()}

JOB DESCRIPTION:
${jobDescription}

First, analyze silently:
- What on their profile is genuinely relevant to this role?
- What is the specific gap or mismatch — name it precisely, don't hedge?

Then output ONLY the message using this EXACT structure:

Hi [name] - really appreciate you responding and I want to be respectful of your time before we jump on a call, especially since I came to you.

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
- Output ONLY the message. No preamble, no analysis, nothing else.`,
      },
    ]);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Clarification Message</h1>
      <p className="text-sm text-gray-500 mb-6">
        Paste a candidate's LinkedIn profile or background info. Claude reads it against the JD,
        identifies the gap, and writes the pre-call message automatically.
      </p>

      {!jobDescription && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Complete Stage 1 first to load a job description.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Candidate name (optional)
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
            Candidate profile or background info <span className="text-red-500">*</span>
          </label>
          <textarea
            value={candidateInfo}
            onChange={e => setCandidateInfo(e.target.value)}
            placeholder="Paste their LinkedIn profile, headline, experience summary, or any background info you have..."
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !candidateInfo.trim() || !jobDescription}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700 active:bg-blue-800 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing & generating...' : 'Analyze & Generate Message'}
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
      <RefinementBox currentOutput={output} onRefined={setOutput} />
    </div>
  );
}

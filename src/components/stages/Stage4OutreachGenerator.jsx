import { useState } from 'react';
import { useStreamingMessage } from '../../hooks/useStreamingMessage';
import OutputBlock from '../shared/OutputBlock';

export default function Stage4OutreachGenerator({ jobDescription }) {
  const [firstName, setFirstName] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [background, setBackground] = useState('');
  const { output, setOutput, isLoading, error, generate } = useStreamingMessage();

  const handleGenerate = async () => {
    if (!firstName.trim() || !jobDescription) return;

    await generate([
      {
        role: 'user',
        content: `You are writing a direct, peer-to-peer outreach message for a recruiting engagement. Follow the template structure and rules exactly.

CANDIDATE DETAILS:
- First name: ${firstName.trim()}
- Current title: ${currentTitle.trim() || 'unknown'}
- Notable background detail: ${background.trim() || 'none provided'}

JOB DESCRIPTION:
${jobDescription}

OUTPUT the outreach message using this EXACT structure:

[First name] - I'm recruiting for a [role title] within [describe the company anonymously — use a descriptor like "a global financial institution" or "a major technology firm" — NEVER name the company], [one sentence on where the role sits and what it is centered on].

[One paragraph: what this role is about at a higher level — the mandate, what is being built or transformed, what makes it interesting. No fluff. Specific and grounded in the actual JD.]

A few things that tend to stand out:
- [bullet 1 — key responsibility or scope area pulled directly from the JD]
- [bullet 2]
- [bullet 3]
- [bullet 4]
- [bullet 5]
- [bullet 6]
- [bullet 7, only if warranted by the JD]

[One closing sentence on what type of person this lands well with — the profile, operating style, or background that fits. Draw from JD.]

[One sentence on the broader opportunity — growth, visibility, platform investment, or trajectory. Keep it real, not hype.]

Logistics:
- Location: [from JD]
- Compensation: [from JD, or omit line if not available]
- Eligibility: [visa/work auth from JD, or omit line if not available]

If interested, feel free to share a resume or number.
Best,
Jason Wolpow

RULES — follow every one:
- NEVER name the hiring company. Use a descriptor only.
- Open with the first name followed by a dash. No "Hi", no "Dear", nothing before the name.
- The two body paragraphs must be distinct — first sets context and role, second adds stakes, mandate, or what makes it worth their time.
- Bullets must be concise and specific — pulled directly from JD language, not rephrased into vague generalities.
- No em dashes anywhere. Use commas or sentence breaks instead.
- No bold formatting anywhere.
- Tone: direct, confident, peer-to-peer. Not salesy, not recruiter-speak.`,
      },
    ]);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Outreach Generator</h1>
      <p className="text-sm text-gray-500 mb-6">
        Generate a personalized, peer-to-peer outreach message anchored to the stored JD.
      </p>

      {!jobDescription && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Complete Stage 1 first to load a job description.
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Candidate first name <span className="text-red-500">*</span>
            </label>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="e.g. Sarah"
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
              placeholder="e.g. VP of Product"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Notable background detail (optional)
          </label>
          <input
            value={background}
            onChange={e => setBackground(e.target.value)}
            placeholder="e.g. previously built payments infra at Stripe"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !firstName.trim() || !jobDescription}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700 active:bg-blue-800 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Outreach Message'}
        </button>
      </div>

      <OutputBlock
        label="Outreach message — edit as needed"
        value={output}
        onChange={setOutput}
        isLoading={isLoading}
        error={error}
        rows={22}
      />
    </div>
  );
}

import { useStreamingMessage } from '../../hooks/useStreamingMessage';
import OutputBlock from '../shared/OutputBlock';
import RefinementBox from '../shared/RefinementBox';
import { useDebouncedSave } from '../../hooks/useDebouncedSave';

export default function Stage4OutreachGenerator({ jobDescription, savedData, onSave }) {
  const { output, setOutput, isLoading, error, generate } = useStreamingMessage(undefined, savedData?.output || '');
  useDebouncedSave(output, (val) => onSave({ output: val }));

  const handleGenerate = async () => {
    if (!jobDescription) return;

    await generate([
      {
        role: 'user',
        content: `You are writing a universal outreach message for a recruiting engagement. This message will be sent to multiple candidates — use [First Name] as the opening placeholder. Follow the template structure and rules exactly.

JOB DESCRIPTION:
${jobDescription}

OUTPUT the outreach message using this EXACT structure:

[First Name] - I'm recruiting for a [role title] within [describe the company anonymously — use a descriptor like "a global financial institution" or "a major technology firm" — NEVER name the company], [one sentence on where the role sits and what it is centered on].

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
- Open with [First Name] followed by a dash. No "Hi", no "Dear", nothing before the placeholder.
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
        Generates a single outreach template anchored to the active role's JD.
        Copy it, swap in the first name, and send to anyone on your list.
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
        {isLoading ? 'Generating...' : 'Generate Outreach Template'}
      </button>

      <OutputBlock
        label="Outreach template — replace [First Name] before sending"
        value={output}
        onChange={setOutput}
        isLoading={isLoading}
        error={error}
        rows={22}
      />
      <RefinementBox currentOutput={output} onRefined={setOutput} />
    </div>
  );
}

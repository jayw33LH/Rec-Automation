import { useState } from 'react';
import { useStreamingMessage } from '../../hooks/useStreamingMessage';
import OutputBlock from '../shared/OutputBlock';
import RefinementBox from '../shared/RefinementBox';
import { MAX_TOKENS_LONG } from '../../anthropic';
import { useDebouncedSave } from '../../hooks/useDebouncedSave';

export default function Stage7InterviewPrep({ jobDescription, savedData, onSave }) {
  const [resume, setResume] = useState('');
  const [jdOverride, setJdOverride] = useState('');
  const [hmLinkedIn, setHmLinkedIn] = useState('');
  const [interviewFormat, setInterviewFormat] = useState('');
  const [hmPrefs, setHmPrefs] = useState('');
  const [priorIntel, setPriorIntel] = useState('');
  const [aboutPage, setAboutPage] = useState('');
  const [compExpectation, setCompExpectation] = useState('');
  const [logistics, setLogistics] = useState('');
  const { output, setOutput, isLoading, error, generate } = useStreamingMessage(MAX_TOKENS_LONG, savedData?.output || '');
  useDebouncedSave(output, (val) => onSave({ output: val }));

  const effectiveJD = jdOverride.trim() || jobDescription || '';

  const handleGenerate = async () => {
    if (!resume.trim() || !effectiveJD) return;

    await generate([
      {
        role: 'user',
        content: `You are an experienced recruiter who knows both the candidate and the hiring process well. Write a thorough, structured interview prep email for the candidate advancing to interview.

This should read like a human wrote it after doing real research on both sides. Long-form, specific, and genuinely useful.

INPUTS:
---
Candidate resume:
${resume.trim()}

Job description:
${effectiveJD}

Hiring manager LinkedIn profile:
${hmLinkedIn.trim() || 'Not provided'}

Interview format:
${interviewFormat.trim() || 'Not specified'}

HM preferences / feedback from previously rejected candidates:
${hmPrefs.trim() || 'None provided'}

Intel or questions from prior rounds of this search:
${priorIntel.trim() || 'None provided'}

Company about page:
${aboutPage.trim() || 'Not provided — use JD for company context'}

Candidate locked comp expectation:
${compExpectation.trim() || 'Not provided'}

Logistics to reinforce:
${logistics.trim() || 'None specified'}
---

Write the prep email with these EXACT sections in this order:

1. About the company
(Use the about page if provided. Otherwise draw from the JD. Give enough context that someone unfamiliar with the company understands what it does, its scale, its position in the market, and what's notable about where it sits right now.)

2. About the interviewer
(Draw from the HM LinkedIn profile. Cover their background, tenure, likely perspective, what they tend to care about based on their trajectory. If no LinkedIn provided, note that and give general guidance.)

3. What to expect in the interview and likely questions you will be asked
(Use the interview format, HM preferences, and any prior round intel. Be specific about what they will likely ask. Give actual example questions. If behavioral, give the STAR framing. If technical, name the areas. If case-based, describe what the case is likely to probe.)

4. How to tie your experience into the role
(Map specific things from the candidate's resume to specific requirements in the JD. This is not generic advice — it is a tailored playbook for this person going into this role. Name the relevant experiences, explain the connection, and flag anything that needs framing or bridging.)

5. Questions the candidate should ask the interviewer
(5-7 thoughtful questions grounded in the JD, the company's situation, and the HM's profile. These should demonstrate preparation and strategic thinking, not box-check curiosity.)

6. Core logistics
(Restate comp expectation, any days on-site, start date, visa status, and anything flagged as potentially slippery. Frame it as a reminder to the candidate to hold the line on things already discussed.)

RULES:
- No em dashes anywhere. Use commas or sentence breaks instead.
- No bold formatting anywhere.
- No double dashes.
- Tone: professional but warm, written by someone who knows both sides well.
- Long-form is expected — this is a thorough prep document, not a summary.
- Output only the email body. No subject line, no meta-commentary.`,
      },
    ]);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Interview Prep Email</h1>
      <p className="text-sm text-gray-500 mb-6">
        Generates a long-form, structured prep email for candidates advancing to interview.
        Six sections: company, interviewer, what to expect, how to position, questions to ask, logistics.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Candidate resume <span className="text-red-500">*</span>
          </label>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste the candidate's resume text here..."
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Job description
            <span className="ml-1 text-gray-400 font-normal">(auto-populated from Stage 1 — edit here if needed)</span>
          </label>
          <textarea
            value={jdOverride || jobDescription || ''}
            onChange={e => setJdOverride(e.target.value)}
            placeholder="Job description will appear here from Stage 1..."
            rows={6}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Hiring manager LinkedIn profile
          </label>
          <textarea
            value={hmLinkedIn}
            onChange={e => setHmLinkedIn(e.target.value)}
            placeholder="Paste the HM's LinkedIn profile text..."
            rows={5}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Interview format
          </label>
          <input
            value={interviewFormat}
            onChange={e => setInterviewFormat(e.target.value)}
            placeholder="e.g. behavioral, technical, case-based, panel..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            HM preferences or feedback from previously rejected candidates (optional)
          </label>
          <textarea
            value={hmPrefs}
            onChange={e => setHmPrefs(e.target.value)}
            placeholder="e.g. HM values structured thinkers, previously rejected a candidate for being too tactical..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Intel or questions from prior rounds of this search (optional)
          </label>
          <textarea
            value={priorIntel}
            onChange={e => setPriorIntel(e.target.value)}
            placeholder="e.g. previous candidates were asked about multi-stakeholder alignment, team had concerns about scale..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Company about page (optional — for lesser-known companies)
          </label>
          <textarea
            value={aboutPage}
            onChange={e => setAboutPage(e.target.value)}
            placeholder="Paste the company's about page text..."
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Candidate locked comp expectation
            </label>
            <input
              value={compExpectation}
              onChange={e => setCompExpectation(e.target.value)}
              placeholder="e.g. $230K base + equity"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Logistics to reinforce
            </label>
            <input
              value={logistics}
              onChange={e => setLogistics(e.target.value)}
              placeholder="e.g. 3 days on-site, April start date firm"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !resume.trim() || !effectiveJD}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700 active:bg-blue-800 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Interview Prep Email'}
        </button>
      </div>

      <OutputBlock
        label="Interview prep email — edit as needed"
        value={output}
        onChange={setOutput}
        isLoading={isLoading}
        error={error}
        rows={32}
      />
      <RefinementBox currentOutput={output} onRefined={setOutput} maxTokens={MAX_TOKENS_LONG} />
    </div>
  );
}

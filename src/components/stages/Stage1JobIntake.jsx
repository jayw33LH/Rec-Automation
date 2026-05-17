import { useState, useRef } from 'react';
import { useStreamingMessage } from '../../hooks/useStreamingMessage';
import { parseFile } from '../../utils/fileParser';
import OutputBlock from '../shared/OutputBlock';

const TEMPLATE = `Hi,

Thank you for your time today. As discussed, if you can confirm the details below this will form the basis of the search that we conduct. Feel free to add/edit anything as you see fit.

Title:
Reporting to:
Business need for the hire:
Wider team and where this role sits:
Essential skills required to interview a candidate:
Questions to screen candidates:
Interview Process:
Selling points of the role/company:
Location:
Salary:
Benefits:
Bonus:
Visa Sponsorship/Relocation package etc:
Ideal Start Date:
CV Feedback & Interview Feedback agreed SLAs:

As soon as you respond confirming the above, we will begin the search.
Best,`;

export default function Stage1JobIntake({ jobDescription, onJobDescriptionChange }) {
  const [pasteInput, setPasteInput] = useState('');
  const [fileError, setFileError] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileRef = useRef(null);
  const { output, setOutput, isLoading, error, generate } = useStreamingMessage();

  const handleFileUpload = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    setIsParsing(true);
    try {
      const text = await parseFile(file);
      setPasteInput(text);
    } catch (err) {
      setFileError(err.message);
    } finally {
      setIsParsing(false);
      e.target.value = '';
    }
  };

  const handleGenerate = async () => {
    const jd = pasteInput.trim();
    if (!jd) return;

    onJobDescriptionChange(jd);

    await generate([
      {
        role: 'user',
        content: `You are a recruiting assistant. Parse the job description below and fill in every field of the email template. Rules:
- Only fill fields clearly determinable from the JD.
- Leave fields blank (label followed by nothing) if the information is not present.
- Keep all field labels exactly as shown. Do not rearrange or add labels.
- Output ONLY the filled template — no commentary, no explanation, nothing else.

JOB DESCRIPTION:
${jd}

TEMPLATE TO FILL:
${TEMPLATE}`,
      },
    ]);
  };

  const displayOutput = output || '';

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Job Intake</h1>
      <p className="text-sm text-gray-500 mb-6">
        Paste or upload a job description. Claude will auto-populate the confirmation email template.
        The JD is saved in memory for all subsequent stages.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Job Description
          </label>
          <textarea
            value={pasteInput}
            onChange={e => setPasteInput(e.target.value)}
            placeholder="Paste job description here..."
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm leading-relaxed
              resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isParsing}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700
              hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            {isParsing ? 'Parsing file...' : 'Upload PDF / DOCX'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          {fileError && (
            <span className="text-sm text-red-600">{fileError}</span>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !pasteInput.trim()}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700 active:bg-blue-800 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Parse JD & Generate Email'}
        </button>
      </div>

      <OutputBlock
        label="Confirmation Email — edit as needed"
        value={displayOutput}
        onChange={setOutput}
        isLoading={isLoading}
        error={error}
        rows={24}
      />
    </div>
  );
}

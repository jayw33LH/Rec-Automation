import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Use the local worker via Vite's URL resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).href;

export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'pdf') return parsePDF(file);
  if (ext === 'docx' || ext === 'doc') return parseWord(file);
  if (ext === 'txt') return file.text();

  throw new Error(`Unsupported file type: .${ext}. Supported: PDF, DOCX, TXT`);
}

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    pages.push(pageText);
  }

  return pages.join('\n\n').trim();
}

async function parseWord(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

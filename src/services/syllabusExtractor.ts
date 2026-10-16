import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Configure CDN worker matching pdfjs-dist@3.11.174 for reliable client-side operation
// without requiring complicated Vite worker bundling or node polyfills
try {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
} catch {
  // Graceful fallback
}

export interface ExtractionProgress {
  stage: 'reading' | 'pdf-text' | 'ocr-image' | 'matching' | 'done';
  percent: number;
  message: string;
}

/**
 * Extracts syllabus text 100% inside the student's browser at $0 server cost.
 * Supports digital PDFs, scanned image PDFs (via canvas + OCR fallback), and photo/image uploads (PNG/JPG/WEBP).
 */
export async function extractTextFromUploadedFile(
  file: File,
  onProgress: (p: ExtractionProgress) => void
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // 1. Plain text file (.txt)
  if (ext === 'txt' || file.type === 'text/plain') {
    onProgress({ stage: 'reading', percent: 50, message: 'Reading plain text syllabus...' });
    const text = await file.text();
    onProgress({ stage: 'done', percent: 100, message: 'Syllabus text loaded!' });
    return text;
  }

  // 2. PDF Document (Digital or Scanned)
  if (ext === 'pdf' || file.type === 'application/pdf') {
    onProgress({ stage: 'pdf-text', percent: 10, message: 'Opening PDF document in browser...' });
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let combinedText = '';
    const totalPages = Math.min(pdf.numPages, 10); // Parse up to 10 pages for syllabus

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      onProgress({
        stage: 'pdf-text',
        percent: Math.round(10 + (pageNum / totalPages) * 60),
        message: `Extracting text from PDF page ${pageNum} of ${totalPages}...`,
      });

      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');

      // Check if page contains selectable text or is a scanned image
      if (pageText.trim().length >= 25) {
        combinedText += `\n--- Page ${pageNum} ---\n` + pageText;
      } else {
        // Fallback: Render PDF page onto offscreen canvas and run in-browser OCR
        onProgress({
          stage: 'ocr-image',
          percent: 75,
          message: `Page ${pageNum} appears to be a scanned photocopy. Running in-browser OCR...`,
        });

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const ocrResult = await Tesseract.recognize(canvas, 'eng');
          combinedText += `\n--- Page ${pageNum} (OCR) ---\n` + ocrResult.data.text;
        }
      }
    }

    onProgress({ stage: 'done', percent: 100, message: 'PDF parsing complete!' });
    return combinedText;
  }

  // 3. Image file (PNG, JPG, JPEG, WEBP, camera photo of syllabus handout)
  if (file.type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
    onProgress({ stage: 'ocr-image', percent: 10, message: 'Initializing in-browser OCR engine...' });

    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const currentPercent = Math.min(95, Math.max(15, Math.round(m.progress * 100)));
          onProgress({
            stage: 'ocr-image',
            percent: currentPercent,
            message: `Scanning image text with OCR (${currentPercent}%)...`,
          });
        }
      },
    });

    onProgress({ stage: 'done', percent: 100, message: 'OCR text extraction complete!' });
    return result.data.text;
  }

  throw new Error('Unsupported format. Please upload a PDF, Image (PNG/JPG/WEBP), or TXT file.');
}

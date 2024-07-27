'use client'
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocumentProxy } from "pdfjs-dist";
import { useState } from "react";
import { PreviewFile } from "@models/app";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  isOffscreenCanvasSupported: true
};

export default function PdfCanvas({ file }: { file: PreviewFile }) {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const onLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy) => {
    setPageNumber(nextNumPages);
  }
  // Can't be bothered with typing the button
  const changePage = (e: any, direction: 'left' | 'right') => {
    e.preventDefault();
    const destinationPage = currentPage + (direction === 'left' ? -1 : 1);
    if (destinationPage < 0 || destinationPage >= pageNumber) {
      return;
    }
    setCurrentPage(destinationPage);
  }
  return (
    <div id='pdf-preview-container'>
      <Document file={file.data} options={options} onLoadSuccess={onLoadSuccess}>
        <Page key={`page-${currentPage + 1}`} pageNumber={currentPage + 1} width={800} />
      </Document>
      <div className="flex items-center justify-center">
        <div className="join">
          <button className="join-item btn" onClick={(e) => changePage(e, 'left')}><ChevronLeftIcon className="h-10" /></button>
          <button className="join-item btn">{currentPage + 1}</button>
          <button className="join-item btn" onClick={(e) => changePage(e, 'right')}><ChevronRightIcon className="h-10" /></button>
        </div>
      </div>
    </div>
  );
}

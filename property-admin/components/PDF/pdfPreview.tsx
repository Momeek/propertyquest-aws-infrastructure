'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PDFPreviewProps {
  url: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 768,
  );

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () =>
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));

  const goToNextPage = () =>
    setPageNumber((prev) => (numPages && prev < numPages ? prev + 1 : prev));

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageWidth = Math.min(600, windowWidth - 32); // 32 = padding/margin allowance

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
        {/* Navigation */}
        <div className="flex gap-2 flex-1 sm:flex-initial">
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={numPages ? pageNumber >= numPages : true}
            className="w-full sm:w-auto"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Page Info */}
        <div className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
          Page {pageNumber} of {numPages ?? '--'}
        </div>

        {/* Zoom Controls */}
        <div className="flex gap-2 flex-1 sm:flex-initial justify-end">
          <Button
            variant="outline"
            onClick={zoomOut}
            disabled={scale <= 0.6}
            className="w-full sm:w-auto"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={zoomIn}
            disabled={scale >= 3}
            className="w-full sm:w-auto"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="max-h-[700px] overflow-auto p-2">
        <div className="flex justify-center w-full overflow-x-auto">
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
            <div className="inline-block max-w-full">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                width={pageWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
};

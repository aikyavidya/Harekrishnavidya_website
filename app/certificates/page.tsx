'use client';

import { useState, useEffect, useRef } from 'react';

export default function CertificateViewer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        // Load PDF.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = async () => {
          try {
            // @ts-expect-error - pdfjsLib is loaded from CDN
            const pdfjsLib = window.pdfjsLib;
            
            // Set worker
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            // Load PDF
            const loadingTask = pdfjsLib.getDocument('/ISKON.pdf');
            const pdf = await loadingTask.promise;
            
            setNumPages(pdf.numPages);
            canvasRefs.current = new Array(pdf.numPages).fill(null);
            
            // Function to render pages with responsive scale
            const renderPage = async (pageNum: number) => {
              const page = await pdf.getPage(pageNum);
              
              // Calculate responsive scale
              const baseViewport = page.getViewport({ scale: 1 });
              const screenWidth = window.innerWidth;
              let targetWidth;
              
              if (screenWidth < 640) { // Mobile
                targetWidth = screenWidth - 40;
              } else if (screenWidth < 1024) { // Tablet
                targetWidth = Math.min(700, screenWidth - 80);
              } else { // Desktop
                targetWidth = Math.min(900, screenWidth - 200);
              }
              
              const scale = targetWidth / baseViewport.width;
              const viewport = page.getViewport({ scale });
              
              const canvas = document.getElementById(`pdf-canvas-${pageNum}`) as HTMLCanvasElement;
              if (canvas) {
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                // Set canvas style for responsive display
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
                canvas.style.maxWidth = `${viewport.width}px`;
                
                const renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                
                await page.render(renderContext).promise;
              }
            };
            
            // Render each page
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              await renderPage(pageNum);
            }
            
            // Add resize listener for responsive updates
            const handleResize = async () => {
              for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                await renderPage(pageNum);
              }
            };
            
            window.addEventListener('resize', handleResize);
            
            setLoading(false);
          } catch (pdfError) {
            console.error('PDF loading error:', pdfError);
            setError('Failed to load PDF document');
            setLoading(false);
          }
        };
        
        script.onerror = () => {
          setError('Failed to load PDF.js library');
          setLoading(false);
        };
        
        document.head.appendChild(script);
        
        return () => {
          document.head.removeChild(script);
        };
      } catch (err) {
        console.error('Error setting up PDF viewer:', err);
        setError('Failed to initialize PDF viewer');
        setLoading(false);
      }
    };

    loadPDF();
  }, []);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <br />
          <small>Make sure ISKON.pdf is in your public folder.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800">Legal Certificate</h2>
        
        {loading && (
          <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg text-gray-600">Loading certificate...</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          {numPages > 0 && Array.from({ length: numPages }, (_, index) => (
            <div key={`page-${index + 1}`} className="mb-8 flex justify-center">
              <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white p-4">
                <canvas
                  id={`pdf-canvas-${index + 1}`}
                  className="max-w-full h-auto block mx-auto"
                />
              </div>
            </div>
          ))}
        </div>
        
       
      </div>
    </div>
  );
}
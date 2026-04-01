import React, { useRef, useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ContractLayoutProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode; // Optional during migration
  preview: React.ReactNode; // The inline editable document preview goes here
  clientName?: string; // Optional client name for PDF filename
}

export const ContractLayout: React.FC<ContractLayoutProps> = ({ title, icon, preview, clientName }) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    
    setIsExporting(true);
    const currentScale = previewScale;
    setPreviewScale(1);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    const container = documentRef.current;

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pages = container.querySelectorAll('.a4-page');
      
      if (pages.length === 0) {
        // Fallback for single page
        const canvas = await html2canvas(container, { 
          scale: 2, 
          useCORS: true, 
          logging: true,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      } else {
        for (let i = 0; i < pages.length; i++) {
          if (i > 0) pdf.addPage();
          const element = pages[i] as HTMLElement;
          
          const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            allowTaint: true,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
              const clonedElement = clonedDoc.querySelector('.a4-page') as HTMLElement;
              if (clonedElement) {
                clonedElement.style.border = 'none';
                clonedElement.style.boxShadow = 'none';
              }
            }
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
      }
      
      const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const safeName = clientName ? `_${clientName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}` : '';
      const filename = `${safeTitle}${safeName}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Errore durante la generazione del PDF. Riprova tra un istante.');
    } finally {
      setIsExporting(false);
      setPreviewScale(currentScale);
    }
  };

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  // ResizeObserver for the document preview to scale it down if container is too small
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width;
        // A4 document physical width is ~794px. We scale down if available width is less.
        if (availableWidth < 794 && availableWidth > 0) {
          setPreviewScale(availableWidth / 794);
        } else {
          setPreviewScale(1);
        }
      }
    });

    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`flex flex-col h-full w-full bg-background ${isExporting ? 'pdf-exporting' : ''}`}>
      {/* Top Header */}
      <div className="p-4 md:p-6 border-b border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-surface/90 backdrop-blur-sm z-10 w-full">
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2 bg-primary-light text-primary rounded-lg">
            {icon}
          </div>
          <div>
            <h1 className="text-xl font-bold truncate">{title}</h1>
            <p className="text-sm text-primary">Compila direttamente sul documento</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="btn btn-primary shadow-md hover:shadow-lg transition-all" onClick={handleDownloadPdf} disabled={isExporting}>
            <Download size={18} /> {isExporting ? 'Generazione in corso...' : 'Scarica PDF'}
          </button>
        </div>
      </div>
      
      {/* Preview Area */}
      <div 
        ref={previewContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden document-preview-container flex justify-center items-start min-w-0"
      >
        <div className="w-full flex justify-center py-8 relative" style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center', transition: 'transform 0.1s ease-out' }}>
          <div className="a4-document-container flex flex-col gap-8" ref={documentRef}>
            {preview}
          </div>
        </div>
      </div>
    </div>
  );
};

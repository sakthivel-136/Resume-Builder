'use client';

import React, { memo } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';

interface ToolbarProps {
  contentHeight: number;
  zoom: number | 'fit';
  setZoom: (val: number | 'fit') => void;
  isExporting: boolean;
  setIsExporting: (val: boolean) => void;
}

const Toolbar = ({ contentHeight, zoom, setZoom, isExporting, setIsExporting }: ToolbarProps) => {
  const { state, dispatch } = useResume();
  const { addToast } = useToast();

  // Zoom options
  const handleZoomOut = () => {
    if (zoom === 'fit' as any) setZoom(1.0);
    else setZoom(Math.max(0.5, (zoom as number) - 0.15));
  };

  const handleZoomIn = () => {
    if (zoom === 'fit' as any) setZoom(1.0);
    else setZoom(Math.min(1.5, (zoom as number) + 0.15));
  };

  const handleZoomFit = () => {
    setZoom('fit');
  };

  // PDF Download using html2pdf.js
  const downloadPDF = async () => {
    setIsExporting(true);
    addToast('Generating your PDF...', 'info');

    // Small delay to ensure state and DOM are synchronized
    setTimeout(async () => {
      const element = document.getElementById('resume-export');
      if (!element) {
        addToast('Resume content not found', 'error');
        setIsExporting(false);
        return;
      }

      try {
        const html2pdf = (await import('html2pdf.js')).default;
        
        // Configure export settings
        const opt = {
          margin: [state.mT, 0, state.mB, 0] as [number, number, number, number],
          filename: `${state.name.replace(/\s+/g, '_').toLowerCase() || 'resume'}_cv.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true, 
            logging: false
          },
          jsPDF: { unit: 'px', format: [794, 1128] as [number, number], hotfixes: ['px_scaling'] },
          pagebreak: { mode: ['css', 'legacy'] }
        };

        // Run generator
        await html2pdf().set(opt).from(element).save();
        addToast('PDF downloaded successfully!', 'success');

        // Increment global PDF download counter
        const curCount = localStorage.getItem('rbp_global_download_count');
        const nextCount = curCount ? parseInt(curCount, 10) + 1 : 143;
        localStorage.setItem('rbp_global_download_count', nextCount.toString());
      } catch (err) {
        console.error(err);
        addToast('Failed to export PDF', 'error');
      } finally {
        setIsExporting(false);
      }
    }, 50);
  };

  // Auto-fit spacing algorithms
  const autoFitContent = () => {
    const A4_HEIGHT = 1123;
    if (contentHeight <= A4_HEIGHT) {
      addToast('Content already fits on a single page!', 'info');
      return;
    }

    // Incremental shrinkage to fit A4 height
    let tempSecSp = state.secSp;
    let tempLineH = state.lineH;
    let tempBodySize = state.bodySize;
    let tempHeadSize = state.headSize;

    // Calculate how much we need to shrink
    const overflowRatio = A4_HEIGHT / contentHeight;

    if (overflowRatio < 0.8) {
      addToast('Content is too long to automatically fit 1 page. Please reduce text.', 'error');
      return;
    }

    // Scale options down
    tempSecSp = Math.max(4, Math.floor(state.secSp * overflowRatio));
    tempLineH = Math.max(1.15, Number((state.lineH * overflowRatio).toFixed(2)));
    tempBodySize = Math.max(9, Number((state.bodySize * overflowRatio).toFixed(1)));
    tempHeadSize = Math.max(9, Number((state.headSize * overflowRatio).toFixed(1)));

    dispatch({ type: 'SET_FIELD', field: 'secSp', value: tempSecSp });
    dispatch({ type: 'SET_FIELD', field: 'lineH', value: tempLineH });
    dispatch({ type: 'SET_FIELD', field: 'bodySize', value: tempBodySize });
    dispatch({ type: 'SET_FIELD', field: 'headSize', value: tempHeadSize });

    addToast('Adjusted spacing to fit page!', 'success');
  };

  return (
    <div 
      style={{ 
        width: '100%', 
        maxWidth: '794px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          <span 
            style={{ 
              width: '8px', 
              height: '8px', 
              background: 'var(--success)', 
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--success)',
              display: 'inline-block'
            }} 
          />
          Live preview · <strong>auto-updating</strong>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Zoom controls */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 4px',
              gap: '4px'
            }}
          >
            <button 
              type="button" 
              onClick={handleZoomOut} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px 8px', fontSize: '14px', fontWeight: 700 }}
              title="Zoom Out"
            >
              -
            </button>
            <span 
              onClick={handleZoomFit}
              style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', padding: '0 4px', minWidth: '42px', textAlign: 'center' }}
              title="Fit width"
            >
              {zoom === 'fit' ? 'Fit' : `${Math.round(zoom * 100)}%`}
            </span>
            <button 
              type="button" 
              onClick={handleZoomIn} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px 8px', fontSize: '14px', fontWeight: 700 }}
              title="Zoom In"
            >
              +
            </button>
          </div>

          <Button variant="secondary" size="sm" onClick={autoFitContent} style={{ fontSize: '12px' }}>
            Auto Fit Page
          </Button>

          <Button 
            variant="primary" 
            size="sm" 
            onClick={downloadPDF} 
            loading={isExporting}
            style={{ fontSize: '12px' }}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Tip bar */}
      <div 
        style={{ 
          fontSize: '11px', 
          color: 'var(--text-secondary)', 
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed var(--border)',
          borderRadius: '6px',
          padding: '8px 12px',
          lineHeight: '1.45'
        }}
      >
        💡 <strong>Auto Fit:</strong> Fills spacing to exactly one A4 page. <strong>PDF Export:</strong> Custom breaks avoided dynamically. Use <strong>Ctrl+P</strong> shortcut.
      </div>
    </div>
  );
};

export default memo(Toolbar);

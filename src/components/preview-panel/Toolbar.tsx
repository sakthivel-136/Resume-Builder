'use client';

import React, { memo, useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';

interface ToolbarProps {
  contentHeight: number;
  zoom: number | 'fit';
  setZoom: (val: number | 'fit') => void;
  isExporting: boolean;
  setIsExporting: (val: boolean) => void;
  onToggleTab?: (tab: 'edit' | 'preview') => void;
}

const Toolbar = ({ contentHeight, zoom, setZoom, isExporting, setIsExporting, onToggleTab }: ToolbarProps) => {
  const { state, dispatch } = useResume();
  const { addToast } = useToast();
  const [showBackupPrompt, setShowBackupPrompt] = useState(false);

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

    // Ensure the export container exists
    const element = document.getElementById('resume-export');
    if (!element) {
      addToast('Resume content not found', 'error');
      setIsExporting(false);
      return;
    }

    try {
      // Wait for font system to be ready (downloads finished)
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Try to load specific fonts to ensure metrics match runtime
      if (document.fonts?.load) {
        await Promise.all([
          document.fonts.load(`1em ${state.bFont}`),
          document.fonts.load(`1em ${state.hFont}`),
        ]).catch(() => undefined);
      }

      // Wait two paints so browser has applied metrics and reflowed
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const html2pdf = (await import('html2pdf.js')).default;
      
      // Configure export settings (enable letterRendering for accurate letter-spaced text)
      const opt = {
        margin: 0,
        filename: `${state.name.replace(/\s+/g, '_').toLowerCase() || 'resume'}_cv.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 3.125, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
        },
        jsPDF: { unit: 'px', format: [794, 1123] as [number, number], hotfixes: ['px_scaling'] },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      // Run generator
      await html2pdf().set(opt).from(element).save();
      addToast('PDF downloaded successfully!', 'success');

      // Show backup prompt modal after 3.5 seconds
      setTimeout(() => {
        setShowBackupPrompt(true);
      }, 3500);

      // Increment global PDF download counter
      await fetch('/api/counter', { method: 'POST' }).catch((err) =>
        console.error('Failed to increment global counter:', err)
      );
    } catch (err) {
      console.error(err);
      addToast('Failed to export PDF', 'error');
    } finally {
      setIsExporting(false);
    }
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
      {onToggleTab && (
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '3px', width: '100%', marginBottom: '4px' }}>
          <button 
            type="button"
            style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '11.5px', fontWeight: 700, padding: '8px 12px', cursor: 'pointer', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={() => onToggleTab('edit')}
          >
            ✏️ Edit Inputs
          </button>
          <button 
            type="button"
            style={{ flex: 1, background: 'var(--bg-primary)', border: 'none', color: 'var(--accent-primary)', fontSize: '11.5px', fontWeight: 700, padding: '8px 12px', cursor: 'default', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
            disabled
          >
            👁️ Preview &amp; PDF
          </button>
        </div>
      )}
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

      {showBackupPrompt && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(3, 7, 18, 0.75)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div 
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              maxWidth: '440px',
              width: '90%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(108, 99, 255, 0.1)',
              fontFamily: 'inherit',
            }}
          >
            <h3 
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              💾 Save a Local Backup!
            </h3>
            <p 
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                margin: '0 0 20px 0',
              }}
            >
              To safeguard your data against browser cache clearing or to edit your resume on another device, kindly please download the JSON formatted backup file also!
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  const jsonStr = JSON.stringify(state, null, 2);
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `resume-${state.profileName.replace(/\s+/g, '-').toLowerCase()}-backup.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  addToast('JSON backup downloaded successfully!', 'success');
                  setShowBackupPrompt(false);
                }}
                style={{
                  flex: 1,
                  background: '#ffd700',
                  color: '#030712',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.15)')}
                onMouseOut={(e) => (e.currentTarget.style.filter = 'none')}
              >
                Download JSON Backup
              </button>
              <button
                onClick={() => setShowBackupPrompt(false)}
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'var(--border)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Toolbar);

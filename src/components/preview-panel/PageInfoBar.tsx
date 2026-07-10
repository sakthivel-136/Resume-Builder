'use client';

import React, { memo } from 'react';
import { useResume } from '@/context/ResumeContext';
import styles from './PreviewPanel.module.css';

interface PageInfoBarProps {
  contentHeight: number;
}

const PageInfoBar = ({ contentHeight }: PageInfoBarProps) => {
  const { state } = useResume();

  const A4_HEIGHT = 1123;
  const totalMargin = state.mT + state.mB;
  
  // Calculate page statistics
  const usableHeight = A4_HEIGHT;
  const pageCount = Math.max(1, Math.ceil(contentHeight / usableHeight));
  const isMulti = pageCount > 1;

  // Calculate fit status
  const maxSinglePageHeight = A4_HEIGHT;
  const isOverflow = contentHeight > maxSinglePageHeight;
  const overflowPx = isOverflow ? contentHeight - maxSinglePageHeight : 0;

  return (
    <div 
      style={{ 
        width: '100%', 
        maxWidth: '794px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 4px',
        fontSize: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span 
          style={{ 
            background: isMulti ? 'var(--accent-secondary)' : 'var(--accent-primary)',
            color: '#fff',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>
          Content Height: <strong style={{ color: 'var(--text-primary)' }}>{contentHeight}px</strong> / {A4_HEIGHT}px
        </span>
      </div>

      <div>
        {isOverflow ? (
          <span style={{ color: 'var(--danger)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Overflows page by {overflowPx}px
          </span>
        ) : (
          <span style={{ color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Perfect single-page fit!
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(PageInfoBar);

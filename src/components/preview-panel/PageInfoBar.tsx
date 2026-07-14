'use client';

import React, { memo } from 'react';
import { useResume } from '@/context/ResumeContext';
import styles from './PreviewPanel.module.css';

interface PageInfoBarProps {
  contentHeight: number;
}

const PageInfoBar = ({ contentHeight }: PageInfoBarProps) => {
  const { state } = useResume();

  const PAGE_HEIGHT = 1123;
  const PAGE_WIDTH = 794;
  const totalMargin = state.mT + state.mB;
  
  // Calculate page statistics based on actual layout with page breaks
  // This accounts for the layout adjustment logic that pushes content to avoid page break margins
  const usablePageHeight = PAGE_HEIGHT - totalMargin;
  
  // More accurate page calculation that considers page break adjustments
  // This matches the logic in ResumeRenderer's layout adjustment system
  let adjustedContentHeight = contentHeight;
  
  // Estimate additional height from page break adjustments
  // Each page boundary can potentially add margin pushes
  const estimatedPageBreaks = Math.floor(contentHeight / PAGE_HEIGHT);
  const estimatedPushAdjustments = estimatedPageBreaks * (state.mT + state.mB) * 0.5; // Conservative estimate
  adjustedContentHeight += estimatedPushAdjustments;
  
  const pageCount = Math.max(1, Math.ceil(adjustedContentHeight / PAGE_HEIGHT));
  const isMulti = pageCount > 1;

  // Calculate fit status based on adjusted height
  const maxContentForPageCount = pageCount * PAGE_HEIGHT;
  const isOverflow = adjustedContentHeight > maxContentForPageCount;
  const overflowPx = isOverflow ? adjustedContentHeight - maxContentForPageCount : 0;

  // Calculate actual usable space per page
  const totalUsableSpace = pageCount * usablePageHeight;
  const spaceUtilization = Math.min(100, (contentHeight / totalUsableSpace) * 100);

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
          Content: <strong style={{ color: 'var(--text-primary)' }}>{contentHeight}px</strong> 
          {adjustedContentHeight !== contentHeight && (
            <> → <strong style={{ color: 'var(--text-primary)' }}>{Math.round(adjustedContentHeight)}px</strong></>
          )}
          <span style={{ opacity: 0.7 }}> ({Math.round(spaceUtilization)}% used)</span>
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
            Estimated overflow: {Math.round(overflowPx)}px
          </span>
        ) : (
          <span style={{ color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {pageCount === 1 ? 'Single-page' : `${pageCount}-page`} layout ready
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(PageInfoBar);

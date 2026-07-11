'use client';

import React, { memo, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import ClassicTemplate from './templates/ClassicTemplate';
import SidebarTemplate from './templates/SidebarTemplate';
import ModernTemplate from './templates/ModernTemplate';
import { SAMPLE_RESUME_DATA } from '@/data/defaultResume';

interface ResumeRendererProps {
  onHeightChange?: (height: number) => void;
}

const ResumeRenderer = ({ onHeightChange }: ResumeRendererProps) => {
  const { state } = useResume();
  const [contentHeight, setContentHeight] = useState(1123);
  const measureRef = useRef<HTMLDivElement>(null);

  // Measure content height and report back
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setContentHeight(height);
        if (onHeightChange) {
          onHeightChange(height);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [onHeightChange, state]);

  const renderActiveTemplate = (isExport = false) => {
    const stateWithFallbacks = {
      ...state,
      name: state.name ? state.name.trim() : '',
      title: state.title ? state.title.trim() : '',
      phone: state.phone ? state.phone.trim() : '',
      email: state.email ? state.email.trim() : '',
      linkedin: state.linkedin ? state.linkedin.trim() : '',
      github: state.github ? state.github.trim() : '',
      website: state.website ? state.website.trim() : '',
      summary: state.summary ? state.summary.trim() : '',
      education: state.education || [],
      skillGroups: state.skillGroups || [],
      experience: state.experience || [],
      projects: state.projects || [],
      achievements: state.achievements || [],
    };

    switch (stateWithFallbacks.tpl) {
      case 1:
        return <ClassicTemplate state={stateWithFallbacks} isExport={isExport} />;
      case 2:
        return <SidebarTemplate state={stateWithFallbacks} isExport={isExport} />;
      case 3:
        return <ModernTemplate state={stateWithFallbacks} isExport={isExport} />;
      default:
        return <ClassicTemplate state={stateWithFallbacks} isExport={isExport} />;
    }
  };

  let bulletChar = '"•"';
  if (state.bulletType === 'circle') bulletChar = '"○"';
  if (state.bulletType === 'square') bulletChar = '"■"';
  if (state.bulletType === 'none') bulletChar = '""';

  // Maps values to CSS properties on container
  const cssVarsStyle = {
    '--p-heading-font': state.hFont,
    '--p-body-font': state.bFont,
    '--p-heading-color': state.hColor,
    '--p-text-color': state.tColor,
    '--p-sidebar-bg': state.sidebarBg,
    '--p-sidebar-text': state.sidebarText,
    '--p-left-bg': state.leftBg,
    '--p-accent-color': state.aColor,
    '--body-size': `${state.bodySize}px`,
    '--heading-size': `${state.headSize}px`,
    '--line-height': state.lineH,
    '--p-bullet-char': bulletChar,
    '--p-bullet-size': '1.35em',
    '--p-bullet-color': state.bulletColor || 'var(--p-heading-color)',
    '--p-sec-sp': `${state.secSp}px`,
  } as React.CSSProperties;

  const PAGE_HEIGHT = 1123;
  const PAGE_WIDTH = 794;
  const marginTop = Number(state.mT) || 24;
  const marginBottom = Number(state.mB) || 24;
  
  const pageCount = Math.max(1, Math.ceil(contentHeight / PAGE_HEIGHT));

  // Layout adjustment script to push blocks out of margin/page break boundaries
  useLayoutEffect(() => {
    const runAdjustment = () => {
      const containers = document.querySelectorAll(
        '#resume-measure-container, #resume-export, #resume-content'
      );
      
      containers.forEach((container) => {
        const blocks = container.querySelectorAll<HTMLElement>(
          '[class*="entryBlock"], .eduBlock, .timelineBlock, .achievementList, .skillGroup'
        );
        
        // 1. Reset margins
        blocks.forEach((el) => {
          el.style.marginTop = '';
        });

        // 2. Cascade adjustments (up to 5 passes)
        for (let pass = 0; pass < 5; pass++) {
          let adjusted = false;
          
          const items = Array.from(blocks).map((el) => {
            const offsetTop = el.offsetTop;
            const offsetHeight = el.offsetHeight;
            return { el, top: offsetTop, bottom: offsetTop + offsetHeight };
          });

          for (const item of items) {
            const startPage = Math.floor(item.top / PAGE_HEIGHT);
            const boundary = (startPage + 1) * PAGE_HEIGHT;
            const marginBoundary = boundary - marginBottom;

            if (item.bottom > marginBoundary) {
              const itemHeight = item.bottom - item.top;
              const fitsOnPage = itemHeight <= (PAGE_HEIGHT - marginTop - marginBottom);
              
              if (fitsOnPage && item.top < marginBoundary) {
                const pushAmount = (boundary + marginTop) - item.top;
                item.el.style.marginTop = `${pushAmount}px`;
                adjusted = true;
                break;
              }
            }
          }
          if (!adjusted) break;
        }
      });
    };

    runAdjustment();
  }, [state, contentHeight]);

  const renderPageSheet = (pageIndex: number, isExport = false) => {
    return (
      <div 
        key={pageIndex}
        className="resume-page-sheet"
        style={{
          width: `${PAGE_WIDTH}px`,
          height: `${PAGE_HEIGHT}px`,
          background: state.bgColor || '#ffffff',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden',
          ...(isExport ? {} : {
            boxShadow: '0 4px 24px rgba(20, 30, 50, 0.12)',
            marginBottom: pageIndex === pageCount - 1 ? '0' : '24px',
          })
        }}
      >
        {/* Sliced template content */}
        <div 
          style={{ 
            ...cssVarsStyle, 
            width: '100%', 
            transform: `translateY(-${pageIndex * PAGE_HEIGHT}px)`,
            boxSizing: 'border-box' 
          }}
        >
          {renderActiveTemplate(true)}
        </div>

        {/* Page Number Indicator (Hidden in PDF export) */}
        {!isExport && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '16px',
            fontSize: '10.5px',
            color: 'rgba(0, 0, 0, 0.4)',
            fontWeight: 600,
            userSelect: 'none',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '2px 8px',
            borderRadius: '4px',
            zIndex: 60,
          }}>
            Page {pageIndex + 1} of {pageCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="resume-content-wrapper" style={{ position: 'relative' }}>
      {/* Hidden Measure Container (auto height to get natural continuous height) */}
      <div
        id="resume-measure-container"
        ref={measureRef}
        style={{
          ...cssVarsStyle,
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: `${PAGE_WIDTH}px`,
          height: 'auto',
          visibility: 'hidden',
          pointerEvents: 'none',
          boxSizing: 'border-box',
        }}
      >
        {renderActiveTemplate(true)}
      </div>

      {/* Export Container (Off-screen but fully rendered for html2canvas capture) */}
      <div 
        id="resume-export"
        style={{ 
          position: 'fixed', 
          left: '-9999px', 
          top: 0, 
          width: `${PAGE_WIDTH}px`, 
          height: `${pageCount * PAGE_HEIGHT}px`, 
          pointerEvents: 'none', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {Array.from({ length: pageCount }).map((_, i) => renderPageSheet(i, true))}
      </div>

      {/* Visible Split-Page Preview */}
      <div 
        id="resume-content"
        style={{
          width: `${PAGE_WIDTH}px`,
          display: 'flex',
          flexDirection: 'column',
          background: 'transparent',
          boxSizing: 'border-box',
          fontFamily: state.bFont,
          fontSize: `${state.bodySize}px`,
          color: state.tColor,
        }}
      >
        {Array.from({ length: pageCount }).map((_, i) => renderPageSheet(i, false))}
      </div>
    </div>
  );
};

export default memo(ResumeRenderer);

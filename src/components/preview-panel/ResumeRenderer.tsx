'use client';

import React, { memo, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import ClassicTemplate from './templates/ClassicTemplate';
import SidebarTemplate from './templates/SidebarTemplate';
import ModernTemplate from './templates/ModernTemplate';
import TimelineTemplate from './templates/TimelineTemplate';
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
      case 4:
        return <TimelineTemplate state={stateWithFallbacks} isExport={isExport} />;
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
    // Helper to get absolute offsetTop relative to a container, traversing offsetParents (immune to CSS zoom/scale)
    const getAbsoluteOffsetTop = (el: HTMLElement, targetContainer: HTMLElement): number => {
      let top = 0;
      let current: HTMLElement | null = el;
      while (current && current !== targetContainer) {
        top += current.offsetTop;
        const next: HTMLElement | null = current.offsetParent as HTMLElement | null;
        if (next && !targetContainer.contains(next) && next !== targetContainer) {
          break;
        }
        current = next;
      }
      return top;
    };

    const runAdjustment = () => {
      const measureContainer = document.getElementById('resume-measure-container');
      if (!measureContainer) return;

      const PAGE_HEIGHT = 1123;
      const marginTop = Number(state.mT) || 24;
      const marginBottom = Number(state.mB) || 24;

      // 1. Query resettable items in measure container and reset
      const sourceBlocks = measureContainer.querySelectorAll<HTMLElement>(
        '[class*="entryBlock"], .eduBlock, .timelineBlock, .skillGroup, [id^="entry-"]'
      );
      sourceBlocks.forEach((el) => {
        el.style.marginTop = '';
      });

      // 2. Cascade adjustments on measure container (up to 20 passes)
      for (let pass = 0; pass < 20; pass++) {
        let adjusted = false;
        
        const items = Array.from(sourceBlocks).map((el) => {
          const offsetTop = getAbsoluteOffsetTop(el, measureContainer);
          const offsetHeight = el.offsetHeight;
          return { el, top: offsetTop, bottom: offsetTop + offsetHeight };
        });

        for (const item of items) {
          const secId = item.el.id || '';
          
          // Check if this item falls in the unsafe boundary zone of ANY page break
          // Max 4 pages check to keep it safe and bounded
          for (let pageIndex = 1; pageIndex <= 4; pageIndex++) {
            const boundary = pageIndex * PAGE_HEIGHT;
            const unsafeStart = boundary - marginBottom;
            const unsafeEnd = boundary + marginTop;

            if (item.bottom > unsafeStart && item.top < unsafeEnd) {
              const itemHeight = item.bottom - item.top;
              const fitsOnPage = itemHeight <= (PAGE_HEIGHT - marginTop - marginBottom);
              
              // Only push if it fits on a single page (otherwise it has to split anyway)
              if (fitsOnPage && item.top < unsafeEnd) {
                const parentSectionIds = [
                  'entry-summary', 'entry-education', 'entry-skills', 'entry-experience', 
                  'entry-projects', 'entry-achievements'
                ];
                const isParentSection = parentSectionIds.includes(secId) || secId.startsWith('entry-custom_');
                
                if (isParentSection) {
                  const isKeepWholeSec = secId.includes('summary') || secId.includes('skills') || secId.includes('achievements') || secId.startsWith('entry-custom_');
                  
                  if (isKeepWholeSec) {
                    // Push the entire section container
                    const pushAmount = unsafeEnd - item.top;
                    item.el.style.marginTop = `${pushAmount}px`;
                    adjusted = true;
                  } else {
                    // For split sections (education, experience, projects), check if header + first entry fits
                    const header = item.el.querySelector('h2, h3, [class*="sectionHeader"], [class*="mainHeading"], [class*="sbHeading"]');
                    const firstEntry = item.el.querySelector<HTMLElement>('.eduBlock, .timelineBlock, [id^="entry-"]');
                    
                    if (header && firstEntry) {
                      const headerTop = getAbsoluteOffsetTop(header as HTMLElement, measureContainer);
                      const firstEntryBottom = getAbsoluteOffsetTop(firstEntry, measureContainer) + firstEntry.offsetHeight;
                      
                      if (firstEntryBottom > unsafeStart && headerTop < unsafeEnd) {
                        // Even the header + first entry does not fit, push the entire section container
                        const pushAmount = unsafeEnd - item.top;
                        item.el.style.marginTop = `${pushAmount}px`;
                        adjusted = true;
                      }
                    }
                  }
                } else {
                  // This is an individual entry block (e.g. .eduBlock, a specific experience job, or a specific project entry)
                  // Push it to start cleanly on the next page
                  const pushAmount = unsafeEnd - item.top;
                  item.el.style.marginTop = `${pushAmount}px`;
                  adjusted = true;
                }
                break;
              }
            }
          }
          if (adjusted) break;
        }
        if (!adjusted) break;
      }

      // 3. Sync calculated margin-top values from measure container to preview sheets and export container
      const syncTargetMargins = (targetContainer: HTMLElement | null) => {
        if (!targetContainer) return;
        const targetBlocks = targetContainer.querySelectorAll<HTMLElement>(
          '[class*="entryBlock"], .eduBlock, .timelineBlock, .skillGroup, [id^="entry-"]'
        );
        sourceBlocks.forEach((srcEl, index) => {
          const targetEl = targetBlocks[index];
          if (targetEl) {
            targetEl.style.marginTop = srcEl.style.marginTop;
          }
        });
      };

      // Sync to visible page sheets (might contain multiple copies)
      const visibleSheets = document.querySelectorAll('#resume-content .resume-page-sheet');
      visibleSheets.forEach((sheet) => {
        syncTargetMargins(sheet as HTMLElement);
      });

      // Sync to export container
      syncTargetMargins(document.getElementById('resume-export'));
    };

    let active = true;
    runAdjustment();

    if (typeof window !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        if (active) {
          runAdjustment();
        }
      });
    }

    return () => {
      active = false;
    };
  }, [state, contentHeight]);

  const renderPageSheet = (pageIndex: number) => {
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
          boxShadow: '0 4px 24px rgba(20, 30, 50, 0.12)',
          marginBottom: pageIndex === pageCount - 1 ? '0' : '24px',
        }}
      >
        {/* Sliced template content */}
        <div 
          style={{ 
            ...cssVarsStyle, 
            width: '100%', 
            height: `${pageCount * PAGE_HEIGHT}px`,
            transform: `translateY(-${pageIndex * PAGE_HEIGHT}px)`,
            boxSizing: 'border-box' 
          }}
        >
          {renderActiveTemplate(false)}
        </div>

        {/* Page Number Indicator (Hidden in PDF export) */}
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
          fontFamily: state.bFont,
          fontSize: `${state.bodySize}px`,
          color: state.tColor,
        }}
      >
        {renderActiveTemplate(false)}
      </div>

      {/* Export Container (Off-screen but fully rendered for html2canvas capture) */}
      <div 
        style={{ 
          position: 'fixed', 
          left: '-9999px', 
          top: 0, 
          width: `${PAGE_WIDTH}px`, 
          height: `${pageCount * PAGE_HEIGHT}px`, 
          pointerEvents: 'none', 
          overflow: 'hidden',
        }}
      >
        <div 
          id="resume-export"
          style={{
            ...cssVarsStyle,
            position: 'relative',
            width: `${PAGE_WIDTH}px`,
            height: `${pageCount * PAGE_HEIGHT}px`,
            background: state.bgColor || '#ffffff',
            boxSizing: 'border-box',
            fontFamily: state.bFont,
            fontSize: `${state.bodySize}px`,
            color: state.tColor,
            overflow: 'hidden',
          }}
        >
          {renderActiveTemplate(false)}
        </div>
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
        {Array.from({ length: pageCount }).map((_, i) => renderPageSheet(i))}
      </div>
    </div>
  );
};

export default memo(ResumeRenderer);

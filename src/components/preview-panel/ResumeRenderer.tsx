'use client';

import React, { memo, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [isMounted, setIsMounted] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  }, [onHeightChange, state, isMounted]);

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

    const isWholeSection = (id: string) => {
      return id === 'entry-summary' || 
             id === 'entry-skills' || 
             id === 'entry-achievements' || 
             id === 'entry-education' || 
             id.startsWith('entry-custom_');
    };

    const isSplittableSection = (id: string) => {
      return id === 'entry-experience' || id === 'entry-projects';
    };

    const getParentSectionId = (el: HTMLElement): string | null => {
      let parent = el.parentElement;
      while (parent) {
        if (parent.id && parent.id.startsWith('entry-')) {
          const id = parent.id;
          if (isWholeSection(id) || isSplittableSection(id)) {
            return id;
          }
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const runAdjustment = () => {
      const measureContainer = document.getElementById('resume-measure-container');
      if (!measureContainer) return;

      const PAGE_HEIGHT = 1123;
      const marginTop = Number(state.mT) || 24;
      const marginBottom = Number(state.mB) || 24;

      // 1. Reset all source blocks in measure container to their natural state
      // (clearing inline marginTop resets them to their original continuous layout positions)
      const allEntryEls = measureContainer.querySelectorAll<HTMLElement>('[id^="entry-"]');
      allEntryEls.forEach((el) => {
        el.style.marginTop = '';
      });

      // 2. Filter elements to measure (only sections, and entries belonging to experience or projects)
      const blocksToMeasure: HTMLElement[] = [];
      allEntryEls.forEach((el) => {
        const id = el.id;
        if (isWholeSection(id) || isSplittableSection(id)) {
          blocksToMeasure.push(el);
        } else {
          const parentSecId = getParentSectionId(el);
          if (parentSecId === 'entry-experience' || parentSecId === 'entry-projects') {
            blocksToMeasure.push(el);
          }
        }
      });

      // 3. Extract details of each block
      interface MeasureItem {
        id: string;
        el: HTMLElement;
        naturalTop: number;
        naturalBottom: number;
        height: number;
        type: 'whole' | 'splittable-container' | 'entry';
      }

      const items: MeasureItem[] = blocksToMeasure.map((el) => {
        const top = getAbsoluteOffsetTop(el, measureContainer);
        const height = el.offsetHeight;
        const id = el.id;
        
        let type: 'whole' | 'splittable-container' | 'entry' = 'entry';
        if (isWholeSection(id)) {
          type = 'whole';
        } else if (isSplittableSection(id)) {
          type = 'splittable-container';
        }

        return {
          id,
          el,
          naturalTop: top,
          naturalBottom: top + height,
          height,
          type,
        };
      });

      // 4. Compute push amounts. We track cumulative pushes.
      const pushMap = new Map<string, number>();
      let cumulativePush = 0;

      for (const item of items) {
        const simTop = item.naturalTop + cumulativePush;
        const simBottom = item.naturalBottom + cumulativePush;

        // Check page breaks for pages 1 to 4
        for (let pageIndex = 1; pageIndex <= 4; pageIndex++) {
          const boundary = pageIndex * PAGE_HEIGHT;
          const unsafeStart = boundary - marginBottom;
          const unsafeEnd = boundary + marginTop;

          if (simBottom > unsafeStart && simTop < unsafeEnd) {
            const fitsOnPage = item.height <= (PAGE_HEIGHT - marginTop - marginBottom);
            if (!fitsOnPage) break; // If too big, let it split naturally across pages

            if (item.type === 'splittable-container') {
              // Only push the splittable container if the header + first entry does not fit
              const headerEl = item.el.querySelector<HTMLElement>('h2, h3, [class*="sectionHeader"], [class*="mainHeading"], [class*="sbHeading"]');
              const firstEntryEl = item.el.querySelector<HTMLElement>('[id^="entry-"]:not(h2):not(h3)');
              
              const hTop = (headerEl ? getAbsoluteOffsetTop(headerEl, measureContainer) : item.naturalTop) + cumulativePush;
              const fBottom = (firstEntryEl ? (getAbsoluteOffsetTop(firstEntryEl, measureContainer) + firstEntryEl.offsetHeight) : item.naturalBottom) + cumulativePush;

              if (fBottom > unsafeStart && hTop < unsafeEnd) {
                const push = unsafeEnd - simTop;
                pushMap.set(item.id, push);
                cumulativePush += push;
              }
            } else {
              // For whole sections or individual entries, push it to next page
              const push = unsafeEnd - simTop;
              pushMap.set(item.id, push);
              cumulativePush += push;
            }
            break; // Handle only the first boundary this block crosses
          }
        }
      }

      // 5. Apply Computed Pushes to Visible Sheets & Export Container
      const applyPushesToContainer = (container: HTMLElement | null) => {
        if (!container) return;

        // Reset first
        const blocks = container.querySelectorAll<HTMLElement>('[id^="entry-"]');
        blocks.forEach((el) => {
          el.style.marginTop = '';
        });

        // Apply
        pushMap.forEach((pushAmount, id) => {
          if (!id) return;
          const el = container.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`);
          if (el) {
            el.style.marginTop = `${pushAmount}px`;
          }
        });
      };

      // Sync to all visible page sheets
      const visibleSheets = document.querySelectorAll('#resume-content .resume-page-sheet');
      visibleSheets.forEach((sheet) => {
        applyPushesToContainer(sheet as HTMLElement);
      });

      // Sync to export container
      applyPushesToContainer(document.getElementById('resume-export'));
    };

    let active = true;
    
    const triggerAdjust = () => {
      if (active) {
        runAdjustment();
      }
    };

    triggerAdjust();
    // Run after a short paint delay to handle React DOM updates
    setTimeout(triggerAdjust, 60);

    if (typeof window !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(triggerAdjust, 120);
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

      {/* Render measurement and export containers outside scaled preview workspace */}
      {isMounted && createPortal(
        <>
          {/* Viewport-fixed hidden parent wrapper to prevent scrolling stretch while guaranteeing full layout activation in mobile Safari */}
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
              pointerEvents: 'none',
              opacity: 0,
              zIndex: -9999,
            }}
          >
            {/* Hidden Measure Container (auto height to get natural continuous height) */}
            <div
              id="resume-measure-container"
              ref={measureRef}
              style={{
                ...cssVarsStyle,
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${PAGE_WIDTH}px`,
                height: 'auto',
                boxSizing: 'border-box',
                fontFamily: state.bFont,
                fontSize: `${state.bodySize}px`,
                color: state.tColor,
              }}
            >
              {renderActiveTemplate(false)}
            </div>
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
        </>,
        document.body
      )}
    </div>
  );
};

export default memo(ResumeRenderer);

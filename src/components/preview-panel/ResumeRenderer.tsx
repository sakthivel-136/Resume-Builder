'use client';

import React, { memo, useRef, useEffect, useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import ClassicTemplate from './templates/ClassicTemplate';
import SidebarTemplate from './templates/SidebarTemplate';
import ModernTemplate from './templates/ModernTemplate';

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
      name: state.name ? state.name.trim() : 'Sakthi Vel C',
      title: state.title ? state.title.trim() : 'Python Full-Stack Developer',
      phone: state.phone ? state.phone.trim() : '+91 99999 99999',
      email: state.email ? state.email.trim() : 'hello@alexcarter.dev',
      linkedin: state.linkedin ? state.linkedin.trim() : 'linkedin.com/in/sakthivel-c',
      github: state.github ? state.github.trim() : 'github.com/alex-dev',
      website: state.website ? state.website.trim() : 'sakthivel-blog.io',
      summary: state.summary ? state.summary.trim() : 'Computer Science student and Python Full-Stack Developer specializing in Machine Learning and IoT, focusing on architecting secure, scalable systems. Proven expertise in building real-time AI applications with Gemini 1.5 Pro, FastAPI, and Next.js, while optimizing database performance and implementing robust encrypted data architectures for high-performance environments.'
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
    '--p-bullet-size': `${state.bulletSize || 8}px`,
    '--p-bullet-color': state.bulletColor || 'var(--p-heading-color)',
  } as React.CSSProperties;

  const usableHeight = 1123 - state.mT - state.mB;
  const pageCount = Math.max(1, Math.ceil((contentHeight - 15) / usableHeight));

  return (
    <div id="resume-content" style={{ position: 'relative' }}>
      {/* Off-screen Measurement Container (Invisible) */}
      <div 
        ref={measureRef}
        id="resume-measure"
        style={{
          ...cssVarsStyle,
          width: '794px',
          height: 'auto',
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          visibility: 'hidden',
          pointerEvents: 'none',
          boxSizing: 'border-box',
        }}
      >
        {renderActiveTemplate(true)}
      </div>

      {/* Off-screen Export Container (Always 100% scale, page-split, for html2pdf capture) */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden', pointerEvents: 'none' }}>
        <div 
          id="resume-export"
          style={{
            ...cssVarsStyle,
            position: 'relative',
            width: '794px',
            height: `${pageCount * usableHeight}px`,
            background: state.bgColor || '#ffffff',
            boxSizing: 'border-box',
            fontFamily: state.bFont,
            fontSize: `${state.bodySize}px`,
            color: state.tColor,
          }}
        >
          {renderActiveTemplate()}
        </div>
      </div>

      {/* Visible Pageless Preview */}
      <div 
        id="resume-content"
        style={{
          width: '794px',
          height: `${pageCount * usableHeight}px`,
          background: state.bgColor || '#ffffff',
          boxShadow: '0 4px 24px rgba(20, 30, 50, 0.12)',
          position: 'relative',
          marginBottom: '24px',
          boxSizing: 'border-box',
          fontFamily: state.bFont,
          fontSize: `${state.bodySize}px`,
          color: state.tColor,
        }}
      >
        <div style={{ ...cssVarsStyle, width: '100%', height: '100%', boxSizing: 'border-box' }}>
          {renderActiveTemplate()}
        </div>

        {/* Page Break Indicators */}
        {pageCount > 1 && Array.from({ length: pageCount }).map((_, i) => {
          if (i === 0) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${state.mT + i * usableHeight}px`,
                left: 0,
                right: 0,
                height: '0px',
                borderTop: '2px dashed rgba(0, 0, 0, 0.2)',
                zIndex: 50,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <span style={{ 
                background: '#fff', 
                padding: '2px 6px', 
                fontSize: '10px', 
                color: '#666',
                borderRadius: '4px',
                transform: 'translateY(-50%)',
                marginRight: '8px',
                fontWeight: 600,
                border: '1px solid #ddd',
              }}>Page Break</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ResumeRenderer);

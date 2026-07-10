'use client';

import React, { memo, useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import ATSScoreBar from './ATSScoreBar';
import PageInfoBar from './PageInfoBar';
import ResumeRenderer from './ResumeRenderer';
import styles from './PreviewPanel.module.css';

interface PreviewPanelProps {
  onToggleTab?: (tab: 'edit' | 'preview') => void;
}

const PreviewPanel = ({ onToggleTab }: PreviewPanelProps) => {
  const [contentHeight, setContentHeight] = useState(1123);
  const [zoom, setZoom] = useState<number | 'fit'>('fit');
  const [isExporting, setIsExporting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getZoomScale = () => {
    if (zoom === 'fit') {
      if (windowWidth < 1024) {
        const padding = 24;
        const availableWidth = windowWidth - padding;
        return Math.min(0.82, availableWidth / 794);
      }
      return 0.82; // Comfortable fitting scale
    }
    return zoom;
  };

  const scale = getZoomScale();
  const pageCount = Math.max(1, Math.ceil(contentHeight / 1123));
  const totalViewportHeight = 1123 * pageCount + 24 * (pageCount - 1);

  return (
    <div className={styles.panel}>
      <div className={styles.scrollArea}>
        {/* Toolbar */}
        <Toolbar 
          contentHeight={contentHeight} 
          zoom={zoom as any} 
          setZoom={setZoom} 
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          onToggleTab={onToggleTab}
        />

        {/* ATS incompatibility scoring */}
        <ATSScoreBar />

        {/* Height fit information metrics */}
        <PageInfoBar contentHeight={contentHeight} />

        {/* PaperViewport representing the document sheets */}
        <div 
          className={styles.paperViewport}
          style={{ 
            width: `${794 * scale}px`,
            height: `${totalViewportHeight * scale}px`,
          }}
        >
          <div 
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            <ResumeRenderer onHeightChange={setContentHeight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PreviewPanel);

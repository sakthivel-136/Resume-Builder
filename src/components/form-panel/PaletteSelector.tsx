'use client';

import React, { memo } from 'react';
import type { ResumeData } from '@/types/resume';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import ColorPicker from '@/components/ui/ColorPicker';
import { PALETTES } from '@/data/palettes';

const PaletteSelector = () => {
  const { state, dispatch } = useResume();

  const currentPalettes = PALETTES[state.tpl] || [];

  const handleSelect = (idx: number) => {
    dispatch({ type: 'SET_PALETTE', pal: idx });
  };

  const handleCustomColor = (field: keyof ResumeData, val: string) => {
    dispatch({ type: 'SET_FIELD', field, value: val });
  };

  return (
    <Card title="Color Palette" collapsible>
      {/* Palette presets */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '8px', 
          marginBottom: '16px' 
        }}
      >
        {currentPalettes.map((p, idx) => (
          <button
            key={p.n}
            type="button"
            onClick={() => handleSelect(idx)}
            style={{
              background: state.pal === idx ? 'rgba(108, 99, 255, 0.1)' : 'var(--bg-tertiary)',
              border: '2px solid',
              borderColor: state.pal === idx ? 'var(--accent-primary)' : 'var(--border)',
              borderRadius: '8px',
              padding: '8px 10px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
              outline: 'none',
            }}
          >
            {/* Color Swatch Dots */}
            <div style={{ display: 'flex', gap: '3px' }}>
              <div 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  backgroundColor: p.h,
                  border: '1px solid rgba(255,255,255,0.1)' 
                }} 
              />
              <div 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  backgroundColor: p.t,
                  border: '1px solid rgba(255,255,255,0.1)' 
                }} 
              />
              {p.sb ? (
                <div 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    backgroundColor: p.sb,
                    border: '1px solid rgba(255,255,255,0.1)' 
                  }} 
                />
              ) : p.lf ? (
                <div 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    backgroundColor: p.lf,
                    border: '1px solid rgba(255,255,255,0.1)' 
                  }} 
                />
              ) : p.a ? (
                <div 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    backgroundColor: p.a,
                    border: '1px solid rgba(255,255,255,0.1)' 
                  }} 
                />
              ) : null}
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {p.n}
            </span>
          </button>
        ))}
      </div>

      {/* Custom color pickers */}
      <div 
        style={{ 
          borderTop: '1px solid var(--border)', 
          paddingTop: '14px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px' 
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
          Fine-tune Colors
        </div>

        <ColorPicker
          label="Heading Color"
          value={state.hColor}
          onChange={(val) => handleCustomColor('hColor', val)}
        />

        <ColorPicker
          label="Body Text Color"
          value={state.tColor}
          onChange={(val) => handleCustomColor('tColor', val)}
        />

        <ColorPicker
          label="Page Background"
          value={state.bgColor}
          onChange={(val) => handleCustomColor('bgColor', val)}
        />

        {state.tpl === 1 && (
          <ColorPicker
            label="Accent Color"
            value={state.aColor}
            onChange={(val) => handleCustomColor('aColor', val)}
          />
        )}

        {state.tpl === 2 && (
          <>
            <ColorPicker
              label="Sidebar Background"
              value={state.sidebarBg}
              onChange={(val) => handleCustomColor('sidebarBg', val)}
            />
            <ColorPicker
              label="Sidebar Text Color"
              value={state.sidebarText}
              onChange={(val) => handleCustomColor('sidebarText', val)}
            />
          </>
        )}

        {state.tpl === 3 && (
          <ColorPicker
            label="Left Accent Bg"
            value={state.leftBg}
            onChange={(val) => handleCustomColor('leftBg', val)}
          />
        )}
      </div>
    </Card>
  );
};

export default memo(PaletteSelector);

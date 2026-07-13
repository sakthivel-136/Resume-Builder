'use client';

import React, { memo } from 'react';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import RangeSlider from '@/components/ui/RangeSlider';
import Toggle from '@/components/ui/Toggle';
import ColorPicker from '@/components/ui/ColorPicker';
import styles from './cards.module.css';

const LayoutControls = () => {
  const { state, dispatch } = useResume();

  const handleSliderChange = (field: string, value: number) => {
    dispatch({ type: 'SET_FIELD', field: field as any, value });
  };

  const handleToggleContact = (checked: boolean) => {
    dispatch({ type: 'SET_FIELD', field: 'gmContact', value: checked });
  };

  const handleAccentChange = (mode: 'none' | 'top') => {
    dispatch({ type: 'SET_FIELD', field: 'accentBar', value: mode });
  };

  const showSidebarOptions = state.tpl === 2 || state.tpl === 3 || state.tpl === 4;

  return (
    <Card title="Layout & Margins" collapsible>
      {/* Contact Style Option */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '16px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Grid Contact Layout
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Render contact items as labeled grids
          </span>
        </div>
        <Toggle
          checked={state.gmContact}
          onChange={handleToggleContact}
        />
      </div>

      {/* Accent Bar Select */}
      <div className={styles.field} style={{ marginBottom: '16px' }}>
        <label>Top Accent Bar</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
          <button
            type="button"
            onClick={() => handleAccentChange('none')}
            style={{
              background: state.accentBar === 'none' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: '#fff',
              border: '1px solid',
              borderColor: state.accentBar === 'none' ? 'var(--accent-primary)' : 'var(--border)',
              borderRadius: '6px',
              padding: '6px 8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            None
          </button>
          <button
            type="button"
            onClick={() => handleAccentChange('top')}
            style={{
              background: state.accentBar === 'top' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: '#fff',
              border: '1px solid',
              borderColor: state.accentBar === 'top' ? 'var(--accent-primary)' : 'var(--border)',
              borderRadius: '6px',
              padding: '6px 8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Solid Line
          </button>
        </div>
      </div>

      {state.accentBar === 'top' && (
        <div style={{ marginBottom: '14px' }}>
          <RangeSlider
            label="Accent Bar Height"
            value={state.accentH}
            min={2}
            max={12}
            step={1}
            unit="px"
            onChange={(val) => handleSliderChange('accentH', val)}
          />
        </div>
      )}

      {/* Margins */}
      <div 
        style={{ 
          borderTop: '1px solid var(--border)', 
          paddingTop: '14px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          marginBottom: '14px'
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          Page Margins
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <RangeSlider
            label="Top"
            value={state.mT}
            min={0}
            max={70}
            unit="px"
            onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'mT', value: val })}
          />
          <RangeSlider
            label="Bottom"
            value={state.mB}
            min={0}
            max={70}
            unit="px"
            onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'mB', value: val })}
          />
          <RangeSlider
            label="Left"
            value={state.mL}
            min={0}
            max={70}
            unit="px"
            onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'mL', value: val })}
          />
          <RangeSlider
            label="Right"
            value={state.mR}
            min={0}
            max={70}
            unit="px"
            onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'mR', value: val })}
          />
        </div>
      </div>

      {/* Bullet Points */}
      <div 
        style={{ 
          borderTop: '1px solid var(--border)', 
          paddingTop: '14px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          marginBottom: showSidebarOptions ? '14px' : '0px'
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          Bullet Points
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Bullet Style
          </label>
          <select
            value={state.bulletType || 'disc'}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'bulletType', value: e.target.value as any })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="disc">Filled Circle (Disc)</option>
            <option value="circle">Hollow Circle</option>
            <option value="square">Filled Square</option>
            <option value="none">None (Hidden)</option>
          </select>
        </div>

        <div style={{ marginTop: '4px' }}>
          <ColorPicker
            label="Bullet Color"
            value={state.bulletColor || state.hColor}
            onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'bulletColor', value: val })}
          />
        </div>
      </div>

      {/* Sidebar Specific Layout Options */}
      {showSidebarOptions && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Sidebar Layout
          </div>

          <RangeSlider
            label="Sidebar Width"
            value={state.sbW}
            min={140}
            max={280}
            unit="px"
            onChange={(val) => handleSliderChange('sbW', val)}
          />

          <RangeSlider
            label="Sidebar Padding"
            value={state.sbPad}
            min={8}
            max={30}
            unit="px"
            onChange={(val) => handleSliderChange('sbPad', val)}
          />

          <RangeSlider
            label="Main Area Padding"
            value={state.mainPad}
            min={10}
            max={40}
            unit="px"
            onChange={(val) => handleSliderChange('mainPad', val)}
          />
        </div>
      )}
    </Card>
  );
};

export default memo(LayoutControls);

'use client';

import React, { memo } from 'react';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import RangeSlider from '@/components/ui/RangeSlider';
import { HEADING_FONTS, BODY_FONTS } from '@/data/fonts';
import styles from './cards.module.css';

const TypographyControls = () => {
  const { state, dispatch } = useResume();

  const handleSelectFont = (field: 'hFont' | 'bFont', value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleSliderChange = (field: string, value: number) => {
    dispatch({ type: 'SET_FIELD', field: field as any, value });
  };

  return (
    <Card title="Typography" collapsible>
      {/* Heading Font Dropdown */}
      <div className={styles.field} style={{ marginBottom: '14px' }}>
        <label htmlFor="h-font-sel">Heading Font</label>
        <select
          id="h-font-sel"
          className={styles.select}
          value={state.hFont}
          onChange={(e) => handleSelectFont('hFont', e.target.value)}
        >
          {HEADING_FONTS.map((font) => (
            <option 
              key={font.value} 
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Body Font Dropdown */}
      <div className={styles.field} style={{ marginBottom: '18px' }}>
        <label htmlFor="b-font-sel">Body Font</label>
        <select
          id="b-font-sel"
          className={styles.select}
          value={state.bFont}
          onChange={(e) => handleSelectFont('bFont', e.target.value)}
        >
          {BODY_FONTS.map((font) => (
            <option 
              key={font.value} 
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <RangeSlider
          label="Line Height"
          value={state.lineH}
          min={1.1}
          max={2.0}
          step={0.05}
          onChange={(val) => handleSliderChange('lineH', val)}
        />

        <RangeSlider
          label="Section Spacing"
          value={state.secSp}
          min={4}
          max={30}
          step={1}
          unit="px"
          onChange={(val) => handleSliderChange('secSp', val)}
        />

        <RangeSlider
          label="Name Font Size"
          value={state.nameSize}
          min={16}
          max={36}
          step={1}
          unit="px"
          onChange={(val) => handleSliderChange('nameSize', val)}
        />

        <RangeSlider
          label="Heading Size"
          value={state.headSize}
          min={8}
          max={20}
          step={0.5}
          unit="px"
          onChange={(val) => handleSliderChange('headSize', val)}
        />

        <RangeSlider
          label="Body Font Size"
          value={state.bodySize}
          min={8}
          max={16}
          step={0.5}
          unit="px"
          onChange={(val) => handleSliderChange('bodySize', val)}
        />
      </div>
    </Card>
  );
};

export default memo(TypographyControls);

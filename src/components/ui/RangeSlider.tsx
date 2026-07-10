'use client';

import React, { memo, useCallback, useMemo, useId } from 'react';
import styles from './ui.module.css';

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}) => {
  const id = useId();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  // Percentage for the filled track gradient
  const pct = useMemo(() => {
    if (max === min) return 0;
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  // Inline gradient for the track (WebKit needs this on the input itself)
  const trackStyle: React.CSSProperties = useMemo(
    () => ({
      background: `linear-gradient(90deg, #6c63ff 0%, #4ecdc4 ${pct}%, var(--bg-tertiary) ${pct}%)`,
    }),
    [pct]
  );

  const displayValue = `${value}${unit}`;

  return (
    <div className={styles.rangeSlider}>
      <label htmlFor={id} className={styles.rangeLabel}>
        {label}
      </label>
      <div className={styles.rangeInputWrapper}>
        <input
          id={id}
          type="range"
          className={styles.rangeInput}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          style={trackStyle}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        <input
          type="number"
          className={styles.rangeValueInput}
          min={min}
          max={max * 3}
          step={step}
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!isNaN(val)) {
              onChange(val);
            }
          }}
          onFocus={(e) => e.target.select()}
          aria-label={`${label} input value`}
        />
        {unit && <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>{unit}</span>}
      </div>
    </div>
  );
};

export default memo(RangeSlider);

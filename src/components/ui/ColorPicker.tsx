'use client';

import React, { memo, useCallback, useId } from 'react';
import styles from './ui.module.css';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const id = useId();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={styles.colorPicker}>
      <div className={styles.colorSwatch}>
        <input
          id={id}
          type="color"
          className={styles.colorInput}
          value={value}
          onChange={handleChange}
          aria-label={label}
        />
      </div>
      <label htmlFor={id} className={styles.colorLabel}>
        {label}
      </label>
      <span className={styles.colorHex} aria-hidden="true">
        {value}
      </span>
    </div>
  );
};

export default memo(ColorPicker);

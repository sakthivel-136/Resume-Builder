'use client';

import React, { memo, useCallback, useId } from 'react';
import styles from './ui.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
}

const sizeClass: Record<string, string> = {
  sm: styles.toggleSm,
  md: styles.toggleMd,
};

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  size = 'sm',
}) => {
  const id = useId();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onChange(!checked);
      }
    },
    [onChange, checked]
  );

  return (
    <label className={`${styles.toggle} ${sizeClass[size]}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={styles.toggleInput}
        checked={checked}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={checked}
      />
      <span
        className={`${styles.toggleTrack} ${
          checked ? styles.toggleTrackChecked : ''
        }`}
        aria-hidden="true"
      >
        <span className={styles.toggleThumb} />
      </span>
      {label && <span className={styles.toggleLabel}>{label}</span>}
    </label>
  );
};

export default memo(Toggle);

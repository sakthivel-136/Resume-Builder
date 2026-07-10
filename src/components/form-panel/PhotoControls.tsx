'use client';

import React, { memo, useState, DragEvent } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import RangeSlider from '@/components/ui/RangeSlider';
import styles from './cards.module.css';

const PhotoControls = () => {
  const { state, dispatch } = useResume();
  const { addToast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);

  const handlePhotoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (PNG/JPG)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        dispatch({ type: 'SET_FIELD', field: 'photo', value: e.target.result as string });
        addToast('Photo uploaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoUpload(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePhotoUpload(file);
  };

  const handleRemovePhoto = () => {
    dispatch({ type: 'SET_FIELD', field: 'photo', value: null });
    addToast('Photo removed', 'info');
  };

  const handleShapeChange = (shape: 'circle' | 'rounded' | 'square') => {
    dispatch({ type: 'SET_FIELD', field: 'photoShape', value: shape });
  };

  const handlePosChange = (pos: string) => {
    dispatch({ type: 'SET_FIELD', field: 'photoPos', value: pos as any });
  };

  const handleSizeChange = (val: number) => {
    dispatch({ type: 'SET_FIELD', field: 'photoSize', value: val });
  };

  return (
    <Card title="Profile Photo" collapsible>
      {/* Upload Zone */}
      {!state.photo ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            border: isDragActive ? '2px dashed var(--accent-primary)' : '2px dashed var(--border)',
            background: isDragActive ? 'rgba(108, 99, 255, 0.05)' : 'var(--bg-tertiary)',
            borderRadius: '10px',
            padding: '24px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all var(--transition-fast)',
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
          <svg
            style={{ width: '28px', height: '28px', color: 'var(--text-secondary)', marginBottom: '8px' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Drag & drop photo here
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            or click to browse (Max 5MB)
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
          {/* Preview thumbnail */}
          <div style={{ position: 'relative' }}>
            <img
              src={state.photo}
              alt="Profile preview"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'cover',
                borderRadius:
                  state.photoShape === 'circle'
                    ? '50%'
                    : state.photoShape === 'rounded'
                    ? '10px'
                    : '2px',
                border: '2px solid var(--border)',
              }}
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--danger)',
                color: '#fff',
                border: 'none',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '11px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
              title="Remove photo"
            >
              ×
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Photo added
            </span>
            <button
              type="button"
              onClick={handleRemovePhoto}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                fontSize: '11.5px',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Delete photo
            </button>
          </div>
        </div>
      )}

      {/* Style Controls (only show if photo is uploaded) */}
      {state.photo && (
        <div 
          style={{ 
            borderTop: '1px solid var(--border)', 
            paddingTop: '14px', 
            marginTop: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Shape selection */}
          <div className={styles.field}>
            <label>Photo Shape</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
              {(['circle', 'rounded', 'square'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleShapeChange(s)}
                  style={{
                    background: state.photoShape === s ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: '#fff',
                    border: '1px solid',
                    borderColor: state.photoShape === s ? 'var(--accent-primary)' : 'var(--border)',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Position selection */}
          <div className={styles.field}>
            <label htmlFor="p-pos-sel">Photo Position</label>
            <select
              id="p-pos-sel"
              className={styles.select}
              value={(state.tpl === 2 || state.tpl === 3) && state.photoPos !== 'hidden' ? 'sidebar' : state.photoPos}
              onChange={(e) => handlePosChange(e.target.value)}
            >
              {state.tpl === 2 || state.tpl === 3 ? (
                <>
                  <option value="sidebar">Sidebar Column</option>
                  <option value="hidden">Hidden</option>
                </>
              ) : (
                <>
                  <option value="top-center">Top Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="hidden">Hidden</option>
                </>
              )}
            </select>
          </div>

          {/* Size slider */}
          {state.photoPos !== 'hidden' && (
            <RangeSlider
              label="Photo Size"
              value={state.photoSize}
              min={40}
              max={120}
              step={2}
              unit="px"
              onChange={handleSizeChange}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default memo(PhotoControls);

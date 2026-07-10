'use client';

import React, { memo, useRef, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import styles from './cards.module.css';

const SummaryCard = () => {
  const { state, dispatch } = useResume();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [state.summary]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_FIELD', field: 'summary', value: e.target.value });
  };

  const charCount = state.summary?.length || 0;

  return (
    <Card title={state.secNames.summary || "Professional Summary"} collapsible>
      <div className={styles.field} style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Describe your professional background, key skills, and career achievements..."
          value={state.summary}
          onChange={handleChange}
          onFocus={(e) => {
            const sampleSummary = 'Computer Science student and Python Full-Stack Developer specializing in Machine Learning and IoT, focusing on architecting secure, scalable systems. Proven expertise in building real-time AI applications with Gemini 1.5 Pro, FastAPI, and Next.js, while optimizing database performance and implementing robust encrypted data architectures for high-performance environments.';
            if (e.target.value === sampleSummary) {
              dispatch({ type: 'SET_FIELD', field: 'summary', value: '' });
            } else {
              e.target.select();
            }
          }}
          rows={4}
          style={{ minHeight: '80px', overflowY: 'hidden' }}
        />
        <div 
          style={{ 
            fontSize: '10px', 
            color: 'var(--text-muted)', 
            textAlign: 'right', 
            marginTop: '4px',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {charCount} characters
        </div>
      </div>
    </Card>
  );
};

export default memo(SummaryCard);

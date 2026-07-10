'use client';

import React, { memo, useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useATSScore } from '@/hooks/useATSScore';
import styles from './ATSScoreBar.module.css';

const ATSScoreBar = () => {
  const { state } = useResume();
  const [jd, setJd] = useState('');
  const [jdExpanded, setJdExpanded] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Compute ATS score
  const { score, keywords, topDomain } = useATSScore(state, jd);

  // Smooth count up animation for score
  useEffect(() => {
    let start = animatedScore;
    const end = score;
    if (start === end) return;

    const duration = 500; // ms
    const range = end - start;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(() => {
      if (start < end) {
        start++;
      } else {
        start--;
      }
      setAnimatedScore(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 8));

    return () => clearInterval(timer);
  }, [score]);

  // Color mappings based on score range
  const scoreColor = 
    score >= 70 ? 'var(--success)' : 
    score >= 40 ? 'var(--warning)' : 
    'var(--danger)';

  return (
    <div className={styles.box}>
      <div className={styles.hdr}>
        <div className={styles.ttl}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: scoreColor }}>
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          ATS Compatibility Score
          {topDomain && !jd && (
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>
              (Matched Domain: {topDomain})
            </span>
          )}
        </div>
        <div className={styles.pct} style={{ color: scoreColor }}>
          {animatedScore}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progBar}>
        <div 
          className={styles.progFill} 
          style={{ 
            width: `${score}%`,
            background: score >= 70 ? 'linear-gradient(90deg, #10b981, #22c55e)' : 
                        score >= 40 ? 'linear-gradient(90deg, #f59e0b, #eab308)' : 
                        'linear-gradient(90deg, #ef4444, #f87171)'
          }} 
        />
      </div>

      {/* Keywords matching dashboard */}
      {keywords.length > 0 && (
        <div className={styles.tags}>
          {keywords.map((kw) => (
            <span 
              key={kw.text} 
              className={`${styles.tag} ${kw.hit ? styles.tagHit : ''}`}
            >
              <span className={styles.dot} />
              {kw.text}
            </span>
          ))}
        </div>
      )}

      {/* Job Description matching accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
        <button 
          type="button" 
          onClick={() => setJdExpanded(!jdExpanded)} 
          className={styles.jdToggleBtn}
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            style={{ 
              transform: jdExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition-fast)'
            }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          {jdExpanded ? 'Hide Job Description Matcher' : 'Match with Specific Job Description'}
        </button>

        {jdExpanded && (
          <textarea
            className={styles.jdTextarea}
            placeholder="Paste target job description here to analyze keyword match score..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default memo(ATSScoreBar);

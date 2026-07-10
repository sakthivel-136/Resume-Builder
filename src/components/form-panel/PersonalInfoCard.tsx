'use client';

import React, { memo } from 'react';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import styles from './cards.module.css';

const PersonalInfoCard = () => {
  const { state, dispatch } = useResume();

  const handleChange = (field: string, value: string) => {
    dispatch({ type: 'SET_FIELD', field: field as any, value });
  };

  return (
    <Card title="Personal Information" collapsible>
      <div className={styles.field}>
        <label htmlFor="p-name">Full Name</label>
        <input
          id="p-name"
          className={styles.input}
          type="text"
          placeholder="e.g. Sakthi Vel C"
          value={state.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="p-title">Professional Title</label>
        <input
          id="p-title"
          className={styles.input}
          type="text"
          placeholder="e.g. Python Full-Stack Developer"
          value={state.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="p-phone">Phone Number</label>
          <input
            id="p-phone"
            className={styles.input}
            type="tel"
            placeholder="e.g. +91 6374052055"
            value={state.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="p-email">Email Address</label>
          <input
            id="p-email"
            className={styles.input}
            type="email"
            placeholder="e.g. c.sakthivel@gmail.com"
            value={state.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="p-linkedin">LinkedIn Profile</label>
          <input
            id="p-linkedin"
            className={styles.input}
            type="text"
            placeholder="e.g. linkedin.com/in/sakthivel"
            value={state.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="p-github">GitHub Handle</label>
          <input
            id="p-github"
            className={styles.input}
            type="text"
            placeholder="e.g. github.com/sakthivel"
            value={state.github}
            onChange={(e) => handleChange('github', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="p-website">Personal Website / Blog</label>
        <input
          id="p-website"
          className={styles.input}
          type="text"
          placeholder="e.g. sakthivel-blog.io"
          value={state.website}
          onChange={(e) => handleChange('website', e.target.value)}
        />
      </div>

      {/* Custom Contact Fields */}
      <div style={{ marginTop: '16px', borderTop: '1px dashed var(--border)', paddingTop: '16px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>Custom Links</h4>
        {(state.customContacts || []).map((c) => (
          <div key={c.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Platform Label</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. LeetCode"
                value={c.label}
                onChange={(e) => dispatch({ type: 'UPDATE_CUSTOM_CONTACT', id: c.id, field: 'label', value: e.target.value })}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Link URL / Handle</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. leetcode.com/user"
                value={c.value}
                onChange={(e) => dispatch({ type: 'UPDATE_CUSTOM_CONTACT', id: c.id, field: 'value', value: e.target.value })}
              />
            </div>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => dispatch({ type: 'REMOVE_CUSTOM_CONTACT', id: c.id })}
              style={{ height: '38px', padding: '0 10px', fontSize: '11px' }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_CUSTOM_CONTACT' })}
          style={{
            width: '100%',
            background: 'var(--bg-tertiary)',
            border: '1px dashed var(--border)',
            color: 'var(--text-primary)',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all var(--transition-fast)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Custom Link
        </button>
      </div>
    </Card>
  );
};

export default memo(PersonalInfoCard);

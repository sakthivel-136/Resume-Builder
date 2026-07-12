'use client';

import React, { memo } from 'react';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import styles from './cards.module.css';

const TemplateSelector = () => {
  const { state, dispatch } = useResume();

  const handleSelect = (tpl: 1 | 2 | 3 | 4) => {
    dispatch({ type: 'SET_TEMPLATE', tpl });
  };

  return (
    <Card title="Choose Template">
      <div className={styles.row3} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {/* T1 - Classic */}
        <button
          type="button"
          onClick={() => handleSelect(1)}
          style={{
            background: state.tpl === 1 ? 'rgba(108, 99, 255, 0.1)' : 'var(--bg-tertiary)',
            border: '2px solid',
            borderColor: state.tpl === 1 ? 'var(--accent-primary)' : 'var(--border)',
            borderRadius: '10px',
            padding: '10px 8px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all var(--transition-fast)',
            outline: 'none',
          }}
        >
          <div style={{ height: '56px', background: '#f8f9fa', borderRadius: '4px', padding: '6px', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ height: '6px', background: '#122644', width: '50%', margin: '0 auto', borderRadius: '1px' }} />
            <div style={{ height: '3px', background: '#ccd0d5', width: '80%', margin: '0 auto', borderRadius: '0.5px' }} />
            <div style={{ height: '2px', background: '#e2e5e8', width: '90%', margin: '0 auto', borderRadius: '0.5px' }} />
            <div style={{ display: 'flex', gap: '4px', margin: '4px auto 0', width: '90%' }}>
              <div style={{ flex: 1, height: '16px', background: '#fff', border: '1px solid #e2e5e8', borderRadius: '2px' }} />
            </div>
          </div>
          <span style={{ fontSize: '10.2px', fontWeight: 700, color: state.tpl === 1 ? 'var(--text-primary)' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Classic
          </span>
        </button>

        {/* T2 - Sidebar */}
        <button
          type="button"
          onClick={() => handleSelect(2)}
          style={{
            background: state.tpl === 2 ? 'rgba(108, 99, 255, 0.1)' : 'var(--bg-tertiary)',
            border: '2px solid',
            borderColor: state.tpl === 2 ? 'var(--accent-primary)' : 'var(--border)',
            borderRadius: '10px',
            padding: '10px 8px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all var(--transition-fast)',
            outline: 'none',
          }}
        >
          <div style={{ height: '56px', background: '#f8f9fa', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '35%', background: '#122644', padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ width: '100%', height: '4px', background: '#fff', opacity: 0.8, borderRadius: '0.5px' }} />
              <div style={{ width: '80%', height: '2px', background: '#fff', opacity: 0.5, borderRadius: '0.5px' }} />
            </div>
            <div style={{ width: '65%', padding: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ height: '5px', background: '#ccd0d5', width: '60%', borderRadius: '1px' }} />
              <div style={{ height: '3px', background: '#e2e5e8', width: '100%', borderRadius: '0.5px' }} />
              <div style={{ height: '14px', background: '#fff', border: '1px solid #e2e5e8', borderRadius: '2px' }} />
            </div>
          </div>
          <span style={{ fontSize: '10.2px', fontWeight: 700, color: state.tpl === 2 ? 'var(--text-primary)' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Sidebar
          </span>
        </button>

        {/* T3 - Modern */}
        <button
          type="button"
          onClick={() => handleSelect(3)}
          style={{
            background: state.tpl === 3 ? 'rgba(108, 99, 255, 0.1)' : 'var(--bg-tertiary)',
            border: '2px solid',
            borderColor: state.tpl === 3 ? 'var(--accent-primary)' : 'var(--border)',
            borderRadius: '10px',
            padding: '10px 8px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all var(--transition-fast)',
            outline: 'none',
          }}
        >
          <div style={{ height: '56px', background: '#f8f9fa', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '30%', background: '#eef2f6', borderRight: '1.5px solid #122644', padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ width: '90%', height: '3px', background: '#122644', borderRadius: '0.5px' }} />
              <div style={{ width: '70%', height: '2px', background: '#ccd0d5', borderRadius: '0.5px' }} />
            </div>
            <div style={{ width: '70%', padding: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ height: '5px', background: '#122644', width: '70%', borderRadius: '1px' }} />
              <div style={{ height: '3px', background: '#ccd0d5', width: '90%', borderRadius: '0.5px' }} />
              <div style={{ height: '14px', background: '#fff', border: '1px solid #e2e5e8', borderRadius: '2px' }} />
            </div>
          </div>
          <span style={{ fontSize: '10.2px', fontWeight: 700, color: state.tpl === 3 ? 'var(--text-primary)' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Modern
          </span>
        </button>

        {/* T4 - Timeline */}
        <button
          type="button"
          onClick={() => handleSelect(4)}
          style={{
            background: state.tpl === 4 ? 'rgba(108, 99, 255, 0.1)' : 'var(--bg-tertiary)',
            border: '2px solid',
            borderColor: state.tpl === 4 ? 'var(--accent-primary)' : 'var(--border)',
            borderRadius: '10px',
            padding: '10px 8px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all var(--transition-fast)',
            outline: 'none',
          }}
        >
          <div style={{ height: '56px', background: '#f8f9fa', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            {/* Sidebar Column */}
            <div style={{ width: '30%', padding: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ width: '80%', height: '4px', background: '#ccd0d5', borderRadius: '0.5px' }} />
              <div style={{ width: '60%', height: '2px', background: '#e2e5e8', borderRadius: '0.5px' }} />
              <div style={{ width: '80%', height: '4px', background: '#ccd0d5', borderRadius: '0.5px' }} />
            </div>
            {/* Vertical timeline divider line */}
            <div style={{ width: '1px', background: '#122644', position: 'relative', height: '100%' }}>
              <div style={{ width: '4px', height: '4px', background: '#122644', borderRadius: '50%', position: 'absolute', left: '-1.5px', top: '10px' }} />
              <div style={{ width: '4px', height: '4px', background: '#122644', borderRadius: '50%', position: 'absolute', left: '-1.5px', top: '24px' }} />
              <div style={{ width: '4px', height: '4px', background: '#122644', borderRadius: '50%', position: 'absolute', left: '-1.5px', top: '38px' }} />
            </div>
            {/* Main Area */}
            <div style={{ width: '70%', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '8px' }}>
              <div style={{ height: '4px', background: '#122644', width: '60%', borderRadius: '1px' }} />
              <div style={{ height: '10px', background: '#fff', border: '1px solid #e2e5e8', borderRadius: '2px' }} />
              <div style={{ height: '4px', background: '#122644', width: '80%', borderRadius: '1px' }} />
              <div style={{ height: '10px', background: '#fff', border: '1px solid #e2e5e8', borderRadius: '2px' }} />
            </div>
          </div>
          <span style={{ fontSize: '10.2px', fontWeight: 700, color: state.tpl === 4 ? 'var(--text-primary)' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Timeline
          </span>
        </button>
      </div>
    </Card>
  );
};

export default memo(TemplateSelector);

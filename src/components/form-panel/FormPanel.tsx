'use client';

import React, { memo, useEffect, useState, useRef, useCallback } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';
import {
  saveProfile,
  getUserProfiles,
  deleteProfile,
  loadProfile,
} from '@/utils/storage';
import { exportToJson, exportToLatex } from '@/utils/exportService';
import { importFromJson, importFromLatex } from '@/utils/importService';
import { createDefaultResume, createSampleResume } from '@/data/defaultResume';
import Button from '@/components/ui/Button';

// Style imports
import styles from './FormPanel.module.css';

// Cards
import PersonalInfoCard from './PersonalInfoCard';
import SummaryCard from './SummaryCard';
import EducationCard from './EducationCard';
import ExperienceCard from './ExperienceCard';
import ProjectsCard from './ProjectsCard';
import SkillsCard from './SkillsCard';
import AchievementsCard from './AchievementsCard';
import CustomSectionCard from './CustomSectionCard';
import TemplateSelector from './TemplateSelector';
import PaletteSelector from './PaletteSelector';
import TypographyControls from './TypographyControls';
import LayoutControls from './LayoutControls';
import PhotoControls from './PhotoControls';
import SectionManager from './SectionManager';
import ResumeAudit from './ResumeAudit';

interface FormPanelProps {
  onToggleTab?: (tab: 'edit' | 'preview') => void;
}

const FormPanel = ({ onToggleTab }: FormPanelProps) => {
  const { user, logout } = useAuth();
  const { state, dispatch, canUndo, canRedo } = useResume();
  const undo = () => dispatch({ type: 'UNDO' });
  const redo = () => dispatch({ type: 'REDO' });
  const { addToast } = useToast();
  
  const [profileList, setProfileList] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('just now');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get active username safely
  const username = user?.name || 'anonymous';

  // Load profile list for selector
  const refreshProfiles = useCallback(() => {
    setProfileList(getUserProfiles(username));
  }, [username]);

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  // Debounced auto-save logic
  const debouncedState = useDebounce(state, 3000);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('saving');
    saveProfile(username, state);
    
    const timer = setTimeout(() => {
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      refreshProfiles();
    }, 800);

    return () => clearTimeout(timer);
  }, [debouncedState, username, refreshProfiles]);

  // Load a profile
  const handleProfileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'new') {
      const fresh = createDefaultResume();
      dispatch({ type: 'LOAD_PROFILE', data: fresh });
      addToast('Created new profile', 'success');
    } else if (val === 'sample') {
      const sample = createSampleResume();
      dispatch({ type: 'LOAD_PROFILE', data: sample });
      addToast('Loaded sample profile', 'success');
    } else if (val) {
      const loaded = loadProfile(username, val);
      if (loaded) {
        dispatch({ type: 'LOAD_PROFILE', data: loaded });
        addToast(`Loaded profile "${loaded.profileName}"`, 'success');
      }
    }
  };

  const handleDuplicateProfile = () => {
    const dup = {
      ...state,
      profileId: `${Date.now()}`,
      profileName: `${state.profileName} (Copy)`,
      lastEdited: Date.now(),
    };
    saveProfile(username, dup);
    dispatch({ type: 'LOAD_PROFILE', data: dup });
    addToast('Profile duplicated', 'success');
    refreshProfiles();
  };

  const handleDeleteProfile = () => {
    if (profileList.length <= 1) {
      addToast('Cannot delete the only profile', 'error');
      return;
    }
    if (confirm(`Are you sure you want to delete "${state.profileName}"?`)) {
      deleteProfile(username, state.profileId);
      addToast('Profile deleted', 'info');
      // Load another profile
      const remaining = getUserProfiles(username);
      if (remaining.length > 0) {
        const nextProfile = loadProfile(username, remaining[0].id);
        if (nextProfile) dispatch({ type: 'LOAD_PROFILE', data: nextProfile });
      }
      refreshProfiles();
    }
  };

  // Import / Export JSON
  // Import / Export
  const handleExportJSON = () => {
    try {
      exportToJson(state);
      addToast('JSON backup downloaded successfully!', 'success');
    } catch (e) {
      addToast('Failed to export JSON', 'error');
    }
  };

  const handleExportLaTeX = () => {
    try {
      exportToLatex(state);
      addToast('LaTeX source file downloaded successfully!', 'success');
    } catch (e) {
      addToast('Failed to export LaTeX', 'error');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        if (file.name.endsWith('.json')) {
          const importedData = importFromJson(text);
          dispatch({ type: 'LOAD_PROFILE', data: importedData });
          addToast('JSON profile loaded successfully!', 'success');
        } else if (file.name.endsWith('.tex')) {
          const importedData = importFromLatex(text, state);
          dispatch({ type: 'LOAD_PROFILE', data: importedData });
          addToast('LaTeX source imported and mapped successfully!', 'success');
        } else {
          addToast('Unsupported file format. Please upload .json or .tex', 'error');
        }
      } catch (err: any) {
        console.error(err);
        addToast(err.message || 'Failed to parse file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Render cards in order
  const renderCard = (key: string) => {
    switch (key) {
      case 'summary':
        return <SummaryCard key={key} />;
      case 'education':
        return <EducationCard key={key} />;
      case 'skills':
        return <SkillsCard key={key} />;
      case 'experience':
        return <ExperienceCard key={key} />;
      case 'projects':
        return <ProjectsCard key={key} />;
      case 'achievements':
        return <AchievementsCard key={key} />;
      default:
        if (key.startsWith('custom_')) {
          return <CustomSectionCard key={key} id={key} />;
        }
        return null;
    }
  };

  return (
    <div className={styles.panel}>
      {/* Header Panel */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.userGreet}>
            Hi, {user?.displayName || username}! 👋
          </div>
          <div className={styles.actions}>
            {/* Undo/Redo */}
            <button
              className={styles.utilBtn}
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              style={{ opacity: canUndo ? 1 : 0.4 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
              </svg>
            </button>
            <button
              className={styles.utilBtn}
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              style={{ opacity: canRedo ? 1 : 0.4 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 7v6h-6" />
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
              </svg>
            </button>

            {/* Logout */}
            <Button variant="ghost" size="sm" onClick={logout} style={{ fontSize: '11px', padding: '4px 8px' }}>
              Logout
            </Button>
          </div>
        </div>

        {/* Profile switches and Utilities */}
        {/* Profile switches and Utilities */}
        <div className={styles.profileContainer}>
          <div className={styles.profileRow1}>
            <div style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Profile Name</span>
              <input
                className={styles.profileNameInput}
                type="text"
                value={state.profileName}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'profileName', value: e.target.value })}
                title="Rename Profile"
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Active Profile</span>
              <select
                className={styles.profileSelect}
                value={state.profileId}
                onChange={handleProfileSelect}
              >
                <option disabled value="">Switch Profile...</option>
                {profileList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                <option value="new">+ Create New Profile</option>
                <option value="sample">+ Load Sample Data</option>
              </select>
            </div>
          </div>

          <div className={styles.buttonGrid}>
            <button className={styles.actionBtn} onClick={handleDuplicateProfile} title="Duplicate current profile">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Duplicate
            </button>
            <button className={styles.actionBtn} onClick={handleDeleteProfile} style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }} title="Delete current profile">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                className={styles.actionBtn} 
                onClick={() => setShowExportDropdown(!showExportDropdown)} 
                title="Export resume code"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Export {showExportDropdown ? '▲' : '▼'}
              </button>
              {showExportDropdown && (
                <div 
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 'calc(100% + 4px)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '160px',
                    overflow: 'hidden'
                  }}
                >
                  <button 
                    onClick={() => { handleExportJSON(); setShowExportDropdown(false); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '10px 12px', textAlign: 'left', cursor: 'pointer', fontSize: '11px', width: '100%', font: 'inherit' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    ⚙️ Export JSON Backup
                  </button>
                  <button 
                    onClick={() => { handleExportLaTeX(); setShowExportDropdown(false); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '10px 12px', textAlign: 'left', cursor: 'pointer', fontSize: '11px', width: '100%', font: 'inherit' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    🛠️ Export LaTeX Source
                  </button>
                </div>
              )}
            </div>
            
            <button className={styles.actionBtn} onClick={() => fileInputRef.current?.click()} title="Import file (.json or .tex)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.tex"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </div>
          
          {onToggleTab && (
            <div className={styles.mobileToggleWrapper}>
              <button 
                className={`${styles.mobileToggleBtn} ${styles.mobileToggleBtnActive}`}
                disabled
                type="button"
              >
                ✏️ Edit Inputs
              </button>
              <button 
                className={styles.mobileToggleBtn} 
                onClick={() => onToggleTab('preview')}
                type="button"
              >
                👁️ Preview &amp; PDF
              </button>
            </div>
          )}
        </div>

        {/* Auto save indicator status */}
        <div className={styles.saveIndicator}>
          <div className={`${styles.saveIndicatorDot} ${saveStatus === 'saving' ? styles.saveIndicatorSaving : ''}`} />
          {saveStatus === 'saving' ? 'Saving changes...' : `All changes saved (${lastSavedTime})`}
        </div>
      </header>

      {/* Main scrollable inputs */}
      <div className={styles.scrollArea}>
        <ResumeAudit />
        <TemplateSelector />
        <PaletteSelector />
        <PersonalInfoCard />
        <PhotoControls />
        <SectionManager />
        <TypographyControls />
        <LayoutControls />

        {/* Render all custom & predefined content sections based on flat sectionOrder */}
        {state.sectionOrder.map((key) => renderCard(key))}
      </div>
    </div>
  );
};

export default memo(FormPanel);

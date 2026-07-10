'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ResumeProvider, useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { loadProfile, saveProfile, getLastEditedProfileId, getUserProfiles } from '@/utils/storage';
import { createSampleResume } from '@/data/defaultResume';
import FormPanel from '@/components/form-panel/FormPanel';
import PreviewPanel from '@/components/preview-panel/PreviewPanel';

function BuilderContent() {
  const { user } = useAuth();
  const { state, dispatch } = useResume();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport width for responsive tabs
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;
    const profiles = getUserProfiles(user.name);
    if (profiles.length > 0) {
      const lastId = getLastEditedProfileId(user.name);
      if (lastId) {
        const loaded = loadProfile(user.name, lastId);
        if (loaded) {
          // Force reset cached sample profile to the clean empty inputs schema
          if (loaded.profileName === 'Sample Resume' && loaded.experience.length > 0) {
            const cleanSample = createSampleResume();
            saveProfile(user.name, cleanSample);
            dispatch({ type: 'LOAD_PROFILE', data: cleanSample });
          } else {
            dispatch({ type: 'LOAD_PROFILE', data: loaded });
          }
        }
      }
    } else {
      // Pre-fill with sample resume for demo to wow the user!
      const sample = createSampleResume();
      saveProfile(user.name, sample);
      dispatch({ type: 'LOAD_PROFILE', data: sample });
      addToast('Welcome! We pre-filled a professional template for you.', 'info');
    }
    setLoading(false);
  }, [user, dispatch, addToast]);

  // Bind keyboard shortcuts
  useKeyboardShortcuts({
    undo: () => {
      dispatch({ type: 'UNDO' });
      addToast('Undo action', 'info');
    },
    redo: () => {
      dispatch({ type: 'REDO' });
      addToast('Redo action', 'info');
    },
    save: () => {
      saveProfile(user?.name || 'anonymous', state);
      addToast('Work saved!', 'success');
    },
    exportPDF: () => {
      // Trigger PDF download button in Toolbar
      const el = document.getElementById('resume-content');
      if (el) {
        addToast('Export shortcut triggered', 'info');
      }
    }
  });

  if (loading) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          height: '100vh', 
          width: '100vw', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'var(--bg-primary)', 
          color: 'var(--text-secondary)',
          fontFamily: 'inherit'
        }}
      >
        Loading your resume workspace...
      </div>
    );
  }

  // Responsive mobile render
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)' }}>
        {/* Tab view screen */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {activeTab === 'edit' ? (
            <FormPanel onToggleTab={setActiveTab} />
          ) : (
            <PreviewPanel onToggleTab={setActiveTab} />
          )}
        </div>
      </div>
    );
  }

  // Desktop side-by-side render
  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(390px, 480px) 1fr', 
        minHeight: '100vh', 
        background: 'var(--bg-primary)' 
      }}
    >
      <FormPanel />
      <PreviewPanel />
    </div>
  );
}

export default function BuilderPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push('/');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <ResumeProvider>
      <BuilderContent />
    </ResumeProvider>
  );
}

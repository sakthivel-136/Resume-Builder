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
  const [modalType, setModalType] = useState<'new' | 'returning' | null>(null);

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
    if (loading) return;
    const type = sessionStorage.getItem('login_type');
    if (type === 'new') {
      setModalType('new');
      sessionStorage.removeItem('login_type');
    } else if (type === 'returning') {
      setModalType('returning');
      sessionStorage.removeItem('login_type');
    }
  }, [loading]);

  useEffect(() => {
    if (!user) return;
    const profiles = getUserProfiles(user.name);
    if (profiles.length > 0) {
      const lastId = getLastEditedProfileId(user.name);
      if (lastId) {
        const loaded = loadProfile(user.name, lastId);
        if (loaded) {
          // Force reset cached sample profile to the pre-populated inputs schema
          if (loaded.profileName === 'Sample Resume' && loaded.experience.length > 0) {
            const cleanSample = createSampleResume();
            cleanSample.profileName = `${user.displayName || user.name || 'My'} Resume`;
            cleanSample.name = user.displayName || user.name || 'Sakthi Vel C';
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
      sample.profileName = `${user.displayName || user.name || 'My'} Resume`;
      sample.name = user.displayName || user.name || 'Sakthi Vel C';
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

  const renderOnboardingModal = () => {
    if (!modalType) return null;
    
    const isNew = modalType === 'new';
    
    return (
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(3, 7, 18, 0.75)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div 
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            maxWidth: '440px',
            width: '90%',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(108, 99, 255, 0.1)',
            fontFamily: 'inherit',
          }}
        >
          <h3 
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '20px' }}>{isNew ? '🚀' : '✨'}</span> 
            {isNew ? 'Welcome to Resume Builder Pro!' : `Happy to see you again, ${user?.displayName || 'user'}!`}
          </h3>
          <p 
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
            }}
          >
            {isNew ? (
              <>
                We've preloaded a sample template with your name (<b>{user?.displayName}</b>) to help you get started.
                <br /><br />
                <b>💡 Tip:</b> Create custom profile versions by clicking <b>"Create New Profile"</b> in the top-left section manager to keep your different job application CV data perfectly structured!
              </>
            ) : (
              <>
                Welcome back to your workspace! We have successfully loaded your last edited profile: <b>{state.profileName}</b>.
                <br /><br />
                Feel free to continue updating your sections, modifying layout designs, or downloading your print-ready PDF resume.
              </>
            )}
          </p>
          <button
            onClick={() => setModalType(null)}
            style={{
              width: '100%',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.15)')}
            onMouseOut={(e) => (e.currentTarget.style.filter = 'none')}
          >
            {isNew ? "Got it, let's build!" : 'Close'}
          </button>
        </div>
      </div>
    );
  };

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
        {renderOnboardingModal()}
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
      {renderOnboardingModal()}
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

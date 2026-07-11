'use client';

import React, { useState, useCallback, useMemo, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserProfiles, getUserDisplayName } from '@/utils/storage';
import { timeAgo } from '@/utils/helpers';
import styles from './LoginPage.module.css';

/* ===== SVG Icon Components ===== */

function UserIcon() {
  return (
    <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="3.5" />
      <path d="M3 17.5c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5" />
    </svg>
  );
}

function LayoutIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="3" y1="9" x2="9" y2="9" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4l5 5-5 5" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

/* ===== Returning User Info ===== */
interface UserCardData {
  username: string;
  displayName: string;
  profileCount: number;
  lastEdited: number;
}

/* ===== LoginPage Component ===== */
export default function LoginPage() {
  const { login, allUsers } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [downloadCount, setDownloadCount] = useState(142);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const isNewUser = useMemo(() => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) return false;
    const profiles = getUserProfiles(trimmed);
    return profiles.length === 0;
  }, [name]);

  // Reset scroll and check state if username is changed
  useEffect(() => {
    setHasScrolledToBottom(false);
    setIsChecked(false);
  }, [name]);

  useEffect(() => {
    if (!isNewUser) return;
    
    const handleScroll = () => {
      const threshold = 120;
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
      if (isBottom) {
        setHasScrolledToBottom(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isNewUser]);

  useEffect(() => {
    fetch('/api/counter')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count === 'number') {
          setDownloadCount(data.count);
        }
      })
      .catch((err) => console.error('Failed to load global counter:', err));
  }, []);

  // Build returning user data
  const returningUsers = useMemo<UserCardData[]>(() => {
    return allUsers
      .map((username) => {
        const profiles = getUserProfiles(username);
        const displayName = getUserDisplayName(username);
        const lastEdited = profiles.reduce(
          (latest, p) => Math.max(latest, p.lastEdited),
          0
        );
        return {
          username,
          displayName,
          profileCount: profiles.length,
          lastEdited,
        };
      })
      .sort((a, b) => b.lastEdited - a.lastEdited);
  }, [allUsers]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = name.trim();
      if (!trimmed) {
        setError('Please enter your name to continue');
        return;
      }
      if (trimmed.length < 2) {
        setError('Name must be at least 2 characters');
        return;
      }
      setError('');

      const usernameKey = trimmed.toLowerCase();
      const profiles = getUserProfiles(usernameKey);

      if (profiles.length > 0) {
        sessionStorage.setItem('login_type', 'returning');
      } else {
        sessionStorage.setItem('login_type', 'new');
      }
      login(trimmed);
      router.push('/builder');
    },
    [name, login, router]
  );

  const handleUserClick = useCallback(
    (username: string) => {
      const displayName = getUserDisplayName(username);
      sessionStorage.setItem('login_type', 'returning');
      login(displayName);
      router.push('/builder');
    },
    [login, router]
  );

  return (
    <div className={styles.page}>
      {/* Animated background mesh */}
      <div className={styles.bgMesh} />

      <div className={styles.content}>
        {/* Header / Branding */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <img
              src="/tgs-logo.png"
              alt="TGS Logo"
              className={styles.logoImg}
            />
          </div>
          <h1 className={styles.title}>Resume Builder Pro</h1>
          <p className={styles.subtitle}>
            Create stunning, ATS-optimized resumes in minutes
          </p>
          <div className={styles.statsBadge}>
            🔥 {downloadCount} Resumes Generated & Exported
          </div>
        </header>

        {/* Login Card */}
        <form className={styles.loginCard} onSubmit={handleSubmit}>
          <h2 className={styles.cardTitle}>Get Started</h2>
          <div className={styles.inputGroup}>
            <UserIcon />
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              autoComplete="name"
              spellCheck={false}
            />
          </div>
          {error && <p className={styles.errorText}>{error}</p>}

          {isNewUser && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '14px', marginBottom: '14px', textAlign: 'left' }}>
              <input
                id="disclaimer-checkbox"
                type="checkbox"
                checked={isChecked}
                disabled={!hasScrolledToBottom}
                onChange={(e) => setIsChecked(e.target.checked)}
                style={{ marginTop: '3px', cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed', width: '16px', height: '16px' }}
              />
              <label 
                htmlFor="disclaimer-checkbox"
                style={{
                  fontSize: '12px',
                  color: isChecked ? 'var(--text-secondary)' : '#ef4444',
                  cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed',
                  userSelect: 'none',
                  lineHeight: '1.4',
                  fontWeight: isChecked ? 500 : 600
                }}
              >
                {!hasScrolledToBottom 
                  ? "⚠️ Kindly scroll down to the bottom of the page to read all precautions/guidelines to enable this checkbox."
                  : "✅ I have reviewed all guide disclaimers below."
                }
              </label>
            </div>
          )}

          <button 
            className={styles.submitBtn} 
            type="submit"
            disabled={isNewUser && !isChecked}
            style={{
              opacity: (isNewUser && !isChecked) ? 0.5 : 1,
              cursor: (isNewUser && !isChecked) ? 'not-allowed' : 'pointer'
            }}
          >
            Get Started →
          </button>
          <div className={styles.desktopAdvice}>
            💻 <b>Best Experienced on Desktop:</b> Resume layout precision and editing are easiest on a larger screen. You can still use mobile to view or make quick edits!
          </div>
        </form>

        {/* ===== Client-Side Privacy Meter ===== */}
        <div className={styles.privacyWidget}>
          <div className={styles.privacyHeader}>
            <svg className={styles.privacyShield} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className={styles.privacyStatusText}>Privacy Meter: 100% Client-Side Secure</span>
          </div>
          <div className={styles.privacyGaugeContainer}>
            <div className={styles.privacyGaugeFill} />
          </div>
          <p className={styles.privacyExplain}>
            All your resume data is saved strictly in your local browser storage. No databases, no tracking, and 0% of your data is sent to external servers.
          </p>
        </div>

        {/* Returning Users */}
        {returningUsers.length > 0 && (
          <section className={styles.returningSection}>
            <div className={styles.divider} />
            <h3 className={styles.returnTitle}>Welcome Back</h3>
            <div className={styles.userList}>
              {returningUsers.map((user) => (
                <button
                  key={user.username}
                  className={styles.userCard}
                  onClick={() => handleUserClick(user.username)}
                  type="button"
                >
                  <div className={styles.userAvatar}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user.displayName}</div>
                    <div className={styles.userMeta}>
                      <span>
                        {user.profileCount}{' '}
                        {user.profileCount === 1 ? 'profile' : 'profiles'}
                      </span>
                      {user.lastEdited > 0 && (
                        <>
                          <span>·</span>
                          <span>{timeAgo(user.lastEdited)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={styles.userArrow}>
                    <ArrowIcon />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Feature Cards */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.featureIconPurple}`}>
              <LayoutIcon />
            </div>
            <div className={styles.featureTitle}>3 Templates</div>
            <div className={styles.featureDesc}>
              Classic, sidebar, and two-column layouts
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.featureIconTeal}`}>
              <ChartIcon />
            </div>
            <div className={styles.featureTitle}>ATS Scoring</div>
            <div className={styles.featureDesc}>
              Real-time score with keyword analysis
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.featureIconGold}`}>
              <DownloadIcon />
            </div>
            <div className={styles.featureTitle}>PDF Export</div>
            <div className={styles.featureDesc}>
              One-click download in perfect quality
            </div>
          </div>
        </div>

        {/* ===== How to Use Guide ===== */}
        <div className={styles.guideSection}>
          <div className={styles.guideDivider} />
          <h3 className={styles.guideTitle}>
            <span className={styles.guideTitleIcon}>📖</span>
            How to Use — Quick Guide
          </h3>

          {/* Steps */}
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Enter Your Name &amp; Get Started</div>
                <div className={styles.stepDesc}>Type any name in the box above and click <b>Get Started</b>. Your data is saved locally in your browser — no account needed!</div>
              </div>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Fill in Your Details</div>
                <div className={styles.stepDesc}>Add your personal info, experience, education, skills and projects from the left panel. The resume preview updates live on the right.</div>
              </div>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Pick a Template &amp; Color</div>
                <div className={styles.stepDesc}>Choose from <b>Classic</b>, <b>Sidebar</b> or <b>Modern</b> template. Then select a color palette — Navy Gold, Steel Blue, Forest and more!</div>
              </div>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Download Your Resume</div>
                <div className={styles.stepDesc}>Hit the <b>Download PDF</b> button in the top toolbar. Your resume downloads instantly as a pixel-perfect, print-ready PDF file!</div>
              </div>
            </div>
          </div>

          {/* Import section */}
          <div className={styles.importGuide}>
            <div className={styles.importIcon}>
              <DocIcon />
            </div>
            <div className={styles.importContent}>
              <div className={styles.importTitle}>📂 Already have a resume? Import it in seconds!</div>
              <div className={styles.importSteps}>
                <div className={styles.importStep}>
                  <span className={styles.importBadge}>Step 1</span>
                  Open the builder and click <b>Export JSON</b> from the top left panel to save your current resume data as a <code>.json</code> file.
                </div>
                <div className={styles.importStep}>
                  <span className={styles.importBadge}>Step 2</span>
                  Next time, click <b>Import JSON</b> and select that file — all your data (experience, skills, projects) loads instantly!
                </div>
                <div className={styles.importStep}>
                  <span className={styles.importBadge}>Tip</span>
                  Use <b>Duplicate Profile</b> to create multiple resume versions for different job roles without starting over!
                </div>
                <div className={styles.importStep + ' ' + styles.importWarning}>
                  <span className={styles.importBadgeWarn}>⚠️ Warning</span>
                  <span><b>Clearing browser cache will delete all your resume data!</b> Before clearing cache or switching devices, always click <b>Export JSON</b> to download a backup of your resume first.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features quick ref */}
          <div className={styles.quickRef}>
            <div className={styles.quickRefTitle}>⚡ Quick Feature Reference</div>
            <div className={styles.quickRefGrid}>
              <div className={styles.quickRefItem}><span>🎨</span> 6 Color Palettes</div>
              <div className={styles.quickRefItem}><span>📐</span> 3 Templates</div>
              <div className={styles.quickRefItem}><span>📸</span> Profile Photo Upload</div>
              <div className={styles.quickRefItem}><span>🔢</span> ATS Score Checker</div>
              <div className={styles.quickRefItem}><span>↕️</span> Drag &amp; Drop Sections</div>
              <div className={styles.quickRefItem}><span>🖋️</span> Custom Fonts &amp; Spacing</div>
              <div className={styles.quickRefItem}><span>💾</span> Multiple Resume Profiles</div>
              <div className={styles.quickRefItem}><span>📄</span> 1-Click PDF Download</div>
            </div>
          </div>
        </div>

        {/* ===== SEO Keywords & FAQ Section ===== */}
        <section className={styles.seoSection}>
          <div className={styles.seoDivider} />
          
          <div className={styles.seoHeader}>
            <h3 className={styles.seoMainTitle}>About Resume Builder Pro</h3>
            <p className={styles.seoSubtitleText}>
              Create professional, ATS-optimized resumes and CVs online in minutes. 
              Our free resume builder helps job seekers design print-ready resumes that pass 
              applicant tracking systems (ATS) with ease. Choose from classic, modern, and sidebar resume formats, 
              customize layout spacing, select from 20+ professional fonts, check your ATS score, and download 
              your resume instantly as a PDF.
            </p>
          </div>

          <div className={styles.faqContainer}>
            <h4 className={styles.faqMainTitle}>Frequently Asked Questions (FAQ)</h4>
            <div className={styles.faqGrid}>
              <div className={styles.faqCard}>
                <h5 className={styles.faqQuestion}>How do I make an ATS-friendly resume?</h5>
                <p className={styles.faqAnswer}>
                  To create an ATS-friendly resume, use simple layout structures (like our Classic or Sidebar formats), 
                  select standard professional fonts (like Inter, Open Sans, or Roboto), avoid placing essential information 
                  in text boxes or headers, and align margins properly. Our builder automatically uses clean semantic HTML structures 
                  that ATS parsers read perfectly.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h5 className={styles.faqQuestion}>How can I download my resume as a PDF?</h5>
                <p className={styles.faqAnswer}>
                  Once you enter your details in our cv maker, click the <b>Download PDF</b> button in the top toolbar. 
                  Your resume will instantly compile and download as a high-quality, print-ready PDF file.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h5 className={styles.faqQuestion}>Is my resume data safe and private?</h5>
                <p className={styles.faqAnswer}>
                  Yes, 100%! We prioritize your privacy. All resume details and personal information are stored strictly 
                  on your local device using browser storage (localStorage). No data is sent to external databases or tracking servers, 
                  making it fully secure and private.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h5 className={styles.faqQuestion}>How do I fit my resume on a single page?</h5>
                <p className={styles.faqAnswer}>
                  Use our live <b>Section Spacing</b> and <b>Page Margin</b> controls to adjust document spacing dynamically. 
                  Decreasing font sizes slightly or shrinking bullet list margins will immediately compress the layout to fit 
                  onto exactly one page while maintaining clean visual alignment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Minimalist Branded Footer with subtle color trick ===== */}
        <footer className={styles.footer}>
          <div className={styles.footerText}>
            <span className={styles.secretLetter}>M</span><span className={styles.normalLetters}>aking</span>{' '}
            <span className={styles.secretLetter}>E</span><span className={styles.normalLetters}>xcellent</span>{' '}
            <span className={styles.secretLetter}>R</span><span className={styles.normalLetters}>esumes</span>{' '}
            <span className={styles.secretLetter}>C</span><span className={styles.normalLetters}>rafted for</span>{' '}
            <span className={styles.secretLetter}>Y</span><span className={styles.normalLetters}>ou</span>{' '}
            <span className={styles.creditAccent}>— By SAKTHI</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

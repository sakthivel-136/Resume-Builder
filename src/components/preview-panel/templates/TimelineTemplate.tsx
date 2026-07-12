'use client';

import React, { memo } from 'react';
import { ResumeData } from '@/types/resume';
import styles from './TimelineTemplate.module.css';
import shared from './shared.module.css';
import { getContactHref } from '@/utils/helpers';
import LinkRenderer from '@/components/ui/LinkRenderer';

interface TimelineTemplateProps {
  state: ResumeData;
  ignoreSpacers?: boolean;
  spacers?: Record<string, number>;
  isExport?: boolean;
}

const TimelineTemplate = ({ state, ignoreSpacers = false, spacers = {}, isExport = false }: TimelineTemplateProps) => {
  const {
    name,
    title,
    phone,
    email,
    linkedin,
    github,
    website,
    photo,
    photoPos,
    photoShape,
    photoSize,
    accentBar,
    accentH,
    hColor,
    secNames,
    secVis,
    sidebarSections,
    mainSections,
    summary,
    education,
    experience,
    projects,
    skillGroups,
    skillMode,
    achievements,
    customSections,
    lineH,
    secSp,
    nameSize,
    headSize,
    bodySize,
    customContacts,
    bulletType,
  } = state;

  const getPhotoClass = () => {
    if (photoShape === 'circle') return shared.photoCircle;
    if (photoShape === 'rounded') return shared.photoRounded;
    return shared.photoSquare;
  };

  const renderPhoto = (isSidebar: boolean) => {
    if (!photo || photoPos === 'hidden') return null;
    const shouldShow = isSidebar;
    if (!shouldShow) return null;

    return (
      <img
        src={photo}
        alt="Profile"
        className={`${shared.photo} ${getPhotoClass()}`}
        style={{
          width: `${photoSize}px`,
          height: `${photoSize}px`,
          border: `1.5px solid ${hColor}`,
          margin: '0 auto 12px auto',
          display: 'block',
        }}
      />
    );
  };

  const renderContactGM = () => {
    const items = [
      { l: 'Phone', v: phone },
      { l: 'Email', v: email },
      { l: 'LinkedIn', v: linkedin },
      { l: 'GitHub', v: github },
      { l: 'Website', v: website },
      ...(customContacts || []).map(c => ({ l: c.label, v: c.value })),
    ].filter(i => i.v);

    if (items.length === 0) return null;

    return (
      <div className={shared.gmContact}>
        {items.map((it, idx) => {
          const href = getContactHref(it.v);
          return (
            <div key={idx} className={shared.gmItem} style={{ marginBottom: '6px' }}>
              <div className={shared.gmLabel} style={{ fontSize: '0.85em', color: hColor, fontWeight: 700 }}>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {it.l}
                  </a>
                ) : (
                  it.l
                )}
              </div>
              <div className={shared.gmValue} style={{ fontSize: '0.9em', wordBreak: 'break-all' }}>
                {href ? (
                  <LinkRenderer url={href} label={it.v} />
                ) : (
                  it.v
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContactInline = () => {
    const cp = [
      phone,
      email,
      linkedin,
      github,
      website,
      ...(customContacts || []).map(c => c.value),
    ].filter(Boolean);
    if (cp.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9em' }}>
        {cp.map((c, idx) => {
          const href = getContactHref(c);
          return (
            <div key={idx} style={{ wordBreak: 'break-all' }}>
              {href ? (
                <LinkRenderer url={href} label={c} />
              ) : (
                c
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSkills = () => {
    if (skillMode === 'text') {
      return (
        <div className={shared.skillsContainer}>
          {skillGroups.map((s, idx) => (
            <div key={s.id || idx} style={{ marginBottom: '6px' }}>
              <span className={shared.skillCat} style={{ color: hColor, fontWeight: 700 }}>{s.category}: </span>
              <span className={shared.skillVals} style={{ fontSize: '0.9em' }}>{s.values}</span>
            </div>
          ))}
        </div>
      );
    }

    if (skillMode === 'pills') {
      const allItems = skillGroups.flatMap((sg) =>
        sg.values.split(',').map((v) => v.trim()).filter(Boolean)
      );
      if (allItems.length === 0) return null;
      return (
        <div 
          className={shared.skillsContainer}
          style={{ 
            display: 'block', 
            marginTop: '4px', 
            lineHeight: 1.5,
            fontSize: `${bodySize * 0.95}px`
          }}
        >
          {allItems.map((v, sIdx) => (
            <React.Fragment key={sIdx}>
              {sIdx > 0 && ' '}
              <span 
                style={{ 
                  whiteSpace: 'nowrap', 
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}
              >
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{v}</span>
                {sIdx < allItems.length - 1 && (
                  <span 
                    style={{ 
                      color: state.bulletColor || hColor, 
                      marginLeft: '6px', 
                      marginRight: '6px', 
                      fontWeight: 'bold',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      lineHeight: 1
                    }}
                  >
                    •
                  </span>
                )}
              </span>
            </React.Fragment>
          ))}
        </div>
      );
    }

    // Bullets mode
    return (
      <div className={shared.skillsContainer}>
        {skillGroups.map((s, idx) => {
          const items = s.values.split(',').map(v => v.trim()).filter(Boolean);
          return (
            <div key={s.id || idx} style={{ marginBottom: '6px' }}>
              <div className={shared.skillCat} style={{ color: hColor, fontWeight: 700 }}>{s.category}</div>
              <ul className={shared.points} style={{ marginTop: '2px', paddingLeft: '14px' }}>
                {items.map((v, sIdx) => (
                  <li key={sIdx} style={{ fontSize: `${bodySize * 0.9}px` }}>{v}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBadgeIcon = (key: string) => {
    const size = 14;
    const props = {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2.5',
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    };

    if (key === 'summary') {
      return (
        <svg {...props}>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    }
    if (key === 'experience') {
      return (
        <svg {...props}>
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    }
    if (key === 'projects') {
      return (
        <svg {...props}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    }
    if (key === 'education') {
      return (
        <svg {...props}>
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    }
    // Default custom icon
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="16" />
        <line x1="8" x2="16" y1="12" y2="12" />
      </svg>
    );
  };

  const renderSectionContent = (key: string) => {
    // Custom section
    if (key.startsWith('custom_')) {
      const section = customSections[key];
      if (!section) return null;

      const renderCustomContent = () => {
        if (!section.content.trim()) {
          return <div style={{ fontStyle: 'italic', opacity: 0.5, fontSize: '0.9em' }}>No content added yet.</div>;
        }
        const lines = section.content.split('\n');

        if (section.type === 'list') {
          return (
            <ul className={shared.achievementList} style={{ paddingLeft: '14px' }}>
              {lines.filter((l) => l.trim()).map((item, idx) => (
                <li key={idx} style={{ fontSize: 'inherit', lineHeight: lineH }}>{item}</li>
              ))}
            </ul>
          );
        }

        if (section.type === 'simplelist') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {lines.filter((l) => l.trim()).map((item, idx) => (
                <div key={idx} style={{ marginBottom: '2px', fontSize: '0.93em', lineHeight: lineH }}>
                  {idx + 1}. {item}
                </div>
              ))}
            </div>
          );
        }

        if (section.type === 'keyvalue') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {lines.filter((l) => l.trim()).map((item, idx) => {
                const parts = item.split(':');
                const label = parts[0];
                const val = parts.slice(1).join(':');
                return (
                  <div key={idx} style={{ fontSize: '0.93em', lineHeight: lineH }}>
                    {label && <strong style={{ color: hColor }}>{label}:</strong>}
                    {val && <span> {val}</span>}
                  </div>
                );
              })}
            </div>
          );
        }

        // Default: text
        return (
          <div className={shared.customContent} style={{ fontSize: 'inherit', lineHeight: lineH }}>
            <p>{section.content}</p>
          </div>
        );
      };

      return (
        <div className={shared.customSectionContent}>
          {renderCustomContent()}
        </div>
      );
    }

    switch (key) {
      case 'summary':
        if (!summary) return null;
        return (
          <div key={key} style={{ fontSize: 'inherit', lineHeight: lineH }}>
            {summary}
          </div>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <div key={key}>
            {education.map((e, idx) => (
              <React.Fragment key={e.id || idx}>
                {!ignoreSpacers && spacers[e.id] && (
                  <div style={{ height: `${spacers[e.id]}px` }} />
                )}
                <div id={`entry-${e.id}`} className={shared.eduBlock} style={{ position: 'relative' }}>
                  {/* Timeline Dot Node */}
                  <div className={styles.nodeDot} />
                  <div className={shared.eduRow}>
                    <span className={shared.eduTitle}>{e.degree}</span>
                    <span className={shared.entryDates} style={{ opacity: 0.8 }}>{e.dates}</span>
                  </div>
                  <div className={shared.eduSub}>
                    {e.school}{e.gpa ? ` | ${e.gpa}` : ''}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        );

      case 'skills':
        if (skillGroups.length === 0) return null;
        return <div key={key}>{renderSkills()}</div>;

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key={key}>
            {experience.map((x, idx) => (
              <React.Fragment key={x.id || idx}>
                {!ignoreSpacers && spacers[x.id] && (
                  <div style={{ height: `${spacers[x.id]}px` }} />
                )}
                <div id={`entry-${x.id}`} className={shared.entryBlock} style={{ position: 'relative' }}>
                  {/* Timeline Dot Node */}
                  <div className={styles.nodeDot} />
                  <div className={shared.entryRow}>
                    <span className={shared.entryRole}>{x.role}</span>
                    <span className={shared.entryDates}>{x.dates}</span>
                  </div>
                  <div className={shared.entrySub}>{x.company}</div>
                  <ul className={shared.points} style={{ paddingLeft: '14px' }}>
                    {x.points.filter(Boolean).map((pt, pIdx) => (
                      <li key={pIdx} style={{ lineHeight: lineH }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </React.Fragment>
            ))}
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key={key}>
            {projects.map((p, idx) => (
              <React.Fragment key={p.id || idx}>
                {!ignoreSpacers && spacers[p.id] && (
                  <div style={{ height: `${spacers[p.id]}px` }} />
                )}
                <div id={`entry-${p.id}`} className={shared.entryBlock} style={{ position: 'relative' }}>
                  {/* Timeline Dot Node */}
                  <div className={styles.nodeDot} />
                  <div className={shared.entryRow}>
                    <span className={shared.entryRole}>
                      <span style={{ textDecoration: 'underline' }}>{p.name}</span>{p.tech ? ` | ${p.tech}` : ''}
                    </span>
                    <span className={shared.entryDates}>{p.dates}</span>
                  </div>
                  {p.problemStatement && (
                    <div style={{ fontSize: 'inherit', marginTop: '4px', marginBottom: '2px', textAlign: 'justify' }}>
                      <strong>PROBLEM:</strong> {p.problemStatement}
                    </div>
                  )}
                  {p.proposedSolution && (
                    <div style={{ fontSize: 'inherit', marginTop: '2px', marginBottom: '4px', textAlign: 'justify' }}>
                      <strong>SOLUTION:</strong> {p.proposedSolution}
                    </div>
                  )}
                  <ul className={shared.points} style={{ paddingLeft: '14px' }}>
                    {p.points.filter(Boolean).map((pt, pIdx) => (
                      <li key={pIdx} style={{ lineHeight: lineH }}>{pt}</li>
                    ))}
                  </ul>
                  {(p.githubUrl || p.liveUrl) && (
                    <div style={{ fontSize: '0.9em', marginTop: '4px', marginBottom: '2px' }}>
                      {p.githubUrl && <LinkRenderer url={p.githubUrl} label={p.githubUrl} />}
                      {p.liveUrl && <LinkRenderer url={p.liveUrl} label={p.liveUrl} />}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        );

      case 'achievements':
        const filteredAch = achievements.filter(Boolean);
        if (filteredAch.length === 0) return null;
        return (
          <div key={key}>
            <ul className={shared.achievementList} style={{ paddingLeft: '14px' }}>
              {filteredAch.map((ach, idx) => (
                <li key={idx} style={{ fontSize: 'inherit', lineHeight: lineH }}>{ach}</li>
              ))}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={styles.container} 
      style={{ 
        '--sb-width': `${state.sbW}px`,
        fontSize: `${bodySize}px`,
        padding: `${isExport ? 0 : state.mT}px ${state.mR}px ${isExport ? 0 : state.mB}px ${state.mL}px`
      } as any}
    >
      {/* Left Sidebar Column */}
      <div 
        className={styles.leftCol}
        style={{ 
          paddingRight: '20px',
          borderColor: 'rgba(0, 0, 0, 0.08)'
        }}
      >
        {renderPhoto(true)}
        {!(photo && photoPos !== 'hidden') && (
          <div style={{ height: `${Math.max(60, nameSize * 1.2 + 8)}px` }} />
        )}

        {/* Contact list in sidebar */}
        <div>
          <h3 className={styles.sbHeading} style={{ color: hColor, borderColor: hColor, fontSize: `${headSize}px` }}>Contact</h3>
          {state.gmContact ? renderContactGM() : renderContactInline()}
        </div>

        {/* Dynamic Sidebar Sections */}
        {sidebarSections.map((key) => {
          if (!secVis[key]) return null;
          return (
            <div id={`entry-${key}`} key={key}>
              <h3 
                className={styles.sbHeading}
                style={{ 
                  color: hColor, 
                  borderColor: hColor,
                  fontSize: `${headSize}px`,
                  marginTop: `${secSp}px`
                }}
              >
                {secNames[key] || key}
              </h3>
              {renderSectionContent(key)}
            </div>
          );
        })}
      </div>

      {/* Right Column (Contains continuous timeline divider and main blocks) */}
      <div 
        className={styles.rightCol}
        style={{ 
          paddingLeft: '32px',
          marginLeft: '20px',
          color: state.tColor
        }}
      >
        {/* Continuous vertical timeline border */}
        <div className={styles.timelineAxis} style={{ background: hColor }} />

        {/* Header Block in main content */}
        <div className={styles.headerBlock}>
          <h1 className={styles.name} style={{ fontSize: `${nameSize}px`, color: hColor, fontFamily: 'var(--p-heading-font)' }}>
            {name}
          </h1>
          <div className={styles.title} style={{ color: hColor }}>{title}</div>
          <div style={{ height: '2px', background: hColor, marginTop: '8px', marginBottom: '8px', opacity: 0.15 }} />
        </div>

        {/* Dynamic Main Sections */}
        {mainSections.map((key) => {
          if (!secVis[key]) return null;
          return (
            <div id={`entry-${key}`} key={key} className={styles.mainSection}>
              {/* Timeline circular section icon badge */}
              <div className={styles.badge} style={{ background: hColor, boxShadow: `0 0 0 4px ${state.bgColor || '#ffffff'}` }}>
                {renderBadgeIcon(key)}
              </div>
              <h3 
                className={styles.mainHeading}
                style={{ 
                  color: hColor, 
                  fontFamily: 'var(--p-heading-font)',
                  fontSize: `${headSize}px`,
                  borderColor: hColor
                }}
              >
                {secNames[key] || key}
              </h3>
              {renderSectionContent(key)}
            </div>
          );
        })}

        {/* Optional Ending Dot at the bottom of the timeline */}
        <div className={styles.timelineEndDot} style={{ background: hColor }} />
      </div>
    </div>
  );
};

export default memo(TimelineTemplate);

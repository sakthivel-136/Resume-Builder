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
    tColor,
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
    nameSize,
    titleSize,
    contactSize,
    headSize,
    bodySize,
    detailSize,
    educationDegreeSize,
    experienceRoleSize,
    experienceCompanySize,
    projectNameSize,
    techStackSize,
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
      { l: 'Phone', v: phone, display: phone },
      { l: 'Email', v: email, display: email },
      { l: 'LinkedIn', v: linkedin, display: linkedin },
      { l: 'GitHub', v: github, display: github },
      { l: 'Website', v: website, display: website },
      ...(customContacts || []).map(c => ({ l: c.label, v: c.value, display: c.label || c.value })),
    ].filter(i => i.v);

    if (items.length === 0) return null;

    return (
      <div className={shared.gmContact} style={{ fontSize: `${contactSize}px` }}>
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
                  <LinkRenderer url={href} label={it.display || it.v} showIcon={state.showContactIcons} />
                ) : (
                  <LinkRenderer url={it.v} label={it.display || it.v} showIcon={state.showContactIcons} />
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
      { value: phone, display: phone },
      { value: email, display: email },
      { value: linkedin, display: linkedin },
      { value: github, display: github },
      { value: website, display: website },
      ...(customContacts || []).map(c => ({ value: c.value, display: c.label || c.value })),
    ].filter(c => c.value);
    if (cp.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: `${contactSize}px` }}>
        {cp.map((c, idx) => {
          const href = getContactHref(c.value);
          return (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {href ? (
                <LinkRenderer url={href} label={c.display || c.value} color={tColor} noMargin={true} showIcon={state.showContactIcons} />
              ) : (
                <LinkRenderer url={c.value} label={c.display || c.value} color={tColor} noMargin={true} showIcon={state.showContactIcons} />
              )}
            </span>
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
              <ul className={`${shared.points} ${shared.skillPoints}`} style={{ marginTop: '2px', paddingLeft: '14px' }}>
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
    const props = {
      width: 14,
      height: 14,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2.5',
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    };

    if (key === 'summary') {
      return <svg {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    }
    if (key === 'experience') {
      return <svg {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
    }
    if (key === 'projects') {
      return <svg {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
    }
    if (key === 'education') {
      return <svg {...props}><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>;
    }
    return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="16" /><line x1="8" x2="16" y1="12" y2="12" /></svg>;
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
            <div className={shared.justifiedContent} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {lines.filter((l) => l.trim()).map((item, idx) => (
                <div key={idx} style={{ marginBottom: '2px', fontSize: '0.93em', lineHeight: lineH }}>
                  {idx + 1}. {item}
                </div>
              ))}
            </div>
          );
        }

        if (section.type === 'text') {
          return (
            <div className={`${shared.customContent} ${shared.justifiedContent}`} style={{ fontSize: 'inherit', lineHeight: lineH }}>
              {section.content.split('\n\n').filter((p) => p.trim()).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          );
        }

        if (section.type === 'keyvalue') {
          return (
            <div className={shared.justifiedContent}>
              {lines.filter((l) => l.trim()).map((line, idx) => {
                const parts = line.split(':');
                if (parts.length >= 2) {
                  const keyLabel = parts.shift()?.trim() || '';
                  const valText = parts.join(':').trim();
                  return (
                    <div key={idx} className={shared.kvRow} style={{ fontSize: '0.93em' }}>
                      <span className={shared.kvLabel} style={{ color: hColor }}>{keyLabel}:</span>
                      <span className={shared.kvValue}> {valText}</span>
                    </div>
                  );
                }
                return (
                  <div key={idx} style={{ marginBottom: '2px', fontSize: '0.93em', lineHeight: lineH }}>
                    {line}
                  </div>
                );
              })}
            </div>
          );
        }

        if (section.type === 'skills') {
          const items = section.content.split(',').map((v) => v.trim()).filter(Boolean);
          return (
            <div className={shared.justifiedContent} style={{ fontSize: '0.93em', marginTop: '4px', lineHeight: lineH }}>
              {items.join(', ')}
            </div>
          );
        }

        if (section.type === 'timeline') {
          const blocks: { date: string; title: string; desc: string }[] = [];
          let cur: { date: string; title: string; desc: string } | null = null;
          lines.forEach((line) => {
            const tr = line.trim();
            if (!tr) return;
            const pi = tr.indexOf('|');
            if (pi > 0) {
              if (cur) blocks.push(cur);
              cur = { date: tr.substring(0, pi).trim(), title: tr.substring(pi + 1).trim(), desc: '' };
            } else {
              if (cur) cur.desc += (cur.desc ? ' ' : '') + tr;
            }
          });
          if (cur) blocks.push(cur);

          return (
            <div className={shared.justifiedContent}>
              {blocks.map((b, idx) => (
                <div key={idx} className={shared.timelineBlock}>
                  <div className={shared.timelineRow}>
                    <span className={shared.timelineTitle}>{b.title}</span>
                    <span className={shared.timelineDate}>{b.date}</span>
                  </div>
                  {b.desc && (
                    <div className={shared.timelineDesc}>{b.desc}</div>
                  )}
                </div>
              ))}
            </div>
          );
        }

        return (
          <div className={`${shared.customContent} ${shared.justifiedContent}`} style={{ fontSize: 'inherit', lineHeight: lineH }}>
            <p>{section.content}</p>
          </div>
        );
      };

      return (
        <div key={key} className={`${shared.customSectionContent} ${shared.justifiedContent}`}>
          {renderCustomContent()}
        </div>
      );
    }

    switch (key) {
      case 'summary':
        if (!summary) return null;
        return (
          <div key={key} style={{ fontSize: `${detailSize}px`, lineHeight: lineH }} className={`${shared.customContent} ${shared.justifiedContent}`}>
            {summary}
          </div>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <div key={key}>
            {education.map((e, idx) => (
              <div key={e.id || idx} className={`${shared.eduBlock} ${shared.justifiedContent}`}>
                <div className={shared.eduRow}>
                  <span className={shared.eduTitle} style={{ fontSize: `${educationDegreeSize}px` }}>{e.degree}</span>
                  <span className={shared.entryDates}>{e.dates}</span>
                </div>
                <div className={`${shared.eduSub} ${shared.justifiedContent}`}>
                  {e.school}{e.gpa ? ` | ${e.gpa}` : ''}
                </div>
              </div>
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
              <div id={`entry-${x.id || idx}`} key={x.id || idx} className={`${shared.entryBlock} ${shared.justifiedContent}`}>
                <div className={shared.entryRow}>
                  <span className={shared.entryRole} style={{ fontSize: `${experienceRoleSize}px` }}>{x.role}</span>
                  <span className={shared.entryDates}>{x.dates}</span>
                </div>
                <div className={`${shared.entrySub} ${shared.justifiedContent}`} style={{ fontSize: `${experienceCompanySize}px` }}>{x.company}</div>
                <ul className={shared.points} style={{ paddingLeft: '14px' }}>
                  {x.points.filter(Boolean).map((pt, pIdx) => (
                    <li key={pIdx} style={{ lineHeight: lineH }}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key={key}>
            {projects.map((p, idx) => (
              <div id={`entry-${p.id || idx}`} key={p.id || idx} className={`${shared.entryBlock} ${shared.justifiedContent}`}>
                  <div className={shared.entryRow}>
                    <span className={shared.entryRole}>
                      <span style={{ fontWeight: 'bold', color: hColor, fontSize: `${projectNameSize}px` }}>{p.name}</span>{p.tech ? <span style={{ fontSize: `${techStackSize}px` }}> | {p.tech}</span> : ''}
                    </span>
                    <span className={shared.entryDates}>{p.dates}</span>
                  </div>
                  {p.problemStatement && (
                    <div style={{ fontSize: `${detailSize}px`, marginTop: '4px', marginBottom: '2px', textAlign: 'justify' }}>
                      <strong>PROBLEM:</strong> {p.problemStatement}
                    </div>
                  )}
                  {p.proposedSolution && (
                    <div style={{ fontSize: `${detailSize}px`, marginTop: '2px', marginBottom: '4px', textAlign: 'justify' }}>
                      <strong>SOLUTION:</strong> {p.proposedSolution}
                    </div>
                  )}
                  <ul className={shared.points} style={{ paddingLeft: '14px' }}>
                    {p.points.filter(Boolean).map((pt, pIdx) => (
                      <li key={pIdx} style={{ lineHeight: lineH }}>{pt}</li>
                    ))}
                  </ul>
                  {(p.githubUrl || p.liveUrl) && (
                    <div style={{ fontSize: `${detailSize}px`, marginTop: '4px', marginBottom: '2px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {p.githubUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: hColor }}>
                          <span>•</span>
                          <span style={{ fontWeight: 600 }}>Github:</span>
                          <LinkRenderer url={p.githubUrl} label={p.githubUrl} color={hColor} showIcon={false} />
                        </div>
                      )}
                      {p.liveUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: hColor }}>
                          <span>•</span>
                          <span style={{ fontWeight: 600 }}>Live:</span>
                          <LinkRenderer url={p.liveUrl} label={p.liveUrl} color={hColor} showIcon={false} />
                        </div>
                      )}
                    </div>
                  )}
              </div>
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
                <li key={idx} style={{ lineHeight: lineH }}>{ach}</li>
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
        '--p-main-pad': `${state.mainPad}px`,
        fontSize: `${bodySize}px`,
        padding: `${state.mT}px ${state.mR}px ${state.mB}px ${state.mL}px`
      } as React.CSSProperties & Record<'--sb-width' | '--p-main-pad', string>}
    >
      {/* Left Sidebar Column */}
      <div 
        className={styles.leftCol}
        style={{ 
          paddingRight: `${state.sbPad}px`,
          borderColor: 'rgba(0, 0, 0, 0.08)'
        }}
      >
        {renderPhoto(true)}
        {!(photo && photoPos !== 'hidden') && (
          <div style={{ height: `${Math.max(60, nameSize * 1.2 + 8)}px` }} />
        )}

        {/* Contact list in sidebar */}
        <div>
          <h3 className={`${styles.sbHeading} ${shared.sectionHeaderLine}`} style={{ color: hColor, borderColor: hColor, fontSize: `${headSize}px` }}>Contact</h3>
          {state.gmContact ? renderContactGM() : renderContactInline()}
        </div>

        {/* Dynamic Sidebar Sections */}
        {sidebarSections.map((key) => {
          if (!secVis[key]) return null;
          return (
            <div id={`entry-${key}`} key={key}>
              <h3 
                className={`${styles.sbHeading} ${shared.sectionHeaderLine}`}
                style={{ 
                  color: hColor, 
                  borderColor: hColor,
                  fontSize: `${headSize}px`,
                  marginTop: '0'
                }}
              >
                {secNames[key] || key}
              </h3>
              {renderSectionContent(key)}
            </div>
          );
        })}
      </div>

      {/* Right Column */}
      <div 
        className={styles.rightCol}
        style={{ 
          paddingLeft: `${state.mainPad}px`,
          marginLeft: `${state.sbPad}px`,
          color: state.tColor
        }}
      >
        <div className={styles.timelineAxis} style={{ background: hColor }} />

        {/* Header Block in main content */}
        <div className={styles.headerBlock}>
          <h1 className={styles.name} style={{ fontSize: `${nameSize}px`, color: hColor, fontFamily: 'var(--p-heading-font)' }}>
            {name}
          </h1>
          <div className={styles.title} style={{ color: hColor, fontSize: `${titleSize}px` }}>{title}</div>
          <div style={{ height: '2px', background: hColor, marginTop: '8px', marginBottom: '8px', opacity: 0.15 }} />
        </div>

        {/* Dynamic Main Sections */}
        {mainSections.map((key) => {
          if (!secVis[key]) return null;
          return (
            <div id={`entry-${key}`} key={key} className={styles.mainSection}>
              {key !== 'skills' && (
                <div
                  className={styles.badge}
                  style={{
                    background: hColor,
                    boxShadow: `0 0 0 4px ${state.bgColor || '#ffffff'}`,
                    top: `${Math.round((headSize * 1.2 - 32) / 2 + headSize * 0.2)}px`,
                  }}
                >
                  {renderBadgeIcon(key)}
                </div>
              )}
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
        <div className={styles.timelineEndDot} style={{ background: hColor }} />
      </div>
    </div>
  );
};

export default memo(TimelineTemplate);

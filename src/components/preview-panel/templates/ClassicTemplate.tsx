'use client';

import React, { memo } from 'react';
import { ResumeData } from '@/types/resume';
import styles from './ClassicTemplate.module.css';
import shared from './shared.module.css';

import { getContactHref } from '@/utils/helpers';
import LinkRenderer from '@/components/ui/LinkRenderer';

interface ClassicTemplateProps {
  state: ResumeData;
  ignoreSpacers?: boolean;
  spacers?: Record<string, number>;
  isExport?: boolean;
}

const ClassicTemplate = ({ state, ignoreSpacers = false, spacers = {}, isExport = false }: ClassicTemplateProps) => {
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
    sectionOrder,
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
    aColor,
    customContacts,
    bulletType,
  } = state;

  // Contact list filters out empty details
  const contacts = [
    phone,
    email,
    linkedin,
    github,
    website,
    ...(customContacts || []).map(c => c.value)
  ].filter(Boolean);

  // Photo Style helper
  const getPhotoClass = () => {
    if (photoShape === 'circle') return shared.photoCircle;
    if (photoShape === 'rounded') return shared.photoRounded;
    return shared.photoSquare;
  };

  const renderPhoto = () => {
    if (!photo || photoPos === 'hidden' || photoPos === 'sidebar') return null;
    return (
      <img
        src={photo}
        alt="Profile"
        className={`${shared.photo} ${getPhotoClass()}`}
        style={{
          width: `${photoSize}px`,
          height: `${photoSize}px`,
          border: `1.5px solid ${hColor}`,
        }}
      />
    );
  };

  const renderContactInline = () => {
    if (contacts.length === 0) return null;
    return (
      <div className={shared.contactInline} style={{ fontSize: `${bodySize * 0.9}px` }}>
        {contacts.map((c, idx) => {
          const href = getContactHref(c);
          return (
            <span key={idx}>
              {href ? (
                <LinkRenderer url={href} label={c} color={hColor} />
              ) : (
                c
              )}
            </span>
          );
        })}
      </div>
    );
  };

  const renderHeader = () => {
    const nameEl = (
      <h1 
        className={styles.name} 
        style={{ 
          fontSize: `${nameSize}px`, 
          color: hColor, 
          fontFamily: 'var(--p-heading-font)',
          textAlign: photoPos === 'top-left' ? 'left' : photoPos === 'top-right' ? 'right' : 'center'
        }}
      >
        {name}
      </h1>
    );
    const titleEl = (
      <div 
        className={styles.title} 
        style={{ 
          color: hColor, 
          fontFamily: 'var(--p-heading-font)',
          textAlign: photoPos === 'top-left' ? 'left' : photoPos === 'top-right' ? 'right' : 'center'
        }}
      >
        {title}
      </div>
    );

    if (photoPos === 'top-left' && photo) {
      return (
        <div className={styles.flexHeader}>
          {renderPhoto()}
          <div style={{ flex: 1 }}>
            {nameEl}
            {titleEl}
            {renderContactInline()}
          </div>
        </div>
      );
    }

    if (photoPos === 'top-right' && photo) {
      return (
        <div className={styles.flexHeaderRev}>
          {renderPhoto()}
          <div style={{ flex: 1 }}>
            {nameEl}
            {titleEl}
            {renderContactInline()}
          </div>
        </div>
      );
    }

    // Top Center or Hidden photo
    return (
      <div className={styles.centerHeader}>
        {photoPos === 'top-center' && renderPhoto()}
        {nameEl}
        {titleEl}
        {renderContactInline()}
      </div>
    );
  };

  const renderSkills = () => {
    if (skillMode === 'text') {
      return (
        <div className={shared.skillsContainer}>
          {skillGroups.map((s, idx) => (
            <div key={s.id || idx}>
              <span className={shared.skillCat} style={{ color: hColor }}>{s.category}: </span>
              <span className={shared.skillVals}>{s.values}</span>
            </div>
          ))}
        </div>
      );
    }

    if (skillMode === 'pills') {
      const allItems = skillGroups[0]
        ? skillGroups[0].values.split(',').map((v) => v.trim()).filter(Boolean)
        : [];
      if (allItems.length === 0) return null;
      return (
        <div 
          className={shared.skillsContainer}
          style={{ 
            display: 'block', 
            marginTop: '6px', 
            lineHeight: 1.6, 
            textAlign: 'justify',
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
                      marginLeft: '8px', 
                      marginRight: '8px', 
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
            <div key={s.id || idx} style={{ marginBottom: '4px' }}>
              <div className={shared.skillCat} style={{ color: hColor }}>{s.category}</div>
              <ul className={shared.points}>
                {items.map((v, sIdx) => (
                  <li key={sIdx} style={{ fontSize: `${bodySize * 0.95}px` }}>{v}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSection = (key: string) => {
    if (!secVis[key]) return null;

    const heading = (
      <h3 
        className={styles.sectionHeading}
        style={{ 
          color: hColor, 
          fontFamily: 'var(--p-heading-font)',
          fontSize: `${headSize}px`,
          marginTop: `${secSp}px`,
          borderColor: hColor
        }}
      >
        {secNames[key] || key}
      </h3>
    );

    // Custom Section rendering
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
            <ul className={shared.achievementList}>
              {lines.filter((l) => l.trim()).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          );
        }

        if (section.type === 'simplelist') {
          return (
            <div>
              {lines.filter((l) => l.trim()).map((item, idx) => (
                <div key={idx} style={{ marginBottom: '2px', fontSize: '0.93em' }}>
                  {idx + 1}. {item}
                </div>
              ))}
            </div>
          );
        }

        if (section.type === 'text') {
          return (
            <div className={shared.customContent}>
              {section.content.split('\n\n').filter((p) => p.trim()).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          );
        }

        if (section.type === 'keyvalue') {
          return (
            <div>
              {lines.filter((l) => l.trim()).map((line, idx) => {
                const parts = line.split(':');
                if (parts.length >= 2) {
                  const keyLabel = parts.shift()?.trim() || '';
                  const valText = parts.join(':').trim();
                  return (
                    <div key={idx} className={shared.kvRow}>
                      <span className={shared.kvLabel} style={{ color: hColor }}>{keyLabel}:</span>
                      <span className={shared.kvValue}> {valText}</span>
                    </div>
                  );
                }
                return (
                  <div key={idx} style={{ marginBottom: '2px', fontSize: '0.93em' }}>
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
            <div style={{ display: 'block', marginTop: '4px', lineHeight: 1.45 }}>
              {items.map((t, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span style={{ color: hColor, margin: '0 6px', fontWeight: 'bold' }}>•</span>}
                  {t}
                </React.Fragment>
              ))}
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
            <div>
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
          <div className={shared.customContent}>
            <p>{section.content}</p>
          </div>
        );
      };

      return (
        <React.Fragment key={key}>
          {!ignoreSpacers && spacers[key] && (
            <div style={{ height: `${spacers[key]}px` }} />
          )}
          <div id={`entry-${key}`} className={shared.entryBlock}>
            {heading}
            {renderCustomContent()}
          </div>
        </React.Fragment>
      );
    }

    switch (key) {
      case 'summary':
        if (!summary) return null;
        return (
          <div key={key} className={shared.entryBlock}>
            {heading}
            <div style={{ lineHeight: lineH }} className={shared.customContent}>{summary}</div>
          </div>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <div key={key} className={shared.entryBlock}>
            {heading}
            {education.map((e, idx) => (
              <React.Fragment key={e.id || idx}>
                {!ignoreSpacers && spacers[e.id] && (
                  <div style={{ height: `${spacers[e.id]}px` }} />
                )}
                <div id={`entry-${e.id}`} className={shared.eduBlock}>
                  <div className={shared.eduRow}>
                    <span className={shared.eduTitle}>{e.degree}</span>
                    <span className={shared.entryDates}>{e.dates}</span>
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
        return (
          <div key={key} className={shared.entryBlock}>
            {heading}
            {renderSkills()}
          </div>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key={key} className={shared.entryBlock}>
            {heading}
            {experience.map((x, idx) => (
              <React.Fragment key={x.id || idx}>
                {!ignoreSpacers && spacers[x.id] && (
                  <div style={{ height: `${spacers[x.id]}px` }} />
                )}
                <div id={`entry-${x.id}`} className={shared.entryBlock}>
                  <div className={shared.entryRow}>
                    <span className={shared.entryRole}>{x.role}</span>
                    <span className={shared.entryDates}>{x.dates}</span>
                  </div>
                  <div className={shared.entrySub}>{x.company}</div>
                  <ul className={shared.points}>
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
          <div key={key} className={shared.entryBlock}>
            {heading}
            {projects.map((p, idx) => (
              <React.Fragment key={p.id || idx}>
                {!ignoreSpacers && spacers[p.id] && (
                  <div style={{ height: `${spacers[p.id]}px` }} />
                )}
                <div id={`entry-${p.id}`} className={shared.entryBlock}>
                  <div className={shared.entryRow}>
                    <span className={shared.entryRole}>
                      {p.name}{p.tech ? ` | ${p.tech}` : ''}
                    </span>
                    <span className={shared.entryDates}>{p.dates}</span>
                  </div>
                  {p.problemStatement && (
                    <div style={{ fontSize: `${bodySize * 0.95}px`, marginTop: '4px', marginBottom: '2px' }}>
                      <strong>Problem:</strong> {p.problemStatement}
                    </div>
                  )}
                  {p.proposedSolution && (
                    <div style={{ fontSize: `${bodySize * 0.95}px`, marginTop: '2px', marginBottom: '4px' }}>
                      <strong>Solution:</strong> {p.proposedSolution}
                    </div>
                  )}
                  <ul className={shared.points}>
                    {p.points.filter(Boolean).map((pt, pIdx) => (
                      <li key={pIdx} style={{ lineHeight: lineH }}>{pt}</li>
                    ))}
                  </ul>
                  {(p.githubUrl || p.liveUrl) && (
                    <div style={{ display: 'flex', gap: '12px', fontSize: `${bodySize * 0.85}px`, marginTop: '4px', marginBottom: '2px' }}>
                      {p.githubUrl && <LinkRenderer url={p.githubUrl} label={p.githubUrl} color={hColor} />}
                      {p.liveUrl && <LinkRenderer url={p.liveUrl} label={p.liveUrl} color={hColor} />}
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
          <React.Fragment key={key}>
            {!ignoreSpacers && spacers['achievements'] && (
              <div style={{ height: `${spacers['achievements']}px` }} />
            )}
            <div id="entry-achievements" className={shared.entryBlock}>
              {heading}
              <ul className={shared.achievementList}>
                {filteredAch.map((ach, idx) => (
                  <li key={idx} style={{ lineHeight: lineH }}>{ach}</li>
                ))}
              </ul>
            </div>
          </React.Fragment>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Accent Bar */}
      {accentBar === 'top' && (
        <div 
          className={shared.accentBar} 
          style={{ height: `${accentH}px`, background: aColor || hColor, marginBottom: '14px' }} 
        />
      )}

      {/* Main layout */}
      <div style={{ padding: `${isExport ? 0 : state.mT}px ${state.mR}px ${isExport ? 0 : state.mB}px ${state.mL}px` }}>
        {renderHeader()}
        {sectionOrder.map((key) => renderSection(key))}
      </div>
    </div>
  );
};

export default memo(ClassicTemplate);

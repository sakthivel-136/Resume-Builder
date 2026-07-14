'use client';

import React, { memo } from 'react';
import { ResumeData } from '@/types/resume';
import styles from './SidebarTemplate.module.css';
import shared from './shared.module.css';
import { getContactHref } from '@/utils/helpers';
import LinkRenderer from '@/components/ui/LinkRenderer';

interface SidebarTemplateProps {
  state: ResumeData;
  ignoreSpacers?: boolean;
  spacers?: Record<string, number>;
  isExport?: boolean;
}

const SidebarTemplate = ({ state, ignoreSpacers = false, spacers = {}, isExport = false }: SidebarTemplateProps) => {
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
    titleSize,
    contactSize,
    headSize,
    bodySize,
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
          border: isSidebar ? '2.5px solid rgba(255, 255, 255, 0.25)' : `1.5px solid ${hColor}`,
          margin: isSidebar ? '24px auto 6px' : '0 0 10px 0',
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
      <div className={shared.gmContact} style={{ fontSize: `${contactSize}px` }}>
        {items.map((it, idx) => {
          const href = getContactHref(it.v);
          return (
            <div key={idx} className={shared.gmItem}>
              <div className={shared.gmLabel}>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {it.l}
                  </a>
                ) : (
                  it.l
                )}
              </div>
              <div className={shared.gmValue}>
                {href ? (
                  <LinkRenderer url={href} label={it.v} showIcon={false} />
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: `${contactSize}px` }}>
        {cp.map((c, idx) => {
          const href = getContactHref(c);
          return (
            <div key={idx} style={{ wordBreak: 'break-all' }}>
              {href ? (
                <LinkRenderer url={href} label={c} showIcon={false} />
              ) : (
                c
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSkills = (isSidebar: boolean) => {
    if (skillMode === 'text') {
      return (
        <div className={shared.skillsContainer}>
          {skillGroups.map((s, idx) => (
            <div key={s.id || idx} style={{ marginBottom: '4px' }}>
              <span className={shared.skillCat} style={{ color: isSidebar ? '#fff' : hColor }}>{s.category}: </span>
              <span className={shared.skillVals}>{s.values}</span>
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
            fontSize: `${bodySize * 0.9}px`
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
                <span style={{ display: 'inline-block', verticalAlign: 'middle', color: isSidebar ? '#e5e7eb' : 'inherit' }}>{v}</span>
                {sIdx < allItems.length - 1 && (
                  <span 
                    style={{ 
                      color: isSidebar ? '#fff' : (state.bulletColor || hColor), 
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
            <div key={s.id || idx} style={{ marginBottom: '4px' }}>
              <div className={shared.skillCat} style={{ color: isSidebar ? '#fff' : hColor }}>{s.category}</div>
              <ul className={shared.points}>
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

  const renderSectionContent = (key: string, isSidebar: boolean) => {
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
            <ul className={shared.achievementList}>
              {lines.filter((l) => l.trim()).map((item, idx) => (
                <li key={idx} style={{ fontSize: isSidebar ? '0.9em' : 'inherit' }}>{item}</li>
              ))}
            </ul>
          );
        }

        if (section.type === 'simplelist') {
          return (
            <div className={shared.justifiedContent}>
              {lines.filter((l) => l.trim()).map((item, idx) => (
                <div key={idx} style={{ marginBottom: '2px', fontSize: isSidebar ? '0.85em' : '0.93em' }}>
                  {idx + 1}. {item}
                </div>
              ))}
            </div>
          );
        }

        if (section.type === 'text') {
          return (
            <div className={`${shared.customContent} ${shared.justifiedContent}`} style={{ fontSize: isSidebar ? '0.9em' : 'inherit' }}>
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
                    <div key={idx} className={shared.kvRow} style={{ fontSize: isSidebar ? '0.85em' : '0.93em' }}>
                      <span className={shared.kvLabel} style={{ color: isSidebar ? '#fff' : hColor }}>{keyLabel}:</span>
                      <span className={shared.kvValue}> {valText}</span>
                    </div>
                  );
                }
                return (
                  <div key={idx} style={{ marginBottom: '2px', fontSize: isSidebar ? '0.85em' : '0.93em' }}>
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
            <div className={shared.justifiedContent} style={{ fontSize: isSidebar ? '0.9em' : 'inherit', marginTop: '4px', lineHeight: 1.4 }}>
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
                <div key={idx} className={shared.timelineBlock} style={{ fontSize: isSidebar ? '0.9em' : 'inherit' }}>
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
          <div className={`${shared.customContent} ${shared.justifiedContent}`} style={{ fontSize: isSidebar ? '0.9em' : 'inherit' }}>
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
          <div key={key} style={{ fontSize: isSidebar ? '0.9em' : 'inherit', lineHeight: lineH }} className={`${shared.customContent} ${shared.justifiedContent}`}>
            {summary}
          </div>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <div key={key}>
            {education.map((e, idx) => (
              <div key={e.id || idx} className={`${shared.eduBlock} ${shared.justifiedContent}`} style={{ fontSize: isSidebar ? '0.9em' : 'inherit' }}>
                <div className={shared.eduRow} style={{ flexDirection: isSidebar ? 'column' : 'row', alignItems: 'stretch' }}>
                  <span className={shared.eduTitle} style={{ fontSize: `${educationDegreeSize}px` }}>{e.degree}</span>
                  <span className={shared.entryDates} style={{ opacity: 0.8 }}>{e.dates}</span>
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
        return <div key={key} className={shared.justifiedContent}>{renderSkills(isSidebar)}</div>;

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key={key}>
            {experience.map((x, idx) => (
              <div id={`entry-${x.id || idx}`} key={x.id || idx} className={`${shared.entryBlock} ${shared.justifiedContent}`} style={{ fontSize: isSidebar ? '0.9em' : 'inherit' }}>
                <div className={shared.entryRow} style={{ flexDirection: isSidebar ? 'column' : 'row', alignItems: 'stretch' }}>
                  <span className={shared.entryRole} style={{ fontSize: `${experienceRoleSize}px` }}>{x.role}</span>
                  <span className={shared.entryDates} style={{ opacity: 0.8 }}>{x.dates}</span>
                </div>
                <div className={`${shared.entrySub} ${shared.justifiedContent}`} style={{ fontSize: `${experienceCompanySize}px` }}>{x.company}</div>
                <ul className={shared.points}>
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
              <div id={`entry-${p.id || idx}`} key={p.id || idx} className={`${shared.entryBlock} ${shared.justifiedContent}`} style={{ fontSize: isSidebar ? '0.9em' : 'inherit' }}>
                  <div className={shared.entryRow} style={{ flexDirection: isSidebar ? 'column' : 'row', alignItems: 'stretch' }}>
                    <span className={shared.entryRole}>
                      <span style={{ fontWeight: 'bold', color: isSidebar ? '#fff' : hColor, fontSize: `${projectNameSize}px` }}>{p.name}</span>{p.tech ? <span style={{ fontSize: `${techStackSize}px` }}> | {p.tech}</span> : ''}
                    </span>
                    <span className={shared.entryDates} style={{ opacity: 0.8 }}>{p.dates}</span>
                  </div>
                  {p.problemStatement && (
                    <div style={{ fontSize: isSidebar ? '0.9em' : 'inherit', marginTop: '4px', marginBottom: '2px', textAlign: 'justify' }}>
                      <strong>PROBLEM:</strong> {p.problemStatement}
                    </div>
                  )}
                  {p.proposedSolution && (
                    <div style={{ fontSize: isSidebar ? '0.9em' : 'inherit', marginTop: '2px', marginBottom: '4px', textAlign: 'justify' }}>
                      <strong>SOLUTION:</strong> {p.proposedSolution}
                    </div>
                  )}
                  <ul className={shared.points}>
                    {p.points.filter(Boolean).map((pt, pIdx) => (
                      <li key={pIdx} style={{ lineHeight: lineH }}>{pt}</li>
                    ))}
                  </ul>
                  {(p.githubUrl || p.liveUrl) && (
                    <div style={{ fontSize: `${bodySize * 0.85}px`, marginTop: '4px', marginBottom: '2px' }}>
                      {p.githubUrl && <LinkRenderer url={p.githubUrl} label={p.githubUrl} color={isSidebar ? '#fff' : hColor} showIcon={false} prefix="Github Link: " />}
                      {p.liveUrl && <LinkRenderer url={p.liveUrl} label={p.liveUrl} color={isSidebar ? '#fff' : hColor} showIcon={false} prefix="Live In: " />}
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
            <ul className={shared.achievementList}>
              {filteredAch.map((ach, idx) => (
                <li key={idx} style={{ fontSize: isSidebar ? '0.9em' : 'inherit', lineHeight: lineH }}>{ach}</li>
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
      style={{ '--sb-width': `${state.sbW}px` } as any}
    >
      {/* Sidebar Column (Dark bg) */}
      <div 
        className={styles.sidebar}
        style={{ 
          padding: `${isExport ? 0 : state.mT}px ${state.sbPad}px ${isExport ? 0 : state.mB}px ${state.sbPad}px`,
          background: state.sidebarBg,
          color: state.sidebarText
        }}
      >
        {/* Header Block in sidebar */}
        <div className={styles.headerBlock}>
          {renderPhoto(true)}
          <h1 className={styles.name} style={{ fontSize: `${nameSize * 0.65}px`, fontFamily: 'var(--p-heading-font)' }}>
            {name}
          </h1>
          <div className={styles.title} style={{ fontSize: `${titleSize}px` }}>{title}</div>
        </div>

        {/* Contact info in sidebar */}
        <div>
          <h3 className={`${styles.sbHeading} ${shared.sectionHeaderLine}`}>Contact Details</h3>
          {state.gmContact ? renderContactGM() : renderContactInline()}
        </div>

        {/* Dynamic Sidebar Sections */}
        {sidebarSections.map((key) => {
          if (!secVis[key]) return null;
          return (
            <div id={`entry-${key}`} key={key}>
              <h3 className={`${styles.sbHeading} ${shared.sectionHeaderLine}`}>{secNames[key] || key}</h3>
              {renderSectionContent(key, true)}
            </div>
          );
        })}
      </div>

      {/* Main Column (White bg) */}
      <div 
        className={styles.main}
        style={{ 
          padding: `${isExport ? 0 : state.mT}px ${state.mR}px ${isExport ? 0 : state.mB}px ${state.mainPad}px`,
          background: state.bgColor,
          color: state.tColor
        }}
      >
        {/* Accent Bar */}
        {accentBar === 'top' && (
          <div 
            className={shared.accentBar} 
            style={{ height: `${accentH}px`, background: hColor, marginBottom: '14px', marginLeft: `-${state.mainPad}px`, width: `calc(100% + ${state.mainPad}px + ${state.mR}px)` }} 
          />
        )}

        {/* Inline Photo if set to top position in main content */}
        {renderPhoto(false)}

        {/* Dynamic Main Sections */}
        {mainSections.map((key) => {
          if (!secVis[key]) return null;
          return (
            <div id={`entry-${key}`} key={key} className={shared.entryBlock}>
              <h3 
                className={`${styles.mainHeading} ${shared.sectionHeaderLine}`}
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
              {renderSectionContent(key, false)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(SidebarTemplate);

'use client';

import React, { memo } from 'react';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import styles from './ResumeAudit.module.css';

interface AuditItem {
  type: 'critical' | 'warning' | 'success';
  message: string;
  id: string;
}

const ResumeAudit = () => {
  const { state } = useResume();

  // Helper to compile audit checklist
  const getAuditList = (): AuditItem[] => {
    const list: AuditItem[] = [];

    // --- CRITICAL AUDITS ---
    if (!state.name.trim()) {
      list.push({
        id: 'name',
        type: 'critical',
        message: 'Name is empty. Your full name is required at the top of your resume.',
      });
    }

    if (!state.email.trim()) {
      list.push({
        id: 'email',
        type: 'critical',
        message: 'Contact email is missing. Recruiters need a way to reach you.',
      });
    }

    const hasVisibleExp = state.experience.length > 0 && !!state.secVis['experience'];
    if (!hasVisibleExp) {
      list.push({
        id: 'experience',
        type: 'critical',
        message: 'No professional experience entries found. Add at least one entry.',
      });
    }

    const hasVisibleSkills = state.skillGroups.length > 0 && !!state.secVis['skills'];
    if (!hasVisibleSkills) {
      list.push({
        id: 'skills',
        type: 'critical',
        message: 'Core skills are missing. List your key technologies or strengths.',
      });
    }

    // --- WARNING AUDITS ---
    if (!state.phone.trim()) {
      list.push({
        id: 'phone',
        type: 'warning',
        message: 'No phone number listed. डायरेक्ट contact options are highly recommended.',
      });
    }

    if (!state.linkedin.trim()) {
      list.push({
        id: 'linkedin',
        type: 'warning',
        message: 'LinkedIn profile is missing. Most modern recruiters check this first.',
      });
    }

    const hasVisibleEdu = state.education.length > 0 && !!state.secVis['education'];
    if (!hasVisibleEdu) {
      list.push({
        id: 'education',
        type: 'warning',
        message: 'Academic history is missing. Consider listing your degree or certificates.',
      });
    }

    const hasVisibleProj = state.projects.length > 0 && !!state.secVis['projects'];
    if (!hasVisibleProj) {
      list.push({
        id: 'projects',
        type: 'warning',
        message: 'No projects listed. Projects are key to showing your hands-on coding skills.',
      });
    }

    if (state.photoPos !== 'hidden' && !state.photo) {
      list.push({
        id: 'photo',
        type: 'warning',
        message: 'Profile photo pos is active, but you have not uploaded a picture yet.',
      });
    }

    const summaryLen = state.summary ? state.summary.trim().length : 0;
    if (summaryLen < 100 && !!state.secVis['summary']) {
      list.push({
        id: 'summary',
        type: 'warning',
        message: `Summary is too short (${summaryLen} chars). Try aiming for 100–300 characters.`,
      });
    }

    return list;
  };

  const auditList = getAuditList();
  const criticals = auditList.filter((item) => item.type === 'critical');
  const warnings = auditList.filter((item) => item.type === 'warning');

  // Compute metrics
  const totalChecked = 10;
  const criticalCount = criticals.length;
  const warningCount = warnings.length;
  const passedCount = totalChecked - criticalCount - warningCount;
  const healthPercent = Math.round((passedCount / totalChecked) * 100);

  // Set health color indicator
  let healthColor = styles.healthGreen;
  let healthMessage = 'Excellent';
  if (healthPercent < 50) {
    healthColor = styles.healthRed;
    healthMessage = 'Needs Attention';
  } else if (healthPercent < 90) {
    healthColor = styles.healthYellow;
    healthMessage = 'Good Quality';
  }

  return (
    <Card title="Resume Health Audit" collapsible defaultCollapsed={false}>
      <div className={styles.auditContainer}>
        {/* Health Gauge Ring / Bar */}
        <div className={styles.gaugeBlock}>
          <div className={styles.gaugeMeta}>
            <span className={styles.gaugeText}>Resume Health Index</span>
            <span className={`${styles.gaugeStatus} ${healthColor}`}>{healthMessage} ({healthPercent}%)</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={`${styles.progressBarFill} ${healthColor}`} 
              style={{ width: `${healthPercent}%` }} 
            />
          </div>
        </div>

        {/* Audit Details */}
        <div className={styles.issuesList}>
          {criticalCount === 0 && warningCount === 0 ? (
            <div className={styles.perfectState}>
              <span className={styles.perfectIcon}>🎉</span>
              <div>
                <div className={styles.perfectTitle}>Perfect Resume Health!</div>
                <div className={styles.perfectDesc}>Your resume conforms to all standard layout and ATS guidelines. Ready for download!</div>
              </div>
            </div>
          ) : (
            <>
              {/* Critical issues list */}
              {criticals.map((item) => (
                <div key={item.id} className={`${styles.issueRow} ${styles.issueCritical}`}>
                  <span className={styles.issueIcon}>🔴</span>
                  <span className={styles.issueMessage}>{item.message}</span>
                </div>
              ))}

              {/* Warnings list */}
              {warnings.map((item) => (
                <div key={item.id} className={`${styles.issueRow} ${styles.issueWarning}`}>
                  <span className={styles.issueIcon}>🟡</span>
                  <span className={styles.issueMessage}>{item.message}</span>
                </div>
              ))}

              {/* Successful checkmarks list */}
              <div className={styles.successSummary}>
                <span className={styles.successIcon}>🟢</span>
                <span>{passedCount} out of {totalChecked} essential checks successfully passed!</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default memo(ResumeAudit);

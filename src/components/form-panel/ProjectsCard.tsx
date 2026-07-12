'use client';

import React, { memo, useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './cards.module.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* ===== Sortable Project Bullet Point Component ===== */
interface SortablePointProps {
  id: string;
  pointIndex: number;
  projIndex: number;
  value: string;
  onRemovePoint: (projIdx: number, ptIdx: number) => void;
  onUpdatePoint: (projIdx: number, ptIdx: number, val: string) => void;
}

const SortableBulletPoint = ({
  id,
  pointIndex,
  projIndex,
  value,
  onRemovePoint,
  onUpdatePoint,
}: SortablePointProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.pointRow}>
      <div {...attributes} {...listeners} className={styles.dragHandle} style={{ padding: '2px' }} title="Drag to reorder bullet">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="9" cy="5" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
      <input
        className={`${styles.input} ${styles.pointInput}`}
        type="text"
        placeholder="Describe a key aspect of this project..."
        value={value}
        onChange={(e) => onUpdatePoint(projIndex, pointIndex, e.target.value)}
        onFocus={(e) => {
          const defaults = [
            'Architected a full-stack verification system with Role-Based Access Control (RBAC) and real-time monitoring.',
            'Optimized database queries reducing response time by 40% for high-concurrency environments.',
            'Deployed and hosted the system in production for Pentagon Garments; actively used by the company for real-world security monitoring.',
            'Awarded a certification by Pentagon Garments for successful project completion and live deployment.',
            'Engineering a PSTN-based platform using Gemini 1.5 Pro to convert offline voice calls into structured digital reports.',
            'Implementing speech recognition and automated intent detection to classify and escalate grievances to authorities.',
            'Developed a predictive alert system using Random Forest to detect health risks and HVAC inefficiencies.',
            'Presented research findings at the ICASET-2026 International Conference in Chennai.'
          ];
          if (defaults.includes(e.target.value)) {
            onUpdatePoint(projIndex, pointIndex, '');
          } else {
            e.target.select();
          }
        }}
      />
      <button
        type="button"
        className={styles.pointDel}
        onClick={() => onRemovePoint(projIndex, pointIndex)}
        title="Delete bullet"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
};

/* ===== Sortable Project Entry Component ===== */
interface SortableEntryProps {
  id: string;
  index: number;
  name: string;
  tech: string;
  dates: string;
  points: string[];
  githubUrl?: string;
  liveUrl?: string;
  problemStatement?: string;
  proposedSolution?: string;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, field: string, val: string) => void;
  onAddPoint: (idx: number) => void;
  onRemovePoint: (projIdx: number, ptIdx: number) => void;
  onUpdatePoint: (projIdx: number, ptIdx: number, val: string) => void;
  onReorderPoints: (projIdx: number, fromIdx: number, toIdx: number) => void;
}

const SortableProjectEntry = ({
  id,
  index,
  name,
  tech,
  dates,
  points,
  githubUrl = '',
  liveUrl = '',
  problemStatement = '',
  proposedSolution = '',
  onRemove,
  onUpdate,
  onAddPoint,
  onRemovePoint,
  onUpdatePoint,
  onReorderPoints,
}: SortableEntryProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [showGithub, setShowGithub] = useState(!!githubUrl);
  const [showLive, setShowLive] = useState(!!liveUrl);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handlePointDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromIdx = parseInt(active.id.toString().split('-').pop() || '0', 10);
      const toIdx = parseInt(over.id.toString().split('-').pop() || '0', 10);
      onReorderPoints(index, fromIdx, toIdx);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.entry}>
      <div className={styles.entryHead}>
        <div {...attributes} {...listeners} className={styles.dragHandle} title="Drag to reorder project">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="5" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="9" cy="12" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className={styles.removeBtn}
        >
          Remove
        </button>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label>Project Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. DigiSphere"
            value={name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            onFocus={(e) => {
              const defaults = [
                'DigiSphere',
                'KURAL – AI Voice-Based Grievance Redressal System',
                'IoT Smart Air Quality & Climate Monitoring System'
              ];
              if (defaults.includes(e.target.value)) {
                onUpdate(index, 'name', '');
              } else {
                e.target.select();
              }
            }}
          />
        </div>
        <div className={styles.field}>
          <label>Dates (or Month/Year)</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. July 2026"
            value={dates}
            onChange={(e) => onUpdate(index, 'dates', e.target.value)}
            onFocus={(e) => {
              const defaults = ['July 2026', 'Oct 2025 – Present', 'Nov 2025'];
              if (defaults.includes(e.target.value)) {
                onUpdate(index, 'dates', '');
              } else {
                e.target.select();
              }
            }}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Tech Stack / Technologies Used</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. FastAPI, Next.js, PostgreSQL, JWT"
          value={tech}
          onChange={(e) => onUpdate(index, 'tech', e.target.value)}
          onFocus={(e) => {
            const defaults = [
              'FastAPI, Next.js, PostgreSQL, JWT',
              'Gemini 1.5 Pro, PSTN',
              'ESP32, Random Forest'
            ];
            if (defaults.includes(e.target.value)) {
              onUpdate(index, 'tech', '');
            } else {
              e.target.select();
            }
          }}
        />
      </div>

      <div className={styles.togglesRow} style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
          <input type="checkbox" checked={showGithub} onChange={(e) => {
            setShowGithub(e.target.checked);
            if (!e.target.checked) onUpdate(index, 'githubUrl', '');
          }} /> GitHub Link
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
          <input type="checkbox" checked={showLive} onChange={(e) => {
            setShowLive(e.target.checked);
            if (!e.target.checked) onUpdate(index, 'liveUrl', '');
          }} /> Live Link
        </label>
      </div>

      {(showGithub || showLive) && (
        <div className={styles.row2} style={{ marginTop: '8px' }}>
          {showGithub && (
            <div className={styles.field}>
              <label>GitHub URL</label>
              <input className={styles.input} type="text" placeholder="https://github.com/..." value={githubUrl} onChange={(e) => onUpdate(index, 'githubUrl', e.target.value)} />
            </div>
          )}
          {showLive && (
            <div className={styles.field}>
              <label>Live URL</label>
              <input className={styles.input} type="text" placeholder="https://..." value={liveUrl} onChange={(e) => onUpdate(index, 'liveUrl', e.target.value)} />
            </div>
          )}
        </div>
      )}

      <div className={styles.field} style={{ marginTop: '12px' }}>
        <label>Problem Statement</label>
        <textarea className={styles.input} rows={2} placeholder="Describe the problem..." value={problemStatement} onChange={(e) => onUpdate(index, 'problemStatement', e.target.value)} style={{ resize: 'vertical' }} />
      </div>
      <div className={styles.field}>
        <label>Proposed Solution</label>
        <textarea className={styles.input} rows={2} placeholder="Describe your solution..." value={proposedSolution} onChange={(e) => onUpdate(index, 'proposedSolution', e.target.value)} style={{ resize: 'vertical' }} />
      </div>

      {/* Collapsible Project Details */}
      <div className={styles.pointsContainer} style={{ marginTop: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '12px' }}>
        <div 
          className={styles.pointsTitle} 
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}
          onClick={() => setDetailsOpen(!detailsOpen)}
        >
          <span>Project Details & Key Features</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: detailsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        
        {detailsOpen && (
          <div style={{ marginTop: '12px' }}>
            {points.length === 0 && (
              <p className={styles.emptyHint}>No bullet points added yet. Add one below.</p>
            )}
            <DndContext
              id={`proj-points-dnd-${id}`}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handlePointDragEnd}
            >
              <SortableContext
                items={points.map((_, pIdx) => `proj-pt-${id}-${pIdx}`)}
                strategy={verticalListSortingStrategy}
              >
                <div>
                  {points.map((pt, pIdx) => (
                    <SortableBulletPoint
                      key={`proj-pt-${id}-${pIdx}`}
                      id={`proj-pt-${id}-${pIdx}`}
                      pointIndex={pIdx}
                      projIndex={index}
                      value={pt}
                      onRemovePoint={onRemovePoint}
                      onUpdatePoint={onUpdatePoint}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onAddPoint(index)}
              style={{ marginTop: '4px', fontSize: '11px' }}
            >
              + Add Bullet Point
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== Main ProjectsCard Component ===== */
const ProjectsCard = () => {
  const { state, dispatch } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromIndex = state.projects.findIndex((item) => item.id === active.id);
      const toIndex = state.projects.findIndex((item) => item.id === over.id);
      dispatch({ type: 'REORDER_PROJECTS', fromIndex, toIndex });
    }
  };

  const handleAdd = () => {
    dispatch({ type: 'ADD_PROJECT' });
  };

  const handleRemove = (index: number) => {
    dispatch({ type: 'REMOVE_PROJECT', index });
  };

  const handleUpdate = (index: number, field: string, value: string) => {
    dispatch({
      type: 'UPDATE_PROJECT',
      index,
      field: field as any,
      value,
    });
  };

  const handleAddPoint = (projIndex: number) => {
    dispatch({ type: 'ADD_PROJ_POINT', projIndex });
  };

  const handleRemovePoint = (projIndex: number, pointIndex: number) => {
    dispatch({ type: 'REMOVE_PROJ_POINT', projIndex, pointIndex });
  };

  const handleUpdatePoint = (projIndex: number, pointIndex: number, value: string) => {
    dispatch({ type: 'UPDATE_PROJ_POINT', projIndex, pointIndex, value });
  };

  const handleReorderPoints = (projIndex: number, fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_PROJ_POINTS', projIndex, fromIndex, toIndex });
  };

  return (
    <Card title={state.secNames.projects || "Projects"} collapsible>
      <DndContext
        id="projects-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {state.projects.map((item, idx) => (
              <SortableProjectEntry
                key={item.id}
                id={item.id}
                index={idx}
                name={item.name}
                tech={item.tech}
                dates={item.dates}
                points={item.points}
                githubUrl={item.githubUrl}
                liveUrl={item.liveUrl}
                problemStatement={item.problemStatement}
                proposedSolution={item.proposedSolution}
                onRemove={handleRemove}
                onUpdate={handleUpdate}
                onAddPoint={handleAddPoint}
                onRemovePoint={handleRemovePoint}
                onUpdatePoint={handleUpdatePoint}
                onReorderPoints={handleReorderPoints}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="secondary"
        onClick={handleAdd}
        fullWidth
        className={styles.addBtn}
      >
        + Add Key Project
      </Button>
    </Card>
  );
};

export default memo(ProjectsCard);

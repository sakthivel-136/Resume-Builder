'use client';

import React, { memo } from 'react';
import type { Experience } from '@/types/resume';
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

/* ===== Sortable Bullet Point Component ===== */
interface SortablePointProps {
  id: string;
  pointIndex: number;
  expIndex: number;
  value: string;
  onRemovePoint: (expIdx: number, ptIdx: number) => void;
  onUpdatePoint: (expIdx: number, ptIdx: number, val: string) => void;
}

const SortableBulletPoint = ({
  id,
  pointIndex,
  expIndex,
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
        placeholder="Describe a key achievement or responsibility..."
        value={value}
        onChange={(e) => onUpdatePoint(expIndex, pointIndex, e.target.value)}
        onFocus={(e) => {
          const defaults = [
            'Developed a secure verification system with RESTful APIs and JWT authentication for real-time security monitoring.',
            'Independently built and deployed the DigiSphere system into production for the company, currently in active daily use by their security staff.',
            'Received a certification from Pentagon Garments for successful completion and real-world deployment of the project.',
            'Developed and deployed predictive Machine Learning models using XGBoost and Random Forest to enhance system accuracy and project performance.'
          ];
          if (defaults.includes(e.target.value)) {
            onUpdatePoint(expIndex, pointIndex, '');
          } else {
            e.target.select();
          }
        }}
      />
      <button
        type="button"
        className={styles.pointDel}
        onClick={() => onRemovePoint(expIndex, pointIndex)}
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

/* ===== Sortable Experience Entry Component ===== */
interface SortableEntryProps {
  id: string;
  index: number;
  role: string;
  company: string;
  dates: string;
  points: string[];
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, field: keyof Experience, val: string) => void;
  onAddPoint: (idx: number) => void;
  onRemovePoint: (expIdx: number, ptIdx: number) => void;
  onUpdatePoint: (expIdx: number, ptIdx: number, val: string) => void;
  onReorderPoints: (expIdx: number, fromIdx: number, toIdx: number) => void;
}

const SortableExperienceEntry = ({
  id,
  index,
  role,
  company,
  dates,
  points,
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
        <div {...attributes} {...listeners} className={styles.dragHandle} title="Drag to reorder work experience">
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
          <label>Job Title / Role</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. Software Developer Intern"
            value={role}
            onChange={(e) => onUpdate(index, 'role', e.target.value)}
            onFocus={(e) => {
              const defaults = ['Software Developer Intern', 'Machine Learning Intern'];
              if (defaults.includes(e.target.value)) {
                onUpdate(index, 'role', '');
              } else {
                e.target.select();
              }
            }}
          />
        </div>
        <div className={styles.field}>
          <label>Dates (Start – End)</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. Dec 2025 – Jun 2026"
            value={dates}
            onChange={(e) => onUpdate(index, 'dates', e.target.value)}
            onFocus={(e) => {
              const defaults = ['Dec 2025 – Jun 2026', 'June 2025 – Nov 2025'];
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
        <label>Company / Organization & Location</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Pentagon Garments, Virudhunagar, India"
          value={company}
          onChange={(e) => onUpdate(index, 'company', e.target.value)}
          onFocus={(e) => {
            const defaults = [
              'PENTAGON GARMENTS, Virudhunagar, India',
              'PANITH INNOVATIONS, Remote'
            ];
            if (defaults.includes(e.target.value)) {
              onUpdate(index, 'company', '');
            } else {
              e.target.select();
            }
          }}
        />
      </div>

      {/* Bullet points DnD list */}
      <div className={styles.pointsContainer}>
        <div className={styles.pointsTitle}>Key Achievements / Responsibilities</div>
        {points.length === 0 && (
          <p className={styles.emptyHint}>No bullet points added yet. Add one below.</p>
        )}
        <DndContext
          id={`points-dnd-${id}`}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handlePointDragEnd}
        >
          <SortableContext
            items={points.map((_, pIdx) => `pt-${id}-${pIdx}`)}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {points.map((pt, pIdx) => (
                <SortableBulletPoint
                  key={`pt-${id}-${pIdx}`}
                  id={`pt-${id}-${pIdx}`}
                  pointIndex={pIdx}
                  expIndex={index}
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
    </div>
  );
};

/* ===== Main ExperienceCard Component ===== */
const ExperienceCard = () => {
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
      const fromIndex = state.experience.findIndex((item) => item.id === active.id);
      const toIndex = state.experience.findIndex((item) => item.id === over.id);
      dispatch({ type: 'REORDER_EXPERIENCE', fromIndex, toIndex });
    }
  };

  const handleAdd = () => {
    dispatch({ type: 'ADD_EXPERIENCE' });
  };

  const handleRemove = (index: number) => {
    dispatch({ type: 'REMOVE_EXPERIENCE', index });
  };

  const handleUpdate = (index: number, field: keyof Experience, value: string) => {
    dispatch({
      type: 'UPDATE_EXPERIENCE',
      index,
      field,
      value,
    });
  };

  const handleAddPoint = (expIndex: number) => {
    dispatch({ type: 'ADD_EXP_POINT', expIndex });
  };

  const handleRemovePoint = (expIndex: number, pointIndex: number) => {
    dispatch({ type: 'REMOVE_EXP_POINT', expIndex, pointIndex });
  };

  const handleUpdatePoint = (expIndex: number, pointIndex: number, value: string) => {
    dispatch({ type: 'UPDATE_EXP_POINT', expIndex, pointIndex, value });
  };

  const handleReorderPoints = (expIndex: number, fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_EXP_POINTS', expIndex, fromIndex, toIndex });
  };

  return (
    <Card title={state.secNames.experience || "Experience"} collapsible>
      <DndContext
        id="exp-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.experience.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {state.experience.map((item, idx) => (
              <SortableExperienceEntry
                key={item.id}
                id={item.id}
                index={idx}
                role={item.role}
                company={item.company}
                dates={item.dates}
                points={item.points}
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
        + Add Work Experience
      </Button>
    </Card>
  );
};

export default memo(ExperienceCard);

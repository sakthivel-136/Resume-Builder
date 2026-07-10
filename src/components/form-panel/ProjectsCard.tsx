'use client';

import React, { memo } from 'react';
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
        />
      </div>

      {/* Bullet points DnD list */}
      <div className={styles.pointsContainer}>
        <div className={styles.pointsTitle}>Project Details & Key Features</div>
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

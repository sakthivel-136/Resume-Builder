'use client';

import React, { memo } from 'react';
import type { Education } from '@/types/resume';
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

/* ===== Sortable Education Item Component ===== */
interface SortableEntryProps {
  id: string;
  index: number;
  degree: string;
  school: string;
  dates: string;
  gpa: string;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, field: keyof Education, value: string) => void;
}

const SortableEducationEntry = ({
  id,
  index,
  degree,
  school,
  dates,
  gpa,
  onRemove,
  onUpdate,
}: SortableEntryProps) => {
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
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.entry}>
      <div className={styles.entryHead}>
        <div {...attributes} {...listeners} className={styles.dragHandle} title="Drag to reorder">
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

      <div className={styles.field}>
        <label>Degree / Certificate</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Bachelor of Engineering in Computer Science"
          value={degree}
          onChange={(e) => onUpdate(index, 'degree', e.target.value)}
          onFocus={(e) => {
            if (e.target.value === 'Bachelor of Engineering in Computer Science') {
              onUpdate(index, 'degree', '');
            } else {
              e.target.select();
            }
          }}
        />
      </div>

      <div className={styles.field}>
        <label>School / University</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Kamaraj College of Engineering and Technology"
          value={school}
          onChange={(e) => onUpdate(index, 'school', e.target.value)}
          onFocus={(e) => {
            if (e.target.value === 'Kamaraj College of Engineering and Technology, Virudhunagar, India') {
              onUpdate(index, 'school', '');
            } else {
              e.target.select();
            }
          }}
        />
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label>Dates (Start – End)</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. 2023 – 2027"
            value={dates}
            onChange={(e) => onUpdate(index, 'dates', e.target.value)}
            onFocus={(e) => {
              if (e.target.value === '2023 – 2027') {
                onUpdate(index, 'dates', '');
              } else {
                e.target.select();
              }
            }}
          />
        </div>
        <div className={styles.field}>
          <label>GPA / Grade / Details</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. GPA: 7.44"
            value={gpa}
            onChange={(e) => onUpdate(index, 'gpa', e.target.value)}
            onFocus={(e) => {
              if (e.target.value === 'GPA: 7.44 (till 5th sem)') {
                onUpdate(index, 'gpa', '');
              } else {
                e.target.select();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ===== Main EducationCard Component ===== */
const EducationCard = () => {
  const { state, dispatch } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid triggering drag on simple click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromIndex = state.education.findIndex((item) => item.id === active.id);
      const toIndex = state.education.findIndex((item) => item.id === over.id);
      dispatch({ type: 'REORDER_EDUCATION', fromIndex, toIndex });
    }
  };

  const handleAdd = () => {
    dispatch({ type: 'ADD_EDUCATION' });
  };

  const handleRemove = (index: number) => {
    dispatch({ type: 'REMOVE_EDUCATION', index });
  };

  const handleUpdate = (index: number, field: keyof Education, value: string) => {
    dispatch({
      type: 'UPDATE_EDUCATION',
      index,
      field,
      value,
    });
  };

  return (
    <Card title={state.secNames.education || "Education"} collapsible>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.education.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {state.education.map((item, idx) => (
              <SortableEducationEntry
                key={item.id}
                id={item.id}
                index={idx}
                degree={item.degree}
                school={item.school}
                dates={item.dates}
                gpa={item.gpa}
                onRemove={handleRemove}
                onUpdate={handleUpdate}
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
        + Add Education
      </Button>
    </Card>
  );
};

export default memo(EducationCard);

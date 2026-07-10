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

/* ===== Sortable Achievement Entry Component ===== */
interface SortableEntryProps {
  id: string;
  index: number;
  value: string;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, val: string) => void;
}

const SortableAchievementEntry = ({
  id,
  index,
  value,
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
  };

  return (
    <div ref={setNodeRef} style={{ ...style, marginBottom: '10px' }} className={styles.pointRow}>
      <div {...attributes} {...listeners} className={styles.dragHandle} title="Drag to reorder achievement">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="5" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
      <input
        className={styles.input}
        type="text"
        placeholder="e.g. Grand Winner – Student Pitch Competition at Mini Technovision 2K26."
        value={value}
        onChange={(e) => onUpdate(index, e.target.value)}
        onFocus={(e) => {
          const defaults = [
            'Grand Winner – Student Pitch Competition at Mini Technovision 2K26.',
            'Presenter – Presented research on IoT-integrated Air Quality Systems in ICASET - 2026.',
            'Patent Filed – Intellectual Property application filed for "Mr. Strict" (AI Proctoring System).',
            'ISRO Certification – Completed AIML training for Crop Acreage Mapping via official ISRO workshop.',
            'Industry Certification – Certified by Pentagon Garments for developing and deploying the DigiSphere system into the real-world production use.'
          ];
          if (defaults.includes(e.target.value)) {
            onUpdate(index, '');
          } else {
            e.target.select();
          }
        }}
      />
      <button
        type="button"
        className={styles.pointDel}
        onClick={() => onRemove(index)}
        title="Delete achievement"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
};

/* ===== Main AchievementsCard Component ===== */
const AchievementsCard = () => {
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
      const fromIndex = parseInt(active.id.toString().split('-').pop() || '0', 10);
      const toIndex = parseInt(over.id.toString().split('-').pop() || '0', 10);
      dispatch({ type: 'REORDER_ACHIEVEMENTS', fromIndex, toIndex });
    }
  };

  const handleAdd = () => {
    dispatch({ type: 'ADD_ACHIEVEMENT' });
  };

  const handleRemove = (index: number) => {
    dispatch({ type: 'REMOVE_ACHIEVEMENT', index });
  };

  const handleUpdate = (index: number, value: string) => {
    dispatch({ type: 'UPDATE_ACHIEVEMENT', index, value });
  };

  return (
    <Card title={state.secNames.achievements || "Conferences & Achievements"} collapsible>
      {state.achievements.length === 0 && (
        <p className={styles.emptyHint}>No achievements added yet. Add one below.</p>
      )}
      <DndContext
        id="achievements-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.achievements.map((_, idx) => `ach-${idx}`)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {state.achievements.map((item, idx) => (
              <SortableAchievementEntry
                key={`ach-${idx}`}
                id={`ach-${idx}`}
                index={idx}
                value={item}
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
        + Add Achievement
      </Button>
    </Card>
  );
};

export default memo(AchievementsCard);

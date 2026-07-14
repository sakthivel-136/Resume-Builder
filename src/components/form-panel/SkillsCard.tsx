'use client';

import React, { memo } from 'react';
import type { SkillGroup } from '@/types/resume';
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

/* ===== Sortable Skill Group Component ===== */
interface SortableGroupProps {
  id: string;
  index: number;
  category: string;
  values: string;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, field: keyof SkillGroup, val: string) => void;
}

const SortableSkillGroup = ({
  id,
  index,
  category,
  values,
  onRemove,
  onUpdate,
}: SortableGroupProps) => {
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
        <div {...attributes} {...listeners} className={styles.dragHandle} title="Drag to reorder skill group">
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
        <label>Category Name</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Languages & Frameworks"
          value={category}
          onChange={(e) => onUpdate(index, 'category', e.target.value)}
          onFocus={(e) => {
            const defaults = [
              'Languages & Frameworks',
              'Tools & Access Control',
              'Machine Learning',
              'IoT & Protocols'
            ];
            if (defaults.includes(e.target.value)) {
              onUpdate(index, 'category', '');
            } else {
              e.target.select();
            }
          }}
        />
      </div>

      <div className={styles.field}>
        <label>Skills (Comma-separated)</label>
        <textarea
          className={styles.textarea}
          placeholder="e.g. Python, SQL, FastAPI, Flask, Next.js"
          value={values}
          onChange={(e) => onUpdate(index, 'values', e.target.value)}
          onFocus={(e) => {
            const defaults = [
              'Python, SQL, FastAPI, Flask, Next.js 14, PostgreSQL, Supabase, Tailwind CSS, RESTful APIs, JWT, Flutter',
              'Git, GitHub, RBAC',
              'TensorFlow, XGBoost, Random Forest, Gemini 1.5 Pro',
              'ESP32/Arduino, MQTT'
            ];
            if (defaults.includes(e.target.value)) {
              onUpdate(index, 'values', '');
            } else {
              e.target.select();
            }
          }}
          rows={2}
          style={{ minHeight: '44px' }}
        />
      </div>
    </div>
  );
};

/* ===== Main SkillsCard Component ===== */
const SkillsCard = () => {
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

  React.useEffect(() => {
    if ((state.tpl === 2 || state.tpl === 3 || state.tpl === 4) && state.skillMode === 'pills') {
      dispatch({ type: 'SET_FIELD', field: 'skillMode', value: 'text' });
    }
  }, [state.tpl, state.skillMode, dispatch]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromIndex = state.skillGroups.findIndex((item) => item.id === active.id);
      const toIndex = state.skillGroups.findIndex((item) => item.id === over.id);
      dispatch({ type: 'REORDER_SKILLS', fromIndex, toIndex });
    }
  };

  const handleAdd = () => {
    dispatch({ type: 'ADD_SKILL_GROUP' });
  };

  const handleRemove = (index: number) => {
    dispatch({ type: 'REMOVE_SKILL_GROUP', index });
  };

  const handleUpdate = (index: number, field: keyof SkillGroup, value: string) => {
    dispatch({
      type: 'UPDATE_SKILL_GROUP',
      index,
      field,
      value,
    });
  };

  const handleModeChange = (mode: 'text' | 'pills' | 'bullets') => {
    dispatch({ type: 'SET_FIELD', field: 'skillMode', value: mode });
  };

  const allowedModes = (state.tpl === 2 || state.tpl === 3 || state.tpl === 4)
    ? (['text', 'bullets'] as const)
    : (['text', 'pills', 'bullets'] as const);

  return (
    <Card title={state.secNames.skills || "Technical Skills"} collapsible>
      {/* Display Mode Selector */}
      <div className={styles.field} style={{ marginBottom: '16px' }}>
        <label>Display Style</label>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${allowedModes.length}, 1fr)`, gap: '8px', marginTop: '6px' }}>
          {allowedModes.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeChange(m)}
              style={{
                background: state.skillMode === m ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: '#fff',
                border: '1px solid',
                borderColor: state.skillMode === m ? 'var(--accent-primary)' : 'var(--border)',
                borderRadius: '6px',
                padding: '6px 8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--transition-fast)',
              }}
            >
              {m === 'pills' ? 'Inline Bullets' : m}
            </button>
          ))}
        </div>
      </div>

      {state.skillMode === 'pills' ? (
        <div className={styles.entry}>
          <div className={styles.field}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>SKILLS (COMMA-SEPARATED)</label>
            <textarea
              className={styles.textarea}
              placeholder="e.g. Python, SQL, FastAPI, Flask, Next.js"
              value={state.skillGroups[0]?.values || ''}
              onChange={(e) => {
                if (state.skillGroups.length === 0) {
                  dispatch({ type: 'ADD_SKILL_GROUP' });
                }
                handleUpdate(0, 'values', e.target.value);
              }}
              rows={4}
              style={{ minHeight: '80px', marginTop: '6px' }}
            />
          </div>
        </div>
      ) : (
        <>
          <DndContext
            id="skills-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={state.skillGroups.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                {state.skillGroups.map((item, idx) => (
                  <SortableSkillGroup
                    key={item.id}
                    id={item.id}
                    index={idx}
                    category={item.category}
                    values={item.values}
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
            + Add Skill Category
          </Button>
        </>
      )}
    </Card>
  );
};

export default memo(SkillsCard);

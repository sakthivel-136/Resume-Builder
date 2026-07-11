'use client';

import React, { memo, useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
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

/* ===== Sortable Custom List Entry Component ===== */
interface SortableEntryProps {
  id: string;
  index: number;
  value: string;
  placeholder: string;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, val: string) => void;
}

const SortableCustomListEntry = ({
  id,
  index,
  value,
  placeholder,
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
      <div {...attributes} {...listeners} className={styles.dragHandle} title="Drag to reorder item">
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
        placeholder={placeholder}
        value={value}
        onChange={(e) => onUpdate(index, e.target.value)}
        onFocus={(e) => e.target.select()}
      />
      <button
        type="button"
        className={styles.pointDel}
        onClick={() => onRemove(index)}
        title="Delete item"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
};

/* ===== Main CustomSectionCard Component ===== */
interface CustomSectionCardProps {
  id: string;
}

const CustomSectionCard = ({ id }: CustomSectionCardProps) => {
  const { state, dispatch } = useResume();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const section = state.customSections[id];
  const sectionName = state.secNames[id] || 'Custom Section';

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

  if (!section) return null;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_CUSTOM_SECTION_CONTENT', id, content: e.target.value });
  };

  // --- Individual list item helpers ---
  const listItems = section.content === ''
    ? []
    : section.content.split('\n');

  const updateListItem = (index: number, value: string) => {
    const items = [...listItems];
    items[index] = value;
    dispatch({ type: 'SET_CUSTOM_SECTION_CONTENT', id, content: items.join('\n') });
  };

  const removeListItem = (index: number) => {
    const items = [...listItems];
    items.splice(index, 1);
    dispatch({ type: 'SET_CUSTOM_SECTION_CONTENT', id, content: items.join('\n') });
  };

  const addListItem = () => {
    if (section.content === '') {
      dispatch({ type: 'SET_CUSTOM_SECTION_CONTENT', id, content: ' ' });
    } else {
      dispatch({ type: 'SET_CUSTOM_SECTION_CONTENT', id, content: section.content + '\n ' });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromIndex = parseInt(active.id.toString().split('-').pop() || '0', 10);
      const toIndex = parseInt(over.id.toString().split('-').pop() || '0', 10);
      
      const items = [...listItems];
      const result = Array.from(items);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      
      dispatch({ type: 'SET_CUSTOM_SECTION_CONTENT', id, content: result.join('\n') });
    }
  };

  const TYPE_LABELS: Record<string, string> = {
    text: 'Paragraphs',
    list: 'Bullet List',
    keyvalue: 'Key-Value',
    skills: 'Tags / Pills',
    timeline: 'Timeline',
    simplelist: 'Simple List',
  };

  const TYPE_HINTS: Record<string, string> = {
    text: 'Separate paragraphs with double newlines',
    list: 'Each item gets a bullet point on the resume',
    keyvalue: 'Format: Key: Value (one per line)',
    skills: 'Comma-separated values',
    timeline: 'Format: Date | Title, followed by description lines',
    simplelist: 'One item per line',
  };

  const TYPE_PLACEHOLDERS: Record<string, string> = {
    text: 'Enter paragraph content. Use double newlines to start a new paragraph...',
    list: 'Enter each bullet point on a new line...',
    keyvalue: 'Enter key-value pairs (e.g. Award: First Place) on new lines...',
    skills: 'Enter values separated by commas (e.g. Python, SQL, Git)...',
    timeline: 'Enter timeline entries. E.g.:\n2025 | Joined Company\nLearned coding in react',
    simplelist: 'Enter each item on a new line...',
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_CUSTOM_SECTION_TYPE', id, secType: e.target.value as 'text' | 'list' | 'keyvalue' | 'skills' | 'timeline' | 'simplelist' });
  };

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_CUSTOM_SECTION', id });
    setIsDeleteModalOpen(false);
  };

  return (
    <Card
      title={sectionName}
      collapsible
      actions={
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteModalOpen(true);
          }}
          className={styles.removeBtn}
          style={{ padding: '2px 8px', fontSize: '10px' }}
        >
          Delete
        </button>
      }
    >
      <div className={styles.field} style={{ marginBottom: '14px' }}>
        <label htmlFor={`custom-type-${id}`}>Content Layout</label>
        <select
          id={`custom-type-${id}`}
          className={styles.select}
          value={section.type}
          onChange={handleTypeChange}
          style={{ marginTop: '4px' }}
        >
          {Object.entries(TYPE_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
          {TYPE_HINTS[section.type]}
        </div>
      </div>

      {/* Render sortable list elements for Bullet List mode */}
      {section.type === 'list' ? (
        <div>
          {listItems.length === 0 && (
            <p className={styles.emptyHint}>No items added yet. Add one below.</p>
          )}
          
          <DndContext
            id={`custom-dnd-${id}`}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={listItems.map((_, idx) => `item-${idx}`)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                {listItems.map((item, idx) => (
                  <SortableCustomListEntry
                    key={`item-${idx}`}
                    id={`item-${idx}`}
                    index={idx}
                    value={item}
                    placeholder={`${sectionName} item ${idx + 1}`}
                    onRemove={removeListItem}
                    onUpdate={updateListItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Button
            type="button"
            variant="secondary"
            onClick={addListItem}
            fullWidth
            className={styles.addBtn}
            style={{ marginTop: '8px' }}
          >
            + Add {sectionName}
          </Button>
        </div>
      ) : (
        /* Render textarea for all other content types */
        <div className={styles.field}>
          <label htmlFor={`custom-content-${id}`}>Section Content</label>
          <textarea
            id={`custom-content-${id}`}
            className={styles.textarea}
            placeholder={TYPE_PLACEHOLDERS[section.type]}
            value={section.content}
            onChange={handleContentChange}
            rows={5}
            style={{ minHeight: '100px', marginTop: '4px' }}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Custom Section"
        actions={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemove}>
              Delete Section
            </Button>
          </div>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.5 }}>
          Are you sure you want to delete the custom section <strong>&quot;{sectionName}&quot;</strong>? This will permanently delete all content inside it.
        </p>
      </Modal>
    </Card>
  );
};

export default memo(CustomSectionCard);

'use client';

import React, { memo, useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import styles from './cards.module.css';

interface CustomSectionCardProps {
  id: string;
}

const CustomSectionCard = ({ id }: CustomSectionCardProps) => {
  const { state, dispatch } = useResume();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const section = state.customSections[id];
  const sectionName = state.secNames[id] || 'Custom Section';

  if (!section) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'RENAME_SECTION', key: id, name: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_CUSTOM_SECTION_CONTENT', id, content: e.target.value });
  };

  const TYPE_LABELS = {
    text: 'Paragraphs',
    list: 'Bullet List',
    keyvalue: 'Key-Value',
    skills: 'Tags / Pills',
    timeline: 'Timeline',
    simplelist: 'Simple List',
  };

  const TYPE_HINTS = {
    text: 'Separate paragraphs with double newlines',
    list: 'One item per line',
    keyvalue: 'Format: Key: Value (one per line)',
    skills: 'Comma-separated values',
    timeline: 'Format: Date | Title, followed by description lines',
    simplelist: 'One item per line',
  };

  const TYPE_PLACEHOLDERS = {
    text: 'Enter paragraph content. Use double newlines to start a new paragraph...',
    list: 'Enter each bullet point on a new line...',
    keyvalue: 'Enter key-value pairs (e.g. Award: First Place) on new lines...',
    skills: 'Enter values separated by commas (e.g. Python, SQL, Git)...',
    timeline: 'Enter timeline entries. E.g.:\n2025 | Joined Company\nLearned coding in react',
    simplelist: 'Enter each item on a new line...',
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_CUSTOM_SECTION_TYPE', id, secType: e.target.value as any });
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
            e.stopPropagation(); // Avoid collapsing the card
            setIsDeleteModalOpen(true);
          }}
          className={styles.removeBtn}
          style={{ padding: '2px 8px', fontSize: '10px' }}
        >
          Delete
        </button>
      }
    >
      <div className={styles.field}>
        <label>Section Title</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Certifications / Volunteering"
          value={sectionName}
          onChange={handleNameChange}
        />
      </div>

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
          Are you sure you want to delete the custom section <strong>"{sectionName}"</strong>? This will permanently delete all content inside it.
        </p>
      </Modal>
    </Card>
  );
};

export default memo(CustomSectionCard);

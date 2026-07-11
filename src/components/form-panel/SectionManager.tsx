'use client';

import React, { memo, useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import styles from './SectionManager.module.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSectionProps {
  id: string;
  name: string;
  visible: boolean;
  isCustom: boolean;
  isPinned?: boolean;
  isSelected?: boolean;
  onToggleVis: (key: string) => void;
  onRename: (key: string, name: string) => void;
  onDeleteCustom: (key: string) => void;
  onClick?: () => void;
}

const SortableSectionItem = ({
  id,
  name,
  visible,
  isCustom,
  isPinned,
  isSelected,
  onToggleVis,
  onRename,
  onDeleteCustom,
  onClick,
}: SortableSectionProps) => {
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
    opacity: isDragging ? 0.4 : 1,
    cursor: isPinned ? 'default' : 'inherit',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`${styles.sectionItem} ${isSelected ? styles.selectedItem : ''}`}
    >
      {isPinned ? (
        <div className={styles.actionBtn} style={{ cursor: 'default' }} title="Pinned Section">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Dedicated mobile tap selector button */}
          <button
            type="button"
            className={`${styles.swapSelector} ${isSelected ? styles.swapSelectorActive : ''}`}
            onClick={onClick}
            title="Tap to select / swap section order"
          >
            {isSelected ? '🎯' : '⇄'}
          </button>
          
          <div {...attributes} {...listeners} className={styles.dragHandle} title="Drag to reorder section" onClick={(e) => e.stopPropagation()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="5" r="1" />
              <circle cx="15" cy="5" r="1" />
              <circle cx="9" cy="12" r="1" />
              <circle cx="15" cy="12" r="1" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="19" r="1" />
            </svg>
          </div>
        </div>
      )}

      <input
        className={styles.sectionNameInput}
        type="text"
        value={name}
        onChange={(e) => onRename(id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        disabled={isPinned}
      />

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVis(id);
          }}
          className={`${styles.actionBtn} ${visible ? styles.actionBtnActive : ''}`}
          title={visible ? 'Hide section' : 'Show section'}
        >
          {visible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>

        {!isPinned && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCustom(id);
            }}
            className={`${styles.actionBtn} ${styles.delBtn}`}
            title="Delete section"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/* ===== Droppable Zone Component ===== */
interface DroppableZoneProps {
  id: string;
  children: React.ReactNode;
}

const DroppableZone = ({ id, children }: DroppableZoneProps) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} id={id} style={{ minHeight: '140px', paddingBottom: '16px' }}>
      {children}
    </div>
  );
};

/* ===== Main SectionManager Component ===== */
const SectionManager = () => {
  const { state, dispatch } = useResume();
  const { addToast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!isAddModalOpen) {
      setCustomName('');
    }
  }, [isAddModalOpen]);

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

  const handleToggleVis = (key: string) => {
    dispatch({ type: 'TOGGLE_SECTION_VIS', key });
  };

  const handleRename = (key: string, name: string) => {
    dispatch({ type: 'RENAME_SECTION', key, name });
  };

  const handleDeleteCustom = (key: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_SECTION', id: key });
  };

  const handleAddCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customName.trim();
    if (!trimmed) return;
    const newId = `custom_${Date.now()}`;
    dispatch({ type: 'ADD_CUSTOM_SECTION', id: newId, name: trimmed });
    setCustomName('');
    setIsAddModalOpen(false);
  };

  // Helper to check if a section is custom
  const isCustomSection = (key: string) => key.startsWith('custom_');

  // Handle mobile click-to-swap fallback
  const handleSectionClick = (id: string) => {
    if (!selectedSectionId) {
      setSelectedSectionId(id);
      addToast(`Selected "${state.secNames[id] || id}". Tap another section to swap positions!`, 'info');
    } else {
      if (selectedSectionId === id) {
        setSelectedSectionId(null);
        addToast('Selection cleared', 'info');
        return;
      }

      if (state.tpl === 1) {
        const order = [...state.sectionOrder];
        const idx1 = order.indexOf(selectedSectionId);
        const idx2 = order.indexOf(id);
        if (idx1 !== -1 && idx2 !== -1) {
          order[idx1] = id;
          order[idx2] = selectedSectionId;
          dispatch({ type: 'REORDER_SECTIONS', order });
          addToast('Sections swapped successfully!', 'success');
        }
      } else {
        const container1 = findContainer(selectedSectionId);
        const container2 = findContainer(id);

        if (container1 && container2) {
          let sidebar = [...state.sidebarSections];
          let main = [...state.mainSections];

          if (container1 === container2) {
            const arr = container1 === 'sidebar' ? sidebar : main;
            const idx1 = arr.indexOf(selectedSectionId);
            const idx2 = arr.indexOf(id);
            if (idx1 !== -1 && idx2 !== -1) {
              arr[idx1] = id;
              arr[idx2] = selectedSectionId;
            }
          } else {
            const idx1 = sidebar.indexOf(selectedSectionId);
            const idx2 = main.indexOf(id);
            if (idx1 !== -1 && idx2 !== -1) {
              sidebar[idx1] = id;
              main[idx2] = selectedSectionId;
            } else {
              const idx3 = sidebar.indexOf(id);
              const idx4 = main.indexOf(selectedSectionId);
              if (idx3 !== -1 && idx4 !== -1) {
                sidebar[idx3] = selectedSectionId;
                main[idx4] = id;
              }
            }
          }

          dispatch({ type: 'SET_ZONES', sidebar, main });
          addToast('Sections swapped successfully!', 'success');
        }
      }
      setSelectedSectionId(null);
    }
  };

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (state.tpl === 1) return; // No multi-container drag for T1

    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = over.id === 'sidebar' || over.id === 'main' ? over.id : findContainer(over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    // Contact cannot leave sidebar
    if (active.id === 'contact' && overContainer === 'main') return;

    const activeItems = activeContainer === 'sidebar' ? state.sidebarSections : state.mainSections;
    const overItems = overContainer === 'sidebar' ? state.sidebarSections : state.mainSections;

    const activeIdx = activeItems.indexOf(active.id as string);
    let overIdx = overItems.indexOf(over.id as string);

    if (overIdx === -1) {
      overIdx = overItems.length;
    }

    const nextActive = activeItems.filter(item => item !== active.id);
    const nextOver = [...overItems];
    nextOver.splice(overIdx, 0, active.id as string);

    dispatch({
      type: 'SET_ZONES',
      sidebar: activeContainer === 'sidebar' ? nextActive : nextOver,
      main: activeContainer === 'main' ? nextActive : nextOver,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (state.tpl === 1) {
      if (active.id !== over.id) {
        const oldIndex = state.sectionOrder.indexOf(active.id as string);
        const newIndex = state.sectionOrder.indexOf(over.id as string);
        const newOrder = [...state.sectionOrder];
        const [removed] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, removed);
        dispatch({ type: 'REORDER_SECTIONS', order: newOrder });
      }
    } else {
      const activeContainer = findContainer(active.id as string);
      const overContainer = over.id === 'sidebar' || over.id === 'main' ? over.id : findContainer(over.id as string);

      if (activeContainer && overContainer && activeContainer === overContainer) {
        const items = activeContainer === 'sidebar' ? state.sidebarSections : state.mainSections;
        const oldIdx = items.indexOf(active.id as string);
        const newIdx = items.indexOf(over.id as string);
        
        if (oldIdx !== newIdx) {
          const newOrder = [...items];
          const [removed] = newOrder.splice(oldIdx, 1);
          newOrder.splice(newIdx, 0, removed);

          dispatch({
            type: 'SET_ZONES',
            sidebar: activeContainer === 'sidebar' ? newOrder : state.sidebarSections,
            main: activeContainer === 'main' ? newOrder : state.mainSections,
          });
        }
      }
    }
  };

  const findContainer = (id: string): 'sidebar' | 'main' | null => {
    if (state.sidebarSections.includes(id)) return 'sidebar';
    if (state.mainSections.includes(id)) return 'main';
    return null;
  };

  // Find info about active dragging item for DragOverlay
  const activeSectionName = activeId ? (state.secNames[activeId] || activeId) : '';

  return (
    <Card title="Manage Sections" collapsible>
      <div className={styles.managerContainer}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {state.tpl === 1 ? (
            /* ===== T1 Single Column Sortable ===== */
            <SortableContext
              items={state.sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles.classicList}>
                {state.sectionOrder.map((key) => (
                  <SortableSectionItem
                    key={key}
                    id={key}
                    name={state.secNames[key] || key}
                    visible={!!state.secVis[key]}
                    isCustom={isCustomSection(key)}
                    isSelected={selectedSectionId === key}
                    onToggleVis={handleToggleVis}
                    onRename={handleRename}
                    onDeleteCustom={handleDeleteCustom}
                    onClick={() => handleSectionClick(key)}
                  />
                ))}
              </div>
            </SortableContext>
          ) : (
            /* ===== T2/T3 Two Zones Sortable ===== */
            <div className={styles.twoZonesGrid}>
              {/* Sidebar Zone */}
              <div className={styles.zone}>
                <h4 className={styles.zoneTitle}>
                  <span>Sidebar</span>
                  <span style={{ fontSize: '9px', opacity: 0.6 }}>(T{state.tpl} left side)</span>
                </h4>
                <SortableContext
                  items={state.sidebarSections}
                  strategy={verticalListSortingStrategy}
                >
                  <DroppableZone id="sidebar">
                    {/* Permanent contact display */}
                    <div className={styles.sectionItem} style={{ opacity: 0.85, borderStyle: 'dashed' }}>
                      <div className={styles.actionBtn} style={{ cursor: 'default' }} title="Pinned contact">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, flex: 1, padding: '2px 4px', color: 'var(--text-secondary)' }}>
                        Contact Details (Pinned)
                      </span>
                    </div>

                    {state.sidebarSections.map((key) => (
                      <SortableSectionItem
                        key={key}
                        id={key}
                        name={state.secNames[key] || key}
                        visible={!!state.secVis[key]}
                        isCustom={isCustomSection(key)}
                        isSelected={selectedSectionId === key}
                        onToggleVis={handleToggleVis}
                        onRename={handleRename}
                        onDeleteCustom={handleDeleteCustom}
                        onClick={() => handleSectionClick(key)}
                      />
                    ))}
                    {state.sidebarSections.length === 0 && (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '30px' }}>
                        Drag items here
                      </div>
                    )}
                  </DroppableZone>
                </SortableContext>
              </div>

              {/* Main Content Zone */}
              <div className={styles.zone}>
                <h4 className={styles.zoneTitle}>Main Area</h4>
                <SortableContext
                  items={state.mainSections}
                  strategy={verticalListSortingStrategy}
                >
                  <DroppableZone id="main">
                    {state.mainSections.map((key) => (
                      <SortableSectionItem
                        key={key}
                        id={key}
                        name={state.secNames[key] || key}
                        visible={!!state.secVis[key]}
                        isCustom={isCustomSection(key)}
                        isSelected={selectedSectionId === key}
                        onToggleVis={handleToggleVis}
                        onRename={handleRename}
                        onDeleteCustom={handleDeleteCustom}
                        onClick={() => handleSectionClick(key)}
                      />
                    ))}
                    {state.mainSections.length === 0 && (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '30px' }}>
                        Drag items here
                      </div>
                    )}
                  </DroppableZone>
                </SortableContext>
              </div>
            </div>
          )}

          {/* Drag overlay preview */}
          <DragOverlay>
            {activeId ? (
              <div className={styles.sectionItem} style={{ boxShadow: 'var(--shadow-glow)', opacity: 0.9 }}>
                <div className={styles.dragHandle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="5" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="19" r="1" />
                  </svg>
                </div>
                <span style={{ flex: 1, fontSize: '12px', fontWeight: 600, paddingLeft: '4px' }}>
                  {activeSectionName}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsAddModalOpen(true)}
        fullWidth
        style={{ marginTop: '12px' }}
      >
        + Create Custom Section
      </Button>

      {/* Restore Predefined Sections Panel */}
      {(() => {
        const standardSections = ['summary', 'education', 'skills', 'experience', 'projects', 'achievements'];
        const deletedStandardSections = standardSections.filter(key => !state.sectionOrder.includes(key));
        if (deletedStandardSections.length === 0) return null;
        return (
          <div style={{ marginTop: '16px', borderTop: '1px dashed rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <span style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Restore Predefined Sections
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {deletedStandardSections.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'RESTORE_PREDEFINED_SECTION', key });
                    addToast(`Restored "${state.secNames[key] || key}" section!`, 'success');
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  + {state.secNames[key] || key}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Add Custom Section Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Section"
        actions={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCustomSection}>
              Create Section
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAddCustomSection}>
          <div className={styles.field}>
            <label htmlFor="custom-sec-name-inp">Section Name</label>
            <input
              id="custom-sec-name-inp"
              className={styles.input}
              type="text"
              placeholder="e.g. Certifications, Volunteering, Publications"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              autoFocus
            />
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default memo(SectionManager);

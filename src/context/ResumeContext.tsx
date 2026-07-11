'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { ResumeData, ResumeAction } from '@/types/resume';
import { createDefaultResume } from '@/data/defaultResume';
import { useAuth } from '@/context/AuthContext';
import { saveProfile, loadProfile, getLastEditedProfileId, getUserProfiles } from '@/utils/storage';
import { generateId, reorder } from '@/utils/helpers';
import { AUTO_SAVE_DELAY, MAX_HISTORY } from '@/utils/constants';
import { PALETTES } from '@/data/palettes';

interface ResumeContextValue {
  state: ResumeData;
  dispatch: React.Dispatch<ResumeAction>;
  canUndo: boolean;
  canRedo: boolean;
  saveNow: () => void;
  loadProfileById: (id: string) => void;
  createNewProfile: (name?: string) => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

// ===== History tracking =====
interface HistoryState {
  past: ResumeData[];
  present: ResumeData;
  future: ResumeData[];
}

function resumeReducer(data: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return { ...data, tpl: action.tpl };

    case 'SET_PALETTE': {
      const group = PALETTES[data.tpl] || PALETTES[1];
      const pal = group[action.pal] || group[0];
      return {
        ...data,
        pal: action.pal,
        hColor: pal.h,
        tColor: pal.t,
        bgColor: pal.bg,
        sidebarBg: pal.sb || data.sidebarBg,
        sidebarText: pal.st || data.sidebarText,
        leftBg: pal.lf || data.leftBg,
        aColor: pal.a || '#b6863c',
      };
    }

    case 'SET_FIELD':
      return { ...data, [action.field]: action.value };

    case 'REORDER_SECTIONS':
      return { ...data, sectionOrder: action.order };

    case 'SET_ZONES':
      return { ...data, sidebarSections: action.sidebar, mainSections: action.main };

    case 'TOGGLE_SECTION_VIS':
      return { ...data, secVis: { ...data.secVis, [action.key]: !data.secVis[action.key] } };

    case 'RENAME_SECTION':
      return { ...data, secNames: { ...data.secNames, [action.key]: action.name } };

    case 'ADD_CUSTOM_SECTION': {
      const newSections = { ...data.customSections, [action.id]: { type: 'text' as const, content: '' } };
      return {
        ...data,
        customSections: newSections,
        secNames: { ...data.secNames, [action.id]: action.name },
        secVis: { ...data.secVis, [action.id]: true },
        sectionOrder: [...data.sectionOrder, action.id],
        mainSections: [...data.mainSections, action.id],
      };
    }

    case 'REMOVE_CUSTOM_SECTION': {
      const { [action.id]: _removed, ...restCustom } = data.customSections;
      const { [action.id]: _rName, ...restNames } = data.secNames;
      const { [action.id]: _rVis, ...restVis } = data.secVis;
      return {
        ...data,
        customSections: restCustom,
        secNames: restNames,
        secVis: restVis,
        sectionOrder: data.sectionOrder.filter(s => s !== action.id),
        mainSections: data.mainSections.filter(s => s !== action.id),
        sidebarSections: data.sidebarSections.filter(s => s !== action.id),
      };
    }

    case 'RESTORE_PREDEFINED_SECTION': {
      if (data.sectionOrder.includes(action.key)) return data;
      return {
        ...data,
        secVis: { ...data.secVis, [action.key]: true },
        sectionOrder: [...data.sectionOrder, action.key],
        mainSections: [...data.mainSections, action.key],
      };
    }

    // Education
    case 'ADD_EDUCATION':
      return { ...data, education: [...data.education, { id: generateId(), degree: '', school: '', dates: '', gpa: '' }] };
    case 'REMOVE_EDUCATION':
      return { ...data, education: data.education.filter((_, i) => i !== action.index) };
    case 'UPDATE_EDUCATION':
      return { ...data, education: data.education.map((e, i) => i === action.index ? { ...e, [action.field]: action.value } : e) };
    case 'REORDER_EDUCATION':
      return { ...data, education: reorder(data.education, action.fromIndex, action.toIndex) };

    // Experience
    case 'ADD_EXPERIENCE':
      return { ...data, experience: [...data.experience, { id: generateId(), role: '', company: '', dates: '', points: [''] }] };
    case 'REMOVE_EXPERIENCE':
      return { ...data, experience: data.experience.filter((_, i) => i !== action.index) };
    case 'UPDATE_EXPERIENCE':
      return { ...data, experience: data.experience.map((e, i) => i === action.index ? { ...e, [action.field]: action.value } : e) };
    case 'REORDER_EXPERIENCE':
      return { ...data, experience: reorder(data.experience, action.fromIndex, action.toIndex) };
    case 'ADD_EXP_POINT':
      return { ...data, experience: data.experience.map((e, i) => i === action.expIndex ? { ...e, points: [...e.points, ''] } : e) };
    case 'REMOVE_EXP_POINT':
      return { ...data, experience: data.experience.map((e, i) => i === action.expIndex ? { ...e, points: e.points.filter((_, pi) => pi !== action.pointIndex) } : e) };
    case 'UPDATE_EXP_POINT':
      return { ...data, experience: data.experience.map((e, i) => i === action.expIndex ? { ...e, points: e.points.map((p, pi) => pi === action.pointIndex ? action.value : p) } : e) };
    case 'REORDER_EXP_POINTS':
      return { ...data, experience: data.experience.map((e, i) => i === action.expIndex ? { ...e, points: reorder(e.points, action.fromIndex, action.toIndex) } : e) };

    // Projects
    case 'ADD_PROJECT':
      return { ...data, projects: [...data.projects, { id: generateId(), name: '', tech: '', dates: '', points: [''] }] };
    case 'REMOVE_PROJECT':
      return { ...data, projects: data.projects.filter((_, i) => i !== action.index) };
    case 'UPDATE_PROJECT':
      return { ...data, projects: data.projects.map((p, i) => i === action.index ? { ...p, [action.field]: action.value } : p) };
    case 'REORDER_PROJECTS':
      return { ...data, projects: reorder(data.projects, action.fromIndex, action.toIndex) };
    case 'ADD_PROJ_POINT':
      return { ...data, projects: data.projects.map((p, i) => i === action.projIndex ? { ...p, points: [...p.points, ''] } : p) };
    case 'REMOVE_PROJ_POINT':
      return { ...data, projects: data.projects.map((p, i) => i === action.projIndex ? { ...p, points: p.points.filter((_, pi) => pi !== action.pointIndex) } : p) };
    case 'UPDATE_PROJ_POINT':
      return { ...data, projects: data.projects.map((p, i) => i === action.projIndex ? { ...p, points: p.points.map((pt, pi) => pi === action.pointIndex ? action.value : pt) } : p) };
    case 'REORDER_PROJ_POINTS':
      return { ...data, projects: data.projects.map((p, i) => i === action.projIndex ? { ...p, points: reorder(p.points, action.fromIndex, action.toIndex) } : p) };

    // Skills
    case 'ADD_SKILL_GROUP':
      return { ...data, skillGroups: [...data.skillGroups, { id: generateId(), category: '', values: '' }] };
    case 'REMOVE_SKILL_GROUP':
      return { ...data, skillGroups: data.skillGroups.filter((_, i) => i !== action.index) };
    case 'UPDATE_SKILL_GROUP':
      return { ...data, skillGroups: data.skillGroups.map((s, i) => i === action.index ? { ...s, [action.field]: action.value } : s) };
    case 'REORDER_SKILLS':
      return { ...data, skillGroups: reorder(data.skillGroups, action.fromIndex, action.toIndex) };

    // Achievements
    case 'ADD_ACHIEVEMENT':
      return { ...data, achievements: [...data.achievements, ''] };
    case 'REMOVE_ACHIEVEMENT':
      return { ...data, achievements: data.achievements.filter((_, i) => i !== action.index) };
    case 'UPDATE_ACHIEVEMENT':
      return { ...data, achievements: data.achievements.map((a, i) => i === action.index ? action.value : a) };
    case 'REORDER_ACHIEVEMENTS':
      return { ...data, achievements: reorder(data.achievements, action.fromIndex, action.toIndex) };

    // Custom sections
    case 'SET_CUSTOM_SECTION_CONTENT':
      return { ...data, customSections: { ...data.customSections, [action.id]: { ...data.customSections[action.id], content: action.content } } };
    case 'SET_CUSTOM_SECTION_TYPE':
      return { ...data, customSections: { ...data.customSections, [action.id]: { ...data.customSections[action.id], type: action.secType } } };

    // Custom Contact Fields
    case 'ADD_CUSTOM_CONTACT':
      return {
        ...data,
        customContacts: [
          ...(data.customContacts || []),
          { id: generateId(), label: 'LeetCode', value: '' }
        ]
      };
    case 'REMOVE_CUSTOM_CONTACT':
      return {
        ...data,
        customContacts: (data.customContacts || []).filter(c => c.id !== action.id)
      };
    case 'UPDATE_CUSTOM_CONTACT':
      return {
        ...data,
        customContacts: (data.customContacts || []).map(c =>
          c.id === action.id ? { ...c, [action.field]: action.value } : c
        )
      };

    // Profile
    case 'LOAD_PROFILE': {
      const d = action.data as any;
      return {
        ...action.data,
        customContacts: action.data.customContacts || [],
        education: (d.education || []).map((e: any) => ({ 
          ...e, 
          id: e.id || generateId(),
          school: e.school || e.institution || '',
          dates: e.dates || e.duration || '',
          gpa: e.gpa || e.details || ''
        })),
        experience: (d.experience || []).map((e: any) => ({
          ...e,
          id: e.id || generateId(),
          dates: e.dates || e.duration || '',
          points: e.points || e.bullets || (e.details ? [e.details] : []),
          company: e.company + (e.location && !e.company?.includes(e.location) ? `, ${e.location}` : '')
        })),
        projects: (d.projects || []).map((p: any) => ({
          ...p,
          id: p.id || generateId(),
          dates: p.dates || p.duration || '',
          points: p.points || p.bullets || (p.details ? [p.details] : [])
        })),
        skillGroups: (d.skillGroups || []).map((sg: any) => ({
          ...sg,
          id: sg.id || generateId(),
          values: sg.values || sg.items || ''
        }))
      };
    }
    case 'RESET_PROFILE':
      return createDefaultResume();

    // Undo/Redo handled externally
    case 'UNDO':
    case 'REDO':
      return data;

    default:
      return data;
  }
}

function historyReducer(history: HistoryState, action: ResumeAction): HistoryState {
  if (action.type === 'UNDO') {
    if (history.past.length === 0) return history;
    const prev = history.past[history.past.length - 1];
    return {
      past: history.past.slice(0, -1),
      present: prev,
      future: [history.present, ...history.future].slice(0, MAX_HISTORY),
    };
  }

  if (action.type === 'REDO') {
    if (history.future.length === 0) return history;
    const next = history.future[0];
    return {
      past: [...history.past, history.present].slice(-MAX_HISTORY),
      present: next,
      future: history.future.slice(1),
    };
  }

  if (action.type === 'LOAD_PROFILE' || action.type === 'RESET_PROFILE') {
    const newPresent = resumeReducer(history.present, action);
    return { past: [], present: newPresent, future: [] };
  }

  const newPresent = resumeReducer(history.present, action);
  if (newPresent === history.present) return history;

  return {
    past: [...history.past, history.present].slice(-MAX_HISTORY),
    present: newPresent,
    future: [],
  };
}

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const username = user?.name || 'anonymous';
  const [history, dispatchHistory] = useReducer(historyReducer, {
    past: [],
    present: createDefaultResume(),
    future: [],
  });

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load last-edited profile on mount
  useEffect(() => {
    if (!username) return;
    const lastId = getLastEditedProfileId(username);
    if (lastId) {
      const loaded = loadProfile(username, lastId);
      if (loaded) {
        dispatchHistory({ type: 'LOAD_PROFILE', data: loaded });
        return;
      }
    }
    // If no profiles exist, create a default
    const profiles = getUserProfiles(username);
    if (profiles.length === 0) {
      const def = createDefaultResume();
      saveProfile(username, def);
      dispatchHistory({ type: 'LOAD_PROFILE', data: def });
    }
  }, [username]);

  // Auto-save with debounce
  useEffect(() => {
    if (!username) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveProfile(username, history.present);
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [history.present, username]);

  const saveNow = useCallback(() => {
    if (username) saveProfile(username, history.present);
  }, [username, history.present]);

  const loadProfileById = useCallback((id: string) => {
    if (!username) return;
    const loaded = loadProfile(username, id);
    if (loaded) dispatchHistory({ type: 'LOAD_PROFILE', data: loaded });
  }, [username]);

  const createNewProfile = useCallback((name?: string) => {
    if (!username) return;
    const def = createDefaultResume();
    if (name) def.profileName = name;
    saveProfile(username, def);
    dispatchHistory({ type: 'LOAD_PROFILE', data: def });
  }, [username]);

  const value = useMemo<ResumeContextValue>(() => ({
    state: history.present,
    dispatch: dispatchHistory,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    saveNow,
    loadProfileById,
    createNewProfile,
  }), [history, saveNow, loadProfileById, createNewProfile]);

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}

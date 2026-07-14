/* ===== Resume Builder Pro — Type Definitions ===== */

export interface Education {
  id: string;
  degree: string;
  school: string;
  dates: string;
  gpa: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  values: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  dates: string;
  points: string[];
}

export interface Project {
  id: string;
  name: string;
  tech: string;
  dates: string;
  points: string[];
  githubUrl?: string;
  liveUrl?: string;
  problemStatement?: string;
  proposedSolution?: string;
}

export interface CustomSection {
  type: 'text' | 'list' | 'keyvalue' | 'skills' | 'timeline' | 'simplelist';
  content: string;
}

export interface ResumeData {
  // Profile metadata
  profileId: string;
  profileName: string;
  lastEdited: number;

  // Template & Styling
  tpl: 1 | 2 | 3 | 4;
  pal: number;
  lineH: number;
  secSp: number;
  nameSize: number;
  titleSize: number;
  contactSize: number;
  headSize: number;
  bodySize: number;
  detailSize: number;
  educationDegreeSize: number;
  experienceRoleSize: number;
  experienceCompanySize: number;
  projectNameSize: number;
  techStackSize: number;
  skillMode: 'text' | 'pills' | 'bullets';
  photoShape: 'circle' | 'rounded' | 'square';
  photoPos: 'top-center' | 'top-left' | 'top-right' | 'sidebar' | 'hidden';
  photoSize: number;
  accentBar: 'none' | 'top';
  accentH: number;

  // Margins & Layout
  mT: number;
  mR: number;
  mB: number;
  mL: number;
  sbW: number;
  sbPad: number;
  mainPad: number;
  gmContact: boolean;

  // Section Management
  sectionOrder: string[];       // For T1 (Classic) — flat order
  sidebarSections: string[];    // For T2/T3 — sections in sidebar
  mainSections: string[];       // For T2/T3 — sections in main area
  secVis: Record<string, boolean>;
  secNames: Record<string, string>;

  // Personal Info
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  website: string;
  photo: string | null;
  summary: string;

  // Fonts & Colors
  hFont: string;
  bFont: string;
  hColor: string;
  tColor: string;
  bgColor: string;
  sidebarBg: string;
  sidebarText: string;
  leftBg: string;
  aColor: string;
  bulletType: 'disc' | 'circle' | 'square' | 'none';
  bulletSize: number;
  bulletColor: string;

  // Content Sections
  education: Education[];
  skillGroups: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  achievements: string[];
  customSections: Record<string, CustomSection>;
  customContacts?: CustomContact[];
}

export interface CustomContact {
  id: string;
  label: string;
  value: string;
}

export interface ProfileMeta {
  id: string;
  name: string;
  lastEdited: number;
  templateUsed: number;
}

export interface User {
  name: string;
  loginTime: number;
  profiles: string[];
}

/* ===== Reducer Action Types ===== */

export type ResumeAction =
  // Template & Styling
  | { type: 'SET_TEMPLATE'; tpl: 1 | 2 | 3 | 4 }
  | { type: 'SET_PALETTE'; pal: number }
  | { type: 'SET_FIELD'; field: keyof ResumeData; value: unknown }

  // Section Management
  | { type: 'REORDER_SECTIONS'; order: string[] }
  | { type: 'SET_ZONES'; sidebar: string[]; main: string[] }
  | { type: 'TOGGLE_SECTION_VIS'; key: string }
  | { type: 'RENAME_SECTION'; key: string; name: string }
  | { type: 'ADD_CUSTOM_SECTION'; id: string; name: string }
  | { type: 'REMOVE_CUSTOM_SECTION'; id: string }
  | { type: 'RESTORE_PREDEFINED_SECTION'; key: string }

  // Education
  | { type: 'ADD_EDUCATION' }
  | { type: 'REMOVE_EDUCATION'; index: number }
  | { type: 'UPDATE_EDUCATION'; index: number; field: keyof Education; value: string }
  | { type: 'REORDER_EDUCATION'; fromIndex: number; toIndex: number }

  // Experience
  | { type: 'ADD_EXPERIENCE' }
  | { type: 'REMOVE_EXPERIENCE'; index: number }
  | { type: 'UPDATE_EXPERIENCE'; index: number; field: keyof Experience; value: string }
  | { type: 'REORDER_EXPERIENCE'; fromIndex: number; toIndex: number }
  | { type: 'ADD_EXP_POINT'; expIndex: number }
  | { type: 'REMOVE_EXP_POINT'; expIndex: number; pointIndex: number }
  | { type: 'UPDATE_EXP_POINT'; expIndex: number; pointIndex: number; value: string }
  | { type: 'REORDER_EXP_POINTS'; expIndex: number; fromIndex: number; toIndex: number }

  // Projects
  | { type: 'ADD_PROJECT' }
  | { type: 'REMOVE_PROJECT'; index: number }
  | { type: 'UPDATE_PROJECT'; index: number; field: keyof Project; value: string }
  | { type: 'REORDER_PROJECTS'; fromIndex: number; toIndex: number }
  | { type: 'ADD_PROJ_POINT'; projIndex: number }
  | { type: 'REMOVE_PROJ_POINT'; projIndex: number; pointIndex: number }
  | { type: 'UPDATE_PROJ_POINT'; projIndex: number; pointIndex: number; value: string }
  | { type: 'REORDER_PROJ_POINTS'; projIndex: number; fromIndex: number; toIndex: number }

  // Skills
  | { type: 'ADD_SKILL_GROUP' }
  | { type: 'REMOVE_SKILL_GROUP'; index: number }
  | { type: 'UPDATE_SKILL_GROUP'; index: number; field: keyof SkillGroup; value: string }
  | { type: 'REORDER_SKILLS'; fromIndex: number; toIndex: number }

  // Achievements
  | { type: 'ADD_ACHIEVEMENT' }
  | { type: 'REMOVE_ACHIEVEMENT'; index: number }
  | { type: 'UPDATE_ACHIEVEMENT'; index: number; value: string }
  | { type: 'REORDER_ACHIEVEMENTS'; fromIndex: number; toIndex: number }

  // Custom Section Content
  | { type: 'SET_CUSTOM_SECTION_CONTENT'; id: string; content: string }
  | { type: 'SET_CUSTOM_SECTION_TYPE'; id: string; secType: 'text' | 'list' | 'keyvalue' | 'skills' | 'timeline' | 'simplelist' }

  // Custom Contact Fields
  | { type: 'ADD_CUSTOM_CONTACT' }
  | { type: 'REMOVE_CUSTOM_CONTACT'; id: string }
  | { type: 'UPDATE_CUSTOM_CONTACT'; id: string; field: 'label' | 'value'; value: string }

  // Profile
  | { type: 'LOAD_PROFILE'; data: ResumeData }
  | { type: 'RESET_PROFILE' }

  // Undo/Redo
  | { type: 'UNDO' }
  | { type: 'REDO' };

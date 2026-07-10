/* ===== Constants ===== */

/** A4 paper dimensions in pixels at 96 DPI */
export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

/** Default section keys */
export const DEFAULT_SECTIONS = ['summary', 'education', 'skills', 'experience', 'projects', 'achievements'] as const;

/** Default section names */
export const DEFAULT_SECTION_NAMES: Record<string, string> = {
  summary: 'Professional Summary',
  education: 'Education',
  skills: 'Technical Skills',
  experience: 'Internship Experience',
  projects: 'Key Projects',
  achievements: 'Conferences & Achievements',
};

/** Sections that can go in sidebar for T2/T3 */
export const SIDEBAR_ALLOWED_SECTIONS = ['skills', 'education', 'achievements'] as const;

/** Auto-save debounce delay (ms) */
export const AUTO_SAVE_DELAY = 3000;

/** Preview debounce delay (ms) */
export const PREVIEW_DEBOUNCE = 150;

/** Max undo/redo history steps */
export const MAX_HISTORY = 50;

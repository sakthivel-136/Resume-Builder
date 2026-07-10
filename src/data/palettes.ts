/* ===== Color Palettes per Template ===== */

export interface Palette {
  n: string;     // Name
  h: string;     // Heading color
  t: string;     // Text color
  bg: string;    // Background color
  sb?: string;   // Sidebar background (T2)
  st?: string;   // Sidebar text (T2)
  lf?: string;   // Left column bg (T3)
  a?: string;    // Accent color (T1)
}

export const PALETTES: Record<number, Palette[]> = {
  1: [
    { n: 'Navy Gold', h: '#122644', t: '#20262f', a: '#b6863c', bg: '#fff' },
    { n: 'Steel Blue', h: '#2c5282', t: '#2d3748', a: '#4299e1', bg: '#fff' },
    { n: 'Forest', h: '#276749', t: '#22543d', a: '#68d391', bg: '#fff' },
    { n: 'Wine Gold', h: '#742a2a', t: '#3d2525', a: '#d69e2e', bg: '#fff' },
    { n: 'Charcoal Bronze', h: '#2d3748', t: '#2d3748', a: '#b7791f', bg: '#fff' },
    { n: 'Emerald Corp', h: '#1b4d3e', t: '#2d3748', a: '#c5a880', bg: '#fff' },
  ],
  2: [
    { n: 'Navy', h: '#1e3a5f', t: '#1a202c', sb: '#122644', st: '#fff', bg: '#fff' },
    { n: 'Steel', h: '#2c5282', t: '#2d3748', sb: '#2a4365', st: '#ebf8ff', bg: '#fff' },
    { n: 'Teal', h: '#0d7377', t: '#1a202c', sb: '#0a5c5f', st: '#e6fffa', bg: '#fff' },
    { n: 'Forest', h: '#276749', t: '#22543d', sb: '#1a4731', st: '#f0fff4', bg: '#fff' },
    { n: 'Charcoal Gold', h: '#2d3748', t: '#2d3748', sb: '#2d3748', st: '#f7fafc', bg: '#fff' },
    { n: 'Emerald Corp', h: '#1b4d3e', t: '#2d3748', sb: '#163f33', st: '#f7fafc', bg: '#fff' },
  ],
  3: [
    { n: 'Blue', h: '#2b6cb0', t: '#2d3748', lf: '#ebf8ff', bg: '#fff' },
    { n: 'Teal', h: '#0d7377', t: '#1a202c', lf: '#e6fffa', bg: '#fff' },
    { n: 'Green', h: '#276749', t: '#22543d', lf: '#f0fff4', bg: '#fff' },
    { n: 'Slate', h: '#4a5568', t: '#2d3748', lf: '#edf2f7', bg: '#fff' },
    { n: 'Warm Corporate', h: '#2d3748', t: '#2d3748', lf: '#faf5eb', bg: '#fff' },
    { n: 'Emerald Soft', h: '#1b4d3e', t: '#2d3748', lf: '#e6f4ea', bg: '#fff' },
  ],
};

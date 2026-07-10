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
    { n: 'Midnight Obsidian', h: '#0f172a', t: '#334155', a: '#854d0e', bg: '#fff' },
    { n: 'Royal Amethyst', h: '#3b0764', t: '#1f2937', a: '#701a75', bg: '#fff' },
    { n: 'Cobalt Pro', h: '#1e3a8a', t: '#374151', a: '#3b82f6', bg: '#fff' },
    { n: 'Tech Violet', h: '#4c1d95', t: '#1e293b', a: '#8b5cf6', bg: '#fff' },
    { n: 'Premium Crimson', h: '#880d1e', t: '#2f3e46', a: '#dd2d4a', bg: '#fff' },
    { n: 'Nordic Teal', h: '#0f4c5c', t: '#2f3e46', a: '#fb8b24', bg: '#fff' },
  ],
  2: [
    { n: 'Navy', h: '#1e3a5f', t: '#1a202c', sb: '#122644', st: '#fff', bg: '#fff' },
    { n: 'Steel', h: '#2c5282', t: '#2d3748', sb: '#2a4365', st: '#ebf8ff', bg: '#fff' },
    { n: 'Teal', h: '#0d7377', t: '#1a202c', sb: '#0a5c5f', st: '#e6fffa', bg: '#fff' },
    { n: 'Forest', h: '#276749', t: '#22543d', sb: '#1a4731', st: '#f0fff4', bg: '#fff' },
    { n: 'Charcoal Gold', h: '#2d3748', t: '#2d3748', sb: '#2d3748', st: '#f7fafc', bg: '#fff' },
    { n: 'Emerald Corp', h: '#1b4d3e', t: '#2d3748', sb: '#163f33', st: '#f7fafc', bg: '#fff' },
    { n: 'Slate Amber', h: '#0f172a', t: '#1e293b', sb: '#0f172a', st: '#f8fafc', bg: '#fff' },
    { n: 'Royal Plum', h: '#3b0764', t: '#1f2937', sb: '#3b0764', st: '#fdf4ff', bg: '#fff' },
    { n: 'Cobalt Premium', h: '#1e3a8a', t: '#1f2937', sb: '#1e3a8a', st: '#eff6ff', bg: '#fff' },
    { n: 'Tech Dark', h: '#030712', t: '#1f2937', sb: '#111827', st: '#f9fafb', bg: '#fff' },
    { n: 'Espresso Velvet', h: '#3e2723', t: '#212121', sb: '#3e2723', st: '#efebe9', bg: '#fff' },
    { n: 'Wine Dark', h: '#5c0d12', t: '#212121', sb: '#5c0d12', st: '#fff5f5', bg: '#fff' },
  ],
  3: [
    { n: 'Blue', h: '#2b6cb0', t: '#2d3748', lf: '#ebf8ff', bg: '#fff' },
    { n: 'Teal', h: '#0d7377', t: '#1a202c', lf: '#e6fffa', bg: '#fff' },
    { n: 'Green', h: '#276749', t: '#22543d', lf: '#f0fff4', bg: '#fff' },
    { n: 'Slate', h: '#4a5568', t: '#2d3748', lf: '#edf2f7', bg: '#fff' },
    { n: 'Warm Corporate', h: '#2d3748', t: '#2d3748', lf: '#faf5eb', bg: '#fff' },
    { n: 'Emerald Soft', h: '#1b4d3e', t: '#2d3748', lf: '#e6f4ea', bg: '#fff' },
    { n: 'Midnight Slate', h: '#0f172a', t: '#334155', lf: '#f1f5f9', bg: '#fff' },
    { n: 'Amethyst Soft', h: '#3b0764', t: '#1f2937', lf: '#faf5ff', bg: '#fff' },
    { n: 'Cobalt Soft', h: '#1e3a8a', t: '#374151', lf: '#eff6ff', bg: '#fff' },
    { n: 'Tech Silver', h: '#18181b', t: '#27272a', lf: '#f4f4f5', bg: '#fff' },
    { n: 'Espresso Warm', h: '#4a2c2a', t: '#2d3748', lf: '#efebe9', bg: '#fff' },
    { n: 'Rose Soft', h: '#881337', t: '#27272a', lf: '#fff1f2', bg: '#fff' },
  ],
};

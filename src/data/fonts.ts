/* ===== Font Options ===== */

export interface FontOption {
  label: string;
  value: string;
}

export const HEADING_FONTS: FontOption[] = [
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Source Serif', value: "'Source Serif 4', serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Merriweather', value: "'Merriweather', serif" },
  { label: 'PT Serif', value: "'PT Serif', serif" },
  { label: 'Crimson Text', value: "'Crimson Text', serif" },
  { label: 'Libre Baskerville', value: "'Libre Baskerville', serif" },
  { label: 'Garamond', value: "Garamond, serif" },
  { label: 'Book Antiqua', value: "'Book Antiqua', Palatino, serif" },
  { label: 'Palatino', value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
  { label: 'Georgia', value: "Georgia, serif" },
  { label: 'Cambria', value: "Cambria, Georgia, serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', sans-serif" },
];

export const BODY_FONTS: FontOption[] = [
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Open Sans', value: "'Open Sans', sans-serif" },
  { label: 'Lora', value: "'Lora', serif" },
  { label: 'Georgia', value: "Georgia, serif" },
  { label: 'Cambria', value: "Cambria, Georgia, serif" },
  { label: 'PT Serif', value: "'PT Serif', serif" },
  { label: 'Crimson Text', value: "'Crimson Text', serif" },
  { label: 'Libre Baskerville', value: "'Libre Baskerville', serif" },
  { label: 'Garamond', value: "Garamond, serif" },
  { label: 'Palatino', value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
  { label: 'Book Antiqua', value: "'Book Antiqua', Palatino, serif" },
];

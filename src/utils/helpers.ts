/* ===== Utility Functions ===== */

/** Escape HTML special characters for safe rendering */
export function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/** Reorder array items (for drag-and-drop) */
export function reorder<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/** Move item between two arrays */
export function moveBetweenArrays(
  source: string[],
  dest: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; dest: string[] } {
  const sourceClone = Array.from(source);
  const destClone = Array.from(dest);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);
  return { source: sourceClone, dest: destClone };
}

/** Debounce function */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Format timestamp to relative time */
export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/** Get link href for contact detail strings */
export function getContactHref(val: string): string | null {
  const clean = val.trim();
  if (!clean) return null;
  
  // Email
  if (clean.includes('@') && !clean.includes(' ')) {
    return `mailto:${clean}`;
  }
  
  // Phone
  const isPhone = /^[+\d\s().-]{7,25}$/.test(clean);
  if (isPhone) {
    return `tel:${clean.replace(/[^\d+]/g, '')}`;
  }
  
  // URL pattern
  const isUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)\/?$/.test(clean) ||
                clean.includes('linkedin.com') ||
                clean.includes('github.com') ||
                clean.startsWith('http');
                
  if (isUrl) {
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }
    return `https://${clean}`;
  }
  
  return null;
}

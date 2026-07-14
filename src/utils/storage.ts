/* ===== Per-User localStorage Storage ===== */

import { ResumeData, ProfileMeta } from '@/types/resume';

const STORAGE_PREFIX = 'rbp';

export type ProfileSaveResult = 'saved' | 'saved_without_photo' | 'quota_exceeded' | 'storage_unavailable';

function isQuotaExceeded(error: unknown): boolean {
  return error instanceof DOMException && (
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  );
}

function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Get all registered usernames */
export function getAllUsers(): string[] {
  const users = readStoredJson<unknown>(`${STORAGE_PREFIX}_users`, []);
  return Array.isArray(users) ? users.filter((user): user is string => typeof user === 'string') : [];
}

/** Register a new user */
export function registerUser(name: string): void {
  const users = getAllUsers();
  const normalized = name.trim().toLowerCase();
  if (!users.includes(normalized)) {
    users.push(normalized);
    localStorage.setItem(`${STORAGE_PREFIX}_users`, JSON.stringify(users));
  }
}

/** Get the display name for a user */
export function getUserDisplayName(username: string): string {
  if (typeof window === 'undefined') return username;
  return localStorage.getItem(`${STORAGE_PREFIX}_user_${username}_displayName`) || username;
}

/** Set display name for a user */
export function setUserDisplayName(username: string, displayName: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}_user_${username}_displayName`, displayName);
}

/** Get all profile metadata for a user */
export function getUserProfiles(username: string): ProfileMeta[] {
  const profiles = readStoredJson<unknown>(`${STORAGE_PREFIX}_user_${username}_profiles`, []);
  return Array.isArray(profiles) ? profiles.filter((profile): profile is ProfileMeta =>
    typeof profile === 'object' && profile !== null &&
    typeof (profile as ProfileMeta).id === 'string' &&
    typeof (profile as ProfileMeta).name === 'string' &&
    typeof (profile as ProfileMeta).lastEdited === 'number' &&
    typeof (profile as ProfileMeta).templateUsed === 'number'
  ) : [];
}

/** Save profile metadata list */
function saveProfileMetas(username: string, profiles: ProfileMeta[]): void {
  localStorage.setItem(`${STORAGE_PREFIX}_user_${username}_profiles`, JSON.stringify(profiles));
}

/** Save a resume profile */
export function saveProfile(username: string, data: ResumeData): ProfileSaveResult {
  const profiles = getUserProfiles(username);
  const existingIdx = profiles.findIndex(p => p.id === data.profileId);
  
  const meta: ProfileMeta = {
    id: data.profileId,
    name: data.profileName,
    lastEdited: Date.now(),
    templateUsed: data.tpl,
  };

  if (existingIdx >= 0) {
    profiles[existingIdx] = meta;
  } else {
    profiles.push(meta);
  }

  const profileKey = `${STORAGE_PREFIX}_user_${username}_profile_${data.profileId}`;
  const updatedProfile = JSON.stringify({ ...data, lastEdited: Date.now() });

  try {
    localStorage.setItem(profileKey, updatedProfile);
    saveProfileMetas(username, profiles);
    return 'saved';
  } catch (error) {
    if (!isQuotaExceeded(error)) return 'storage_unavailable';
  }

  // Large photos are the usual cause of localStorage quota errors. Preserve every
  // text edit and layout setting by retrying without the photo rather than crashing.
  if (data.photo) {
    try {
      localStorage.setItem(profileKey, JSON.stringify({ ...data, photo: null, lastEdited: Date.now() }));
      saveProfileMetas(username, profiles);
      return 'saved_without_photo';
    } catch (error) {
      if (!isQuotaExceeded(error)) return 'storage_unavailable';
    }
  }

  return 'quota_exceeded';
}

/** Load a resume profile */
export function loadProfile(username: string, profileId: string): ResumeData | null {
  return readStoredJson<ResumeData | null>(`${STORAGE_PREFIX}_user_${username}_profile_${profileId}`, null);
}

/** Delete a resume profile */
export function deleteProfile(username: string, profileId: string): void {
  const profiles = getUserProfiles(username).filter(p => p.id !== profileId);
  saveProfileMetas(username, profiles);
  localStorage.removeItem(`${STORAGE_PREFIX}_user_${username}_profile_${profileId}`);
}

/** Get last edited profile ID for a user */
export function getLastEditedProfileId(username: string): string | null {
  const profiles = getUserProfiles(username);
  if (profiles.length === 0) return null;
  profiles.sort((a, b) => b.lastEdited - a.lastEdited);
  return profiles[0].id;
}

/** Get/set current session user */
export function getSessionUser(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(`${STORAGE_PREFIX}_currentUser`);
}

export function setSessionUser(username: string): void {
  sessionStorage.setItem(`${STORAGE_PREFIX}_currentUser`, username);
}

export function clearSession(): void {
  sessionStorage.removeItem(`${STORAGE_PREFIX}_currentUser`);
}

/** Export resume data as JSON string */
export function exportResumeJSON(data: ResumeData): string {
  return JSON.stringify(data, null, 2);
}

/** Import resume data from JSON string */
export function importResumeJSON(jsonStr: string): ResumeData | null {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || data.name === undefined || data.tpl === undefined) {
      return null;
    }

    const standardKeys = new Set([
      'profileId', 'profileName', 'lastEdited', 'tpl', 'pal', 'lineH', 'secSp',
      'nameSize', 'titleSize', 'contactSize', 'headSize', 'bodySize', 'detailSize',
      'educationDegreeSize', 'experienceRoleSize', 'experienceCompanySize',
      'projectNameSize', 'techStackSize', 'skillMode', 'photoShape', 'photoPos',
      'photoSize', 'accentBar', 'accentH', 'mT', 'mR', 'mB', 'mL', 'sbW', 'sbPad',
      'mainPad', 'gmContact', 'sectionOrder', 'sidebarSections', 'mainSections',
      'secVis', 'secNames', 'name', 'title', 'phone', 'email', 'linkedin',
      'github', 'website', 'photo', 'summary', 'education', 'skillGroups',
      'experience', 'projects', 'achievements', 'customSections', 'customContacts',
      'hFont', 'bFont', 'hColor', 'tColor', 'bgColor', 'sidebarBg', 'sidebarText',
      'leftBg', 'aColor', 'bulletType', 'bulletSize', 'bulletColor'
    ]);

    // Ensure customSections and management fields exist
    if (!data.customSections) data.customSections = {};
    if (!data.secVis) data.secVis = {};
    if (!data.secNames) data.secNames = {};
    if (!data.sectionOrder) data.sectionOrder = [];
    if (!data.mainSections) data.mainSections = [];

    // Detect and parse any non-standard root level keys
    Object.keys(data).forEach((key) => {
      if (!standardKeys.has(key)) {
        const val: unknown = data[key];
        if (val === null || val === undefined) return;

        const customId = key.startsWith('custom_') ? key : `custom_${key}`;
        let type: 'text' | 'list' = 'text';
        let content = '';

        if (Array.isArray(val)) {
          type = 'list';
          content = val
            .map((item: unknown) => (typeof item === 'string' ? item : JSON.stringify(item)))
            .join('\n');
        } else if (typeof val === 'object') {
          content = JSON.stringify(val, null, 2);
        } else {
          content = String(val);
        }

        // Save custom section content
        data.customSections[customId] = { type, content };

        // Generate a readable section header name
        const readableName = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());

        data.secNames[customId] = readableName;
        data.secVis[customId] = true;

        // Push to ordering list maps
        if (!data.sectionOrder.includes(customId)) {
          data.sectionOrder.push(customId);
        }
        if (!data.mainSections.includes(customId)) {
          data.mainSections.push(customId);
        }
      }
    });

    return data as ResumeData;
  } catch {
    return null;
  }
}

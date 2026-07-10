/* ===== Per-User localStorage Storage ===== */

import { ResumeData, ProfileMeta } from '@/types/resume';

const STORAGE_PREFIX = 'rbp';

/** Get all registered usernames */
export function getAllUsers(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`${STORAGE_PREFIX}_users`);
  return raw ? JSON.parse(raw) : [];
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
  const raw = localStorage.getItem(`${STORAGE_PREFIX}_user_${username}_displayName`);
  return raw || username;
}

/** Set display name for a user */
export function setUserDisplayName(username: string, displayName: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}_user_${username}_displayName`, displayName);
}

/** Get all profile metadata for a user */
export function getUserProfiles(username: string): ProfileMeta[] {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}_user_${username}_profiles`);
  return raw ? JSON.parse(raw) : [];
}

/** Save profile metadata list */
function saveProfileMetas(username: string, profiles: ProfileMeta[]): void {
  localStorage.setItem(`${STORAGE_PREFIX}_user_${username}_profiles`, JSON.stringify(profiles));
}

/** Save a resume profile */
export function saveProfile(username: string, data: ResumeData): void {
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

  saveProfileMetas(username, profiles);
  localStorage.setItem(
    `${STORAGE_PREFIX}_user_${username}_profile_${data.profileId}`,
    JSON.stringify({ ...data, lastEdited: Date.now() })
  );
}

/** Load a resume profile */
export function loadProfile(username: string, profileId: string): ResumeData | null {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}_user_${username}_profile_${profileId}`);
  return raw ? JSON.parse(raw) : null;
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
    if (data && data.name !== undefined && data.tpl !== undefined) {
      return data as ResumeData;
    }
    return null;
  } catch {
    return null;
  }
}

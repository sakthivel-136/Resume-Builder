'use client';

import { useMemo } from 'react';
import type { ResumeData } from '@/types/resume';
import { calculateATS, type ATSResult } from '@/utils/ats';
import { useDebounce } from './useDebounce';

const EMPTY_RESULT: ATSResult = {
  score: 0,
  keywords: [],
  topDomain: '',
};

/**
 * Computes ATS compatibility score with 300ms debounce.
 * Accepts resume data and an optional job description string.
 */
export function useATSScore(data: ResumeData, jobDescription?: string): ATSResult {
  // Create a lightweight fingerprint of the data to debounce on
  const fingerprint = useMemo(() => {
    return JSON.stringify({
      name: data.name,
      title: data.title,
      summary: data.summary,
      skills: data.skillGroups,
      experience: data.experience,
      projects: data.projects,
      education: data.education,
      achievements: data.achievements,
      customSections: data.customSections,
      jd: jobDescription ?? '',
    });
  }, [data, jobDescription]);

  const debouncedFingerprint = useDebounce(fingerprint, 300);

  const result = useMemo<ATSResult>(() => {
    // Only compute when fingerprint stabilises
    try {
      return calculateATS(data, jobDescription);
    } catch {
      return EMPTY_RESULT;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFingerprint]);

  return result;
}

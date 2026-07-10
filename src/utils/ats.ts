/* ===== ATS Score Calculation ===== */

import { ResumeData } from '@/types/resume';
import { DOMAIN_KEYWORDS } from '@/data/keywords';

export interface ATSKeyword {
  text: string;
  hit: boolean;
}

export interface ATSResult {
  score: number;
  keywords: ATSKeyword[];
  topDomain: string;
}

/** Extract all text content from resume data */
function extractText(data: ResumeData): string {
  const parts: string[] = [];

  parts.push(data.name, data.title, data.summary);
  parts.push(data.phone, data.email, data.linkedin, data.github, data.website);

  data.education.forEach(e => {
    parts.push(e.degree, e.school, e.dates, e.gpa);
  });

  data.skillGroups.forEach(s => {
    parts.push(s.category, s.values);
  });

  data.experience.forEach(x => {
    parts.push(x.role, x.company, x.dates);
    x.points.forEach(p => parts.push(p));
  });

  data.projects.forEach(p => {
    parts.push(p.name, p.tech, p.dates);
    p.points.forEach(pt => parts.push(pt));
  });

  data.achievements.forEach(a => parts.push(a));

  Object.values(data.customSections).forEach(cs => {
    parts.push(cs.content);
  });

  return parts.join(' ').toLowerCase();
}

/** Calculate ATS compatibility score */
export function calculateATS(data: ResumeData, jobDescription?: string): ATSResult {
  const resumeText = extractText(data);
  const matchText = jobDescription ? jobDescription.toLowerCase() : resumeText;

  // Find best matching domain
  let bestDomain = '';
  let bestCount = 0;
  const allKeywords: ATSKeyword[] = [];

  Object.entries(DOMAIN_KEYWORDS).forEach(([domain, keywords]) => {
    let domainHits = 0;
    keywords.forEach(kw => {
      const hit = resumeText.includes(kw.toLowerCase());
      if (hit) domainHits++;
    });
    if (domainHits > bestCount) {
      bestCount = domainHits;
      bestDomain = domain;
    }
  });

  // If we have a job description, match against it
  if (jobDescription) {
    const jdLower = jobDescription.toLowerCase();
    // Extract unique words from JD
    const jdWords = new Set(
      jdLower
        .replace(/[^\w\s/.-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2)
    );

    // Check all domain keywords that appear in the JD
    Object.values(DOMAIN_KEYWORDS).forEach(keywords => {
      keywords.forEach(kw => {
        if (jdLower.includes(kw)) {
          const hit = resumeText.includes(kw);
          // Avoid duplicates
          if (!allKeywords.find(k => k.text === kw)) {
            allKeywords.push({ text: kw, hit });
          }
        }
      });
    });

    // Also check individual JD words against resume
    jdWords.forEach(word => {
      if (!allKeywords.find(k => k.text === word)) {
        const hit = resumeText.includes(word);
        // Only add meaningful keywords
        const isKeyword = Object.values(DOMAIN_KEYWORDS).some(kws =>
          kws.some(kw => kw.includes(word) || word.includes(kw))
        );
        if (isKeyword) {
          allKeywords.push({ text: word, hit });
        }
      }
    });
  } else {
    // Use the best-matching domain's keywords
    if (bestDomain && DOMAIN_KEYWORDS[bestDomain]) {
      DOMAIN_KEYWORDS[bestDomain].forEach(kw => {
        allKeywords.push({
          text: kw,
          hit: resumeText.includes(kw.toLowerCase()),
        });
      });
    }
  }

  // Calculate score
  const hitCount = allKeywords.filter(k => k.hit).length;
  const total = allKeywords.length || 1;
  const score = Math.round((hitCount / total) * 100);

  return {
    score: Math.min(score, 100),
    keywords: allKeywords.sort((a, b) => (b.hit ? 1 : 0) - (a.hit ? 1 : 0)),
    topDomain: bestDomain,
  };
}

import { ResumeData } from '@/types/resume';
import { generateId } from '@/utils/helpers';

export function createDefaultResume(): ResumeData {
  return {
    profileId: generateId(),
    profileName: 'My Resume',
    lastEdited: Date.now(),

    tpl: 1,
    pal: 0,
    lineH: 1.35,
    secSp: 12,
    nameSize: 24,
    headSize: 11,
    bodySize: 11.5,
    skillMode: 'text',
    photoShape: 'circle',
    photoPos: 'top-center',
    photoSize: 72,
    accentBar: 'none',
    accentH: 4,

    mT: 32,
    mR: 42,
    mB: 32,
    mL: 42,
    sbW: 200,
    sbPad: 16,
    mainPad: 22,
    gmContact: true,

    sectionOrder: ['summary', 'education', 'skills', 'experience', 'projects', 'achievements'],
    sidebarSections: ['skills'],
    mainSections: ['summary', 'education', 'experience', 'projects', 'achievements'],
    secVis: {
      summary: true,
      education: true,
      skills: true,
      experience: true,
      projects: true,
      achievements: true,
    },
    secNames: {
      summary: 'Professional Summary',
      education: 'Education',
      skills: 'Technical Skills',
      experience: 'Internship Experience',
      projects: 'Key Projects',
      achievements: 'Conferences & Achievements',
    },

    name: '',
    title: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    website: '',
    photo: null,
    summary: '',

    hFont: "'Source Serif 4', serif",
    bFont: "'Inter', sans-serif",
    hColor: '#122644',
    tColor: '#20262f',
    bgColor: '#ffffff',
    sidebarBg: '#122644',
    sidebarText: '#ffffff',
    leftBg: '#f0f4f8',
    aColor: '#b6863c',
    bulletType: 'disc',
    bulletSize: 8,
    bulletColor: '#b6863c',

    education: [
      {
        id: generateId(),
        degree: '',
        school: '',
        dates: '',
        gpa: '',
      },
    ],
    skillGroups: [
      {
        id: generateId(),
        category: '',
        values: '',
      },
    ],
    experience: [],
    projects: [],
    achievements: [],
    customSections: {},
    customContacts: [],
  };
}

/** Sample pre-filled resume for demo purposes */
export const SAMPLE_RESUME_DATA = {
  education: [
    {
      id: 's-edu-1',
      degree: 'Bachelor of Engineering in Computer Science',
      school: 'Kamaraj College of Engineering and Technology, Virudhunagar, India',
      dates: '2023 – 2027',
      gpa: 'GPA: 7.44 (till 5th sem)',
    },
  ],
  skillGroups: [
    { id: 's-sk-1', category: 'Languages & Frameworks', values: 'Python, SQL, FastAPI, Flask, Next.js 14, PostgreSQL, Supabase, Tailwind CSS, RESTful APIs, JWT, Flutter' },
    { id: 's-sk-2', category: 'Tools & Access Control', values: 'Git, GitHub, RBAC' },
    { id: 's-sk-3', category: 'Machine Learning', values: 'TensorFlow, XGBoost, Random Forest, Gemini 1.5 Pro' },
    { id: 's-sk-4', category: 'IoT & Protocols', values: 'ESP32/Arduino, MQTT' },
  ],
  experience: [
    {
      id: 's-exp-1',
      role: 'Software Developer Intern',
      company: 'PENTAGON GARMENTS, Virudhunagar, India',
      dates: 'Dec 2025 – Jun 2026',
      points: [
        'Developed a secure verification system with RESTful APIs and JWT authentication for real-time security monitoring.',
        'Independently built and deployed the DigiSphere system into production for the company, currently in active daily use by their security staff.',
        'Received a certification from Pentagon Garments for successful completion and real-world deployment of the project.',
      ],
    },
    {
      id: 's-exp-2',
      role: 'Machine Learning Intern',
      company: 'PANITH INNOVATIONS, Remote',
      dates: 'June 2025 – Nov 2025',
      points: [
        'Developed and deployed predictive Machine Learning models using XGBoost and Random Forest to enhance system accuracy and project performance.',
      ],
    },
  ],
  projects: [
    {
      id: 's-prj-1',
      name: 'DigiSphere',
      tech: 'FastAPI, Next.js, PostgreSQL, JWT',
      dates: 'July 2026',
      points: [
        'Architected a full-stack verification system with Role-Based Access Control (RBAC) and real-time monitoring.',
        'Optimized database queries reducing response time by 40% for high-concurrency environments.',
        'Deployed and hosted the system in production for Pentagon Garments; actively used by the company for real-world security monitoring.',
        'Awarded a certification by Pentagon Garments for successful project completion and live deployment.',
      ],
    },
    {
      id: 's-prj-2',
      name: 'KURAL – AI Voice-Based Grievance Redressal System',
      tech: 'Gemini 1.5 Pro, PSTN',
      dates: 'Oct 2025 – Present',
      points: [
        'Engineering a PSTN-based platform using Gemini 1.5 Pro to convert offline voice calls into structured digital reports.',
        'Implementing speech recognition and automated intent detection to classify and escalate grievances to authorities.',
      ],
    },
    {
      id: 's-prj-3',
      name: 'IoT Smart Air Quality & Climate Monitoring System',
      tech: 'ESP32, Random Forest',
      dates: 'Nov 2025',
      points: [
        'Developed a predictive alert system using Random Forest to detect health risks and HVAC inefficiencies.',
        'Presented research findings at the ICASET-2026 International Conference in Chennai.',
      ],
    },
  ],
  achievements: [
    'Grand Winner – Student Pitch Competition at Mini Technovision 2K26.',
    'Presenter – Presented research on IoT-integrated Air Quality Systems in ICASET - 2026.',
    'Patent Filed – Intellectual Property application filed for "Mr. Strict" (AI Proctoring System).',
    'ISRO Certification – Completed AIML training for Crop Acreage Mapping via official ISRO workshop.',
    'Industry Certification – Certified by Pentagon Garments for developing and deploying the DigiSphere system into the real-world production use.',
  ],
};

export function createSampleResume(): ResumeData {
  const base = createDefaultResume();
  return {
    ...base,
    profileId: 'sample-profile',
    profileName: 'Sample Resume',
    name: '',
    title: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
    education: [
      { id: generateId(), degree: '', school: '', dates: '', gpa: '' }
    ],
    skillGroups: [
      { id: generateId(), category: '', values: '' }
    ],
    experience: [
      { id: generateId(), role: '', company: '', dates: '', points: [''] }
    ],
    projects: [
      { id: generateId(), name: '', tech: '', dates: '', points: [''] }
    ],
    achievements: [''],
  };
}

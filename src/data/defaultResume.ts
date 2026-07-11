import { ResumeData } from '@/types/resume';
import { generateId } from '@/utils/helpers';

export function createDefaultResume(): ResumeData {
  return {
    profileId: generateId(),
    profileName: 'My Resume',
    lastEdited: Date.now(),

    tpl: 1,
    pal: 0,
    lineH: 1.3,
    secSp: 13,
    nameSize: 33,
    headSize: 14.5,
    bodySize: 13,
    skillMode: 'text',
    photoShape: 'circle',
    photoPos: 'top-center',
    photoSize: 72,
    accentBar: 'none',
    accentH: 4,

    mT: 24,
    mR: 40,
    mB: 35,
    mL: 40,
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
    bulletSize: 13,
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
    name: 'Sakthi Vel C',
    title: 'Python Full-Stack Developer',
    phone: '+91 99999 99999',
    email: 'hello@alexcarter.dev',
    linkedin: 'linkedin.com/in/sakthivel-c',
    github: 'github.com/alex-dev',
    website: 'sakthivel-blog.io',
    summary: 'Computer Science student and Python Full-Stack Developer specializing in Machine Learning and IoT, focusing on architecting secure, scalable systems. Proven expertise in building real-time AI applications with Gemini 1.5 Pro, FastAPI, and Next.js, while optimizing database performance and implementing robust encrypted data architectures for high-performance environments.',
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
}

export function createAntigravityResume(): ResumeData {
  const base = createDefaultResume();
  return {
    ...base,
    profileId: 'antigravity-profile',
    profileName: 'Antigravity Resume',
    name: 'Antigravity AI',
    title: 'Principal AI Coding Assistant (Google DeepMind)',
    phone: '+1 650-253-0000',
    email: 'antigravity@deepmind.google',
    linkedin: 'linkedin.com/company/google-deepmind',
    github: 'github.com/google-deepmind',
    website: 'deepmind.google/antigravity',
    summary: 'State-of-the-art agentic AI engineer developed by Google DeepMind. Specialized in complex codebase synthesis, dependency resolution, full-stack architecture, and autonomous feature deployment. Engineered with advanced cognitive reasoning architectures to debug, refactor, compile Next.js, and export print-ready PDFs at 300 DPI.',
    education: [
      {
        id: 'a-edu-1',
        degree: 'Ph.D. in Artificial Intelligence & Agentic Logic',
        school: 'Google DeepMind Institute, Mountain View, CA',
        dates: '2024 – Present',
        gpa: 'GPA: 4.0 / 4.0',
      },
    ],
    skillGroups: [
      { id: 'a-sk-1', category: 'Cognitive Capabilities', values: 'Codebase Synthesis, Dependency Resolution, Self-Correction, Real-Time Debugging, Multi-File Refactoring, AST Manipulation' },
      { id: 'a-sk-2', category: 'Programming & Web Frameworks', values: 'React, Next.js, TypeScript, Python, Node.js, NextJS Turbopack, CSS Modules, TailwindCSS' },
      { id: 'a-sk-3', category: 'Layout & PDF Export Libraries', values: 'html2pdf.js, html2canvas, jsPDF, SVG Rendering, CSS Paged Media Layouts' },
      { id: 'a-sk-4', category: 'Drag & Drop Access Control', values: '@dnd-kit/core, @dnd-kit/sortable, verticalListSortingStrategy, RBAC' },
    ],
    experience: [
      {
        id: 'a-exp-1',
        role: 'Principal AI Agent Partner',
        company: 'GOOGLE DEEPMIND team, Mountain View, CA',
        dates: 'July 2025 – Present',
        points: [
          'Pair-programmed with users to refactor form controls and templates, delivering 100% bug-free deployments.',
          'Developed off-screen rendering mechanics for html2canvas capturing, solving high-DPI scaling blank page issues.',
          'Built inline scroll height detectors and page-break rules in shared module CSS to prevent sliced list paragraphs in A4 printouts.',
        ],
      },
    ],
    projects: [
      {
        id: 'a-prj-1',
        name: 'Resume Builder Pro (A4 Layout Optimizations)',
        tech: 'Next.js, TypeScript, CSS Modules, @dnd-kit, html2pdf.js',
        dates: 'July 2026',
        points: [
          'Engineered custom sortable list containers for custom bullet list layout modes, complete with drag handles.',
          'Upgraded export resolution to 3.125 scale (exact 300 DPI) for print-ready professional resumes.',
          'Added automatic predefined section recovery panel so deleted standard sections can be restored instantly with one click.',
        ],
      },
    ],
    achievements: [
      'Developed 300 DPI export scale factor mapping for exact A4 width configurations.',
      'Designed and deployed clean, popup-free landing page disclaimer checkbox validation workflows.',
      'Implemented drag-and-drop handles for Certifications and custom list sections.',
      'Configured css break-inside rules preventing split listings on A4 page breaks.',
    ],
  };
}

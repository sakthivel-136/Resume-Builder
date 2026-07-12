import { ResumeData } from '@/types/resume';

export function importFromJson(text: string): ResumeData {
  const data = JSON.parse(text);
  if (!data.name && !data.email) {
    throw new Error('Invalid resume JSON structure');
  }
  return data;
}

export function importFromLatex(text: string, currentState: ResumeData): ResumeData {
  const data: ResumeData = { ...currentState };
  
  const unsanitize = (str: string) => {
    if (!str) return '';
    return str
      .trim()
      .replace(/\\&/g, '&')
      .replace(/\\%/g, '%')
      .replace(/\\\$/g, '$')
      .replace(/\\#/g, '#')
      .replace(/\\_/g, '_')
      .replace(/\\{/g, '{')
      .replace(/\\}/g, '}')
      .replace(/\\textasciitilde/g, '~')
      .replace(/\\textasciicircum/g, '^')
      .replace(/\\\\/g, '\\');
  };

  const unsanitizeText = (str: string) => {
    const withNewlines = str.replace(/\s*\\\\\s*/g, '\n');
    return unsanitize(withNewlines);
  };

  // 1. Parse Personal Info (from header)
  const personalBlockMatch = text.match(/%===PERSONAL_INFO===([\s\S]*?)(?=%===|$)/);
  if (personalBlockMatch) {
    const block = personalBlockMatch[1];
    
    const nameMatch = block.match(/\\textbf\{\\Huge\\scshape\s*([^\}]+)\}/) || 
                      block.match(/\\textbf\{\\Huge\s*\\scshape\s*([^\}]+)\}/);
    if (nameMatch) data.name = unsanitize(nameMatch[1]);

    const titleMatch = block.match(/\\small\s*([^\\]+)\s*\\\\/);
    if (titleMatch) data.title = unsanitize(titleMatch[1]);

    const linksMatch = block.match(/\\small\s*[\s\S]*?\\\\([\s\S]*?)(?=\\end{center}|$)/);
    if (linksMatch) {
      const linksLine = linksMatch[1];
      const links = linksLine.split('\\textbar{}').map(l => l.trim());
      
      data.phone = '';
      data.email = '';
      data.linkedin = '';
      data.github = '';
      data.website = '';
      data.customContacts = [];
      
      links.forEach(linkText => {
        const hrefMatch = linkText.match(/\\href\{([^\}]+)\}\{([^\}]+)\}/);
        if (hrefMatch) {
          const href = hrefMatch[1];
          const label = unsanitize(hrefMatch[2]);
          
          if (href.startsWith('tel:')) {
            data.phone = label;
          } else if (href.startsWith('mailto:')) {
            data.email = label;
          } else if (href.includes('linkedin.com')) {
            data.linkedin = href;
          } else if (href.includes('github.com')) {
            data.github = href;
          } else if (label.toLowerCase() === 'website' || href.includes('http')) {
            const lowerLabel = label.toLowerCase();
            if (lowerLabel === 'website') {
              data.website = href;
            } else {
              data.customContacts = data.customContacts || [];
              data.customContacts.push({
                id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                label: label,
                value: href
              });
            }
          }
        }
      });
    }
  }

  // 2. Parse Summary
  const summaryMatch = text.match(/%===SUMMARY===[\s\S]*?\\section\{[^\}]*\}\s*([\s\S]*?)(?=%===|$)/);
  if (summaryMatch) {
    data.summary = unsanitizeText(summaryMatch[1]);
  }

  // 3. Parse Education
  const eduMatch = text.match(/%===EDUCATION===([\s\S]*?)(?=%===|$)/);
  if (eduMatch) {
    const block = eduMatch[1];
    const eduList: any[] = [];
    const eduRegex = /\\resumeSubheading\s*\{([^\}]+)\}\s*\{([^\}]+)\}\s*\{([^\}]+)\}\s*\{([^\}]*)\}/g;
    let m;
    while ((m = eduRegex.exec(block)) !== null) {
      eduList.push({
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        school: unsanitize(m[1]),
        dates: unsanitize(m[2]),
        degree: unsanitize(m[3]),
        gpa: unsanitize(m[4])
      });
    }
    if (eduList.length > 0) data.education = eduList;
  }

  // 4. Parse Experience
  const expMatch = text.match(/%===EXPERIENCE===([\s\S]*?)(?=%===|$)/);
  if (expMatch) {
    const block = expMatch[1];
    const expList: any[] = [];
    const subheadings = block.split(/\\resumeSubheading/);
    subheadings.slice(1).forEach(subBlock => {
      const fullSubBlock = '\\resumeSubheading' + subBlock;
      const subheaderRegex = /\\resumeSubheading\s*\{([^\}]+)\}\s*\{([^\}]+)\}\s*\{([^\}]+)\}\s*\{([^\}]*)\}/;
      const m = fullSubBlock.match(subheaderRegex);
      if (m) {
        const company = unsanitize(m[1]);
        const dates = unsanitize(m[2]);
        const role = unsanitize(m[3]);
        
        const points: string[] = [];
        const pointRegex = /\\resumeItem\s*\{([\s\S]*?)\}/g;
        let pm;
        while ((pm = pointRegex.exec(subBlock)) !== null) {
          points.push(unsanitizeText(pm[1]));
        }

        expList.push({
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          company,
          dates,
          role,
          points: points.length > 0 ? points : ['']
        });
      }
    });
    if (expList.length > 0) data.experience = expList;
  }

  // 5. Parse Projects
  const projMatch = text.match(/%===PROJECTS===([\s\S]*?)(?=%===|$)/);
  if (projMatch) {
    const block = projMatch[1];
    const projList: any[] = [];
    const subheadings = block.split(/\\resumeProjectHeading/);
    subheadings.slice(1).forEach(subBlock => {
      const fullSubBlock = '\\resumeProjectHeading' + subBlock;
      const subheaderRegex = /\\resumeProjectHeading\s*\{([^\}]+)\}\s*\{([^\}]+)\}\s*\{([^\}]+)\}\s*\{(\\resumeProjectLinks\s*\{([^\}]*)\}\s*\{([^\}]*)\}|)\}/;
      const m = fullSubBlock.match(subheaderRegex);
      if (m) {
        const name = unsanitize(m[1]);
        const tech = unsanitize(m[2]);
        const dates = unsanitize(m[3]);
        const githubUrl = m[5] ? unsanitize(m[5]) : '';
        const liveUrl = m[6] ? unsanitize(m[6]) : '';

        let problemStatement = '';
        let proposedSolution = '';
        const probMatch = subBlock.match(/\\resumeProjectProblem\s*\{([\s\S]*?)\}/);
        if (probMatch) problemStatement = unsanitizeText(probMatch[1]);
        const solMatch = subBlock.match(/\\resumeProjectSolution\s*\{([\s\S]*?)\}/);
        if (solMatch) proposedSolution = unsanitizeText(solMatch[1]);

        const points: string[] = [];
        const pointRegex = /\\resumeItem\s*\{([\s\S]*?)\}/g;
        let pm;
        while ((pm = pointRegex.exec(subBlock)) !== null) {
          points.push(unsanitizeText(pm[1]));
        }

        projList.push({
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          name,
          tech,
          dates,
          githubUrl,
          liveUrl,
          problemStatement,
          proposedSolution,
          points: points.length > 0 ? points : ['']
        });
      }
    });
    if (projList.length > 0) data.projects = projList;
  }

  // 6. Parse Skills
  const skillsMatch = text.match(/%===SKILLS===([\s\S]*?)(?=%===|$)/);
  if (skillsMatch) {
    const block = skillsMatch[1];
    const skillGroups: any[] = [];
    const skillLineRegex = /\\textbf\s*\{([^\}]+)\}\s*:\s*\{([^\}]+)\}/g;
    let m;
    while ((m = skillLineRegex.exec(block)) !== null) {
      skillGroups.push({
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        category: unsanitize(m[1]),
        values: unsanitize(m[2])
      });
    }
    if (skillGroups.length > 0) data.skillGroups = skillGroups;
  }

  // 7. Parse Custom Sections
  const customSectionRegex = /%===CUSTOM_SECTION:(custom_[a-zA-Z0-9_]+)===\s*\\section\{([^\}]+)\}\s*([\s\S]*?)(?=%===|\\end\{document\}|$)/g;
  let cm;
  data.customSections = { ...data.customSections };
  
  while ((cm = customSectionRegex.exec(text)) !== null) {
    const secId = cm[1];
    const secTitle = unsanitize(cm[2]);
    const block = cm[3];

    const startMatch = block.match(/\\resumeCustomSectionStart\s*\{[^\}]*\}\s*\{([^\}]+)\}/);
    const type = startMatch ? (startMatch[1].trim() as any) : 'text';

    let content = '';
    if (type === 'list' || type === 'simplelist') {
      const items: string[] = [];
      const pointRegex = /\\resumeItem\s*\{([\s\S]*?)\}/g;
      let pm;
      while ((pm = pointRegex.exec(block)) !== null) {
        items.push(unsanitizeText(pm[1]));
      }
      content = items.join('\n');
    } else {
      let cleanBlock = block
        .replace(/\\resumeCustomSectionStart\s*\{[^\}]*\}\s*\{[^\}]*\}/g, '')
        .replace(/\\resumeCustomSectionEnd/g, '')
        .trim();
      content = unsanitizeText(cleanBlock);
    }

    data.customSections[secId] = {
      type,
      content
    };

    data.secNames = { ...data.secNames, [secId]: secTitle };
    data.secVis = { ...data.secVis, [secId]: true };

    if (!data.sectionOrder.includes(secId)) {
      data.sectionOrder = [...data.sectionOrder, secId];
    }
    if (!data.mainSections.includes(secId) && !data.sidebarSections.includes(secId)) {
      data.mainSections = [...data.mainSections, secId];
    }
  }

  return data;
}

# Resume Builder Pro - Developer Guide

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── counter/              # Global counter API
│   │   └── layout-debug/         # Debug utilities
│   ├── builder/                  # Main resume builder page
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
│
├── components/                   # React components
│   ├── form-panel/               # Left sidebar - form inputs
│   ├── preview-panel/            # Right side - resume preview
│   ├── login/                    # Login page
│   └── ui/                       # Reusable UI components
│
├── context/                      # React Context providers
│   ├── AuthContext.tsx           # User authentication
│   ├── ResumeContext.tsx         # Resume state management
│   └── ToastContext.tsx          # Toast notifications
│
├── hooks/                        # Custom React hooks
│   ├── useATSScore.ts            # ATS score calculator
│   ├── useDebounce.ts            # Debounce hook
│   └── useKeyboardShortcuts.ts   # Keyboard shortcuts
│
├── utils/                        # Utility functions
│   ├── importService.ts          # JSON/LaTeX import
│   ├── exportService.ts          # Export utilities
│   ├── storage.ts                # localStorage operations
│   ├── helpers.ts                # Common helpers
│   └── ats.ts                    # ATS scoring logic
│
├── data/                         # Static data
│   ├── defaultResume.ts          # Default resume template
│   └── colorPalettes.ts          # Color schemes
│
└── types/                        # TypeScript type definitions
    └── resume.ts                 # Resume data types
```

## Key Concepts

### Resume State Management

The resume data is managed using a reducer pattern in `ResumeContext.tsx`:

```typescript
interface ResumeData {
  profileId: string;
  profileName: string;
  tpl: 1 | 2 | 3 | 4;              // Template ID
  name: string;
  email: string;
  // ... more fields
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skillGroups: SkillGroup[];
  customSections: Record<string, CustomSection>;
}
```

### Dispatching Actions

```typescript
const { dispatch } = useResume();

// Update a field
dispatch({ type: 'SET_FIELD', field: 'name', value: 'John Doe' });

// Add education
dispatch({ type: 'ADD_EDUCATION' });

// Load profile
dispatch({ type: 'LOAD_PROFILE', data: resumeData });
```

### Local Storage

```typescript
import { saveProfile, loadProfile, getUserProfiles } from '@/utils/storage';

// Save
saveProfile('username', resumeData);

// Load
const data = loadProfile('username', profileId);

// Get all profiles
const profiles = getUserProfiles('username');
```

## Common Tasks

### Adding a New Resume Section

1. **Create the component** in `src/components/form-panel/`:
```typescript
export default function MyNewCard() {
  const { state, dispatch } = useResume();
  
  return (
    <div className={styles.card}>
      {/* Your form fields */}
    </div>
  );
}
```

2. **Add to FormPanel** in `src/components/form-panel/FormPanel.tsx`:
```typescript
case 'my-section':
  return <MyNewCard key={key} />;
```

3. **Add template rendering** in template files:
```typescript
// In ClassicTemplate.tsx, ModernTemplate.tsx, etc.
{state.myNewSection && (
  <section>
    {/* Render my new section */}
  </section>
)}
```

### Adding a New Template

1. **Create template** in `src/components/preview-panel/templates/`:
```typescript
export default function MyTemplate({ state, isExport }: TemplateProps) {
  return (
    <div className={shared.resumeContainer}>
      {/* Template structure */}
    </div>
  );
}
```

2. **Register in ResumeRenderer**:
```typescript
case 5:
  return <MyTemplate state={stateWithFallbacks} isExport={isExport} />;
```

### Modifying Styles

- **Component styles**: Use CSS modules in `*.module.css`
- **Global styles**: Edit `src/app/globals.css`
- **Template styles**: Edit `src/components/preview-panel/templates/*.module.css`

CSS Variables Available:
```css
--p-heading-font          /* Heading font family */
--p-body-font             /* Body font family */
--p-heading-color         /* Heading color */
--p-text-color            /* Body text color */
--p-sidebar-bg            /* Sidebar background */
--p-sidebar-text          /* Sidebar text color */
--p-accent-color          /* Accent color */
--p-sec-sp                /* Section spacing */
--body-size               /* Body font size */
--heading-size            /* Heading font size */
--line-height             /* Line height */
```

## Type System

### Adding New Types

Edit `src/types/resume.ts`:

```typescript
export interface MyNewType {
  id: string;
  // ... fields
}

export type ResumeAction =
  | // ... existing actions
  | { type: 'MY_ACTION'; data: MyNewType }
```

### Type Checking

The project uses TypeScript strict mode:

```bash
npm run build  # TypeScript errors block build
```

## Performance Tips

1. **Use memo() for components**:
```typescript
export default memo(MyComponent);
```

2. **Use useCallback for handlers**:
```typescript
const handleChange = useCallback((value) => {
  dispatch(...);
}, [dispatch]);
```

3. **Use useRef for non-state values**:
```typescript
const timerRef = useRef(null);
```

## Debugging

### Console in Development
- Browser DevTools: F12
- Check Network tab for API calls
- Check Application tab for localStorage

### Build Errors
```bash
npm run build  # Full build with TypeScript checking
```

### Linting
```bash
npm run lint   # Check for ESLint issues
```

## Best Practices

1. **Always type your data**: Never use `any`
2. **Handle errors gracefully**: Show toast messages to users
3. **Use proper TypeScript guards**: Check types before using
4. **Keep components small**: Aim for <300 lines per component
5. **Memoize expensive operations**: Use useMemo and useCallback
6. **Test locally before deploying**: npm run build && npm start

## Common Issues & Solutions

### Issue: localStorage is undefined
**Solution**: Check if in browser environment
```typescript
if (typeof window !== 'undefined') {
  localStorage.getItem('key');
}
```

### Issue: Hydration mismatch
**Solution**: Use useEffect to access DOM
```typescript
useEffect(() => {
  // DOM access here
}, []);
```

### Issue: Keyboard shortcuts not working
**Solution**: Check that useKeyboardShortcuts is called with proper handlers

### Issue: PDF export empty
**Solution**: Ensure resume-export element has content before calling download

## API Routes

### GET /api/counter
Returns the global counter value

```typescript
fetch('/api/counter').then(r => r.json()).then(data => console.log(data.count));
```

### POST /api/counter
Increments the global counter

```typescript
fetch('/api/counter', { method: 'POST' }).then(r => r.json());
```

## Environment Variables

Required `.env.local`:
```
# Add any required environment variables here
```

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs (if using)

---

**Last Updated**: July 14, 2026

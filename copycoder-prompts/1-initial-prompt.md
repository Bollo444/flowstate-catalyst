Initialize Next.js in current directory:

```bash
mkdir temp; cd temp; npx create-next-app@latest . -y --typescript --tailwind --eslint --app --use-npm --src-dir --import-alias "@/*" -no --turbo
```

Now let's move back to the parent directory and move all files except prompt.md.

For Windows (PowerShell):

```powershell
cd ..; Move-Item -Path "temp*" -Destination . -Force; Remove-Item -Path "temp" -Recurse -Force
```

For Mac/Linux (bash):

```bash
cd .. && mv temp/* temp/.* . 2>/dev/null || true && rm -rf temp
```

Set up the frontend according to the following prompt:
<frontend-prompt>
Create detailed components with these requirements:

1. Use 'use client' directive for client-side components
2. Make sure to concatenate strings correctly using backslash
3. Style with Tailwind CSS utility classes for responsive design
4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
7. Create root layout.tsx page that wraps necessary navigation items to all pages
8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
9. Accurately implement necessary grid layouts
10. Follow proper import practices:

- Use @/ path aliases
- Keep component imports organized
- Update current src/app/page.tsx with new comprehensive code
- Don't forget root route (page.tsx) handling
- You MUST complete the entire prompt before stopping

<summary_title>
Project Management Dashboard with Team Collaboration Features
</summary_title>

<image_analysis>

1. Navigation Elements:

- Left sidebar with: Search, Inbox, Assigned to me, Created by me, Private tasks, More
- Top header with: Team, New, Settings, Profile options
- Secondary navigation with: Projects, To triage, Backlog, Active
- Pins section for quick access

2. Layout Components:

- Left sidebar: 250px width, dark theme
- Main content area: Fluid width
- Right panel: ~300px width for updates
- Header height: 60px
- Content padding: 20px

3. Content Sections:

- Team charter section
- Current projects section
- Status updates panel
- Message input area
- Timer/controls footer

4. Interactive Controls:

- New item button (+)
- Search bar with icon
- Navigation items with hover states
- Message input with emoji picker
- Review & send / Skip buttons
- Timer controls

5. Colors:

- Background: #1E1E1E (dark theme)
- Accent: #50B584 (green)
- Secondary: #6B4EFF (purple)
- Text: #FFFFFF (white)
- Muted text: #8F8F8F
- Button highlight: #2D2D2D

6. Grid/Layout Structure:

- 3-column layout
- Flexible content area
- Fixed-width sidebars
- Responsive breakpoints at 768px, 1024px, 1440px
  </image_analysis>

<development_planning>

1. Project Structure:

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar
│   │   ├── Header
│   │   └── ContentArea
│   ├── features/
│   │   ├── TeamCharter
│   │   ├── Projects
│   │   └── Updates
│   └── shared/
```

2. Key Features:

- Team collaboration workspace
- Project management tools
- Real-time updates
- Task organization
- Timer functionality

3. State Management:

```typescript
interface AppState {
├── workspace: {
│   ├── currentTeam: Team
│   ├── projects: Project[]
│   └── pins: Pin[]
├── user: {
│   ├── profile: UserProfile
│   ├── preferences: UserPreferences
│   └── notifications: Notification[]
├── updates: {
│   ├── messages: Message[]
│   └── status: StatusUpdate[]
└── }
}
```

4. Routes:

```typescript
const routes = [
├── '/workspace',
├── '/projects/*',
├── '/backlog',
├── '/active',
└── '/settings'
]
```

5. Component Architecture:

- WorkspaceLayout (parent)
- NavigationSidebar
- ContentArea
- UpdatesPanel
- SharedComponents (Button, Input, Card)

6. Responsive Breakpoints:

```scss
$breakpoints: (
  ├── "mobile": 320px,
  ├── "tablet": 768px,
  ├── "desktop": 1024px,
  └── "wide": 1440px
);
```

</development_planning>
</frontend-prompt>

IMPORTANT: Please ensure that (1) all KEY COMPONENTS and (2) the LAYOUT STRUCTURE are fully implemented as specified in the requirements. Ensure that the color hex code specified in image_analysis are fully implemented as specified in the requirements.

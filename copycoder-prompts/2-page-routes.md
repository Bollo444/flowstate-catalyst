Set up the page structure according to the following prompt:
   
<page-structure-prompt>
Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- /search
- /inbox
- /assigned-to-me
- /created-by-me
- /private-tasks
- /more
- /team
- /new
- /settings
- /profile-options
- /projects
- /to-triage
- /backlog
- /active

Page Implementations:
/search:
Core Purpose: Global search functionality across all tasks, projects, and team members
Key Components
- Search input with filters
- Real-time search results
- Advanced filter options
- Recent searches list
Layout Structure
- Full-width search bar at top
- Filters panel on left
- Results grid in main area

/inbox:
Core Purpose: Central hub for notifications and updates
Key Components
- Notification list
- Read

/unread filters
- Action buttons
- Priority indicators
Layout Structure:
- List view with categorized sections
- Quick action sidebar
- Notification details panel

/assigned-to-me:
Core Purpose: View and manage tasks assigned to current user
Key Components
- Task list with status
- Priority sorting
- Due date tracking
- Progress indicators
Layout Structure
- Kanban board layout
- List

/created-by-me:
Core Purpose: Track tasks created by current user
Key Components
- Task creation history
- Status overview
- Assignment tracking
- Edit capabilities
Layout Structure
- Timeline view
- Grid layout for tasks
- Filtering sidebar

/private-tasks:
Core Purpose: Manage personal

/private tasks
Key Components:
- Private task list
- Security indicators
- Personal notes
- Quick add feature
Layout Structure
- Simple list view
- Privacy settings panel
- Add task floating button

Layouts:
Default Layout:
Applicable routes
- /search
- /inbox
- /assigned-to-me
- /created-by-me
Core components
- Top navigation bar
- Sidebar menu
- Content area
- Footer
Responsive behavior
- Collapsible sidebar
- Stack layout on mobile
- Adaptive content width

Dashboard Layout
Applicable routes
- /projects
- /active
- /backlog
Core components
- Data visualization area
- Quick actions panel
- Status overview
- Navigation breadcrumbs
Responsive behavior
- Grid to single column
- Collapsible panels
- Mobile-optimized charts

Settings Layout
Applicable routes
- /settings
- /profile-options
- /team
Core components
- Settings categories
- Form elements
- Save/cancel actions
- User feedback
Responsive behavior
- Full width on mobile
- Sticky navigation
- Scrollable content

Note: This is a partial implementation focusing on the most commonly used routes. Each additional route would follow similar patterns adapted to their specific needs.
</page-structure-prompt>
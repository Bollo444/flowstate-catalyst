# FlowState Catalyst - User Guide

## Introduction

Welcome to FlowState Catalyst, an advanced project management and flow state optimization platform designed to help you achieve peak productivity. This guide will walk you through the key features and capabilities of the application based on its current structure.

## What is Flow State?

Flow state is a mental state where a person is fully immersed and engaged in an activity, characterized by focused concentration, a sense of control, and enjoyment in the process. FlowState Catalyst is designed to help you achieve and maintain this optimal state of productivity.

## Key Features (Inferred from Structure)

- **Core Flow Interface:** Visualize and manage your workflow, potentially including flow scores and task alignment (related files: `src/components/core/FlowInterface/`, `src/components/flow/`).
- **Task Management:** Create, organize, and track tasks. Includes various views like Inbox, Backlog, Assigned to Me, etc. (related files: `src/app/tasks/` subroutes, `src/components/tasks/`, `src/features/taskFlow/`). Advanced automation might be under development.
- **Project Management:** Organize tasks within projects (related files: `src/app/projects/`, `src/components/core/ProjectEditor/`, `src/hooks/useProjects.ts`).
- **Team Collaboration:** Features related to team dashboards, member views, and potentially real-time synchronization (related files: `src/app/team/`, `src/components/team/`, `src/features/teamSync/`).
- **Authentication:** Secure sign-in, sign-up, and session management via Supabase (related files: `src/pages/auth/`, `src/app/api/auth/`, `src/lib/supabaseClient.ts`).
- **Analytics Dashboard:** Visualize performance metrics and insights (related files: `src/components/dashboard/`, `src/components/analytics/`). The backend analytics structure (`src/analytics/`) is extensive, suggesting ambitious data analysis capabilities are planned or partially implemented.
- **Flowsistant AI:** An AI assistant feature exists, likely for task interaction or generation (related files: `src/components/flow/Flowsistant/`).
- **Integrations:** Support for connecting with external services, currently showing file storage providers (Dropbox, Google Drive) (related files: `src/integrations/`).
- **Inventory Management:** Basic features for managing inventory (related files: `src/app/inventory/`, `src/components/inventory/`).

## Main Components (Inferred from Structure)

- **Flow Interface (`src/components/core/FlowInterface/`, `src/components/flow/`):** The primary workspace for interacting with tasks, viewing flow state information (like Flow Score), and managing workflow. May include components like `FlowWorkspace`, `FlowScore`, `FlowStateIndicator`.
- **Task Views (`src/app/` subroutes, `src/components/tasks/`, `src/components/core/TaskList/`):** Various pages and components for displaying and interacting with tasks (e.g., Kanban-style boards, lists like Inbox, Backlog).
- **Team Dashboard (`src/components/dashboard/TeamFlowDashboard.tsx`, `src/components/team/`):** Displays team-related information, metrics, activity feeds, and member lists.
- **Analytics Components (`src/components/dashboard/`, `src/components/analytics/`):** Charts, graphs, and summaries for visualizing data processed by the analytics backend.
- **Layout (`src/components/layout/`):** Core application structure including `Header`, `Sidebar`, etc.
- **Shared Components (`src/components/shared/`):** Common UI elements used throughout the application (e.g., `Avatar`, `LoadingSpinner`, `MarkdownEditor`, `ConfirmDialog`).
- **Flowsistant (`src/components/flow/Flowsistant/`):** The UI component for interacting with the AI assistant.

## Getting Started

1.  **Sign In/Sign Up**: Create an account or sign in using the forms likely found under `/auth/signin` or `/auth/signup`.
2.  **Explore Dashboard**: Navigate the main dashboard, likely the application's home page (`/`).
3.  **Create Tasks/Projects**: Use the relevant sections (e.g., `/new`, `/projects`) to add tasks and organize them.
4.  **Manage Tasks**: Interact with tasks through different views like `/inbox`, `/assigned-to-me`, `/backlog`.
5.  **View Team Info**: Explore the team section (`/team`) for collaboration features.
6.  **Check Analytics**: Review available metrics and charts on the dashboard.

## Best Practices

_(Retained from original guide, general applicability assumed)_

1.  **Create Manageable Tasks**: Break down large projects into smaller, focused tasks.
2.  **Respect Flow States**: When in peak flow, focus on complex tasks; use rest periods for planning.
3.  **Regular Updates**: Update task status to help the system better understand your work patterns.
4.  **Team Coordination**: Use team insights to coordinate activities and maintain collective flow.

## Technical Architecture (Inferred from Structure)

FlowState Catalyst is built with:

- **Frontend Framework:** Next.js (using both App Router and Pages Router) with React.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS (likely with CSS Modules).
- **Backend:** Supabase (Database, Auth, Realtime) and Next.js API Routes.
- **State Management:** Likely a combination of React Context API and custom Hooks (`src/hooks/`).
- **Testing:** Includes structure for Jest/React Testing Library (implied by `jest.config.js` and test file names), potentially Cypress or Playwright for E2E tests.

## Support

For additional help or feature requests, please contact the development team or submit an issue on the project repository.

---

Happy flowing! 🚀

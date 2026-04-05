# Lex Casus — AI-Powered Legal Dashboard

A modern, responsive Legal Tech SaaS web application designed for law students and legal practitioners in the Philippines.

## Project Status

- **Project Type**: React + TypeScript Modern Web Application
- **Entry Point**: `src/main.tsx`
- **Build System**: Vite 7.0.0
- **Styling System**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 6.x
- **State Management**: Zustand 4.x (with persist middleware)
- **Icons**: Lucide React

## Architecture

### User Roles
- **Admin**: Only `rashemvanrondina@gmail.com` has admin privileges
- **Client (Atty.)**: Regular subscribers with role-based feature access

### Subscription Plans
- **Basic (₱159)**: Dashboard, Legal Chat AI, E-Codals
- **Premium (₱399)**: Everything in Basic + Practice Bar AI, Case Digest Generator, Notes & Case Linking

### Key Design Decisions
- All users are referred to as "Atty." across the application
- Navy/White/Gold color scheme with dark/light mode support
- Collapsible sidebar navigation
- Mobile-first responsive design
- Premium features are visually locked for Basic users

## Pages & Features

### Client Pages (`/src/pages/client/`)
- `DashboardPage.tsx` — Overview cards, schedule, cases, bar progress
- `SchedulePage.tsx` — Calendar/To-Do system with CRUD
- `PracticeBarPage.tsx` — AI-evaluated Bar exam answers (ALAC format)
- `LegalChatPage.tsx` — Philippine law chatbot interface
- `ECodalsPage.tsx` — Browseable codal provisions with editable notes
- `NotesPage.tsx` — Rich text editor with tagging and case linking
- `CasesPage.tsx` — AI case digest generator + case library

### Admin Pages (`/src/pages/admin/`)
- `AdminDashboardPage.tsx` — Stats, activity logs, analytics
- `ManageQuestionsPage.tsx` — CRUD for Bar questions (visible to all clients)
- `UserManagementPage.tsx` — User list, plan assignment, activation
- `SubscriptionControlPage.tsx` — Revenue overview, plan management

### Shared
- `LoginPage.tsx` — Auth with role detection (admin email detection)

## Data Storage
Currently uses local state with sample data. Backend integration with Youbase/Firebase is needed for:
- User authentication and authorization
- Persistent data storage (questions, cases, notes, schedules)
- AI API integration (chat, case generation, answer evaluation)

## Build Commands
- `npm run build` — Production build
- `npm run dev` — Development server

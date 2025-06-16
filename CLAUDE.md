# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Server:**
```bash
npm run dev
```
Runs Vite dev server on port 8080 with hot reload.

**Build for Production:**
```bash
npm run build
```

**Build for Development:**
```bash
npm run build:dev
```

**Lint Code:**
```bash
npm run lint
```

**Preview Production Build:**
```bash
npm run preview
```

## Architecture Overview

This is a React/TypeScript application built with Vite that provides a comprehensive website template generation and management platform, specifically focused on creative professionals (hair stylists, photographers, beauty specialists).

### Core System Components

**Template8 System** - The main template generation engine:
- **Generator Flow**: Form-based input → AI content generation → Template8Data structure → Database persistence
- **Editing System**: Full-screen modal editing with section-by-section workflow (Hero, Gallery, Stories, Testimonials, etc.)
- **Data Persistence**: Multi-layer persistence (session storage → database) with comprehensive recovery mechanisms
- **ChairLinked Integration**: Backend service handling CRUD operations, slug generation, and site lifecycle management

**Admin System** - Comprehensive management interface:
- **Demo Site Management**: Create, duplicate, publish, and cleanup demo sites
- **Customer Management**: Subscription handling, account operations, customer support
- **Team Management**: Role-based access control (super_admin, admin, support, developer, marketing, viewer)
- **Site Lifecycle**: Draft → Ready to Share → Shared → Claimed → Converting → Customer Controlled → Live Published

**Auth & State Management**:
- Supabase authentication with role-based permissions
- React Query for server state management
- Zustand for client state management
- Context providers for editing state and payment status

### Key Data Structures

**Template8Data Interface**: Central data structure containing business info, hero content, gallery images, Instagram stories, testimonials, services, and branding.

**Site Lifecycle States**: Managed through database with validation and transition rules.

**User Roles**: Hierarchical permission system with granular access control.

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Query, Zustand, React Context
- **Database**: Supabase with real-time subscriptions
- **Routing**: React Router v6 with lazy loading
- **Forms**: React Hook Form with Zod validation

### File Organization

- `src/components/template8/` - Template generation and editing system
- `src/components/admin/` - Admin dashboard and management tools
- `src/components/auth/` - Authentication components and providers
- `src/hooks/` - Custom hooks organized by feature area
- `src/services/` - External service integrations and utilities
- `src/pages/` - Route components with lazy loading

### Development Patterns

**Component Architecture**: Compound components with proper separation of concerns, extensive use of custom hooks for business logic.

**Error Handling**: Comprehensive error boundaries, graceful fallbacks, and user-friendly error messages.

**Performance**: Lazy loading, debounced operations, optimized re-renders with React.memo.

**Type Safety**: Full TypeScript coverage with strict configuration, proper interface definitions for all data structures.

### Important Notes

- Uses path aliases configured in vite.config.ts (`@/` maps to `src/`)
- Development server runs on port 8080 with IPv6 support
- Lovable integration for deployment and version control
- No git repository initialized in current working directory
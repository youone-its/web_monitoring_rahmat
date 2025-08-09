# Overview

SmartMonitor is a real-time monitoring dashboard application built to track GPS locations, camera feeds, and device conditions. The application provides a responsive web interface for monitoring multiple devices with live updates via WebSocket connections. It displays device status information including battery levels, temperature readings, network connectivity, and system performance metrics on an interactive map-based dashboard.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Full-Stack Architecture
The application follows a monolithic architecture with clear separation between client and server components:
- **Frontend**: React-based single-page application with TypeScript
- **Backend**: Express.js REST API server with WebSocket support
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Build System**: Vite for frontend bundling and development

## Frontend Architecture
- **UI Framework**: React 18 with TypeScript and modern hooks
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Updates**: Custom WebSocket hook for live data synchronization
- **Maps**: Leaflet integration for GPS location visualization
- **Component Structure**: Modular dashboard widgets for GPS maps, camera feeds, device status, and statistics

## Backend Architecture
- **API Design**: RESTful endpoints with WebSocket server for real-time communication
- **Data Storage**: In-memory storage implementation with interface abstraction for future database integration
- **Real-time Communication**: WebSocket server broadcasting device updates to connected clients
- **Error Handling**: Centralized error middleware with structured JSON responses
- **Development Setup**: Hot reload with Vite integration and request logging

## Data Schema Design
The database schema supports three main entities:
- **Devices**: Core device information with status, battery, temperature, and performance metrics
- **GPS Locations**: Location tracking with accuracy and timestamps
- **Alerts**: System alerts with severity levels and resolution tracking
- **Type Safety**: Zod schemas for runtime validation and TypeScript integration

## UI/UX Design Patterns
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Component Library**: shadcn/ui components with consistent theming
- **Real-time Indicators**: Live status updates and notification banners
- **Interactive Maps**: Clickable device markers with detailed popups
- **Dashboard Widgets**: Modular card-based layout for different monitoring aspects

# External Dependencies

## Core Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, TypeScript support
- **UI Components**: Radix UI primitives, shadcn/ui component system
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **State Management**: TanStack React Query for server state
- **Navigation**: Wouter for lightweight routing
- **Maps**: Leaflet for interactive mapping functionality

## Backend Dependencies
- **Server Framework**: Express.js for REST API
- **Real-time Communication**: WebSocket (ws) library for live updates
- **Database**: Neon serverless PostgreSQL, Drizzle ORM
- **Development Tools**: tsx for TypeScript execution, esbuild for production builds

## Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **TypeScript**: Full type safety across client and server
- **Development Environment**: Replit-specific plugins for cloud development
- **Database Migrations**: Drizzle Kit for schema management
- **Code Quality**: ESModules throughout the application stack

## Database Integration
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Neon serverless database with connection pooling
- **Schema Management**: Type-safe schema definitions with Zod validation
- **Migration Strategy**: Drizzle Kit for database schema versioning
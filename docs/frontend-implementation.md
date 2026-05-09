# Nexora Health – Frontend Implementation

## Tech Stack
- React.js 18 with Vite
- Redux Toolkit (State Management)
- React Router DOM v6
- Tailwind CSS v3
- Recharts (Data Visualization)
- Vite PWA Plugin
- React Hook Form

## Component Architecture
Main Layout:
- `App.jsx` handles global routing and structure.
- `Navbar.jsx` & `Sidebar.jsx` provide persistent navigation.
- `ProtectedRoute.jsx` wraps authenticated views.

Pages:
- `LandingPage`: Public introduction to the application.
- `Login/Register`: Auth forms using React Hook Form.
- `Dashboard`: Central hub showing summary statistics and mini-charts.
- `HealthTracker`: Double-column layout for logging data and viewing today's entries.
- `Reports`: Full Recharts implementation for historical analysis.
- `Profile/Admin`: User management and system overview.

## Redux State Structure
The `authSlice` manages global user authentication state.
- `user`: Holds the JWT token and user info if logged in.
- `isLoading`/`isError`/`isSuccess`: Loading state indicators for Auth requests.

## PWA Setup
The frontend is built using `vite-plugin-pwa` configured for 'autoUpdate'. Manifest parameters include brand theme colors, standalone display mode, and icon paths for both desktop and mobile installation.

## Responsive Design Approach
Tailwind CSS provides mobile-first utility classes. 
- Sidebars collapse on smaller screens. 
- Grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) automatically adjust the display cards for mobile, tablet, and desktop views to maintain a clean Glassmorphism aesthetic.

# Genmi Admin Dashboard Demo

A lightweight admin dashboard demo built with Vue 3, Vite, and TailwindCSS for Genmi.ai.

## Features

- **User Management**: View, search, and filter users with detailed user pages
- **Order Management**: Track orders with filtering by feature type and model
- **Feedback Management**: Monitor user feedback with satisfaction levels and resolution tracking
- **Reviews Management**: View and filter user reviews
- **Responsive Design**: Mobile-friendly layout with collapsible sidebar
- **Mock Data**: All data is static JSON (no backend required)

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: Vue Router
- **State**: Local reactive state

## Project Structure

```
src/
├── main.js              # Application entry point
├── router.js            # Vue Router configuration
├── App.vue              # Main layout component
├── layout/
│   ├── Sidebar.vue      # Left navigation sidebar
│   └── Topbar.vue       # Top header bar
├── components/
│   ├── Table.vue        # Reusable data table
│   ├── Tabs.vue         # Tab navigation component
│   └── EmptyState.vue   # Empty state placeholder
├── pages/
│   ├── Users/
│   │   ├── UserList.vue    # User list with filters
│   │   └── UserDetail.vue  # User detail with tabs
│   ├── Orders/OrderList.vue
│   ├── Feedback/FeedbackList.vue
│   └── Reviews/ReviewList.vue
└── mock/
    ├── users.json
    ├── orders.json
    ├── feedback.json
    └── reviews.json
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Features by Module

### Users
- Search by user ID, name, or email
- Filter by country and channel
- Click row to view user details
- View user's orders and feedback in tabs

### Orders
- Filter by feature type and model name
- Search by prompt keyword
- View all order details in table format

### Feedback
- Filter by satisfaction level and status
- Mark feedback as resolved
- View detailed feedback descriptions

### Reviews
- Filter by satisfaction level and review type
- View user comments and ratings

## Design System

### Colors
- **Sidebar**: slate-900 (#0F172A)
- **Topbar**: slate-800 (#1E293B)
- **Background**: slate-100
- **Active Item**: indigo-500 with left border
- **Hover**: slate-700

### Layout
- **Sidebar Width**: 240px (60 in Tailwind)
- **Topbar Height**: 56px (14 in Tailwind)
- **Main Content**: Flexbox with overflow-auto

## Self-Test Results

✅ Sidebar renders correctly with icons and text
✅ Active route highlighted with indigo left border
✅ Navigation works - clicking menu switches pages instantly
✅ Mock data loads from /mock files
✅ User detail tabs switch between Orders and Feedback
✅ Feedback "Mark Resolved" updates state immediately
✅ Empty state shows when no data matches filters
✅ Responsive check - sidebar collapses under 768px
✅ No API errors - all mock fetch succeed
✅ Build check - npm run build succeeds with no warnings

---

**Status**: ✅ Genmi Admin Demo ready – all checks passed.
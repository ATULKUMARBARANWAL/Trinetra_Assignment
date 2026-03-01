# High-Performance AI Document Chat System

## Candidate: Atul Baranwal

------------------------------------------------------------------------

## 1. Overview

This project is a production-grade frontend system built using **Next.js
(App Router)**, **TypeScript**, and **Redux Toolkit**.\
It enables users to upload large PDF files, view them efficiently, and
interact with AI-powered chat per document.

The system is designed with a strong focus on: - Performance
optimization - Scalable state architecture - Secure session management -
Clean separation of concerns

------------------------------------------------------------------------

## 2. Tech Stack

-   Next.js (App Router)
-   TypeScript (Strict Mode)
-   Redux Toolkit
-   Tailwind CSS
-   React-PDF (declarative wrapper for PDF rendering)
-   PDF.js (low-level rendering engine used by React-PDF)
-   Axios
-   Web Workers

------------------------------------------------------------------------

## 3. Features Implemented

### Authentication & Session Lifecycle

-   Token-based authentication (Access + Refresh Token)
-   Access token expiry: 1 minute
-   Refresh token expiry: 2 minutes
-   Silent token refresh
-   Auto logout on token expiry
-   Protected routes
-   Session persistence & rehydration
-   API interceptor for token handling
-   Request queue during token refresh
-   Prevention of race conditions

------------------------------------------------------------------------

### PDF Upload & Processing

-   Drag-and-drop multi-file upload
-   File validation (size \> 50MB supported)
-   Efficient large file handling
-   Web Worker for PDF parsing
-   Metadata extraction
-   Remove file functionality
-   Corruption handling

------------------------------------------------------------------------

### PDF Viewer (Performance Critical)

-   Lazy loading of pages
-   Virtualized rendering
-   Smooth scrolling
-   Zoom in / Zoom out
-   Next / Previous page navigation
-   Jump to page via input
-   Current page indicator
-   Page prefetching

------------------------------------------------------------------------

### AI Chat System

-   Unique chat per PDF document
-   Streaming-like response simulation
-   Markdown support
-   Scroll-to-bottom behavior
-   Error handling
-   Loading state
-   Chat history persistence (localStorage)
-   Optimized rendering for 500+ messages

------------------------------------------------------------------------

## 4. State Architecture

The application follows a modular and scalable state design:

### State Separation

-   Auth State
-   Session State
-   Document State
-   Chat State
-   UI State

### Key Design Decisions

-   Redux Toolkit for centralized state
-   Selector-based subscription to prevent re-renders
-   Memoization using `useMemo` and `React.memo`
-   Avoid deep prop drilling
-   Local state for transient UI data

------------------------------------------------------------------------

## 5. Performance Optimizations

-   Code splitting using Next.js dynamic imports
-   Lazy loading heavy components
-   Web Worker for PDF processing
-   Virtualized PDF rendering
-   Avoid full re-renders
-   Stable keys for list rendering
-   Request parallelization
-   Debounced input handling
-   Avoid layout thrashing

------------------------------------------------------------------------

## 6. Error Handling & Resilience

-   Token expiration handling
-   API error handling
-   Upload failure handling
-   Corrupt file handling
-   Network instability handling
-   Graceful UI fallback states
-   Toast notifications

------------------------------------------------------------------------

## 7. Folder Structure

    src/
     ├── app/
     │   ├── login/
     │   ├── dashboard/
     │   └── api/
     ├── components/
     │   ├── auth/
     │   ├── chat/
     │   ├── pdf/
     │   └── dashboard/
     ├── core/
     │   ├── api/
     │   ├── store/
     │   └── providers/
     ├── features/
     │   ├── auth/
     │   ├── chat/
     │   ├── document/
     │   ├── session/
     │   └── ui/
     ├── hooks/
     ├── workers/
     └── lib/

------------------------------------------------------------------------

## 8. Session Flow

1.  User logs in → receives access & refresh tokens
2.  Access token used for API calls
3.  If expired → interceptor triggers refresh token
4.  Requests queued during refresh
5.  If refresh fails → logout user
6.  Session restored on page reload

------------------------------------------------------------------------

## 9. Identified Bottlenecks

-   Large PDF rendering
-   Chat message re-renders
-   Token refresh race conditions

### Solutions

-   Virtualization
-   Memoization
-   Request queueing

------------------------------------------------------------------------

## 10. Trade-offs

-   Redux used for scalability (slightly more boilerplate)
-   Web Worker adds complexity but improves performance
-   Short token expiry for demonstration purposes

------------------------------------------------------------------------

## 11. Future Improvements

-   Backend integration for AI responses
-   IndexedDB for large file storage
-   Real streaming API
-   Server-side session validation
-   WebSocket for chat
-   Pagination in chat

------------------------------------------------------------------------

## 12. Setup Instructions

``` bash
npm install
npm run dev
```

------------------------------------------------------------------------

## 13. Conclusion

This project demonstrates production-level frontend architecture,
focusing on: - Performance - Scalability - Reliability

It follows best practices required for high-performance applications.

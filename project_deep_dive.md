# Project Deep Dive: Ballroom Studio Architecture & Implementation

This document provides a highly detailed technical overview of the development of the Ballroom Note-Taking application. It covers architectural decisions, complex interaction logic, and the iterative refinement process.

---

## 1. Core Architecture Overview
The application follows a **modern full-stack web architecture** designed for performance and flexibility.

- **Frontend**: Built with **Next.js 14+ (App Router)**. It utilizes React Server Components for efficiency while leveraging `use client` for the heavy interactive workspace.
- **Backend**: A modular **Node.js/Express.js** server. It uses an **ABL (Application Business Logic)** pattern to separate API routing from the core logic, ensuring the code is maintainable and testable.
- **Database**: A lightweight **JSON-based database (`db.json`)**. This was chosen for the "homework" scope to provide persistent storage without the overhead of external database management, while still modeling standard relational concepts.

---

## 2. The "Infinite Canvas" System
The project's most complex feature is the **Sequence Canvas**, which allows dance figures to be placed freely in a 2D space.

### Spatial Logic & Snap-to-Grid
To maintain a professional feel, we implemented a **GRID system (40px tiles)**.
- When a figure is dropped or moved, its coordinates are calculated using:
  ```javascript
  const snapToGrid = (coord) => Math.round(coord / GRID_SIZE) * GRID_SIZE;
  ```
- This ensures that despite the free-form nature, routines always look organized and aligned.

### Collision Detection (Space Healing)
A custom algorithm was developed to prevent figures from overlapping:
1. When a figure is dropped, `isAreaOccupied` checks if any other figure exists in that tile block.
2. If occupied, `findNearestFreeTileBlock` uses a **spiral search algorithm** to find the closest available space.
3. This "healing" logic prevents data loss and UI clutter.

### Advanced Zoom & Panning
The canvas supports zooming at the cursor's location, which is a high-end feature usually found in professional design tools like Figma.
- **The Formula**: To keep the point under the cursor stationary while zooming, we adjust the `panOffset` using the ratio of the new zoom to the old zoom:
  ```javascript
  const scaleRatio = nextZoom / prevZoom;
  newOffset.x = mouseX - (mouseX - oldOffset.x) * scaleRatio;
  ```
- **Performance**: We utilized native browser events and `translate3d` to ensure 60FPS fluid movement even during complex panning operations.

---

## 3. Drag-and-Drop Evolution
One of the key learnings during this project was the transition from **Sortable** to **Draggable** logic.

### Why Sortable Failed
Initially, we used `@dnd-kit/sortable`. However, sortable systems are designed for lists (1D). On a 2D canvas, the "sorting" logic caused figures to jump unexpectedly and get "stuck" when trying to occupy the same space.

### The Draggable Solution
We refactored the entire system to use `useDraggable`.
- **Separation of Concerns**: We split `FigureCard` into a **Logic Component** (handling drag sensors) and a **View Component** (pure UI).
- **DragOverlay**: By using a `DragOverlay`, we decoupling the "ghost" being dragged from the "stationary" items on the canvas, solving the browser's horizontal scrolling bugs in the sidebar.
- **PointerWithin Detection**: Switched to `pointerWithin` collision detection, which is much more intuitive for a zooming canvas than the default center-point detection.

---

## 4. UI/UX & Aesthetics
The app uses a **Premium Glassmorphism** design system.

- **Color Palette**: We used a curated "Obsidian Gold" palette (`#D4AF37`) combined with deep blacks (`#050505`) and semi-transparent glass panels.
- **SVG/GIF Integration**: We implemented a custom filter system to colorize black-on-white GIF icons into the brand's gold color:
  ```css
  filter: invert(1) sepia(1) saturate(5) hue-rotate(-15deg);
  mix-blend-mode: screen;
  ```
- **Context-Aware Sidebar**: The sidebar is dynamic—it hides during "Cinematic Mode" to maximize choreography space and provides instant access to dance-specific figures (Standard vs. Latin).

---

## 5. Backend Logic (ABL Pattern)
The backend is structured to be "Self-Documenting".
- **Nested Entities**: Figures are stored as a nested array within Lineups. This ensures that a single API call (`/lineup/get`) retrieves the entire routine state, reducing network latency and simplifying state synchronization in React.
- **Atomic Operations**: Moves are updated atomically on the server to prevent "Sync drift" between multiple browser tabs.

---

## 6. Project Stats & Milestones
- **Lines of Code**: ~2000+ across frontend and backend.
- **Refinement Cycles**: 5 major versions of the Drag-and-Drop system.
- **Key Discovery**: CSS `mix-blend-mode` is a life-saver for legacy image assets.
## 7. Future Innovations & Research
While the current version is optimized for stability and submission, we've identified key paths for future enhancement:

### Step-by-Step Directionality
- **Alignment Selector**: Implementing a per-figure alignment tag (e.g., LOD - Line of Dance, DW - Diagonal Wall) to provide technical context for each move.
- **Interactive Footprints**: Replacing generic indicators with rotatable "Footprint" icons on figure cards. This would allow users to visually "point" where the dancer's feet are heading, providing a textbook-level choreographic experience.

### Enhanced Visualization
- **Cinematic Export**: We've implemented high-resolution PNG export using `html-to-image`, which serves as a foundation for generating printable "Routine Cheat Sheets."
- **Temporal Flow**: The timing system (customizable seconds/beats per figure) allows for future integration with music BPM to provide a real-time progress bar through the routine.

# Submission Documentation: Ballroom Note-Taking Tool

This document satisfies the documentation requirements for Backend homework (#3) and Frontend homework (#4).

---

## 1. Route List (Frontend #4)

| Name | URI | Description |
| :--- | :--- | :--- |
| **Home/Redirect** | `/` | Entry point that automatically redirects users to the Dashboard. |
| **Dashboard** | `/dashboard` | The main library view where users see all available dance routines. |
| **Select Dance** | `/select-dance` | A specialized selector for starting a new routine based on dance style. |
| **Routine Editor** | `/lineups/[id]` | The core interaction space (Infinite Canvas) for managing figures. |

---

## 2. Schema Description (Backend #3)

### Entity: Lineup (Routine)
The primary entity representing a full choreography for a specific dance.
- **Attributes**:
    - `id`: Unique identifier (UUID).
    - `name`: Human-readable name of the routine.
    - `dance_type`: Classification (e.g., "standard" or "latin").
    - `dance_name`: Specific dance (e.g., "Waltz", "Samba").
    - `figures`: Array of Nested Figure Objects.
    - `created_at`: ISO timestamp.

### Entity: Figure (Movement)
A nested entity representing a single step or figure within a routine.
- **Attributes**:
    - `id`: Unique identifier (UUID).
    - `figure_name`: The name of the dance step.
    - `x`, `y`: Spatial coordinates on the Infinite Canvas.
    - `notes`: Optional textual notes.
    - `video_urls`, `image_urls`: Arrays for external media references.

---

## 3. DAO Method List (Backend #3)

| Name | Description |
| :--- | :--- |
| **listLineups()** | Reads from `db.json` and returns the full `lineups` array. |
| **getLineupDetail(id)** | Finds and returns a specific lineup by its UUID. |
| **createLineup(data)** | Generates a new lineup object and persists it to JSON. |
| **addFigureToLineup(id, figure)** | Pushes a new figure into the nested `figures` array of a specific lineup. |
| **updateLineupFigures(id, figures)** | Performs a bulk update of all figures (used for moving/reordering). |
| **deleteLineup(id)** | Removes a lineup entry from the database. |

---

## 4. Command Description (API Endpoints)

### Command: Fetch All Routines
- **Name**: listLineups
- **HTTP Method**: GET
- **URL**: `/lineup/list`
- **Algorithm**:
    1. Call DAO `readDB()`.
    2. Retrieve `lineups` array.
    3. Return array as JSON.

### Command: Create New Routine
- **Name**: createLineup
- **HTTP Method**: POST
- **URL**: `/lineup/create`
- **Algorithm**:
    1. Validate `dtoIn` (ensure `name` and `dance_name` are present).
    2. Generate unique UUID.
    3. Initialize empty `figures` array.
    4. Call DAO `writeDB()` to persist.
    5. Return `dtoOut` (the new routine object).

### Command: Save Figure Positions
- **Name**: updateLineupFigures (Bulk)
- **HTTP Method**: POST
- **URL**: `/figure/reorder`
- **Algorithm**:
    1. Receive `lineup_id` and array of `figures` with new `x/y` coordinates.
    2. Find the target lineup in the database.
    3. Replace the nested `figures` array with the new data.
    4. Update the `updated_at` timestamp.
    5. Save to disk.

---

## 5. Technology Stack Summary
- **Backend**: Node.js v20+, Express.js, FileSystem (fs) for persistent JSON storage.
- **Frontend**: Next.js 14, React context for state management, dnd-kit for complex spatial interactions.

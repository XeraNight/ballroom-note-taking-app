# Ellegance | Ballroom Note-Taking Tool

Welcome to **Ellegance**, a professional-grade platform for ballroom dance choreography and note-taking. This tool allows dancers to organize their routines, manage figures on an infinite canvas, and keep track of their progress.

## How to Run Locally

To ensure the application functions correctly with its persistent database, you need to run both the **Backend** and the **Frontend** simultaneously.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/)

---

### Step 1: Start the Backend

The backend handles data persistence using a local JSON database.

1. Open a new terminal.
2. After extracting files from ZIP, navigate to the app forlder (might be "ballroom-note-taking-app.main")
   ```bash
   cd (folder name)
   ```
3. Navigate to the `server` directory:
   ```bash
   cd server
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the server:
   ```bash
   npm start
   ```
   _The backend will be running at `http://localhost:4000`._

---

### Step 2: Start the Frontend

The frontend provides the interactive user interface.

1. Open a **second** terminal.
2. After extracting files from ZIP, navigate to the app forlder (might be "ballroom-note-taking-app.main")
   ```bash
   cd (folder name)
   ```
3. Ensure you are in the root directory of the project. (the forlder name)
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to:
   [**http://localhost:3000**](http://localhost:3000)

---

## Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, dnd-kit.
- **Backend**: Node.js, Express.js, FileSystem persistence.
- **Design**: Modern Dark Theme with "Dark but ellegant" accents.

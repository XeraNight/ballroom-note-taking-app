const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
const PORT = 4000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 500 } // Support up to 500MB
});

// Helper to read/write DB
const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = { lineups: [], figures: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Root route for status check
app.get('/', (req, res) => {
  res.send('<h1>💃 Ballroom Note-Taking API is Live</h1><p>Status: Operational</p>');
});

// --- LINEUP ENDPOINTS (Routine) ---

// List all lineups
app.get('/lineup/list', (req, res) => {
  const db = readDB();
  res.json(db.lineups);
});

// Get lineup detail with figures
app.get('/lineup/get', (req, res) => {
  const { id } = req.query;
  const db = readDB();
  const lineup = db.lineups.find(l => l.id === id);
  if (!lineup) return res.status(404).json({ error: 'Lineup not found' });
  
  const figures = db.figures.filter(f => f.lineup_id === id).sort((a, b) => a.order_index - b.order_index);
  res.json({ ...lineup, lineup_figures: figures });
});

// Create lineup
app.post('/lineup/create', (req, res) => {
  const { name, dance_type, dance_name } = req.body;
  const db = readDB();
  
  const newLineup = {
    id: uuidv4(),
    name,
    dance_type,
    dance_name,
    created_at: new Date().toISOString()
  };
  
  db.lineups.push(newLineup);
  writeDB(db);
  res.json(newLineup);
});

// Delete lineup
app.post('/lineup/delete', (req, res) => {
  const { id } = req.body;
  const db = readDB();
  db.lineups = db.lineups.filter(l => l.id !== id);
  db.figures = db.figures.filter(f => f.lineup_id !== id);
  writeDB(db);
  res.json({ success: true });
});

// --- FIGURE ENDPOINTS ---

// Add figure to lineup
app.post('/figure/add', (req, res) => {
  const { lineup_id, figure_name, order_index, x, y } = req.body;
  const db = readDB();
  
  const newFigure = {
    id: uuidv4(),
    lineup_id,
    figure_name,
    order_index,
    x: x || 100,
    y: y || 100,
    notes: '',
    video_urls: [],
    image_urls: [],
    created_at: new Date().toISOString()
  };
  
  db.figures.push(newFigure);
  writeDB(db);
  res.json(newFigure);
});

// Update figure details
app.post('/figure/update', (req, res) => {
  const { id, ...updates } = req.body;
  const db = readDB();
  const index = db.figures.findIndex(f => f.id === id);
  if (index === -1) return res.status(404).json({ error: 'Figure not found' });
  
  db.figures[index] = { ...db.figures[index], ...updates, updated_at: new Date().toISOString() };
  writeDB(db);
  res.json(db.figures[index]);
});

// Delete figure
app.post('/figure/delete', (req, res) => {
  const { id } = req.body;
  const db = readDB();
  db.figures = db.figures.filter(f => f.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Reorder figures or update coordinates (bulk update)
app.post('/figure/reorder', (req, res) => {
  const { figures } = req.body; // Array of {id, order_index, x, y}
  const db = readDB();
  
  figures.forEach(update => {
    const index = db.figures.findIndex(f => f.id === update.id);
    if (index !== -1) {
      if (update.order_index !== undefined) db.figures[index].order_index = update.order_index;
      if (update.x !== undefined) db.figures[index].x = update.x;
      if (update.y !== undefined) db.figures[index].y = update.y;
    }
  });
  
  writeDB(db);
  res.json({ success: true });
});

// --- ASSET UPLOAD ENDPOINT ---

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return the full URL for the frontend to consume
  const protocol = req.protocol;
  const host = req.get('host');
  const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  
  res.json({ publicUrl: fileUrl });
});

app.listen(PORT, () => {
  console.log(`Ballroom Backend running on http://localhost:${PORT}`);
});

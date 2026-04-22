const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const lineupController = require('./api/lineup-controller');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.get('/', (req, res) => {
    res.send('<h1>💃 Ballroom Studio Pro API (Public Edition) </h1><p>Status: Operational - Ready for Submission</p>');
});
app.use('/', lineupController);
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({ publicUrl: fileUrl });
});

module.exports = app;

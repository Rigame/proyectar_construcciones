const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read/write JSON DB
function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { professionals: [] };
  }
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// API endpoints (CRUD)
app.get('/api/professionals', (req, res) => {
  const db = readDB();
  res.json(db.professionals || []);
});

app.post('/api/professionals', (req, res) => {
  const db = readDB();
  const item = req.body;
  item.id = Date.now().toString();
  db.professionals.push(item);
  writeDB(db);
  res.status(201).json(item);
});

app.put('/api/professionals/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const idx = db.professionals.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  db.professionals[idx] = { ...db.professionals[idx], ...req.body, id };
  writeDB(db);
  res.json(db.professionals[idx]);
});

app.delete('/api/professionals/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const idx = db.professionals.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  const removed = db.professionals.splice(idx, 1)[0];
  writeDB(db);
  res.json(removed);
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

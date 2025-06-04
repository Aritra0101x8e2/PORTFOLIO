const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Get all reviews
app.get('/reviews', (req, res) => {
  const stmt = db.prepare('SELECT * FROM reviews ORDER BY timestamp DESC');
  const reviews = stmt.all();
  res.json(reviews);
});

// Add a review
app.post('/reviews', (req, res) => {
  const { user, review } = req.body;
  if (!user || !review) {
    return res.status(400).json({ error: 'Missing user or review' });
  }

  const stmt = db.prepare('INSERT INTO reviews (user, review) VALUES (?, ?)');
  const info = stmt.run(user, review);

  res.json({ success: true, id: info.lastInsertRowid });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const db = require('./db'); // Assuming you are using better-sqlite3 or similar

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Get all reviews
app.get('/reviews', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, user, role, rating, review, timestamp FROM reviews ORDER BY timestamp DESC');
    const reviews = stmt.all();

    // Map DB fields to match frontend interface
    const mappedReviews = reviews.map(r => ({
      id: r.id.toString(),
      name: r.user,
      role: r.role || "N/A",
      rating: r.rating || 5,
      comment: r.review,
      date: r.timestamp ? new Date(r.timestamp).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    }));

    res.json(mappedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Add a review
app.post('/reviews', (req, res) => {
  try {
    const { name, role, rating, comment } = req.body;

    if (!name || !role || !comment || !rating) {
      return res.status(400).json({ error: 'Missing fields: name, role, rating or comment' });
    }

    // Insert with timestamp
    const stmt = db.prepare('INSERT INTO reviews (user, role, rating, review, timestamp) VALUES (?, ?, ?, ?, ?)');
    const timestamp = new Date().toISOString();
    const info = stmt.run(name, role, rating, comment, timestamp);

    res.json({
      id: info.lastInsertRowid.toString(),
      name,
      role,
      rating,
      comment,
      date: timestamp.split("T")[0],
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

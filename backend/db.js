const Database = require('better-sqlite3');
const path = require('path');

// Database file path (creates file in backend folder)
const dbPath = path.resolve(__dirname, 'reviews.db');
const db = new Database(dbPath);

// Create a reviews table if not exists
const createTable = `
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    review TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;
db.exec(createTable);

module.exports = db;

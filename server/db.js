//db.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./properties.db');

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT,
      tenant TEXT,
      rent INTEGER
    )
  `);
});

module.exports = db;

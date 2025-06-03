//server/routes.js

const express = require('express');
const router = express.Router();
const db = require('./db');

// GET all properties
router.get('/', (req, res) => {
  db.all('SELECT * FROM properties', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new property
router.post('/', (req, res) => {
  const { address, tenant, rent } = req.body;
  db.run(
    'INSERT INTO properties (address, tenant, rent) VALUES (?, ?, ?)',
    [address, tenant, rent],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, address, tenant, rent });
    }
  );
});

// PUT update property
router.put('/:id', (req, res) => {
  const { address, tenant, rent } = req.body;
  console.log('PUT /:id received:', req.body);

  if (!address || !tenant || isNaN(rent)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  db.run(
    'UPDATE properties SET address = ?, tenant = ?, rent = ? WHERE id = ?',
    [address, tenant, rent, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
    //   res.json({ success: true });
      db.get('SELECT * FROM properties WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    }
  );
});

// DELETE property
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM properties WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;

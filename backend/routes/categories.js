const express = require('express');
const db = require('../database');
const auth = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const router = express.Router();

// Get all categories
router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM categories WHERE user_id IS NULL OR user_id = ?', [req.user.userId], (err, categories) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(categories);
  });
});

// Add custom category  
router.post('/', csrfProtection, auth, (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  db.run('INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)', 
    [name, type, req.user.userId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({ id: this.lastID, name, type, message: 'Category added successfully' });
  });
});

module.exports = router;
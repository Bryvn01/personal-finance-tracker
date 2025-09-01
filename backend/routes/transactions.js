const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const auth = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const router = express.Router();

// Get all transactions for user
router.get('/', auth, (req, res) => {
  const query = `
    SELECT t.*, c.name as category_name 
    FROM transactions t 
    LEFT JOIN categories c ON t.category_id = c.id 
    WHERE t.user_id = ? 
    ORDER BY t.date DESC
  `;
  
  db.all(query, [req.user.userId], (err, transactions) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(transactions);
  });
});

// Add transaction
router.post('/', [
  csrfProtection,
  auth,
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('date').isISO8601().withMessage('Please enter a valid date')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, description, category_id, type, date } = req.body;

  db.run(
    'INSERT INTO transactions (amount, description, category_id, user_id, type, date) VALUES (?, ?, ?, ?, ?, ?)',
    [amount, description, category_id, req.user.userId, type, date],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ id: this.lastID, message: 'Transaction added successfully' });
    }
  );
});

// Update transaction
router.put('/:id', [
  csrfProtection,
  auth,
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, description, category_id, type, date } = req.body;
  const { id } = req.params;

  db.run(
    'UPDATE transactions SET amount = ?, description = ?, category_id = ?, type = ?, date = ? WHERE id = ? AND user_id = ?',
    [amount, description, category_id, type, date, id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json({ message: 'Transaction updated successfully' });
    }
  );
});

// Delete transaction
router.delete('/:id', csrfProtection, auth, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, req.user.userId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  });
});

// Get spending by category
router.get('/analytics/category', auth, (req, res) => {
  const { month, year } = req.query;
  let query = `
    SELECT c.name, SUM(t.amount) as total, t.type
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
  `;
  const params = [req.user.userId];

  if (month && year) {
    query += ` AND strftime('%m', t.date) = ? AND strftime('%Y', t.date) = ?`;
    params.push(month.padStart(2, '0'), year);
  }

  query += ` GROUP BY c.id, c.name, t.type ORDER BY total DESC`;

  db.all(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

module.exports = router;
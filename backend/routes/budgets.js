const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const auth = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const router = express.Router();

// Get budgets for current month
router.get('/', auth, (req, res) => {
  const { month, year } = req.query;
  const currentDate = new Date();
  const targetMonth = month || (currentDate.getMonth() + 1);
  const targetYear = year || currentDate.getFullYear();

  const query = `
    SELECT b.*, c.name as category_name,
           COALESCE(spent.total, 0) as spent_amount
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN (
      SELECT category_id, SUM(amount) as total
      FROM transactions
      WHERE user_id = ? AND type = 'expense'
        AND strftime('%m', date) = ? AND strftime('%Y', date) = ?
      GROUP BY category_id
    ) spent ON b.category_id = spent.category_id
    WHERE b.user_id = ? AND b.month = ? AND b.year = ?
  `;

  db.all(query, [
    req.user.userId, 
    targetMonth.toString().padStart(2, '0'), 
    targetYear.toString(),
    req.user.userId, 
    targetMonth, 
    targetYear
  ], (err, budgets) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(budgets);
  });
});

// Set budget
router.post('/', [
  csrfProtection,
  auth,
  body('category_id').isNumeric().withMessage('Category ID must be a number'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1-12'),
  body('year').isInt({ min: 2020 }).withMessage('Year must be valid')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category_id, amount, month, year } = req.body;

  // Check if budget already exists for this category/month/year
  db.get('SELECT id FROM budgets WHERE category_id = ? AND user_id = ? AND month = ? AND year = ?',
    [category_id, req.user.userId, month, year], (err, existing) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (existing) {
      // Update existing budget
      db.run('UPDATE budgets SET amount = ? WHERE id = ?', [amount, existing.id], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }
        res.json({ message: 'Budget updated successfully' });
      });
    } else {
      // Create new budget
      db.run('INSERT INTO budgets (category_id, user_id, amount, month, year) VALUES (?, ?, ?, ?, ?)',
        [category_id, req.user.userId, amount, month, year], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }
        res.json({ id: this.lastID, message: 'Budget set successfully' });
      });
    }
  });
});

// Get budget alerts (categories close to or over budget)
router.get('/alerts', auth, (req, res) => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const query = `
    SELECT b.*, c.name as category_name, spent.total as spent_amount,
           ROUND((spent.total / b.amount) * 100, 2) as percentage_used
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN (
      SELECT category_id, SUM(amount) as total
      FROM transactions
      WHERE user_id = ? AND type = 'expense'
        AND strftime('%m', date) = ? AND strftime('%Y', date) = ?
      GROUP BY category_id
    ) spent ON b.category_id = spent.category_id
    WHERE b.user_id = ? AND b.month = ? AND b.year = ?
      AND spent.total >= (b.amount * 0.8)
    ORDER BY percentage_used DESC
  `;

  db.all(query, [
    req.user.userId,
    month.toString().padStart(2, '0'),
    year.toString(),
    req.user.userId,
    month,
    year
  ], (err, alerts) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(alerts);
  });
});

module.exports = router;
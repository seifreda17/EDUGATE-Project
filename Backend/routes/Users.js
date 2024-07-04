const express = require('express');
const { body, validationResult } = require('express-validator');
const util = require('util');
const conn = require('../db/dbConnection'); // Adjust the path to your database connection module

const router = express.Router();

router.post(
  '/contact',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;

      const query = util.promisify(conn.query).bind(conn);
      await query(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message]
      );

      return res.status(200).json({ message: 'Contact message sent successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

router.get('/contact-messages', async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn);
    const messages = await query('SELECT name, email, subject, message, created_at FROM contact_messages');
    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;

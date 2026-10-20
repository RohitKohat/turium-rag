const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    // Ping the database to ensure connection is alive
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

module.exports = router;
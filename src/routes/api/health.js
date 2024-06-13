// routes/api/health.js

const express = require('express');
const router = express.Router();
const { version, author } = require('../package.json');

// Define the route handler for GET /health
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: version,
    author: author,
    githubUrl: 'https://github.com/rutarj/fragments',
  });
});

module.exports = router;

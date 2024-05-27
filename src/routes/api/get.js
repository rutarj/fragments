// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

// src/routes/api/get.js
const express = require('express');
const router = express.Router();
const { createSuccessResponse } = require('../../response');

router.get('/v1/fragments', (req, res) => {
  // Sample data
  const fragments = [
    { id: 1, content: 'Fragment 1' },
    { id: 2, content: 'Fragment 2' },
  ];

  res.json(createSuccessResponse({ fragments }));
});

module.exports = router;
module.exports = (req, res) => {
  // TODO: this is just a placeholder. To get something working, return an empty array...
  res.status(200).json({
    status: 'ok',
    // TODO: change me
    fragments: [],
  });
};

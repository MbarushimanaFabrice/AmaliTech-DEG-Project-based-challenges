'use strict';
exports.notFound = (req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    hint: 'See GET / for available endpoints.',
  });
};

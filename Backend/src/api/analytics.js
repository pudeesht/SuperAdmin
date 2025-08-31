
const express = require('express');
const { authenticateToken, requireSuperadmin } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Protect this route
router.use(authenticateToken);
router.use(requireSuperadmin);

// Define the route for the analytics summary
router.get('/analytics/summary', analyticsController.getSummary);

module.exports = router;
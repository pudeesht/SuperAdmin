
const express = require('express');
const { authenticateToken, requireSuperadmin } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.use(authenticateToken);
router.use(requireSuperadmin);

router.get('/analytics/summary', analyticsController.getSummary);

module.exports = router;
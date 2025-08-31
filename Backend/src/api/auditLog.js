const express = require('express');
const { authenticateToken, requireSuperadmin } = require('../middleware/authMiddleware');
const auditLogController = require('../controllers/auditLogControllers');

const router = express.Router();

router.use(authenticateToken);
router.use(requireSuperadmin);

router.get('/audit-logs', auditLogController.listAuditLogs);

module.exports = router;
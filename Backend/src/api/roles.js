// backend/src/api/roles.js

const express = require('express');
const { authenticateToken, requireSuperadmin } = require('../middleware/authMiddleware');
const roleController = require('../controllers/roleController');

const router = express.Router();

router.use(authenticateToken);
router.use(requireSuperadmin);


router.post('/assign-role', roleController.assignRoleToUser);


router.route('/roles')
  .get(roleController.listRoles)
  .post(roleController.createRole);

router.route('/roles/:id')
  .put(roleController.updateRole);

module.exports = router;
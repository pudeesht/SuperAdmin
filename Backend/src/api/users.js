const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireSuperadmin } = require('../middleware/authMiddleware');
const userController=require('../controllers/userControllers');


const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticateToken);
router.use(requireSuperadmin);


router.get('/', userController.listUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);



module.exports = router;
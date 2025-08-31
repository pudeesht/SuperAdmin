const express = require('express');
const { authenticateToken, requireSuperadmin } = require('../middleware/authMiddleware');
const userController=require('../controllers/userControllers');


// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();


const prisma = require('../prismaClient');

const router = express.Router();

router.use(authenticateToken);
router.use(requireSuperadmin);


router.get('/', userController.listUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);



module.exports = router;
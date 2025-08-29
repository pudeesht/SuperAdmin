const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireSuperadmin } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticateToken);
router.use(requireSuperadmin);

router.get('/', async (req, res) => {

  try {
    const users = await prisma.user.findMany({
      include: {
        roles: true,
      },
    });
    users.forEach(user => delete user.hashedPassword); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users.' });
  }
});

module.exports = router;
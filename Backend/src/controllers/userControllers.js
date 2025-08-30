

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const {logAction}=require('../services/auditLogService');

const prisma = new PrismaClient();

const listUsers = async (req, res) => {

    const { page = 1, limit = 10, search = '' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {};

    try {
        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                skip,
                take: limitNum,
                where,
                include: { roles: true },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        users.forEach(user => delete user.hashedPassword);

        res.json({
            data: users,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users.' });
    }
};



const getUserById = async (req, res) => {
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: { roles: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        delete user.hashedPassword;
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user.' });
    }
};





const createUser = async (req, res) => {
    const { email, password, name } = req.body;
    const actorUserId = req.user.userId;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                 email, 
                 hashedPassword, 
                 name ,
                 roles : {
                    connect :{ name : 'user'}
                }
            },

            include:{
                roles:true
            }
        });

        await logAction(actorUserId, 'CREATE_USER', 'USER', newUser.id, { email, name });

        delete newUser.hashedPassword;
        res.status(201).json(newUser);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }
        res.status(500).json({ message: 'Failed to create user.' });
    }
};



const updateUser = async (req, res) => {
    const { name, email } = req.body;
    const actorUserId = req.user.userId;
    const targetId = req.params.id;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: targetId },
            data: { name, email },
        });

        await logAction(actorUserId, 'UPDATE_USER', 'USER', targetId, { name, email });

        delete updatedUser.hashedPassword;
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user.' });
    }
};



const deleteUser = async (req, res) => {
    const actorUserId = req.user.userId;
    const targetId = req.params.id;

    if(targetId===actorUserId)
    {
        return res.status(403).json({message:"You cannot delete your own account"});
    }



    try {
        const userToDelete = await prisma.user.findUnique({ where: { id: targetId } });
        if (!userToDelete) return res.status(404).json({ message: 'User not found' });

        await prisma.user.delete({ where: { id: targetId } });

        await logAction(actorUserId, 'DELETE_USER', 'USER', targetId, { email: userToDelete.email });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user.', error });
    }
};

module.exports = {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
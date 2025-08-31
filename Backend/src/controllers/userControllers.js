const bcrypt = require("bcryptjs");
const { logAction } = require("../services/auditLogService");
const AppError = require("../utils/appError"); 



const prisma = require('../prismaClient');

const catchAsync=require('../utils/catchAsync');


exports.listUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limitNum,
      where,
      include: { roles: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  users.forEach((user) => delete user.hashedPassword);
  res.json({
    data: users,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
  });
});



exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { roles: true },
  });

  if (!user) {
    return next(new AppError(404, "User not found."));
  }
  delete user.hashedPassword;
  res.json(user);
});



exports.createUser = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return next(new AppError(400, "Email and password are required."));
  }


  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return next(new AppError(409, "A user with this email already exists."));  
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, hashedPassword, name, roles: { connect: { name: "user" } } },
    include: { roles: true },
  });

  await logAction(req.user.userId, "CREATE_USER", "USER", newUser.id, {
    email,
    name,
  });

  delete newUser.hashedPassword;
  res.status(201).json({message:"User created sucessfully",data:newUser});
});



exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: req.params.id },
    data: { name, email },
  });

  await logAction(req.user.userId, "UPDATE_USER", "USER", req.params.id, {
    name,
    email,
  });

  delete updatedUser.hashedPassword;
  res.json(updatedUser);
});



exports.deleteUser = catchAsync(async (req, res, next) => {
  const actorUserId = req.user.userId;
  const targetId = req.params.id;

  if (targetId === actorUserId) {
    return next(new AppError(403, "You cannot delete your own account."));
  }

  const userToDelete = await prisma.user.findUnique({
    where: { id: targetId },
  });
  if (!userToDelete) {
    return next(new AppError(404, "User not found"));
  }

  await prisma.user.delete({ where: { id: targetId } });
  await logAction(actorUserId, "DELETE_USER", "USER", targetId, {
    email: userToDelete.email,
  });

  res.status(204).send();
});

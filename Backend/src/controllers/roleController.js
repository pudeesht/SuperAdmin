
const { logAction } = require('../services/auditLogService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync'); 
const prisma = require('../prismaClient');


exports.listRoles = catchAsync(async (req, res, next) => {
  const roles = await prisma.role.findMany();
  res.status(200).json({ data: roles });
});


exports.createRole = catchAsync(async (req, res, next) => {
  const { name, permissions } = req.body;
  if (!name) {
    return next(new AppError('Role name is required.', 400));
  }

  const newRole = await prisma.role.create({
    data: {
      name,
      permissions,
    },
  });

  await logAction(req.user.userId, 'CREATE_ROLE', 'ROLE', newRole.id, { name });
  res.status(201).json({ data: newRole });
});

exports.updateRole = catchAsync(async (req, res, next) => {
  const { name, permissions } = req.body;
  const updatedRole = await prisma.role.update({
    where: { id: req.params.id },
    data: { name, permissions },
  });

  await logAction(req.user.userId, 'UPDATE_ROLE', 'ROLE', updatedRole.id, { name, permissions });
  res.status(200).json({ data: updatedRole });
});


exports.assignRoleToUser = catchAsync(async (req, res, next) => {
  const { userId, roleId } = req.body;

  if (!userId || !roleId) {
    return next(new AppError('Both userId and roleId are required.', 400));
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      roles: {
        connect: { id: roleId },
      },
    },
  });

  await logAction(req.user.userId, 'ASSIGN_ROLE', 'USER', userId, { roleId });
  res.status(200).json({ message: 'Role assigned successfully.' });
});
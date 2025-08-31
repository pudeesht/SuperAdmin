
const prisma = require('../prismaClient');
const catchAsync = require('../utils/catchAsync');

exports.listAuditLogs = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, userId, action, startDate, endDate } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (userId) {
    where.actorUserId = userId;
  }
  if (action) {
    where.action = { contains: action, mode: 'insensitive' };
  }
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) {
      where.timestamp.gte = new Date(startDate); 
    }
    if (endDate) {
      where.timestamp.lte = new Date(endDate); 
    }
  }

  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      skip,
      take: limitNum,
      where,
      orderBy: { timestamp: 'desc' },
      include: {
        actor: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  res.status(200).json({
    data: logs,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
  });
});
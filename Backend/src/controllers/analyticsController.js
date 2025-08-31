const prisma = require('../prismaClient');
const catchAsync = require('../utils/catchAsync');

exports.getSummary = catchAsync(async (req, res, next) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalUsers, totalRoles, recentLoginsCount] = await prisma.$transaction([
    prisma.user.count(),

    prisma.role.count(),
    
    prisma.user.count({
      where: {
        lastLogin: {
          gte: sevenDaysAgo, 
        },
      },
    }),
  ]);

  res.status(200).json({
    data: {
      totalUsers,
      totalRoles,
      activeUsersLast7Days: recentLoginsCount,
    },
  });
});
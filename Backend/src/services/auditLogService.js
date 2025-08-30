
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @param {string} actorUserId 
 * @param {string} action 
 * @param {string} targetType 
 * @param {string} targetId 
 * @param {object} details 
 */
async function logAction(actorUserId, action, targetType, targetId, details = {}) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        targetType,
        targetId,
        details,
        actorUserId,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

module.exports = { logAction };
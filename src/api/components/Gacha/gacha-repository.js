const { Gacha } = require('../../../models');

async function createGachaLog(userId, prizeName, won) {
  return Gacha.create({ userId, prizeName, won });
}

async function countUserGachaToday(userId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return Gacha.countDocuments({
    userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
}

async function countPrizeWinners(prizeName) {
  return Gacha.countDocuments({ prizeName, won: true });
}

async function getUserHistory(userId) {
  return Gacha.find({ userId }).sort({ createdAt: -1 });
}

async function getAllGachaLogs() {
  return Gacha.find({ won: true });
}

module.exports = {
  createGachaLog,
  countUserGachaToday,
  countPrizeWinners,
  getUserHistory,
  getAllGachaLogs,
};

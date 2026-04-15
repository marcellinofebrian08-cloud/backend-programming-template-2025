const gachaRepository = require('./gacha-repository');
const models = require('../../../models');

function maskName(name) {
  if (!name) return name;
  const parts = name.split(' ');
  return parts
    .map((word) => {
      if (word.length <= 2) return word;
      let result = word[0];
      for (let i = 1; i < word.length - 1; i++) {
        result += '*';
      }
      result += word[word.length - 1];
      return result;
    })
    .join(' ');
}

function getRandomPrize(prizes) {
  let totalWeight = 0;
  for (let i = 0; i < prizes.length; i++) {
    totalWeight += prizes[i].weight;
  }

  let random = Math.random() * totalWeight;
  for (let i = 0; i < prizes.length; i++) {
    random -= prizes[i].weight;
    if (random <= 0) {
      return prizes[i];
    }
  }
}

async function rollGacha(userId) {
  const gachaCount = await gachaRepository.countUserGachaToday(userId);
  if (gachaCount >= 5) {
    throw new Error('LIMIT_EXCEEDED');
  }

  const allPrizes = await models.Prize.find();
  const availablePrizes = [];

  for (let i = 0; i < allPrizes.length; i++) {
    const prize = allPrizes[i];
    const winners = await gachaRepository.countPrizeWinners(prize.name);

    if (winners < prize.kuota) {
      availablePrizes.push(prize);
    }
  }
  if (availablePrizes.length === 0) {
    await gachaRepository.createGachaLog(userId, 'Zonk', false);
    return {
      win: false,
      prize: 'Zonk',
      message: 'Semua hadiah sudah habis',
    };
  }

  const isWinningRoll = Math.random() < 0.5;

  if (!isWinningRoll) {
    await gachaRepository.createGachaLog(userId, 'Zonk', false);
    return { win: false, prize: 'Zonk' };
  }

  const prize = getRandomPrize(availablePrizes);

  await gachaRepository.createGachaLog(userId, prize.name, true);

  return {
    win: true,
    prize: prize.name,
  };
}

// [BONUS POINT 1] Get History Gacha
async function getHistory(userId) {
  return gachaRepository.getUserHistory(userId);
}

// [BONUS POINT 2] Get Prize Status & Sisa Kuota
async function getPrizeStatus() {
  const status = [];
  const allPrizes = await models.Prize.find();

  for (let i = 0; i < allPrizes.length; i++) {
    const prize = allPrizes[i];
    const winners = await gachaRepository.countPrizeWinners(prize.name);

    status.push({
      hadiah: prize.name,
      total_kuota: prize.kuota,
      sudah_dimenangkan: winners,
      sisa_kuota: prize.kuota - winners,
    });
  }

  return status;
}

// [BONUS POINT 3] List Pemenang dengan nama disamarkan (Masked)
async function getWinnerList() {
  const logs = await gachaRepository.getAllGachaLogs();

  return logs.map((log) => ({
    prize: log.prizeName,
    winner: maskName(log.userId), // Memanggil fungsi masking
  }));
}

module.exports = {
  rollGacha,
  getHistory,
  getPrizeStatus,
  getWinnerList,
};

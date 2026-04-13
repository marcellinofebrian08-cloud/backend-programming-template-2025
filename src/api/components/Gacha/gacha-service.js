const gachaRepository = require('./gacha-repository');

const PRIZES = [
  { name: 'Emas 10 gram', kuota: 1, weight: 1 },
  { name: 'Smartphone X', kuota: 5, weight: 5 },
  { name: 'Smartwatch Y', kuota: 10, weight: 10 },
  { name: 'Voucher Rp100.000', kuota: 100, weight: 30 },
  { name: 'Pulsa Rp50.000', kuota: 500, weight: 50 },
];

async function rollGacha(userId) {
  const gachaCount = await gachaRepository.countUserGachaToday(userId);
  if (gachaCount >= 5) {
    throw new Error('LIMIT_EXCEEDED');
  }

  const isWinningRoll = Math.random() < 0.3;

  if (!isWinningRoll) {
    await gachaRepository.createGachaLog(userId, 'Zonk', false);
    return { win: false, prize: 'Zonk' };
  }

  const shuffledPrizes = [...PRIZES].sort(() => 0.5 - Math.random());

  for (let i = 0; i < shuffledPrizes.length; i += 1) {
    const prize = shuffledPrizes[i];

    const currentWinners = await gachaRepository.countPrizeWinners(prize.name);

    if (currentWinners < prize.kuota) {
      await gachaRepository.createGachaLog(userId, prize.name, true);
      return { win: true, prize: prize.name };
    }
  }

  await gachaRepository.createGachaLog(userId, 'Zonk', false);
  return { win: false, prize: 'Zonk' };
}

async function getHistory(userId) {
  return gachaRepository.getUserHistory(userId);
}

async function getPrizeStatus() {
  const status = [];
  for (let i = 0; i < PRIZES.length; i += 1) {
    const prize = PRIZES[i];
    const winners = await gachaRepository.countPrizeWinners(prize.name);
    status.push({
      hadiah: prize.name,
      sisa_kuota: prize.kuota - winners,
    });
  }
  return status;
}

function maskName(name) {
  if (!name || name.length <= 2) return name;
  const first = name[0];
  const last = name[name.length - 1];
  const middle = name.slice(1, -1).replace(/[a-zA-Z]/g, '*');
  return `${first}${middle}${last}`;
}

async function getWinnerList() {
  const logs = await gachaRepository.getAllGachaLogs();
  return logs.map((log) => ({
    prize: log.prizeName,
    winner: maskName(log.userId),
  }));
}

module.exports = {
  rollGacha,
  getHistory,
  getPrizeStatus,
  getWinnerList,
};

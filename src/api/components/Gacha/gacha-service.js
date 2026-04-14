const gachaRepository = require('./gacha-repository');

const PRIZES = [
  { name: 'Emas 10 gram', kuota: 1, weight: 1 },
  { name: 'Smartphone X', kuota: 5, weight: 5 },
  { name: 'Smartwatch Y', kuota: 10, weight: 10 },
  { name: 'Voucher Rp100.000', kuota: 100, weight: 30 },
  { name: 'Pulsa Rp50.000', kuota: 500, weight: 50 },
];

// random hadiah berdasarkan weight (versi simpel)
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

// masking nama (biar sesuai soal)
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

async function rollGacha(userId) {
  const gachaCount = await gachaRepository.countUserGachaToday(userId);

  // limit 5x per hari
  if (gachaCount >= 5) {
    throw new Error('LIMIT_EXCEEDED');
  }

  // ambil jumlah pemenang tiap hadiah
  const availablePrizes = [];

  for (let i = 0; i < PRIZES.length; i++) {
    const prize = PRIZES[i];
    const winners = await gachaRepository.countPrizeWinners(prize.name);

    if (winners < prize.kuota) {
      availablePrizes.push(prize);
    }
  }

  // kalau semua hadiah habis
  if (availablePrizes.length === 0) {
    await gachaRepository.createGachaLog(userId, 'Zonk', false);

    return {
      win: false,
      prize: 'Zonk',
      message: 'Semua hadiah sudah habis',
    };
  }

  // peluang menang
  const isWinningRoll = Math.random() < 0.5;

  if (!isWinningRoll) {
    await gachaRepository.createGachaLog(userId, 'Zonk', false);
    return { win: false, prize: 'Zonk' };
  }

  // ambil hadiah pakai weight
  const prize = getRandomPrize(availablePrizes);

  await gachaRepository.createGachaLog(userId, prize.name, true);

  return {
    win: true,
    prize: prize.name,
  };
}

async function getHistory(userId) {
  return gachaRepository.getUserHistory(userId);
}

async function getPrizeStatus() {
  const status = [];

  for (let i = 0; i < PRIZES.length; i++) {
    const prize = PRIZES[i];
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

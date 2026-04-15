// src/utils/seeds/prizes-seeds.js
const mongoose = require('mongoose');

const prizesData = [
  { name: 'Emas 10 gram', kuota: 1, weight: 1 },
  { name: 'Smartphone X', kuota: 5, weight: 5 },
  { name: 'Smartwatch Y', kuota: 10, weight: 10 },
  { name: 'Voucher Rp100.000', kuota: 100, weight: 30 },
  { name: 'Pulsa Rp50.000', kuota: 500, weight: 50 },
];

async function seedPrizes() {
  try {
    const Prize = mongoose.model('Prize');

    await Prize.deleteMany({});
    const result = await Prize.insertMany(prizesData);

    console.log(
      `BERHASIL: ${result.length} data masuk ke collection prizes.`
    );
  } catch (error) {
    console.error('ERROR SEEDING:', error.message);
  }
}

module.exports = seedPrizes;

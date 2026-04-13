const gachaService = require('./gacha-service');

async function playGacha(request, response, next) {
  try {
    const { userId } = request.body;

    if (!userId) {
      return response.status(400).json({ message: 'User ID is required' });
    }

    const result = await gachaService.rollGacha(userId);

    return response.status(200).json({
      message: result.win ? 'Selamat! Anda menang!' : 'Maaf, coba lagi besok.',
      prize: result.prize,
    });
  } catch (error) {
    if (error.message === 'LIMIT_EXCEEDED') {
      return response.status(403).json({
        error: 'kuota Full',
        message:
          'Setiap user hanya bisa melakukan gacha maksimal 5 kali dalam 1 hari.',
      });
    }
    next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const { userId } = request.params;
    const history = await gachaService.getHistory(userId);
    return response.status(200).json(history);
  } catch (error) {
    next(error);
  }
}

async function getPrizeStatus(request, response, next) {
  try {
    const status = await gachaService.getPrizeStatus();
    return response.status(200).json(status);
  } catch (error) {
    next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const winners = await gachaService.getWinnerList();
    return response.status(200).json(winners);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  playGacha,
  getHistory,
  getPrizeStatus,
  getWinners,
};

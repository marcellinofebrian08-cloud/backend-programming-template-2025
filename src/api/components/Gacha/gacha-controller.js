const gachaService = require('./gacha-service');

async function playGacha(request, response, next) {
  try {
    const { userId } = request.body;

    // validasi input
    if (!userId) {
      return response.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const result = await gachaService.rollGacha(userId);

    return response.status(200).json({
      success: true,
      message: result.win
        ? `Selamat! Anda mendapatkan ${result.prize}`
        : result.message || 'Maaf, Anda belum beruntung',
      prize: result.prize,
    });
  } catch (error) {
    // limit gacha
    if (error.message === 'LIMIT_EXCEEDED') {
      return response.status(403).json({
        success: false,
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

    return response.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

async function getPrizeStatus(request, response, next) {
  try {
    const status = await gachaService.getPrizeStatus();

    return response.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const winners = await gachaService.getWinnerList();

    return response.status(200).json({
      success: true,
      data: winners,
    });
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

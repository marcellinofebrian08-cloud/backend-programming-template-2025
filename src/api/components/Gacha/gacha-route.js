const express = require('express');
const gachaController = require('./gacha-controller');
const router = express.Router();

module.exports = (app) => {
  app.use('/gacha', router);

  router.post('/', gachaController.playGacha);
  router.get('/history/:userId', gachaController.getHistory);
  router.get('/prizes', gachaController.getPrizeStatus);
  router.get('/winners', gachaController.getWinners);
};

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const config = require('../core/config');
const logger = require('../core/logger')('app');
const seedPrizes = require('../utils/seeds/prizes-seeds');

const dbExports = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(mongoose);
    dbExports[model.modelName] = model;
  });

const dbUri = `${config.database.connection}/${config.database.name}`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    logger.info(
      `Successfully connected to MongoDB: ${mongoose.connection.name}`
    );

    await seedPrizes();
    logger.info('Prize database has been initialized');
  } catch (error) {
    logger.error('Failed to connect or seed: ' + error.message);
  }
};

connectDB();

dbExports.db = mongoose.connection;
module.exports = dbExports;

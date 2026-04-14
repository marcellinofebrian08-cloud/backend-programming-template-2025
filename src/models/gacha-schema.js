module.exports = (mongoose) => {
  const gachaSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    prizeName: {
      type: String,
      required: true,
    },
    won: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model('Gacha', gachaSchema);
};

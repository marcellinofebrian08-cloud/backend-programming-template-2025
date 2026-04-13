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

  // Nama model harus 'Gacha' agar nanti bisa dipanggil lewat dbExports.Gacha
  return mongoose.model('Gacha', gachaSchema);
};

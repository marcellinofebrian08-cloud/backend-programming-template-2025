module.exports = (mongoose) => {
  const prizeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    kuota: { type: Number, required: true },
    weight: { type: Number, required: true },
  });

  return mongoose.model('Prize', prizeSchema);
};

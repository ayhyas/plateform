const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('ERREUR: la variable d\'environnement MONGODB_URI est manquante.');
    process.exit(1);
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connecte: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('Echec de connexion a MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;

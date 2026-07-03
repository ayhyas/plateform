require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Question = require('../models/Question');
const ExamSettings = require('../models/ExamSettings');
const questions = require('./questions');

async function seed() {
  await connectDB();

  const existingCount = await Question.countDocuments();
  if (existingCount > 0) {
    console.log(`La banque de questions contient déjà ${existingCount} question(s). Aucune question ajoutée.`);
  } else {
    const docs = questions.map((q, idx) => ({ ...q, order: idx }));
    await Question.insertMany(docs);
    console.log(`${docs.length} questions insérées avec succès.`);
  }

  const settings = await ExamSettings.getSingleton();
  console.log('Paramètres de l\'examen (existants ou par défaut) :', {
    title: settings.title,
    durationMinutes: settings.durationMinutes,
    totalQuestions: settings.totalQuestions,
    passingScore: settings.passingScore,
    isActive: settings.isActive,
  });

  await mongoose.disconnect();
  console.log('Seed terminé.');
}

seed().catch((err) => {
  console.error('Erreur lors du seed:', err);
  process.exit(1);
});

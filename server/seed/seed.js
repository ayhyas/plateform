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
    console.log(`La banque de questions contient deja ${existingCount} question(s). Aucune question ajoutee.`);
  } else {
    const docs = questions.map((q, idx) => ({ ...q, order: idx }));
    await Question.insertMany(docs);
    console.log(`${docs.length} questions inserees avec succes.`);
  }

  const settings = await ExamSettings.getSingleton();
  console.log('Parametres de l\'examen (existants ou par defaut) :', {
    title: settings.title,
    durationMinutes: settings.durationMinutes,
    totalQuestions: settings.totalQuestions,
    passingScore: settings.passingScore,
    isActive: settings.isActive,
  });

  await mongoose.disconnect();
  console.log('Seed termine.');
}

seed().catch((err) => {
  console.error('Erreur lors du seed:', err);
  process.exit(1);
});

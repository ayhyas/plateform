const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const ExamSettings = require('../models/ExamSettings');
const { shuffle } = require('../utils/shuffle');
const { signStudentToken } = require('../utils/jwt');
const { finalizeAttempt, remainingSeconds } = require('../utils/attemptHelpers');

function sanitizeCNE(cne) {
  return String(cne || '').trim().toUpperCase();
}

function publicSettings(settings) {
  return {
    title: settings.title,
    university: settings.university,
    faculty: settings.faculty,
    degree: settings.degree,
    durationMinutes: settings.durationMinutes,
    totalQuestions: settings.totalQuestions,
  };
}

// GET /api/student/status
async function getStatus(req, res) {
  const settings = await ExamSettings.getSingleton();
  const now = new Date();

  let isOpen = settings.isActive;
  let message = null;

  if (!settings.isActive) {
    message = "L'examen n'est pas actif pour le moment.";
    isOpen = false;
  } else if (settings.startAt && now < settings.startAt) {
    message = `L'examen ouvrira le ${settings.startAt.toLocaleString('fr-FR')}.`;
    isOpen = false;
  } else if (settings.endAt && now > settings.endAt) {
    message = "La periode de l'examen est terminee.";
    isOpen = false;
  }

  res.json({ isOpen, message, settings: publicSettings(settings) });
}

// POST /api/student/login  { nom, prenom, cne }
async function login(req, res) {
  const nom = String(req.body.nom || '').trim();
  const prenom = String(req.body.prenom || '').trim();
  const cne = sanitizeCNE(req.body.cne);

  if (!nom || !prenom || !cne) {
    return res.status(400).json({ message: 'Nom, prenom et CNE sont requis.' });
  }

  const settings = await ExamSettings.getSingleton();
  const now = new Date();

  if (!settings.isActive) {
    return res.status(403).json({ message: "L'examen n'est pas actif pour le moment." });
  }
  if (settings.startAt && now < settings.startAt) {
    return res.status(403).json({ message: `L'examen ouvrira le ${settings.startAt.toLocaleString('fr-FR')}.` });
  }
  if (settings.endAt && now > settings.endAt) {
    return res.status(403).json({ message: "La periode de l'examen est terminee." });
  }

  let attempt = await Attempt.findOne({ cne });

  if (attempt) {
    if (attempt.status === 'completed') {
      return res.status(409).json({ code: 'ALREADY_COMPLETED', message: 'Vous avez deja passe cet examen.' });
    }
    if (attempt.isExpired()) {
      await finalizeAttempt(attempt);
      return res.status(409).json({ code: 'ALREADY_COMPLETED', message: "Le temps imparti pour votre tentative precedente est ecoule." });
    }
    // Resume existing in-progress attempt.
    const token = signStudentToken(attempt._id);
    return res.json({
      token,
      nom: attempt.nom,
      prenom: attempt.prenom,
      totalQuestions: attempt.totalQuestions,
      durationMinutes: attempt.durationMinutes,
      currentIndex: attempt.currentIndex,
      remainingSeconds: remainingSeconds(attempt),
    });
  }

  const activeQuestions = await Question.find({ active: true });
  if (activeQuestions.length === 0) {
    return res.status(503).json({ message: "Aucune question n'est disponible pour le moment. Contactez l'administrateur." });
  }

  const questionCount = Math.min(settings.totalQuestions, activeQuestions.length);
  const chosen = shuffle(activeQuestions).slice(0, questionCount);

  const questionOrder = chosen.map((q) => ({
    questionId: q._id,
    choiceOrder: shuffle(q.choices.map((_, idx) => idx)),
  }));

  try {
    attempt = await Attempt.create({
      nom,
      prenom,
      cne,
      questionOrder,
      totalQuestions: questionOrder.length,
      passingScore: settings.passingScore,
      durationMinutes: settings.durationMinutes,
      startedAt: new Date(),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ code: 'ALREADY_COMPLETED', message: 'Une tentative existe deja pour ce CNE.' });
    }
    throw err;
  }

  const token = signStudentToken(attempt._id);
  res.status(201).json({
    token,
    nom: attempt.nom,
    prenom: attempt.prenom,
    totalQuestions: attempt.totalQuestions,
    durationMinutes: attempt.durationMinutes,
    currentIndex: 0,
    remainingSeconds: remainingSeconds(attempt),
  });
}

async function loadCurrentQuestion(attempt) {
  const entry = attempt.questionOrder[attempt.currentIndex];
  const question = await Question.findById(entry.questionId);
  const choices = entry.choiceOrder.map((originalIdx) => question.choices[originalIdx]);
  return { text: question.text, choices };
}

// GET /api/student/exam/current
async function getCurrentQuestion(req, res) {
  const attempt = req.attempt;

  if (attempt.status === 'completed') {
    return res.status(409).json({ code: 'ALREADY_COMPLETED', message: 'Examen deja termine.' });
  }

  if (attempt.isExpired()) {
    await finalizeAttempt(attempt);
    return res.status(409).json({ code: 'TIME_UP', message: 'Le temps imparti est ecoule.' });
  }

  if (attempt.currentIndex >= attempt.totalQuestions) {
    await finalizeAttempt(attempt);
    return res.status(409).json({ code: 'ALREADY_COMPLETED', message: 'Examen deja termine.' });
  }

  const question = await loadCurrentQuestion(attempt);

  res.json({
    index: attempt.currentIndex,
    total: attempt.totalQuestions,
    remainingSeconds: remainingSeconds(attempt),
    question,
  });
}

// POST /api/student/exam/answer  { choiceIndex }
async function submitAnswer(req, res) {
  const attempt = req.attempt;
  const { choiceIndex } = req.body;

  if (attempt.status === 'completed') {
    return res.status(409).json({ code: 'ALREADY_COMPLETED', message: 'Examen deja termine.' });
  }

  if (attempt.isExpired()) {
    await finalizeAttempt(attempt);
    return res.status(409).json({ code: 'TIME_UP', message: 'Le temps imparti est ecoule.' });
  }

  if (attempt.currentIndex >= attempt.totalQuestions) {
    await finalizeAttempt(attempt);
    return res.status(409).json({ code: 'ALREADY_COMPLETED', message: 'Examen deja termine.' });
  }

  const entry = attempt.questionOrder[attempt.currentIndex];
  if (
    typeof choiceIndex !== 'number' ||
    choiceIndex < 0 ||
    choiceIndex >= entry.choiceOrder.length
  ) {
    return res.status(400).json({ message: 'Reponse invalide.' });
  }

  const question = await Question.findById(entry.questionId);
  const originalIndex = entry.choiceOrder[choiceIndex];
  const isCorrect = originalIndex === question.correctIndex;

  attempt.answers.push({
    questionId: question._id,
    selectedChoiceIndex: originalIndex,
    isCorrect,
  });
  attempt.currentIndex += 1;

  const finished = attempt.currentIndex >= attempt.totalQuestions;

  if (finished) {
    await finalizeAttempt(attempt);
    return res.json({ completed: true });
  }

  await attempt.save();
  res.json({ completed: false, nextIndex: attempt.currentIndex });
}

module.exports = { getStatus, login, getCurrentQuestion, submitAnswer };

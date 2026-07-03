const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const ExamSettings = require('../models/ExamSettings');
const { signAdminToken } = require('../utils/jwt');
const { buildResultsWorkbook } = require('../utils/excelExport');

// POST /api/admin/login { username, password }
async function login(req, res) {
  const { username, password } = req.body;

  const validUsername = username === process.env.ADMIN_USERNAME;
  const validPassword = password === process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }

  const token = signAdminToken();
  res.json({ token });
}

// GET /api/admin/students
async function listStudents(req, res) {
  const attempts = await Attempt.find().sort({ createdAt: -1 });

  const results = attempts.map((a) => ({
    id: a._id,
    nom: a.nom,
    prenom: a.prenom,
    cne: a.cne,
    score: a.status === 'completed' ? a.score : null,
    totalQuestions: a.totalQuestions,
    passingScore: a.passingScore,
    status: a.status,
    passed: a.status === 'completed' ? a.score >= a.passingScore : null,
    startedAt: a.startedAt,
    completedAt: a.completedAt,
  }));

  res.json({ students: results });
}

// DELETE /api/admin/students/:id
async function deleteStudent(req, res) {
  const attempt = await Attempt.findByIdAndDelete(req.params.id);
  if (!attempt) return res.status(404).json({ message: 'Tentative introuvable.' });
  res.json({ message: 'Tentative supprimee.' });
}

// GET /api/admin/export
async function exportResults(req, res) {
  const attempts = await Attempt.find().sort({ nom: 1, prenom: 1 });
  const settings = await ExamSettings.getSingleton();

  const buffer = await buildResultsWorkbook(attempts, settings);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename="resultats_examen_datascience.xlsx"');
  res.send(Buffer.from(buffer));
}

// ---- Questions ----

// GET /api/admin/questions
async function listQuestions(req, res) {
  const questions = await Question.find().sort({ order: 1, createdAt: 1 });
  res.json({ questions });
}

// POST /api/admin/questions
async function createQuestion(req, res) {
  const { text, choices, correctIndex, order, active } = req.body;
  const question = await Question.create({
    text,
    choices,
    correctIndex,
    order: order ?? 0,
    active: active ?? true,
  });
  res.status(201).json({ question });
}

// PUT /api/admin/questions/:id
async function updateQuestion(req, res) {
  const { text, choices, correctIndex, order, active } = req.body;
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: 'Question introuvable.' });

  if (text !== undefined) question.text = text;
  if (choices !== undefined) question.choices = choices;
  if (correctIndex !== undefined) question.correctIndex = correctIndex;
  if (order !== undefined) question.order = order;
  if (active !== undefined) question.active = active;

  await question.save();
  res.json({ question });
}

// DELETE /api/admin/questions/:id
async function deleteQuestion(req, res) {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) return res.status(404).json({ message: 'Question introuvable.' });
  res.json({ message: 'Question supprimee.' });
}

// ---- Settings ----

// GET /api/admin/settings
async function getSettings(req, res) {
  const settings = await ExamSettings.getSingleton();
  res.json({ settings });
}

// PUT /api/admin/settings
async function updateSettings(req, res) {
  const settings = await ExamSettings.getSingleton();
  const fields = [
    'title',
    'university',
    'faculty',
    'degree',
    'startAt',
    'endAt',
    'durationMinutes',
    'totalQuestions',
    'passingScore',
    'isActive',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  });
  await settings.save();
  res.json({ settings });
}

module.exports = {
  login,
  listStudents,
  deleteStudent,
  exportResults,
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getSettings,
  updateSettings,
};

const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedChoiceIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    answeredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const questionOrderSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    // choiceOrder[displayPosition] = originalChoiceIndex
    choiceOrder: { type: [Number], required: true },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    cne: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },
    questionOrder: { type: [questionOrderSchema], required: true },
    answers: { type: [answerSchema], default: [] },
    currentIndex: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
    passingScore: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

attemptSchema.methods.deadline = function () {
  return new Date(this.startedAt.getTime() + this.durationMinutes * 60 * 1000);
};

attemptSchema.methods.isExpired = function () {
  return this.status === 'in-progress' && Date.now() > this.deadline().getTime();
};

module.exports = mongoose.model('Attempt', attemptSchema);

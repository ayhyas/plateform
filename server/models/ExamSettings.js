const mongoose = require('mongoose');

const examSettingsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Examen de Data Science',
    },
    university: {
      type: String,
      default: 'Universite Chouaib Doukali',
    },
    faculty: {
      type: String,
      default: 'Faculte des Sciences',
    },
    degree: {
      type: String,
      default: 'Licence',
    },
    startAt: {
      type: Date,
      default: null,
    },
    endAt: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 30,
      min: 1,
    },
    totalQuestions: {
      type: Number,
      default: 20,
      min: 1,
    },
    passingScore: {
      type: Number,
      default: 10,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Singleton helper: always returns (and creates if needed) the single settings document.
examSettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('ExamSettings', examSettingsSchema);

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Le texte de la question est requis'],
      trim: true,
    },
    choices: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 2 && arr.length <= 6,
        message: 'Une question doit avoir entre 2 et 6 choix',
      },
      required: true,
    },
    correctIndex: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return Number.isInteger(value) && value >= 0 && value < this.choices.length;
        },
        message: 'correctIndex doit correspondre a un choix valide',
      },
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);

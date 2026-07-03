// Finalizes an in-progress attempt: computes the score and marks it completed.
// Any questions left unanswered (e.g. because the timer ran out) simply do not
// count towards the score.
async function finalizeAttempt(attempt) {
  if (attempt.status === 'completed') return attempt;

  attempt.score = attempt.answers.filter((a) => a.isCorrect).length;
  attempt.status = 'completed';
  attempt.completedAt = new Date();
  await attempt.save();
  return attempt;
}

function remainingSeconds(attempt) {
  const deadline = attempt.deadline().getTime();
  const remaining = Math.floor((deadline - Date.now()) / 1000);
  return Math.max(0, remaining);
}

module.exports = { finalizeAttempt, remainingSeconds };

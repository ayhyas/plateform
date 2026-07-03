// Centralized error handler. Any error passed to next(err) or thrown inside
// an async route wrapped with asyncHandler ends up here.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Un étudiant avec ce CNE a déjà une tentative enregistrée.' });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Erreur serveur interne' });
}

function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { errorHandler, asyncHandler };

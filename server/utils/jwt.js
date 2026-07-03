const jwt = require('jsonwebtoken');

function signStudentToken(attemptId) {
  return jwt.sign({ role: 'student', attemptId }, process.env.JWT_SECRET, {
    expiresIn: '6h',
  });
}

function signAdminToken() {
  return jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signStudentToken, signAdminToken, verifyToken };

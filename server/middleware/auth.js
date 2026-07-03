const { verifyToken } = require('../utils/jwt');
const Attempt = require('../models/Attempt');

function getTokenFromHeader(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

async function studentAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: 'Authentification requise' });

    const payload = verifyToken(token);
    if (payload.role !== 'student' || !payload.attemptId) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    const attempt = await Attempt.findById(payload.attemptId);
    if (!attempt) return res.status(401).json({ message: 'Session introuvable' });

    req.attempt = attempt;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expirée ou invalide' });
  }
}

function adminAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: 'Authentification requise' });

    const payload = verifyToken(token);
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    req.admin = true;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expirée ou invalide' });
  }
}

module.exports = { studentAuth, adminAuth };

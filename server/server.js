require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Variables d'environnement manquantes: ${missing.join(', ')}`);
  process.exit(1);
}

connectDB();

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '200kb' }));
app.use(mongoSanitize());

const allowedOrigin = process.env.CLIENT_URL;
app.use(
  cors({
    origin: allowedOrigin || true,
    credentials: true,
  })
);

app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur demarre sur le port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

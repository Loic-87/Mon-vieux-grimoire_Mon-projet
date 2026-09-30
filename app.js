require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

const app = express();

// Connexion a la base de donnees MongoDB (URL stockee dans le fichier .env)
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connexion a MongoDB reussie'))
  .catch((error) => console.log('Connexion a MongoDB echouee :', error.message));

// Middleware CORS : autorise le front (autre origine) a appeler cette API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

// Helmet : ajoute des en-tetes HTTP securises.
// crossOriginResourcePolicy en "cross-origin" pour que le front (port 3000)
// puisse afficher les images servies par l'API (port 4000).
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Middleware global : permet de lire le corps JSON des requetes (req.body)
app.use(express.json());

// Sert les images enregistrees de maniere statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// Rate limiting : limite chaque IP a 100 requetes par tranche de 15 minutes
// (protege notamment contre le brute-force sur la connexion)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes d'authentification (inscription et connexion)
app.use('/api/auth', userRoutes);

// Routes des livres
app.use('/api/books', bookRoutes);

module.exports = app;

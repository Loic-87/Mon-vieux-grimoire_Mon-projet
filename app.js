require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

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

// Middleware global : permet de lire le corps JSON des requetes (req.body)
app.use(express.json());

// Routes d'authentification (inscription et connexion)
app.use('/api/auth', userRoutes);

module.exports = app;

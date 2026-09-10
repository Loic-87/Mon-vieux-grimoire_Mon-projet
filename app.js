require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connexion a la base de donnees MongoDB (URL stockee dans le fichier .env)
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connexion a MongoDB reussie'))
  .catch((error) => console.log('Connexion a MongoDB echouee :', error.message));

// Middleware global : permet de lire le corps JSON des requetes (req.body)
app.use(express.json());

// Premiere route de test pour verifier que le serveur repond
app.get('/api/test', (req, res) => {
  res.json({ message: 'Le serveur repond correctement' });
});

module.exports = app;

const express = require('express');

const app = express();

// Middleware global : permet de lire le corps JSON des requetes (req.body)
app.use(express.json());

// Premiere route de test pour verifier que le serveur repond
app.get('/api/test', (req, res) => {
  res.json({ message: 'Le serveur repond correctement' });
});

module.exports = app;

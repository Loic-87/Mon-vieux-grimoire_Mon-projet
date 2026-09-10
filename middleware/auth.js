const jwt = require('jsonwebtoken');

// Middleware d'authentification : verifie le token JWT envoye par le front
module.exports = (req, res, next) => {
  try {
    // Le token est envoye dans l'en-tete "Authorization: Bearer <token>"
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const { userId } = decodedToken;
    // On stocke l'userId pour les controllers suivants (verifier le proprietaire)
    req.auth = { userId };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

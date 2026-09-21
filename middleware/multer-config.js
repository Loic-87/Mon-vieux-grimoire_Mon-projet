const multer = require('multer');

// On garde l'image en memoire (buffer) : elle sera optimisee par sharp
// avant d'etre ecrite sur le disque (approche "green code").
const storage = multer.memoryStorage();

// Une seule image attendue, dans le champ "image"
module.exports = multer({ storage }).single('image');

const multer = require('multer');

// Types d'images acceptes et extension de fichier correspondante
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// On stocke les images sur le disque, dans le dossier "images"
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // On nettoie le nom (espaces -> _) et on retire l'extension d'origine
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + Date.now() + '.' + extension);
  },
});

// Une seule image attendue, dans le champ "image"
module.exports = multer({ storage }).single('image');

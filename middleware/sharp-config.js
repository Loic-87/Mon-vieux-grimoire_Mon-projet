const sharp = require('sharp');
const path = require('path');

// Middleware d'optimisation d'image (green code).
// S'execute APRES multer : redimensionne et convertit l'image en WebP compresse,
// puis l'ecrit dans le dossier "images". Reduit fortement le poids des fichiers.
module.exports = async (req, res, next) => {
  // Pas d'image envoyee (ex : modification sans nouvelle image) -> on passe
  if (!req.file) {
    return next();
  }
  try {
    const name = req.file.originalname.split(' ').join('_').split('.')[0];
    const filename = `${name}_${Date.now()}.webp`;
    await sharp(req.file.buffer)
      .resize({ width: 463 })
      .webp({ quality: 80 })
      .toFile(path.join('images', filename));
    // On expose le nom du fichier optimise pour le controller (imageUrl)
    req.file.filename = filename;
    return next();
  } catch (error) {
    return next(error);
  }
};

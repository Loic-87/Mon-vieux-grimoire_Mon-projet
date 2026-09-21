const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const optimizeImage = require('../middleware/sharp-config');
const bookCtrl = require('../controllers/book');

// Routes de lecture (publiques)
// Attention a l'ordre : "/bestrating" doit etre declare AVANT "/:id",
// sinon Express interpreterait "bestrating" comme un id.
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating);
router.get('/:id', bookCtrl.getOneBook);

// Routes protegees (auth) : multer recoit l'image, sharp l'optimise, puis le controller
router.post('/', auth, multer, optimizeImage, bookCtrl.createBook);
router.put('/:id', auth, multer, optimizeImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

// Notation : ajouter une note et recalculer la moyenne
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;

const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

// Routes de lecture (publiques)
// Attention a l'ordre : "/bestrating" doit etre declare AVANT "/:id",
// sinon Express interpreterait "bestrating" comme un id.
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating);
router.get('/:id', bookCtrl.getOneBook);

// Routes protegees (auth) avec upload d'image (multer) pour creer / modifier
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;

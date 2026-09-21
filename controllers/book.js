const fs = require('fs');
const Book = require('../models/Book');

// Renvoie tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Renvoie un seul livre par son id
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Renvoie les 3 livres les mieux notes
exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Cree un livre : le corps arrive en JSON dans req.body.book (multipart), + une image
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  // On ne fait pas confiance au userId envoye par le client : on utilise celui du token
  delete bookObject._id;
  delete bookObject._userId;
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistre' }))
    .catch((error) => res.status(400).json({ error }));
};

// Modifie un livre : avec ou sans nouvelle image (le front envoie l'un ou l'autre)
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    }
    : { ...req.body };

  delete bookObject._userId;
  delete bookObject.userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre introuvable' });
      }
      // Seul le proprietaire du livre peut le modifier
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Requete non autorisee' });
      }
      return Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id },
      )
        .then(() => res.status(200).json({ message: 'Livre modifie' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// Supprime un livre et son image sur le disque
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre introuvable' });
      }
      // Seul le proprietaire peut supprimer
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Requete non autorisee' });
      }
      // On supprime d'abord le fichier image, puis le document en base
      const filename = book.imageUrl.split('/images/')[1];
      return fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprime' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Ajoute la note d'un utilisateur a un livre et recalcule la moyenne
exports.rateBook = (req, res, next) => {
  const grade = req.body.rating;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre introuvable' });
      }
      // Un utilisateur ne peut noter un livre qu'une seule fois
      const dejaNote = book.ratings.find((r) => r.userId === req.auth.userId);
      if (dejaNote) {
        return res.status(400).json({ message: 'Vous avez deja note ce livre' });
      }
      // On ajoute la note (userId issu du token, pas du corps de la requete)
      book.ratings.push({ userId: req.auth.userId, grade });
      // Recalcul de la moyenne, arrondie a 1 decimale
      const total = book.ratings.reduce((somme, r) => somme + r.grade, 0);
      book.averageRating = Math.round((total / book.ratings.length) * 10) / 10;
      return book.save()
        .then((livreMisAJour) => res.status(200).json(livreMisAJour))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

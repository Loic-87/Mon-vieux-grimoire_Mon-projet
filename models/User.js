const mongoose = require('mongoose');

// Modele utilisateur : un email unique et un mot de passe (qui sera hashe)
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);

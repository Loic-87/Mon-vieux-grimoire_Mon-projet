# Mon Vieux Grimoire — Back-end

API REST du site de notation de livres **Mon Vieux Grimoire**.
Back-end Node.js / Express / MongoDB qui alimente le front-end React fourni par OpenClassrooms.

## Prérequis

- [Node.js](https://nodejs.org/) (testé sur Node 24)
- Un compte et un cluster [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine du dossier `backend` (il n'est pas versionné) :

```
DB_URL=mongodb+srv://<utilisateur>:<motdepasse>@<cluster>.mongodb.net/mon-vieux-grimoire?retryWrites=true&w=majority
TOKEN_SECRET=<une_longue_chaine_aleatoire>
```

- `DB_URL` : chaîne de connexion à ta base MongoDB Atlas.
- `TOKEN_SECRET` : clé secrète utilisée pour signer les tokens JWT.

## Lancement

```bash
npm start      # démarre le serveur
npm run dev    # démarre avec nodemon (redémarrage auto)
```

Le serveur écoute sur **http://localhost:4000**.

## Structure du projet

```
backend/
├── app.js                    # configuration Express (middlewares, routes, connexion DB)
├── server.js                 # création et démarrage du serveur HTTP (port 4000)
├── models/
│   ├── User.js               # modèle utilisateur (email, password)
│   └── Book.js               # modèle livre
├── controllers/
│   ├── user.js               # logique inscription / connexion
│   └── book.js               # logique CRUD livres + notation
├── routes/
│   ├── user.js               # routes /api/auth
│   └── book.js               # routes /api/books
├── middleware/
│   ├── auth.js               # vérification du token JWT
│   ├── multer-config.js      # réception de l'image (en mémoire)
│   └── sharp-config.js       # optimisation de l'image (redimension + WebP)
└── images/                   # images optimisées (non versionné)
```

## Routes de l'API

### Authentification (`/api/auth`)

| Méthode | Route      | Description                            | Protégée |
|---------|------------|----------------------------------------|----------|
| POST    | `/signup`  | Inscription (mot de passe hashé)       | Non      |
| POST    | `/login`   | Connexion (renvoie `userId` + `token`) | Non      |

### Livres (`/api/books`)

| Méthode | Route          | Description                          | Protégée |
|---------|----------------|--------------------------------------|----------|
| GET     | `/`            | Liste tous les livres                | Non      |
| GET     | `/bestrating`  | Les 3 livres les mieux notés         | Non      |
| GET     | `/:id`         | Un livre par son id                  | Non      |
| POST    | `/`            | Crée un livre (avec image)           | Oui      |
| PUT     | `/:id`         | Modifie un livre                     | Oui      |
| DELETE  | `/:id`         | Supprime un livre et son image       | Oui      |
| POST    | `/:id/rating`  | Note un livre (moyenne recalculée)   | Oui      |

## Sécurité et bonnes pratiques

- Mots de passe hashés avec **bcrypt**.
- Authentification par **token JWT**, routes sensibles protégées par un middleware.
- Secrets (URL de la base, clé JWT) stockés dans `.env`, hors du dépôt.
- Le `userId` d'un livre provient toujours du token, jamais du corps de la requête.
- Seul le propriétaire d'un livre peut le modifier ou le supprimer.

## Green code

Les images uploadées sont **redimensionnées et converties en WebP compressé** (via **sharp**)
avant d'être enregistrées, ce qui réduit fortement leur poids.

## Technologies

Express · Mongoose · bcrypt · jsonwebtoken · multer · sharp · dotenv

# 🎓 Formation Express.js - Guide Complet pour Débutants

Bienvenue dans ce projet pédagogique ! Ce guide vous accompagnera **pas à pas** dans la découverte d'**Express.js**, un framework web pour Node.js.

---

## 📚 Table des matières

1. [Qu'est-ce que ce projet ?](#quest-ce-que-ce-projet-)
2. [Prérequis](#prérequis)
3. [Installation et démarrage](#installation-et-démarrage)
4. [Architecture du projet](#architecture-du-projet)
5. [Explication de chaque fichier](#explication-de-chaque-fichier)
6. [Comprendre les concepts](#comprendre-les-concepts)
7. [Guide de test avec Postman](#guide-de-test-avec-postman)
8. [Les routes disponibles](#les-routes-disponibles)
9. [Exercices pratiques](#exercices-pratiques)
10. [Ressources pour aller plus loin](#ressources-pour-aller-plus-loin)

---

## Qu'est-ce que ce projet ? 🤔

C'est une **API REST** (Application Programming Interface RESTful) qui permet de :
- 📝 Gérer des **utilisateurs** (créer, lire, modifier, supprimer)
- 📚 Gérer des **cours** (créer, lire, modifier, supprimer)
- 🔐 S'**authentifier** (inscription et connexion)
- 🛡️ Protéger certaines routes (seuls les utilisateurs connectés peuvent créer/modifier des cours)

**En résumé :** C'est comme un "serveur" qui répond aux demandes d'un client (par exemple une application mobile ou un site web).

---

## Prérequis

Avant de commencer, vous devez avoir installé :

1. **Node.js** (version 16 ou supérieure) - [Télécharger ici](https://nodejs.org/)
2. **MongoDB** (base de données) - [Télécharger ici](https://www.mongodb.com/try/download/community)
   - Ou utilisez **MongoDB Atlas** (version cloud gratuite)
3. **Postman** (pour tester l'API) - [Télécharger ici](https://www.postman.com/downloads/)
4. Un éditeur de code comme **VS Code** - [Télécharger ici](https://code.visualstudio.com/)

### Vérifier l'installation :
```bash
node --version    # Doit afficher v16.x.x ou supérieur
npm --version     # Doit afficher 8.x.x ou supérieur
mongod --version  # Doit afficher la version de MongoDB
```

---

## Installation et démarrage

### Étape 1 : Télécharger le projet
```bash
# Si vous avez Git
git clone <url-du-repo>
cd formation_express

# Ou téléchargez et décompressez le ZIP
```

### Étape 2 : Installer les dépendances
```bash
npm install
```

Cette commande installe tous les packages nécessaires listés dans `package.json` :
- **express** : Le framework web
- **mongoose** : Pour communiquer avec MongoDB
- **bcryptjs** : Pour hasher (crypter) les mots de passe
- **jsonwebtoken** : Pour créer des tokens d'authentification
- **dotenv** : Pour gérer les variables d'environnement
- **nodemon** : Pour redémarrer automatiquement le serveur en développement

### Étape 3 : Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Modifiez le fichier `.env` :
```env
MONGODB_URI=mongodb://localhost:27017/formation_express
PORT=5000
JWT_SECRET=mon_secret_super_securise_123
```

**💡 Explications :**
- `MONGODB_URI` : L'adresse de votre base de données MongoDB
- `PORT` : Le port sur lequel le serveur va écouter (5000 par défaut)
- `JWT_SECRET` : Une clé secrète pour signer les tokens JWT 

### Étape 4 : Démarrer MongoDB

**Sur Windows :**
```bash
# Dans un nouveau terminal
mongod
```

**Sur Mac/Linux :**
```bash
sudo mongod
```

Vous devez voir : `Waiting for connections on port 27017`

### Étape 5 : Démarrer le serveur

**Mode développement** (avec auto-reload) :
```bash
npm run dev
```

**Mode production** :
```bash
npm start
```

Vous devez voir :
```
MongoDB connecté
Serveur démarré sur le port 5000
```

🎉 **Félicitations !** Votre API est maintenant en ligne sur `http://localhost:5000`

---

## Architecture du projet

Voici la structure complète du projet expliquée :

```
formation_express/
│
├── node_modules/          # 📦 Dépendances installées (ne pas modifier)
│
├── src/                   # 📁 Code source de l'application
│   ├── api/               # 📁 Logique métier de l'API
│   │   ├── controllers/   # 🎮 Contrôleurs (logique de traitement)
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── course.controller.js
│   │   │
│   │   ├── models/        # 🗃️ Modèles (structure des données)
│   │   │   ├── user.model.js
│   │   │   └── course.model.js
│   │   │
│   │   └── routes/        # 🛣️ Routes (endpoints de l'API)
│   │       ├── auth.routes.js
│   │       ├── user.routes.js
│   │       └── course.routes.js
│   │
│   ├── config/            # ⚙️ Configuration
│   │   └── db.js          # Connexion à MongoDB
│   │
│   ├── middlewares/       # 🔧 Middlewares (fonctions intermédiaires)
│   │   ├── auth.js        # Protection des routes
│   │   └── logger.js      # Logging des requêtes
│   │
│   └── server.js          # 🚀 Point d'entrée de l'application
│
├── .env                   # 🔐 Variables d'environnement (SECRET, ne pas commit)
├── .env.example           # 📋 Exemple de configuration
├── .gitignore             # 🚫 Fichiers à ignorer par Git
├── package.json           # 📝 Configuration du projet et dépendances
└── README.md              # 📖 Ce fichier !
```

---

## Explication de chaque fichier

### 📄 `package.json`
**Rôle :** Configuration du projet et liste des dépendances.

**Ce qu'il contient :**
- Le nom du projet
- Les scripts (commandes) disponibles
- Les dépendances (packages nécessaires)

**Scripts disponibles :**
```json
{
  "scripts": {
    "start": "node src/server.js",      // Démarrer en production
    "dev": "nodemon src/server.js"      // Démarrer en développement
  }
}
```

---

### 🚀 `src/server.js` - Le cœur de l'application

**Rôle :** Point d'entrée. C'est ici que tout commence !

**Ligne par ligne :**
```javascript
// 1. Importer les dépendances
const express = require('express');       // Le framework
const dotenv = require('dotenv');         // Pour lire le .env
const connectDB = require('./config/db'); // Connexion MongoDB

// 2. Importer les routes
const userRoutes = require('./api/routes/user.routes');
const courseRoutes = require('./api/routes/course.routes');
const authRoutes = require('./api/routes/auth.routes');

// 3. Importer les middlewares
const logger = require('./middlewares/logger');

// 4. Charger les variables d'environnement
dotenv.config();

// 5. Se connecter à MongoDB
connectDB();

// 6. Créer l'application Express
const app = express();

// 7. Appliquer les middlewares
app.use(logger);                // Logger chaque requête
app.use(express.json());        // Lire le JSON dans req.body

// 8. Définir le port
const PORT = process.env.PORT || 5000;

// 9. Route de base
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Formation Express' });
});

// 10. Enregistrer les routes
app.use('/api/auth', authRoutes);      // Routes d'authentification
app.use('/api/users', userRoutes);     // Routes utilisateurs
app.use('/api/courses', courseRoutes); // Routes cours

// 11. Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
```

**💡 En résumé :** Ce fichier configure et démarre le serveur.

---

### 🗃️ `src/api/models/` - Les Modèles

Les modèles définissent **la structure des données** dans MongoDB.

#### `user.model.js`
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définir le schéma (structure) d'un utilisateur
const userSchema = new mongoose.Schema({
  name: String,           // Nom de l'utilisateur
  email: {
    type: String,
    unique: true,         // Email unique (pas de doublons)
    required: true        // Obligatoire
  },
  password: {
    type: String,
    required: true,
    select: false         // Ne pas retourner le password dans les requêtes
  },
  age: Number
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement

// Middleware : Hash le password AVANT de sauvegarder
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode : Comparer le password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

**💡 Points clés :**
- `unique: true` → Pas de doublons dans la BDD
- `select: false` → Le password ne sera jamais retourné
- `pre('save')` → Code exécuté AVANT la sauvegarde
- `bcrypt.hash()` → Transforme "123456" en "$2a$10$abcd..."

#### `course.model.js`
```javascript
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true              // Enlève les espaces au début/fin
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1                  // Minimum 1 heure
  },
  instructor: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['débutant', 'intermédiaire', 'avancé'],  // Valeurs autorisées
    default: 'débutant',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
```

**💡 Points clés :**
- `enum` → Seules ces valeurs sont acceptées
- `min` → Valeur minimale autorisée
- `trim` → Nettoie les espaces

---

### 🎮 `src/api/controllers/` - Les Contrôleurs

Les contrôleurs contiennent **la logique métier**. Ils :
1. Reçoivent la requête
2. Traitent les données
3. Renvoient la réponse

#### Structure type d'un contrôleur :
```javascript
exports.nomDeLaFonction = async (req, res) => {
  try {
    // 1. Récupérer les données de la requête
    const data = req.body;
    
    // 2. Traiter les données (BDD, calculs, etc.)
    const result = await Model.create(data);
    
    // 3. Renvoyer la réponse
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    // 4. Gérer les erreurs
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
```

#### Exemple : `user.controller.js`
```javascript
const User = require('../models/user.model');

// Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();  // find() = SELECT * FROM users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer UN utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

**💡 Méthodes Mongoose courantes :**
- `Model.create(data)` → Créer un document
- `Model.find()` → Trouver tous les documents
- `Model.findById(id)` → Trouver par ID
- `Model.findByIdAndUpdate(id, data)` → Modifier par ID
- `Model.findByIdAndDelete(id)` → Supprimer par ID

---

### 🛣️ `src/api/routes/` - Les Routes

Les routes définissent **les endpoints** (URLs) de l'API.

#### Structure type :
```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/xxx.controller');

// Définir les routes
router.get('/', controller.getAll);        // GET /api/xxx
router.post('/', controller.create);       // POST /api/xxx
router.get('/:id', controller.getById);    // GET /api/xxx/123
router.patch('/:id', controller.update);   // PATCH /api/xxx/123
router.delete('/:id', controller.delete);  // DELETE /api/xxx/123

module.exports = router;
```

#### Exemple : `course.routes.js`
```javascript
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { protect } = require('../../middlewares/auth');

// Routes publiques (tout le monde peut y accéder)
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Routes protégées (seuls les utilisateurs connectés)
router.post('/', protect, courseController.createCourse);
router.patch('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);

module.exports = router;
```

**💡 Verbes HTTP :**
- `GET` → Lire des données
- `POST` → Créer des données
- `PATCH` → Modifier des données
- `DELETE` → Supprimer des données

---

### 🔧 `src/middlewares/` - Les Middlewares

Un middleware est une **fonction intermédiaire** qui s'exécute entre la réception de la requête et l'envoi de la réponse.

#### `logger.js` - Logger les requêtes
```javascript
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Passer au middleware suivant
};

module.exports = logger;
```

**Flux d'exécution :**
```
Client → logger → Route → Controller → Réponse
```

#### `auth.js` - Protéger les routes
```javascript
const jwt = require('jsonwebtoken');
const User = require('../api/models/user.model');

exports.protect = async (req, res, next) => {
  try {
    // 1. Récupérer le token du header
    const token = req.headers.authorization?.split(' ')[1];
    
    // 2. Vérifier qu'il existe
    if (!token) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    
    // 3. Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Récupérer l'utilisateur
    req.user = await User.findById(decoded.id);
    
    // 5. Passer au suivant
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
```

**💡 Comment ça marche :**
1. Le client envoie le token dans le header `Authorization: Bearer xyz...`
2. Le middleware vérifie le token
3. Si valide → ajoute `req.user` et continue
4. Si invalide → renvoie une erreur 401

---

## Comprendre les concepts

### 🔄 Qu'est-ce qu'une API REST ?

**REST** = Representational State Transfer

C'est un style d'architecture pour les APIs qui utilise les verbes HTTP et des URLs claires.

**Exemple :**
```
GET    /api/courses       → Lire tous les cours
GET    /api/courses/123   → Lire le cours n°123
POST   /api/courses       → Créer un cours
PATCH  /api/courses/123   → Modifier le cours n°123
DELETE /api/courses/123   → Supprimer le cours n°123
```

### 🔐 Qu'est-ce que JWT ?

**JWT** = JSON Web Token

C'est un token (jeton) qui prouve votre identité.

**Structure d'un JWT :**
```
Header.Payload.Signature
eyJhbGc...  .  eyJpZCI...  .  SflKxwRJ...
```

**Contenu du Payload :**
```json
{
  "id": "677f123abc...",
  "iat": 1736316000,  // Date de création
  "exp": 1736920800   // Date d'expiration
}
```

**Comment ça marche :**
1. Vous vous connectez → Le serveur génère un JWT
2. Vous stockez le JWT (localStorage, cookie, etc.)
3. Pour chaque requête protégée → Vous envoyez le JWT
4. Le serveur vérifie le JWT → OK ou pas

### 🔒 Qu'est-ce que bcrypt ?

**bcrypt** est un algorithme pour hasher (crypter) les mots de passe.

**Exemple :**
```javascript
// Password en clair
"123456"

// Après hashage
"$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

**Avantages :**
- ✅ Impossible de retrouver le password original
- ✅ Même password → Hash différent à chaque fois (grâce au "salt")
- ✅ Lent à calculer → Protège contre les attaques par force brute

---

## Guide de test avec Postman

### 🚀 Étape 1 : Vérifier que le serveur fonctionne

```http
GET http://localhost:5000/
```

**Réponse attendue :**
```json
{
  "message": "Bienvenue sur l'API Formation Express"
}
```

---

### 🧪 Scénario complet de test

#### **1. Inscription d'un utilisateur**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Alice Dupont",
  "email": "alice@test.com",
  "password": "motdepasse123",
  "age": 25
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "id": "677f...",
      "name": "Alice Dupont",
      "email": "alice@test.com"
    }
  }
}
```

---

#### **2. Connexion**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "alice@test.com",
  "password": "motdepasse123"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

⚠️ **COPIEZ LE TOKEN !** Vous en aurez besoin pour les requêtes protégées.

---

#### **3. Récupérer son profil (route protégée)**

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Dans Postman :**
1. Sélectionnez l'onglet **Headers**
2. Ajoutez une ligne :
   - Key: `Authorization`
   - Value: `Bearer VOTRE_TOKEN` (remplacez VOTRE_TOKEN par le token copié)

---

#### **4. Créer un cours (route protégée)**

```http
POST http://localhost:5000/api/courses
Authorization: Bearer VOTRE_TOKEN
Content-Type: application/json

{
  "title": "Introduction à JavaScript",
  "description": "Apprendre les bases de JS",
  "duration": 15,
  "instructor": "Alice Dupont",
  "level": "débutant"
}
```

**Sans token :** ❌ Erreur 401 "Non autorisé"  
**Avec token :** ✅ Cours créé avec succès

---

#### **5. Lire tous les cours (public)**

```http
GET http://localhost:5000/api/courses
```

Pas besoin de token ! Cette route est publique.

---

#### **6. Modifier un cours (protégé)**

```http
PATCH http://localhost:5000/api/courses/VOTRE_ID_COURS
Authorization: Bearer VOTRE_TOKEN
Content-Type: application/json

{
  "duration": 20,
  "level": "intermédiaire"
}
```

---

#### **7. Supprimer un cours (protégé)**

```http
DELETE http://localhost:5000/api/courses/VOTRE_ID_COURS
Authorization: Bearer VOTRE_TOKEN
```

---

## Les routes disponibles

### 🔐 Routes d'authentification (`/api/auth`)

| Méthode | Route | Protection | Description |
|---------|-------|------------|-------------|
| POST | `/api/auth/register` | ❌ Public | Inscription |
| POST | `/api/auth/login` | ❌ Public | Connexion |
| GET | `/api/auth/me` | ✅ Protégée | Mon profil |

### 👥 Routes utilisateurs (`/api/users`)

| Méthode | Route | Protection | Description |
|---------|-------|------------|-------------|
| GET | `/api/users` | ❌ Public | Liste utilisateurs |
| GET | `/api/users/:id` | ❌ Public | Un utilisateur |
| POST | `/api/users` | ❌ Public | Créer utilisateur |
| PATCH | `/api/users/:id` | ❌ Public | Modifier utilisateur |
| DELETE | `/api/users/:id` | ❌ Public | Supprimer utilisateur |

### 📚 Routes cours (`/api/courses`)

| Méthode | Route | Protection | Description |
|---------|-------|------------|-------------|
| GET | `/api/courses` | ❌ Public | Liste cours |
| GET | `/api/courses/:id` | ❌ Public | Un cours |
| GET | `/api/courses/level/:level` | ❌ Public | Filtrer par niveau |
| POST | `/api/courses` | ✅ Protégée | Créer cours |
| PATCH | `/api/courses/:id` | ✅ Protégée | Modifier cours |
| DELETE | `/api/courses/:id` | ✅ Protégée | Supprimer cours |

---


## Ressources pour aller plus loin

### 📖 Documentation officielle

- **Express.js** : https://expressjs.com/
- **Mongoose** : https://mongoosejs.com/
- **JWT** : https://jwt.io/
- **bcrypt** : https://www.npmjs.com/package/bcryptjs

### 🎥 Tutoriels vidéo

- **Traversy Media** - Express Crash Course
- **The Net Ninja** - Node.js & Express Tutorial
- **Academind** - RESTful APIs with Node.js

### 📚 Livres recommandés

- *"Express in Action"* - Evan Hahn
- *"Node.js Design Patterns"* - Mario Casciaro
- *"RESTful Web API Design with Node.js"* - Valentin Bojinov

---

## 🐛 Résolution de problèmes

### Erreur : `Cannot connect to MongoDB`
**Solution :**
```bash
# Vérifier que MongoDB est démarré
mongod

# Vérifier l'URL dans .env
MONGODB_URI=mongodb://localhost:27017/formation_express
```

### Erreur : `Port 5000 already in use`
**Solution :**
```bash
# Changer le port dans .env
PORT=3000
```

### Erreur : `Token invalid`
**Solution :**
- Vérifiez que vous avez bien copié le token complet
- Vérifiez le format : `Bearer ESPACE token`
- Reconnectez-vous pour obtenir un nouveau token

### Erreur : `Email already exists`
**Solution :**
- Utilisez un autre email
- Ou supprimez l'utilisateur existant en BDD

---

## 🏆 Félicitations !

Vous avez maintenant toutes les connaissances pour :
- ✅ Comprendre l'architecture d'une API REST
- ✅ Utiliser Express.js
- ✅ Gérer une base de données avec MongoDB
- ✅ Implémenter l'authentification JWT
- ✅ Protéger vos routes
- ✅ Tester votre API avec Postman

**Continuez à pratiquer et à explorer !** 🚀

---

**Questions ?** N'hésitez pas à consulter la documentation ou à poser des questions !

**Bon apprentissage ! 🎓**

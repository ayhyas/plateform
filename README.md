# Examen Data Science - Plateforme en ligne

Plateforme d'examen QCM en ligne pour le module **Data Science** - Université Chouaïb Doukkali,
Faculté des Sciences. Stack: React (JavaScript) + Express/Node.js + MongoDB (Atlas).

## Structure du projet

```
datascience/
  client/     Application React (Vite)
  server/     API Express + Mongoose
```

En production, le serveur Express sert directement le build React (une seule application web à déployer).

## 1. Installation locale

```bash
npm run install:all
```

Créez un fichier `server/.env` à partir de `server/.env.example` (voir section "Variables d'environnement" ci-dessous).

## 2. Alimenter la base de données (20 questions + paramètres par défaut)

```bash
npm run seed
```

Cette commande insère 20 questions de Data Science (en français) si la banque de questions est vide,
et crée les paramètres d'examen par défaut (durée 30 min, 20 questions, note de passage 10/20).

## 3. Lancer en développement

Deux terminaux :

```bash
npm run dev:server   # API sur http://localhost:5000
npm run dev:client   # Interface sur http://localhost:5173 (proxy vers l'API)
```

Ouvrez http://localhost:5173 pour l'espace étudiant, et http://localhost:5173/admin/login pour l'administration.

## 4. Variables d'environnement (`server/.env`)

| Variable | Description | Exemple |
|---|---|---|
| `MONGODB_URI` | Chaîne de connexion MongoDB Atlas (avec le nom de la base) | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/examen-datascience?retryWrites=true&w=majority` |
| `JWT_SECRET` | Chaîne aléatoire longue et secrète pour signer les sessions | `openssl rand -hex 32` |
| `ADMIN_USERNAME` | Identifiant de connexion administrateur | `admin` |
| `ADMIN_PASSWORD` | Mot de passe administrateur | choisir un mot de passe fort |
| `PORT` | Port d'écoute du serveur | `5000` (Render le définit automatiquement) |
| `NODE_ENV` | `development` en local, `production` sur Render | `production` |
| `CLIENT_URL` | Origine autorisée en CORS (développement uniquement) | `http://localhost:5173` |

Le client React ne nécessite aucune variable d'environnement : en production il est servi par le même
serveur Express (mêmes origine/port), et en développement Vite proxy `/api` vers `http://localhost:5000`.

## 5. Déploiement sur Render + MongoDB Atlas

### MongoDB Atlas
1. Créer un cluster (le tier gratuit M0 suffit).
2. Créer un utilisateur de base de données (Database Access) avec mot de passe.
3. Dans Network Access, autoriser les IP de Render (le plus simple : `0.0.0.0/0`, tout IP - à restreindre si besoin).
4. Récupérer la chaîne de connexion ("Connect" -> "Drivers"), et ajouter le nom de la base après `mongodb.net/`, par ex. `.../examen-datascience?retryWrites=true&w=majority`.

### Render
1. Créer un nouveau **Web Service**, pointant sur ce dépôt Git, racine du dépôt (pas de sous-dossier).
2. Build Command : `npm run build`
3. Start Command : `npm start`
4. Ajouter les variables d'environnement listées ci-dessus dans l'onglet "Environment" de Render :
   `MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `NODE_ENV=production`.
   (`PORT` est fourni automatiquement par Render, `CLIENT_URL` n'est pas nécessaire en production.)
5. Déployer. Une fois en ligne, exécuter une seule fois le seed (Render Shell) :
   ```bash
   npm run seed
   ```

## 6. Fonctionnement

### Côté étudiant
- L'étudiant saisit Nom, Prénom et CNE (aucun mot de passe).
- Une seule tentative par CNE : si l'examen est déjà terminé, l'accès est bloqué.
- 20 questions (configurable), choix affichés dans un ordre aléatoire par étudiant, une question à la fois,
  pas de retour en arrière, pas d'indice. Chronomètre global (durée configurable par l'administrateur).
- À la fin, l'étudiant voit un message de confirmation puis est déconnecté automatiquement.

### Côté administrateur (`/admin/login`)
- **Résultats** : liste des étudiants, note sur N, statut Réussi/Échoué (seuil configurable, défaut 10/20),
  export Excel (Nom, Prénom, CNE, Note, Statut, Date) avec en-tête de l'établissement.
- **Questions** : création/modification/suppression des questions de la banque, activation/désactivation.
- **Paramètres** : titre, université/faculté/diplôme/professeur responsable affichés en en-tête, fenêtre
  d'ouverture/fermeture de l'examen, durée, nombre de questions par tentative, note de passage.

## Sécurité

- Mots de passe administrateur et secrets JWT stockés uniquement en variables d'environnement.
- Limitation du taux de requêtes sur les routes de connexion (anti brute-force).
- En-têtes de sécurité HTTP (Helmet), assainissement des entrées MongoDB, validation des schémas Mongoose.
- Les bonnes réponses ne sont jamais renvoyées au navigateur de l'étudiant.

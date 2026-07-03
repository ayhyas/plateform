# Examen Data Science - Plateforme en ligne

Plateforme d'examen QCM en ligne pour le module **Data Science** - Universite Chouaib Doukali,
Faculte des Sciences. Stack: React (JavaScript) + Express/Node.js + MongoDB (Atlas).

## Structure du projet

```
datascience/
  client/     Application React (Vite)
  server/     API Express + Mongoose
```

En production, le serveur Express sert directement le build React (une seule application web a deployer).

## 1. Installation locale

```bash
npm run install:all
```

Cree un fichier `server/.env` a partir de `server/.env.example` (voir section "Variables d'environnement" ci-dessous).

## 2. Alimenter la base de donnees (20 questions + parametres par defaut)

```bash
npm run seed
```

Cette commande insere 20 questions de Data Science (en francais) si la banque de questions est vide,
et cree les parametres d'examen par defaut (duree 30 min, 20 questions, note de passage 10/20).

## 3. Lancer en developpement

Deux terminaux :

```bash
npm run dev:server   # API sur http://localhost:5000
npm run dev:client   # Interface sur http://localhost:5173 (proxy vers l'API)
```

Ouvrez http://localhost:5173 pour l'espace etudiant, et http://localhost:5173/admin/login pour l'administration.

## 4. Variables d'environnement (`server/.env`)

| Variable | Description | Exemple |
|---|---|---|
| `MONGODB_URI` | Chaine de connexion MongoDB Atlas (avec le nom de la base) | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/examen-datascience?retryWrites=true&w=majority` |
| `JWT_SECRET` | Chaine aleatoire longue et secrete pour signer les sessions | `openssl rand -hex 32` |
| `ADMIN_USERNAME` | Identifiant de connexion administrateur | `admin` |
| `ADMIN_PASSWORD` | Mot de passe administrateur | choisir un mot de passe fort |
| `PORT` | Port d'ecoute du serveur | `5000` (Render le definit automatiquement) |
| `NODE_ENV` | `development` en local, `production` sur Render | `production` |
| `CLIENT_URL` | Origine autorisee en CORS (developpement uniquement) | `http://localhost:5173` |

Le client React ne necessite aucune variable d'environnement : en production il est servi par le meme
serveur Express (memes origine/port), et en developpement Vite proxy `/api` vers `http://localhost:5000`.

## 5. Deploiement sur Render + MongoDB Atlas

### MongoDB Atlas
1. Creer un cluster (le tier gratuit M0 suffit).
2. Creer un utilisateur de base de donnees (Database Access) avec mot de passe.
3. Dans Network Access, autoriser les IP de Render (le plus simple : `0.0.0.0/0`, tout IP - a restreindre si besoin).
4. Recuperer la chaine de connexion ("Connect" -> "Drivers"), et ajouter le nom de la base apres `mongodb.net/`, par ex. `.../examen-datascience?retryWrites=true&w=majority`.

### Render
1. Creer un nouveau **Web Service**, pointant sur ce depot Git, racine du depot (pas de sous-dossier).
2. Build Command : `npm run build`
3. Start Command : `npm start`
4. Ajouter les variables d'environnement listees ci-dessus dans l'onglet "Environment" de Render :
   `MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `NODE_ENV=production`.
   (`PORT` est fourni automatiquement par Render, `CLIENT_URL` n'est pas necessaire en production.)
5. Deployer. Une fois en ligne, executer une seule fois le seed (Render Shell) :
   ```bash
   npm run seed
   ```

## 6. Fonctionnement

### Cote etudiant
- L'etudiant saisit Nom, Prenom et CNE (aucun mot de passe).
- Une seule tentative par CNE : si l'examen est deja termine, l'acces est bloque.
- 20 questions (configurable), choix affiches dans un ordre aleatoire par etudiant, une question a la fois,
  pas de retour en arriere, pas d'indice. Chronometre global (duree configurable par l'administrateur).
- A la fin, l'etudiant voit un message de confirmation puis est deconnecte automatiquement.

### Cote administrateur (`/admin/login`)
- **Resultats** : liste des etudiants, note sur N, statut Reussi/Echoue (seuil configurable, defaut 10/20),
  export Excel (Nom, Prenom, CNE, Note, Statut, Date) avec en-tete de l'etablissement.
- **Questions** : creation/modification/suppression des questions de la banque, activation/desactivation.
- **Parametres** : titre, universite/faculte/diplome affiches en en-tete, fenetre d'ouverture/fermeture de
  l'examen, duree, nombre de questions par tentative, note de passage.

## Securite

- Mots de passe administrateur et secrets JWT stockes uniquement en variables d'environnement.
- Limitation du taux de requetes sur les routes de connexion (anti brute-force).
- En-tetes de securite HTTP (Helmet), assainissement des entrees MongoDB, validation des schemas Mongoose.
- Les bonnes reponses ne sont jamais renvoyees au navigateur de l'etudiant.

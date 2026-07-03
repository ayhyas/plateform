// 20 questions QCM couvrant les bases du module Data Science.
// correctIndex fait reference a la position (0-based) dans le tableau "choices".
module.exports = [
  {
    text: "Qu'est-ce que la data science ?",
    choices: [
      "Un domaine combinant statistiques, informatique et expertise metier pour extraire de la connaissance a partir de donnees",
      "Un langage de programmation destine au developpement web",
      "Une methode de sauvegarde de fichiers volumineux",
      "Un protocole de securite reseau",
    ],
    correctIndex: 0,
  },
  {
    text: "Quelle bibliotheque Python est principalement utilisee pour la manipulation et l'analyse de donnees tabulaires ?",
    choices: ["Flask", "Pandas", "Django", "Seaborn"],
    correctIndex: 1,
  },
  {
    text: "Quelle bibliotheque Python est principalement utilisee pour le calcul numerique et les tableaux multidimensionnels ?",
    choices: ["Pandas", "Scikit-learn", "NumPy", "Matplotlib"],
    correctIndex: 2,
  },
  {
    text: "En statistique, la moyenne d'une serie de donnees correspond a :",
    choices: [
      "La valeur qui apparait le plus souvent",
      "La somme des valeurs divisee par leur nombre",
      "La valeur du milieu d'une serie triee",
      "L'ecart entre la valeur maximale et minimale",
    ],
    correctIndex: 1,
  },
  {
    text: "La mediane d'une serie de donnees triee correspond a :",
    choices: [
      "La moyenne arithmetique des valeurs",
      "La valeur la plus frequente",
      "La valeur centrale de la serie",
      "La variance des donnees",
    ],
    correctIndex: 2,
  },
  {
    text: "L'ecart-type d'une serie statistique mesure :",
    choices: [
      "La tendance centrale des donnees",
      "La dispersion des donnees autour de la moyenne",
      "La correlation entre deux variables",
      "Le nombre total d'observations",
    ],
    correctIndex: 1,
  },
  {
    text: "Le coefficient de correlation entre deux variables mesure :",
    choices: [
      "La force et la direction de la relation lineaire entre les deux variables",
      "La moyenne des deux variables",
      "La variance totale du jeu de donnees",
      "Le nombre d'observations communes",
    ],
    correctIndex: 0,
  },
  {
    text: "Quelle est la principale difference entre l'apprentissage supervise et non supervise ?",
    choices: [
      "L'apprentissage non supervise est toujours plus rapide",
      "L'apprentissage supervise utilise des donnees etiquetees, contrairement au non supervise",
      "Le supervise ne necessite aucune donnee",
      "Il n'existe aucune difference entre les deux",
    ],
    correctIndex: 1,
  },
  {
    text: "L'algorithme K-means est un exemple typique de :",
    choices: [
      "Apprentissage supervise",
      "Apprentissage par renforcement",
      "Apprentissage non supervise (clustering)",
      "Regression lineaire",
    ],
    correctIndex: 2,
  },
  {
    text: "La regression lineaire est principalement utilisee pour :",
    choices: [
      "Predire une variable quantitative continue",
      "Classer des donnees en categories discretes",
      "Regrouper des observations similaires",
      "Reduire le nombre de variables",
    ],
    correctIndex: 0,
  },
  {
    text: "La regression logistique est principalement utilisee pour :",
    choices: [
      "La reduction de dimensionnalite",
      "Des problemes de classification",
      "Le clustering de donnees",
      "La visualisation de series temporelles uniquement",
    ],
    correctIndex: 1,
  },
  {
    text: "Le surapprentissage (overfitting) se produit lorsque :",
    choices: [
      "Le modele est trop simple pour capturer les tendances des donnees",
      "Le modele apprend trop bien les donnees d'entrainement et generalise mal sur de nouvelles donnees",
      "Le jeu de donnees est insuffisant pour entrainer un modele",
      "Le modele n'apprend absolument rien",
    ],
    correctIndex: 1,
  },
  {
    text: "Pourquoi divise-t-on generalement un jeu de donnees en ensemble d'entrainement et ensemble de test ?",
    choices: [
      "Pour accelerer l'entrainement du modele",
      "Pour reduire la taille du fichier de donnees",
      "Pour evaluer la capacite du modele a generaliser sur des donnees non vues",
      "Pour supprimer automatiquement les valeurs manquantes",
    ],
    correctIndex: 2,
  },
  {
    text: "La validation croisee (cross-validation) permet principalement de :",
    choices: [
      "Nettoyer automatiquement les donnees",
      "Obtenir une estimation plus fiable et robuste de la performance d'un modele",
      "Visualiser les donnees en plusieurs dimensions",
      "Reduire le nombre de variables explicatives",
    ],
    correctIndex: 1,
  },
  {
    text: "Dans une matrice de confusion pour un probleme de classification, on retrouve notamment :",
    choices: [
      "Les vrais positifs, faux positifs, vrais negatifs et faux negatifs",
      "La moyenne et la variance des donnees",
      "Le nombre de variables explicatives du modele",
      "Le temps d'execution de l'algorithme",
    ],
    correctIndex: 0,
  },
  {
    text: "La precision (precision) en classification correspond au rapport entre :",
    choices: [
      "Les vrais positifs et l'ensemble des observations reellement positives",
      "Les vrais positifs et l'ensemble des predictions positives faites par le modele",
      "Les vrais negatifs et les faux positifs",
      "Le nombre total de bonnes predictions et le nombre total d'observations",
    ],
    correctIndex: 1,
  },
  {
    text: "Le rappel (recall) en classification correspond au rapport entre :",
    choices: [
      "Les vrais positifs et l'ensemble des predictions positives",
      "Les faux negatifs et les vrais negatifs",
      "Les vrais positifs et l'ensemble des observations reellement positives",
      "La somme des erreurs de classification",
    ],
    correctIndex: 2,
  },
  {
    text: "Comment traite-t-on generalement les valeurs manquantes dans un jeu de donnees ?",
    choices: [
      "Elles n'ont jamais d'impact sur l'analyse et peuvent etre ignorees",
      "On les remplace toujours automatiquement par zero",
      "Par suppression des lignes/colonnes concernees ou par imputation (moyenne, mediane, etc.)",
      "Elles sont converties automatiquement en texte",
    ],
    correctIndex: 2,
  },
  {
    text: "La normalisation (ou mise a l'echelle) des donnees sert principalement a :",
    choices: [
      "Supprimer les doublons du jeu de donnees",
      "Ramener les variables a une echelle comparable",
      "Augmenter artificiellement la taille du jeu de donnees",
      "Creer de nouvelles variables categoriques",
    ],
    correctIndex: 1,
  },
  {
    text: "L'analyse en composantes principales (ACP / PCA) est une technique utilisee pour :",
    choices: [
      "Augmenter le nombre de variables du jeu de donnees",
      "Nettoyer les valeurs manquantes",
      "Classer les observations en categories predefinies",
      "Reduire la dimensionnalite des donnees tout en conservant un maximum d'information",
    ],
    correctIndex: 3,
  },
];

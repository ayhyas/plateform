// 20 questions QCM couvrant les bases du module Data Science.
// correctIndex fait référence à la position (0-based) dans le tableau "choices".
module.exports = [
  {
    text: "Qu'est-ce que la data science ?",
    choices: [
      "Un domaine combinant statistiques, informatique et expertise métier pour extraire de la connaissance à partir de données",
      "Un langage de programmation destiné au développement web",
      "Une méthode de sauvegarde de fichiers volumineux",
      "Un protocole de sécurité réseau",
    ],
    correctIndex: 0,
  },
  {
    text: "Quelle bibliothèque Python est principalement utilisée pour la manipulation et l'analyse de données tabulaires ?",
    choices: ["Flask", "Pandas", "Django", "Seaborn"],
    correctIndex: 1,
  },
  {
    text: "Quelle bibliothèque Python est principalement utilisée pour le calcul numérique et les tableaux multidimensionnels ?",
    choices: ["Pandas", "Scikit-learn", "NumPy", "Matplotlib"],
    correctIndex: 2,
  },
  {
    text: "En statistique, la moyenne d'une série de données correspond à :",
    choices: [
      "La valeur qui apparaît le plus souvent",
      "La somme des valeurs divisée par leur nombre",
      "La valeur du milieu d'une série triée",
      "L'écart entre la valeur maximale et minimale",
    ],
    correctIndex: 1,
  },
  {
    text: "La médiane d'une série de données triée correspond à :",
    choices: [
      "La moyenne arithmétique des valeurs",
      "La valeur la plus fréquente",
      "La valeur centrale de la série",
      "La variance des données",
    ],
    correctIndex: 2,
  },
  {
    text: "L'écart-type d'une série statistique mesure :",
    choices: [
      "La tendance centrale des données",
      "La dispersion des données autour de la moyenne",
      "La corrélation entre deux variables",
      "Le nombre total d'observations",
    ],
    correctIndex: 1,
  },
  {
    text: "Le coefficient de corrélation entre deux variables mesure :",
    choices: [
      "La force et la direction de la relation linéaire entre les deux variables",
      "La moyenne des deux variables",
      "La variance totale du jeu de données",
      "Le nombre d'observations communes",
    ],
    correctIndex: 0,
  },
  {
    text: "Quelle est la principale différence entre l'apprentissage supervisé et non supervisé ?",
    choices: [
      "L'apprentissage non supervisé est toujours plus rapide",
      "L'apprentissage supervisé utilise des données étiquetées, contrairement au non supervisé",
      "Le supervisé ne nécessite aucune donnée",
      "Il n'existe aucune différence entre les deux",
    ],
    correctIndex: 1,
  },
  {
    text: "L'algorithme K-means est un exemple typique de :",
    choices: [
      "Apprentissage supervisé",
      "Apprentissage par renforcement",
      "Apprentissage non supervisé (clustering)",
      "Régression linéaire",
    ],
    correctIndex: 2,
  },
  {
    text: "La régression linéaire est principalement utilisée pour :",
    choices: [
      "Prédire une variable quantitative continue",
      "Classer des données en catégories discrètes",
      "Regrouper des observations similaires",
      "Réduire le nombre de variables",
    ],
    correctIndex: 0,
  },
  {
    text: "La régression logistique est principalement utilisée pour :",
    choices: [
      "La réduction de dimensionnalité",
      "Des problèmes de classification",
      "Le clustering de données",
      "La visualisation de séries temporelles uniquement",
    ],
    correctIndex: 1,
  },
  {
    text: "Le surapprentissage (overfitting) se produit lorsque :",
    choices: [
      "Le modèle est trop simple pour capturer les tendances des données",
      "Le modèle apprend trop bien les données d'entraînement et généralise mal sur de nouvelles données",
      "Le jeu de données est insuffisant pour entraîner un modèle",
      "Le modèle n'apprend absolument rien",
    ],
    correctIndex: 1,
  },
  {
    text: "Pourquoi divise-t-on généralement un jeu de données en ensemble d'entraînement et ensemble de test ?",
    choices: [
      "Pour accélérer l'entraînement du modèle",
      "Pour réduire la taille du fichier de données",
      "Pour évaluer la capacité du modèle à généraliser sur des données non vues",
      "Pour supprimer automatiquement les valeurs manquantes",
    ],
    correctIndex: 2,
  },
  {
    text: "La validation croisée (cross-validation) permet principalement de :",
    choices: [
      "Nettoyer automatiquement les données",
      "Obtenir une estimation plus fiable et robuste de la performance d'un modèle",
      "Visualiser les données en plusieurs dimensions",
      "Réduire le nombre de variables explicatives",
    ],
    correctIndex: 1,
  },
  {
    text: "Dans une matrice de confusion pour un problème de classification, on retrouve notamment :",
    choices: [
      "Les vrais positifs, faux positifs, vrais négatifs et faux négatifs",
      "La moyenne et la variance des données",
      "Le nombre de variables explicatives du modèle",
      "Le temps d'exécution de l'algorithme",
    ],
    correctIndex: 0,
  },
  {
    text: "La précision (precision) en classification correspond au rapport entre :",
    choices: [
      "Les vrais positifs et l'ensemble des observations réellement positives",
      "Les vrais positifs et l'ensemble des prédictions positives faites par le modèle",
      "Les vrais négatifs et les faux positifs",
      "Le nombre total de bonnes prédictions et le nombre total d'observations",
    ],
    correctIndex: 1,
  },
  {
    text: "Le rappel (recall) en classification correspond au rapport entre :",
    choices: [
      "Les vrais positifs et l'ensemble des prédictions positives",
      "Les faux négatifs et les vrais négatifs",
      "Les vrais positifs et l'ensemble des observations réellement positives",
      "La somme des erreurs de classification",
    ],
    correctIndex: 2,
  },
  {
    text: "Comment traite-t-on généralement les valeurs manquantes dans un jeu de données ?",
    choices: [
      "Elles n'ont jamais d'impact sur l'analyse et peuvent être ignorées",
      "On les remplace toujours automatiquement par zéro",
      "Par suppression des lignes/colonnes concernées ou par imputation (moyenne, médiane, etc.)",
      "Elles sont converties automatiquement en texte",
    ],
    correctIndex: 2,
  },
  {
    text: "La normalisation (ou mise à l'échelle) des données sert principalement à :",
    choices: [
      "Supprimer les doublons du jeu de données",
      "Ramener les variables à une échelle comparable",
      "Augmenter artificiellement la taille du jeu de données",
      "Créer de nouvelles variables catégoriques",
    ],
    correctIndex: 1,
  },
  {
    text: "L'analyse en composantes principales (ACP / PCA) est une technique utilisée pour :",
    choices: [
      "Augmenter le nombre de variables du jeu de données",
      "Nettoyer les valeurs manquantes",
      "Classer les observations en catégories prédéfinies",
      "Réduire la dimensionnalité des données tout en conservant un maximum d'information",
    ],
    correctIndex: 3,
  },
];

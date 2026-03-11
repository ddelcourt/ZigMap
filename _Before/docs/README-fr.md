# ZigMap - Guide Utilisateur
ddelcourt2026

**Version 12** - Raccourcis Clavier Centralisés & Export de Carte de Profondeur

Un outil d'art génératif en temps réel qui crée des motifs zigzag animés dans un espace 3D avec des contrôles de caméra avancés, une visualisation stéréoscopique et des capacités d'exportation.

---

## Table des Matières

- [Démarrage Rapide](#démarrage-rapide)
- [Contrôles Souris](#contrôles-souris)
- [Raccourcis Clavier](#raccourcis-clavier)
- [Contrôles de l'Interface](#contrôles-de-linterface)
  - [Section UI](#section-ui)
  - [Section Fichier](#section-fichier)
  - [Section Caméra](#section-caméra)
  - [Section Géométrie](#section-géométrie)
  - [Section Comportement](#section-comportement)
  - [Section Modulations](#section-modulations)
  - [Section Couleurs](#section-couleurs)
  - [Section Export](#section-export)
- [Formats d'Export](#formats-dexport)
- [Conseils & Bonnes Pratiques](#conseils--bonnes-pratiques)

---

## Démarrage Rapide

1. Ouvrez `ZigzagEmitter_12.html` dans un navigateur moderne (Chrome, Firefox, Safari ou Edge)
2. Utilisez clic gauche + glisser pour faire pivoter la caméra
3. Utilisez clic droit + glisser pour déplacer la caméra
4. Défilez pour zoomer/dézoomer
5. Ajustez les curseurs dans le panneau de gauche pour modifier l'animation
6. Appuyez sur **Tab** pour masquer/afficher les contrôles
7. Appuyez sur **Entrée** pour le mode plein écran

---

## Contrôles Souris

| Action | Contrôle |
|--------|----------|
| **Pivoter la Caméra** | Clic gauche + glisser |
| **Déplacer la Caméra** | Clic droit + glisser (ou clic molette + glisser) |
| **Zoom** | Molette de la souris |

### Remarques :
- Les contrôles de caméra ne fonctionnent que lorsque la souris est sur le canevas (pas sur le panneau UI)
- En mode stéréoscopique, les contrôles sont actifs sur le canevas que vous avez cliqué
- La sensibilité du défilement est proportionnelle à la distance de la caméra

---

## Raccourcis Clavier

| Touche | Action |
|--------|--------|
| **Tab** | Basculer la visibilité du panneau UI |
| **h** | Masquer/afficher les contrôles (alternatif pour Tab) |
| **Entrée** | Basculer le mode plein écran |
| **f** | Plein écran (alternatif pour Entrée) |
| **p** | Exporter PNG |
| **P** (Maj+P) | Exporter PNG (alternatif) |
| **s** | Exporter SVG |
| **S** (Maj+S) | Exporter SVG (alternatif) |
| **d** | Exporter carte de profondeur |
| **D** (Maj+D) | Exporter carte de profondeur (alternatif) |
| **v** | Démarrer/arrêter l'enregistrement vidéo |
| **j** | Sauvegarder les paramètres en JSON |
| **Ctrl+S** (⌘+S sur Mac) | Sauvegarder les paramètres en JSON (alternatif) |
| **r** | Réinitialiser la position de la caméra |
| **R** (Maj+R) | Réinitialiser la position de la caméra (alternatif) |
| **0** | Réinitialiser le zoom par défaut (600 unités) |
| **t** | Basculer la modulation d'épaisseur aléatoire |
| **m** | Basculer la modulation de vitesse aléatoire |
| **3** | Basculer le mode stéréoscopique (VR) |
| **b** | Basculer le mode framebuffer |

---

## Contrôles de l'Interface

### Section UI

Contrôles pour la visibilité de l'interface et les modes d'affichage.

#### Masquer les Contrôles
- **Raccourcis** : Tab ou h
- Masque le panneau de contrôle de gauche pour une vue dégagée
- Appuyez à nouveau sur Tab ou h pour afficher les contrôles

#### Plein Écran
- **Raccourcis** : Entrée ou f
- Entre dans le mode plein écran du navigateur
- Maximise le canevas pour la présentation ou l'enregistrement
- Appuyez sur Échap pour quitter le plein écran

---

### Section Fichier

Sauvegardez et chargez vos configurations.

#### Sauvegarder
- **Raccourcis** : j ou Ctrl+S (⌘+S sur Mac)
- Télécharge les paramètres actuels sous forme de fichier `.json`
- Le nom du fichier inclut l'horodatage : `zigzag-emitter-AAAA-MM-JJ-HHMMSS.json`
- Sauvegarde tous les paramètres y compris la position de la caméra
- Stocké dans le dossier de téléchargements du navigateur

#### Charger
- Ouvre le sélecteur de fichiers pour charger une configuration `.json` précédemment sauvegardée
- Applique instantanément tous les paramètres du fichier
- Persiste automatiquement dans le localStorage

**Note** : Les paramètres sont automatiquement sauvegardés dans le localStorage du navigateur à chaque modification.

---

### Section Caméra

Configurez les modes de visualisation, la résolution et les paramètres de projection.

#### Vue Stéréoscopique (VR)
- **Raccourci** : 3
- **Type** : Case à cocher
- **Défaut** : Désactivé
- Divise la vue en perspectives œil gauche et œil droit
- Crée des vues côte à côte pour les casques VR ou la visualisation croisée
- Les bordures vertes indiquent que le mode stéréoscopique est actif
- Chaque œil obtient la moitié de la largeur de la fenêtre

#### Séparation des Yeux
- **Plage** : 0 – 100
- **Défaut** : 30
- **Unités** : Unités d'espace monde
- Contrôle la distance entre les positions des caméras gauche et droite
- Valeurs plus élevées = effet 3D plus fort
- Actif uniquement lorsque la Vue Stéréoscopique est activée
- Ajustez en fonction de la distance de visualisation et de la taille de l'écran

#### Résolution du Framebuffer
- **Raccourci** : b
- **Type** : Case à cocher
- **Défaut** : Désactivé
- Verrouille le canevas à une résolution pixel spécifique au lieu de la taille de la fenêtre
- Utile pour des dimensions de sortie cohérentes sur différents écrans
- Active les contrôles Préréglage et Résolution ci-dessous
- Affiche une bordure grise autour du canevas de taille fixe
- Le canevas se réduit pour s'adapter à la fenêtre si nécessaire

#### Préréglage
- **Type** : Menu déroulant
- **Défaut** : 1920×1080 (HD Horizontal)
- Sélection rapide des résolutions courantes :
  - **1920×1080** - HD Horizontal (écran large standard)
  - **1080×1920** - HD Vertical (orientation portrait)
  - **1080×1080** - HD Petit Carré
  - **1920×1920** - HD Grand Carré
  - **3840×2160** - 4K Horizontal (ultra HD)
  - **2160×3840** - 4K Vertical (portrait 4K)
  - **2160×2160** - 4K Petit Carré
  - **3840×3840** - 4K Grand Carré
  - **3500×1500** - Bannière Web (aspect large)
  - **1080×1440** - Publication Instagram (ratio 4:5)
  - **Personnalisé** - Saisie manuelle de largeur/hauteur
- Met à jour automatiquement les champs Largeur et Hauteur
- Actif uniquement lorsque la Résolution du Framebuffer est activée

#### Résolution (Largeur × Hauteur)
- **Type** : Entrées numériques
- **Défaut** : 1920 × 1080
- **Minimum** : 320 × 240
- Contrôle manuel sur les dimensions pixel du canevas
- Modifier ces valeurs définit le menu déroulant Préréglage sur "Personnalisé"
- Des résolutions plus élevées impactent les performances
- Utilisez pour un dimensionnement de sortie précis avant l'exportation

#### Plans de Découpe
- **Type** : Curseur à double plage
- **Plage du Plan Proche** : 0.01 – 500
- **Plage du Plan Lointain** : 500 – 20000
- **Défauts** : Proche = 0.01, Lointain = 20000
- Contrôle quelles parties de l'espace 3D sont visibles
- **Proche** : Les objets plus proches que cela ne sont pas rendus
- **Lointain** : Les objets plus éloignés que cela ne sont pas rendus
- Ajustez si la géométrie apparaît coupée à des niveaux de zoom extrêmes
- Le minimum du plan proche est imposé à 0.01 pour éviter les problèmes visuels

---

### Section Géométrie

Contrôlez l'apparence et l'échelle des motifs zigzag.

#### Hauteur de la Géométrie
- **Plage** : 10 – 240
- **Défaut** : 120
- **Unités** : Pixels
- Contrôle la hauteur verticale de chaque segment zigzag
- Valeurs plus élevées = motifs zigzag plus grands
- Affecte l'échelle globale de chaque ligne
- Influence également la distance de la limite de génération

#### Épaisseur de Ligne
- **Plage** : 1 – 20
- **Défaut** : 12
- **Unités** : Pixels
- **Précision** : Incréments de 0.1
- Contrôle la largeur des rubans zigzag
- Valeurs plus élevées = lignes plus épaisses
- Peut être modulé avec Épaisseur Aléatoire (voir section Modulations)

#### Rotation du Plan Z
- **Plage** : 0° – 360°
- **Défaut** : 0°
- **Unités** : Degrés
- Fait pivoter toute la géométrie autour de l'axe Z (perpendiculaire à l'écran)
- 0° = orientation zigzag horizontale standard
- 90° = orientation zigzag verticale
- Utile pour créer différentes compositions

#### Échelle
- **Plage** : 100% – 400%
- **Défaut** : 100%
- **Unités** : Pourcentage
- Met à l'échelle uniformément toute la géométrie
- N'affecte pas les mesures dans l'espace écran (comme la distance de génération)
- 200% = la géométrie apparaît deux fois plus grande
- Utilisez pour zoomer sur la géométrie sans changer la distance de la caméra

#### Champ de Vision
- **Plage** : 0.01° – 180°
- **Défaut** : 60°
- **Unités** : Degrés
- **Précision** : Incréments de 0.01
- Contrôle le champ de vision de la caméra (angle d'objectif)
- **Valeurs plus basses** (20°-40°) = objectif téléobjectif, moins de distorsion, perspective aplatie
- **Défaut** (60°) = perspective standard similaire à la vision humaine
- **Valeurs plus élevées** (90°-120°) = objectif grand angle, plus de distorsion, effet fisheye
- **NOUVEAU EN v10** : Ajuste automatiquement la distance de la caméra pour maintenir la taille apparente
  - Seule la distorsion de perspective change, pas l'échelle de la géométrie
  - Les logs de la console affichent le calcul de compensation de distance

---

### Section Comportement

Contrôlez le timing et le mouvement de l'animation.

#### Taux d'Émission
- **Plage** : 0.1 – 10 lignes/seconde
- **Défaut** : 1.5
- **Unités** : Lignes émises par seconde
- **Précision** : Incréments de 0.1
- Contrôle la fréquence d'apparition des nouvelles lignes zigzag
- Valeurs plus élevées = plus de lignes à l'écran, animation plus dense
- Affecté par le multiplicateur de Vitesse Ambiante Maître
- Valeurs plus basses (0.1-0.5) = esthétique clairsemée, minimaliste
- Valeurs plus élevées (5-10) = animation dense, chargée

#### Vitesse
- **Plage** : 10 – 500 px/seconde
- **Défaut** : 80
- **Unités** : Pixels par seconde
- **Pas** : 5
- Contrôle la vitesse de déplacement des lignes dans l'espace
- Valeurs plus élevées = animation plus rapide
- Peut être modulé avec Vitesse Aléatoire (voir section Modulations)
- Affecté par le multiplicateur de Vitesse Ambiante Maître
- Vitesses plus lentes (10-30) = lent, méditatif
- Vitesses plus élevées (200-500) = rapide, énergique

---

### Section Modulations

Ajoutez de la variation et du mouvement organique à l'animation.

#### Épaisseur Aléatoire
- **Raccourci** : t (bascule la case à cocher)
- **Type** : Case à cocher
- **Défaut** : Désactivé
- Lorsque activé, chaque ligne obtient une épaisseur aléatoirement variée
- La variation est contrôlée par les curseurs de Plage d'Épaisseur ci-dessous
- Utilise le bruit de Perlin + onde sinusoïdale pour une variation douce et organique
- Crée un intérêt visuel et brise l'uniformité

#### Plage d'Épaisseur
- **Type** : Curseur à double plage
- **Plage** : 10% – 400%
- **Défauts** : Min = 10%, Max = 200%
- **Unités** : Pourcentage de l'Épaisseur de Ligne de base
- Actif uniquement lorsque Épaisseur Aléatoire est activée
- **Min** : Multiplicateur d'épaisseur minimum (10% = lignes très fines)
- **Max** : Multiplicateur d'épaisseur maximum (200% = deux fois plus épais)
- La plage entre min et max détermine l'intensité de la variation
- Exemple : Épaisseur de base 12px avec plage 50%-150% produit des lignes entre 6px et 18px

#### Vitesse Aléatoire
- **Raccourci** : m (bascule la case à cocher)
- **Type** : Case à cocher
- **Défaut** : Désactivé
- Lorsque activé, chaque ligne obtient une vitesse aléatoirement variée
- La variation est contrôlée par les curseurs de Plage de Vitesse ci-dessous
- Utilise le bruit de Perlin + onde sinusoïdale pour une variation douce
- Crée de la profondeur et un rythme organique

#### Plage de Vitesse
- **Type** : Curseur à double plage
- **Plage** : 50% – 200%
- **Défauts** : Min = 50%, Max = 150%
- **Unités** : Pourcentage de la Vitesse de base
- Actif uniquement lorsque Vitesse Aléatoire est activée
- **Min** : Multiplicateur de vitesse minimum (50% = moitié de la vitesse)
- **Max** : Multiplicateur de vitesse maximum (150% = 50% plus rapide)
- Exemple : Vitesse de base 80px/s avec plage 50%-150% produit des vitesses entre 40-120 px/s

#### Vitesse Ambiante Maître
- **Plage** : 5% – 100%
- **Défaut** : 100%
- **Unités** : Pourcentage
- Multiplicateur de vitesse global affectant à la fois le taux d'émission et la vitesse des lignes
- N'affecte pas les variations aléatoires individuelles, seulement les valeurs de base
- Valeurs plus basses (5%-30%) = effet de ralenti
- 50% = demi-vitesse
- 100% = vitesse normale
- Utile pour ajuster finement le tempo de l'animation sans changer les paramètres individuels

---

### Section Couleurs

Choisissez la couleur de vos motifs zigzag.

#### Palette de Couleurs
- **Type** : Nuanciers de couleurs
- **Défaut** : Blanc
- Cliquez sur n'importe quel nuancier pour changer la couleur de ligne
- La couleur active montre une bordure blanche
- **Couleurs disponibles** :
  - Blanc (#FFFFFF)
  - Bleu Clair (#50C8FF)
  - Rose/Rouge (#FF5078)
  - Vert Menthe (#50FFA0)
  - Or/Jaune (#FFC83C)
  - Violet (#C850FF)
- La couleur s'applique à toutes les lignes avec transparence alpha pour les effets de fondu
- Plus de couleurs peuvent être ajoutées en éditant le HTML

---

### Section Export

Exportez vos créations sous forme d'images ou de vidéos.

#### Exporter PNG
- **Raccourcis** : p ou Maj+P
- Capture l'image actuelle en tant qu'image PNG
- Utilise l'URL de données du canevas
- Télécharge immédiatement dans le dossier de téléchargements du navigateur
- Nom de fichier : `zigzag-emitter-AAAA-MM-JJ-HHMMSS.png`
- La résolution correspond à la taille actuelle du canevas (respecte la Résolution du Framebuffer si activée)

#### Exporter SVG
- **Raccourcis** : s ou Maj+S
- Exporte l'image actuelle en tant que fichier SVG vectoriel
- Format indépendant de la résolution
- Parfaitement évolutif à n'importe quelle taille
- Toutes les lignes sont exportées en tant qu'éléments `<path>` avec géométrie précise
- Nom de fichier : `zigzag-emitter-AAAA-MM-JJ-HHMMSS.svg`
- Idéal pour l'impression, les graphiques web ou l'édition ultérieure dans des outils vectoriels

#### Exporter Carte de Profondeur
- **Raccourcis** : d ou Maj+D
- **NOUVEAU EN v12** : Exporte les informations de profondeur sous forme d'image PNG en niveaux de gris
- Utilise une projection CPU avec calcul automatique de plage de profondeur
- **Pixels blancs** = objets les plus proches de la caméra
- **Pixels noirs** = objets les plus éloignés de la caméra
- Plage de profondeur **calculée automatiquement** à partir de la géométrie en temps réel lors de l'export
- Applique une courbe de puissance (gamma 0.6) pour améliorer le contraste
- **Case à cocher Inverser** : Inverse l'encodage de profondeur (noir = proche, blanc = loin)
- Alignement parfait au pixel près avec l'export PNG (même projection)
- **Cas d'usage** :
  - Cartes de déplacement pour post-traitement
  - Effets basés sur la profondeur dans After Effects/Blender
  - Compositing Z-depth
  - Référence pour reconstruction 3D
  - Simulation d'effets de mise au point
- Nom de fichier : `zigzag-depthmap-AAAA-MM-JJ-HHMMSS.png`
- Technique : Utilise `scanDepthRange()` pour la détection automatique des seuils proche/loin

#### Durée
- **Plage** : 1 – 60 secondes
- **Défaut** : 10 secondes
- Définit la longueur de l'enregistrement vidéo
- L'aperçu montre le nombre total d'images en fonction de la fréquence d'images

#### Fréquence d'Images (FPS)
- **Plage** : 24 – 60 images/seconde
- **Défaut** : 30 FPS
- Contrôle la fluidité de la vidéo et la taille du fichier
- 24 FPS = cinématique, fichier plus petit
- 30 FPS = vidéo web standard
- 60 FPS = ultra-fluide, fichier plus volumineux

#### Format
- **Type** : Boutons bascule
- **Options** : WebM, MP4
- **Défaut** : WebM
- **WebM** : Meilleure qualité, natif du navigateur, pas d'encodage nécessaire
- **MP4** : Compatibilité plus large, peut nécessiter une conversion
- Note : Le format réel dépend des capacités du navigateur

#### Enregistrer Vidéo
- **Raccourci** : v
- Commence la capture vidéo image par image en utilisant CCapture.js
- L'animation s'exécute à pas de temps fixe indépendamment de la fréquence d'images réelle
- L'indicateur de progression affiche le pourcentage d'achèvement
- Le rendu déterministe garantit une sortie cohérente
- Une fois terminé, la vidéo se télécharge automatiquement
- **Important** : N'interagissez pas avec la page pendant l'enregistrement
- De longues durées à FPS élevé peuvent prendre plusieurs minutes à traiter

---

## Formats d'Export

### Export PNG
- **Format** : Image raster (Portable Network Graphics)
- **Cas d'usage** : Réseaux sociaux, présentations, partage rapide
- **Résolution** : Correspond à la résolution actuelle du canevas
- **Transparence** : Fond noir opaque
- **Qualité** : Compression sans perte
- **Taille de fichier** : ~100Ko - 2Mo selon la résolution

### Export SVG
- **Format** : Graphiques vectoriels (Scalable Vector Graphics)
- **Cas d'usage** : Impression, graphiques web, édition Illustrator/Inkscape
- **Résolution** : Infinie (vectorielle)
- **Transparence** : Définie par élément de chemin
- **Éditabilité** : Complète - peut modifier les chemins, couleurs, transformations
- **Taille de fichier** : ~10Ko - 500Ko selon le nombre de lignes
- **Note** : L'export capture l'image actuelle uniquement ; ne s'anime pas

### Export Carte de Profondeur
- **Format** : PNG en niveaux de gris (Portable Network Graphics)
- **Cas d'usage** : Cartographie de déplacement, compositing Z-depth, effets de post-traitement
- **Résolution** : Correspond à la résolution actuelle du canevas
- **Encodage** : Blanc = objets proches, Noir = objets lointains (inversible)
- **Plage de profondeur** : Calculée automatiquement à partir de la géométrie en temps réel
- **Qualité** : Niveaux de gris sans perte avec courbe de puissance gamma 0.6
- **Taille de fichier** : ~50Ko - 1Mo selon la résolution
- **Technique** : Projection CPU avec alignement parfait au pixel près avec l'export PNG
- **Note** : Capture uniquement les informations de profondeur de l'image actuelle

### Export Vidéo
- **Format** : WebM ou MP4 (selon le navigateur)
- **Cas d'usage** : Plateformes vidéo, réseaux sociaux, portfolio
- **Résolution** : Correspond à la résolution actuelle du canevas
- **Capture d'images** : Enregistrement séquentiel image par image
- **Déterminisme** : Sortie identique pour les mêmes paramètres
- **Taille de fichier** : Varie grandement selon durée, FPS et résolution
  - Exemple : 10 sec @ 30fps @ 1920×1080 ≈ 5-20Mo
- **Temps de traitement** : Temps réel à plusieurs minutes selon la complexité

---

## Conseils & Bonnes Pratiques

### Optimisation des Performances
- **Taux d'émission plus bas** (0.5-2) pour des performances plus fluides
- **Désactiver Épaisseur/Vitesse Aléatoire** si vous rencontrez des ralentissements
- **Utiliser la Résolution du Framebuffer** pour un timing d'image cohérent
- **Baisser la résolution du canevas** (1280×720) pour un rendu plus rapide
- Fermez les autres onglets du navigateur pendant l'enregistrement vidéo

### Composition Visuelle
- **Taux d'émission lent + vitesse élevée** = esthétique clairsemée, minimaliste
- **Taux d'émission élevé + vitesse lente** = composition dense, en couches
- **Modulations aléatoires** ajoutent une qualité organique, dessinée à la main
- **FOV étroit (30-40°)** = aspect propre, architectural
- **FOV large (90-120°)** = perspective dramatique, immersive
- **Rotation du plan Z** crée des compositions diagonales ou verticales

### Visualisation VR / Stéréoscopique
- Activez Vue Stéréoscopique pour une sortie côte à côte
- Commencez avec **Séparation des Yeux = 30**, ajustez au goût
- Séparation plus grande = effet 3D plus fort mais peut causer une fatigue oculaire
- Pour la visualisation croisée : asseyez-vous à ~60 cm de l'écran, croisez les yeux jusqu'à ce que les images fusionnent
- Pour les casques VR : exportez la vidéo en mode framebuffer à la résolution appropriée

### Contrôle de la Caméra
- **Effectuez un zoom arrière** (défilement) avant de pivoter pour voir la structure spatiale complète
- **Déplacez-vous** pour recadrer la composition sans pivoter
- **Réinitialiser la caméra** (touche r ou R) : Restaure la position et rotation par défaut de la caméra
- **Réinitialiser le zoom** (touche 0) : Retourne la distance de la caméra à 600 unités par défaut
- L'état de la caméra est sauvegardé avec votre configuration

### Enregistrement de Vidéos Haute Qualité
1. Définissez la **Résolution du Framebuffer** souhaitée (par exemple, 3840×2160 pour 4K)
2. Choisissez une **Durée** appropriée (5-15 secondes souvent suffisant)
3. Sélectionnez la **Fréquence d'Images** : 30 FPS est standard, 60 FPS pour un mouvement fluide
4. Cliquez sur **Enregistrer Vidéo** et attendez le traitement
5. **N'interagissez pas** avec le navigateur pendant l'enregistrement
6. La vidéo se télécharge automatiquement une fois terminée

### Export pour Web/Réseaux Sociaux
- **Instagram** : Utilisez le préréglage 1080×1080 ou 1080×1440
- **Twitter/X** : 1920×1080 fonctionne bien
- **Bannière de site web** : Utilisez le préréglage 3500×1500
- **Image fixe haute qualité** : Exportez en SVG, puis rastérisez à la taille cible
- **GIF animé** : Enregistrez une vidéo, convertissez avec un outil externe

### Dépannage
- **Les lignes n'apparaissent pas** : Vérifiez Taux d'Émission > 0, ajustez la distance de la caméra
- **Problèmes de découpe** : Ajustez les plans de découpe Proche/Lointain
- **Le déplacement ne fonctionne pas** : Assurez-vous que la distance de la caméra ≥ 50 (vérifiez les logs de la console)
- **Les paramètres ne se sauvegardent pas** : Vérifiez les autorisations localStorage du navigateur
- **Fichier vidéo trop volumineux** : Réduisez la durée, les FPS ou la résolution
- **Animation saccadée** : Baissez le taux d'émission ou fermez d'autres programmes

---

## Historique des Versions

### v12 (Actuelle)
- **NOUVEAU** : Système de raccourcis clavier centralisés
  - 22 raccourcis clavier définis dans un seul tableau de configuration
  - Support des touches de modification (Ctrl, Maj)
  - Répartition cohérente des actions via des fonctions nommées
- **NOUVEAU** : Fonction d'export de carte de profondeur
  - Projection CPU avec calcul automatique de plage
  - Sortie PNG en niveaux de gris avec correction gamma
  - Alignement parfait au pixel près avec l'export PNG principal
  - Encodage de profondeur inversible
- **AMÉLIORÉ** : Fonctions d'export consolidées
  - Les raccourcis clavier déclenchent les gestionnaires de boutons réels
  - Élimine la logique d'export dupliquée
  - Assure la cohérence de la projection 3D
- **CORRIGÉ** : Nettoyage du code
  - Suppression du fallback eval() dans le gestionnaire de clavier (sécurité)
  - Consolidation du style des boutons dans les classes CSS

### v11 (Expérimentale)
- Développement de l'export de carte de profondeur
- Raffinement de la technique de projection CPU

### v10
- **NOUVEAU** : Les changements de FOV compensent automatiquement la distance de la caméra
  - Les ajustements du champ de vision ne mettent plus à l'échelle la géométrie
  - Seule la distorsion de perspective change
  - Maintient une taille apparente cohérente dans le cadre
- **CORRIGÉ** : Maximum FOV limité à 180° (était 240°)

### v9
- Contrôles de caméra basés sur la souris (orbite, déplacement, zoom)
- Journalisation de la console pour le débogage
- Amélioration de la validation de la distance de la caméra
- Sensibilité de déplacement améliorée

### Versions Antérieures
- Mode de visualisation stéréoscopique
- Contrôle de résolution du framebuffer
- Modulations d'épaisseur/vitesse aléatoires
- Capacité d'export SVG
- Enregistrement vidéo avec CCapture.js
- Ajustement de paramètres en temps réel
- Persistance LocalStorage

---

## Compatibilité des Navigateurs

- **Chrome/Edge** : Support complet ✓
- **Firefox** : Support complet ✓
- **Safari** : Support complet ✓
- **Navigateurs mobiles** : Limité (pas de contrôles souris)

**Exigences minimales** : 
- Support WebGL
- JavaScript ES6
- API Canvas 2D
- Support de téléchargement de fichiers

---

## Crédits

- **p5.js** (v1.9.0) - Framework de codage créatif
- **CCapture.js** (v1.1.0) - Capture d'images pour l'export vidéo
- Développé pour le projet TheSpaceLab / Mapping 2026

---

## Licence

[ MIT License — CC BY-NC-SA — ddelcourt 2026 ]

---

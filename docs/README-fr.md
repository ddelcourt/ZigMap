# ZigMap26 — Guide d'Utilisation
ddelcourt2026

Outil génératif en temps réel créant des motifs zigzag animés dans un espace 3D. Contrôles de caméra avancés, visualisation stéréoscopique et capacités d'exportation complètes.

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
- [Guide de Démarrage Rapide](#guide-de-démarrage-rapide)
- [Historique des Versions](#historique-des-versions)
- [Compatibilité Navigateurs](#compatibilité-navigateurs)
- [Crédits & Licence](#crédits--licence)

---

## Démarrage Rapide

1. Ouvrez l'application dans un navigateur web moderne (Chrome, Firefox, Safari, Edge)
2. Utilisez clic gauche + glisser pour pivoter la caméra
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
- Les contrôles de caméra fonctionnent uniquement lorsque la souris est sur le canevas (pas sur le panneau UI)
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
- Masque le panneau de contrôle pour une vue dégagée
- Appuyez à nouveau sur Tab ou h pour réafficher les contrôles

#### Plein Écran
- **Raccourcis** : Entrée ou f
- Active le mode plein écran du navigateur
- Maximise le canevas pour la présentation ou l'enregistrement
- Appuyez sur Échap pour quitter le plein écran

---

### Section Fichier

Sauvegardez et chargez vos configurations.

#### Sauvegarder
- **Raccourcis** : j ou Ctrl+S (⌘+S sur Mac)
- Télécharge les paramètres actuels dans un fichier `.json`
- Nom de fichier incluant l'horodatage : `zigzag-emitter-AAAA-MM-JJ-HHMMSS.json`
- Sauvegarde tous les paramètres, y compris la position de la caméra
- Enregistré dans le dossier de téléchargements du navigateur

#### Charger
- Ouvre le sélecteur de fichiers pour charger une configuration `.json` sauvegardée précédemment
- Applique instantanément tous les paramètres du fichier
- Persiste automatiquement dans localStorage

**Remarque** : Les paramètres sont automatiquement sauvegardés dans le localStorage du navigateur à chaque modification.

---

### Section Caméra

Configuration des modes de visualisation, résolution et paramètres de projection.

#### Vue Stéréoscopique (VR)
- **Raccourci** : 3
- **Type** : Case à cocher
- **Par défaut** : Désactivé
- Divise la vue en perspectives œil gauche et œil droit
- Crée des vues côte à côte pour casques VR ou vision croisée
- Bordures vertes indiquent que le mode stéréoscopique est actif
- Chaque œil obtient la moitié de la largeur de la fenêtre

#### Séparation des Yeux
- **Plage** : 0 – 100
- **Par défaut** : 30
- **Unités** : Unités d'espace monde
- Contrôle la distance entre les positions de caméra gauche et droite
- Valeurs plus élevées = effet 3D plus prononcé
- Actif uniquement quand la Vue Stéréoscopique est activée
- Ajustez selon la distance de visualisation et la taille de l'écran

#### Résolution Framebuffer
- **Raccourci** : b
- **Type** : Case à cocher
- **Par défaut** : Désactivé
- Verrouille le canevas à une résolution en pixels spécifique au lieu de la taille de fenêtre
- Utile pour des dimensions de sortie cohérentes sur différents écrans
- Active les contrôles Préréglage et Résolution ci-dessous
- Affiche une bordure grise autour du canevas de taille fixe
- Le canevas se réduit pour s'adapter à la fenêtre si nécessaire

#### Préréglage
- **Type** : Menu déroulant
- **Par défaut** : 1920×1080 (HD Horizontal)
- Sélection rapide des résolutions courantes :
  - **1920×1080** - HD Horizontal (écran large standard)
  - **1080×1920** - HD Vertical (orientation portrait)
  - **1080×1080** - HD Petit Carré
  - **1920×1920** - HD Grand Carré
  - **3840×2160** - 4K Horizontal (ultra HD)
  - **2160×3840** - 4K Vertical (portrait 4K)
  - **2160×2160** - 4K Petit Carré
  - **3840×3840** - 4K Grand Carré
  - **3500×1500** - Bannière Web (format large)
  - **1080×1440** - Publication Instagram (ratio 4:5)
  - **Personnalisé** - Saisie manuelle largeur/hauteur
- Met automatiquement à jour les champs Largeur et Hauteur
- Actif uniquement quand Résolution Framebuffer est activée

#### Résolution (Largeur × Hauteur)
- **Type** : Champs numériques
- **Par défaut** : 1920 × 1080
- **Minimum** : 320 × 240
- Contrôle manuel sur les dimensions en pixels du canevas
- Modifier ces valeurs règle le menu Préréglage sur "Personnalisé"
- Les résolutions plus élevées impactent les performances
- Utilisez pour un dimensionnement précis avant l'export

#### Champ de Vision
- **Plage** : 0.01 – 180
- **Par défaut** : 60
- **Unités** : Degrés
- Contrôle l'angle de l'objectif de la caméra
- Valeurs plus faibles (30-40°) = aspect architectural propre
- Valeurs plus élevées (90-120°) = perspective dramatique et immersive
- Affecte la distorsion de perspective et l'échelle apparente

#### Plans de Découpe
- **Type** : Curseur double
- **Plage Plan Proche** : 0.01 – 500
- **Plage Plan Lointain** : 500 – 20000
- **Par défaut** : Proche = 0.01, Lointain = 20000
- Contrôle quelles parties de l'espace 3D sont visibles
- **Proche** : Les objets plus proches ne sont pas rendus
- **Lointain** : Les objets plus éloignés ne sont pas rendus
- Ajustez si la géométrie apparaît coupée aux niveaux de zoom extrêmes
- Le minimum du plan proche est fixé à 0.01 pour éviter les glitches visuels

---

### Section Géométrie

Contrôlez l'apparence et l'échelle des motifs zigzag.

#### Hauteur de Géométrie
- **Plage** : 10 – 240
- **Par défaut** : 120
- **Unités** : Pixels

#### Épaisseur de Ligne
- **Plage** : 1 – 60
- **Par défaut** : 8
- **Unités** : Pixels
- Largeur du ruban zigzag
- Les lignes plus épaisses sont plus visibles mais peuvent chevaucher
- Les lignes plus fines créent des motifs plus délicats

#### Échelle de Géométrie
- **Plage** : 100 – 400
- **Par défaut** : 100
- **Unités** : Pourcentage
- Mise à l'échelle globale de toute la géométrie
- 100% = taille d'origine
- Valeurs plus élevées agrandissent tout l'espace
- N'affecte pas la taille du canevas, seulement l'échelle spatiale

---

### Section Comportement

Contrôles de timing d'émission et de mouvement.

#### Taux d'Émission
- **Plage** : 0.1 – 10
- **Par défaut** : 1.5
- **Unités** : Lignes par seconde
- Fréquence de création de nouvelles lignes
- Valeurs plus élevées = écran plus chargé et actif
- Valeurs plus faibles = animation plus calme et espacée
- Impacte directement la densité visuelle

#### Vitesse
- **Plage** : 10 – 500
- **Par défaut** : 80
- **Unités** : Pixels par seconde
- Vitesse à laquelle les lignes se déplacent à travers l'espace
- Animation plus rapide crée de l'urgence/de l'énergie
- Animation plus lente est plus méditative
- Distance parcourue par seconde dans l'espace monde

---

### Section Modulations

Variations aléatoires.

#### Épaisseur Aléatoire
- **Raccourci** : t
- **Type** : Case à cocher
- **Par défaut** : Désactivé
- Applique une variation aléatoire à l'épaisseur de chaque ligne
- Crée de l'intérêt visuel à travers la diversité
- La plage est contrôlée par le curseur Plage d'Épaisseur ci-dessous

#### Plage d'Épaisseur
- **Type** : Curseur double
- **Plage** : 10% – 400%
- **Par défaut** : 10% – 200%
- **Unités** : Pourcentage de l'épaisseur de base
- Définit la variation minimale et maximale quand l'épaisseur aléatoire est activée
- Par exemple : 50%-150% varie l'épaisseur de la moitié au double
- N'a d'effet que si Épaisseur Aléatoire est cochée

#### Vitesse Aléatoire
- **Raccourci** : m
- **Type** : Case à cocher
- **Par défaut** : Désactivé
- Applique une variation aléatoire à la vitesse de chaque ligne
- Crée un mouvement plus organique et naturel
- La plage est contrôlée par le curseur Plage de Vitesse ci-dessous

#### Plage de Vitesse
- **Type** : Curseur double
- **Plage** : 10% – 400%
- **Par défaut** : 30% – 200%
- **Unités** : Pourcentage de la vitesse de base
- Définit la variation minimale et maximale quand la vitesse aléatoire est activée
- N'a d'effet que si Vitesse Aléatoire est cochée
- Crée une profondeur et un dynamisme visuel

---

### Section Couleurs

Sélection de palette de couleurs.

#### Nuancier de Couleur
- Cliquez sur n'importe quel cercle de couleur pour changer la couleur du ruban
- Les couleurs sont persistées dans localStorage
- Couleurs prédéfinies : Blanc, Bleu Clair, Cyan, Rose, Jaune, Orange, Rouge, Vert

---

### Section Export

Exportez votre travail dans différents formats.

#### Exporter PNG
- **Raccourci** : p ou Maj+P
- **Format** : Image raster
- **Type de fichier** : `.png`
- Capture directe du canevas
- Inclut transparence
- Taille de sortie correspond aux dimensions actuelles du canevas
- Utilise les dimensions framebuffer si activées
- Fichier téléchargé : `zigzag-emitter-AAAA-MM-JJ-HHMMSS.png`

#### Exporter SVG
- **Raccourci** : s ou Maj+S
- **Format** : Graphique vectoriel
- **Type de fichier** : `.svg`
- Version vectorielle de l'image actuelle
- Ligne par ligne avec projection exacte
- Mise à l'échelle infinie sans perte de qualité
- Éditable dans Illustrator, Inkscape, etc.
- Fichier téléchargé : `zigzag-emitter-AAAA-MM-JJ-HHMMSS.svg`

#### Exporter Carte de Profondeur
- **Raccourci** : d ou Maj+D
- **Format** : Image en niveaux de gris
- **Type de fichier** : `.png`
- Encode la profondeur Z comme luminosité
- Proche = blanc, Lointain = noir
- Utile pour compositing, post-traitement VFX
- Fichier téléchargé : `zigzag-emitter-depth-AAAA-MM-JJ-HHMMSS.png`

#### Enregistrement Vidéo
- **Raccourci** : v
- **Format** : WebM (par défaut) ou MP4
- **Type de fichier** : `.webm` ou `.mp4`
- Capture image par image pour un rendu fluide
- Bouton bascule pour démarrer/arrêter l'enregistrement
- Indicateur d'enregistrement rouge dans l'interface
- Exporte automatiquement à l'arrêt
- Rendu déterministe (pas de chute d'images)
- Taille de sortie correspond aux dimensions du canevas

---

## Formats d'Export

| Format | Type | Cas d'Usage | Taille | Évolutivité |
|--------|------|-------------|--------|-------------|
| **PNG** | Raster | Partage rapide, web, réseaux sociaux | Moyenne | Dimensions fixes |
| **SVG** | Vectoriel | Impression, design, édition | Petite | Infinie |
| **Profondeur** | Raster | VFX, compositing, 3D | Petite | Dimensions fixes |
| **Vidéo** | Média temporel | Animation, présentation | Grande | Résolution vidéo |

---

## Conseils & Bonnes Pratiques

### Performance
- **Résolutions élevées** : Utilisez le mode framebuffer pour un rendu à 4K de manière cohérente
- **Taux d'émission** : Réduisez pour améliorer les performances sur les systèmes plus lents
- **Nombre de lignes** : Moins de lignes actives = framerate plus élevé
- **Mode stéréoscopique** : Rend deux vues, considérez de réduire la résolution

### Composition
- **Règle des tiers** : Positionnez les éléments clés hors centre pour l'intérêt
- **Profondeur** : Utilisez la rotation de caméra pour révéler les couches spatiales
- **Couleur** : Les couleurs vives sur fond sombre créent un impact maximum
- **Densité** : Équilibrez le taux d'émission et la vitesse pour la clarté visuelle

### Visualisation VR
- **Séparation des yeux** : Démarrez à 30, ajustez selon la distance de visualisation
- **Distance d'écran** : Séparation plus proche → plus petite, plus loin → plus grande
- **Test** : Utilisez la vision croisée ou des visionneurs cardboard pour valider la profondeur
- **Confort** : Évitez une séparation excessive pour réduire la fatigue visuelle

### Contrôle de Caméra
- **Réinitialisation** : Utilisez 'r' pour revenir à la vue par défaut
- **Zoom** : Utilisez '0' pour réinitialiser la distance, puis défilez pour ajuster
- **Déplacement** : Clic droit + glisser pour recentrer dans le cadre
- **Rotation** : Petits mouvements pour des ajustements précis

### Enregistrement
- **Préparez la scène** : Réglez tous les paramètres avant d'enregistrer
- **Durée** : Les enregistrements plus courts (10-30 secondes) sont plus gérables
- **Framerate** : Les exports vidéo sont fluides grâce au rendu image par image
- **Performance** : Fermez les autres applications pendant l'enregistrement

### Export Web/Réseaux Sociaux
- **Instagram** : Utilisez le préréglage 1080×1440 pour les publications
- **Banner web** : Préréglage 3500×1500 pour les bannières larges
- **Twitter/X** : 1920×1080 fonctionne bien pour les publications vidéo
- **Format** : PNG pour les images statiques, WebM pour les animations

### Dépannage
- **Écran noir** : Vérifiez la console du navigateur pour les erreurs
- **Performances lentes** : Réduisez la résolution, le taux d'émission ou désactivez le mode stéréo
- **Exports manquants** : Vérifiez que les téléchargements ne sont pas bloqués par le navigateur
- **Paramètres non sauvegardés** : Assurez-vous que localStorage n'est pas désactivé
- **Vidéo pas d'enregistrement** : Rechargez la page et réessayez

---

# Guide de Démarrage Rapide

## 🚀 Lancer l'Application

### Méthode 1 : Serveur Python (Recommandé)
```bash
cd "/Users/ddelcourt/Documents/Area Zero Base/Works/Clients/Mapping 2026/SpaceGenZigMap"
python3 -m http.server 8080
```
Puis ouvrez : **http://localhost:8080**

### Méthode 2 : Serveur Node.js
```bash
npx http-server -p 8080
```

### Méthode 3 : Live Server VS Code
1. Installez l'extension "Live Server"
2. Clic droit sur `index.html` → "Open with Live Server"

⚠️ **Important** : Les modules ES6 nécessitent un serveur web. Ouvrir `index.html` directement avec le protocole `file://` ne fonctionnera pas.

---

## 📁 Structure du Projet

```
ZigMap26/
├── index.html           # Point d'entrée principal
├── css/                 # 3 modules CSS
├── js/                  # 15 modules JavaScript
│   ├── main.js          # Point d'entrée de l'application
│   ├── config/          # Valeurs par défaut & constantes
│   ├── core/            # Classes de rendu principales
│   ├── storage/         # Intégration localStorage
│   ├── rendering/       # Sketches p5.js
│   ├── export/          # Fonctions d'export (SVG, PNG, profondeur, vidéo)
│   ├── ui/              # Liaisons de contrôles UI
│   └── input/           # Gestionnaires clavier & souris
├── config/              # 3 fichiers de configuration JSON
├── docs/                # Documentation (6 fichiers markdown)
└── backup/              # Fichier monolithique original

Total : 25 fichiers modulaires (depuis 1 fichier HTML monolithique de 2334 lignes)
```

---

## ⌨️ Raccourcis Clavier

| Touche | Action |
|--------|--------|
| **Tab** / **h** | Basculer panneau de contrôle |
| **Entrée** / **f** | Plein écran |
| **p** | Exporter PNG |
| **s** | Exporter SVG |
| **Cmd/Ctrl+S** | Sauvegarder paramètres JSON |
| **d** | Exporter carte de profondeur |
| **v** | Démarrer/arrêter enregistrement vidéo |
| **r** | Réinitialiser caméra |
| **0** | Réinitialiser zoom |
| **t** | Basculer épaisseur aléatoire |
| **m** | Basculer vitesse aléatoire |
| **3** | Basculer mode stéréoscopique |
| **b** | Basculer mode framebuffer |

Liste complète : Voir `config/keyboardShortcuts.json`

---

## 🖱️ Contrôles Souris

- **Clic gauche + glisser** : Pivoter caméra
- **Clic droit + glisser** : Déplacer vue
- **Molette de défilement** : Zoomer

---

## 🎨 Fonctionnalités Clés

### Rendu
- Rubans zigzag 3D en temps réel avec p5.js WEBGL
- Mode VR stéréoscopique (double caméra côte à côte)
- Mode framebuffer (rendu à résolution fixe)
- Modulation aléatoire (épaisseur & vitesse)

### Options d'Export
1. **PNG** — Export raster direct du canevas
2. **SVG** — Graphique vectoriel avec projection exacte
3. **Carte de Profondeur** — Encodage de profondeur en niveaux de gris
4. **Vidéo** — Enregistrement CCapture.js (WebM/MP4)

### Paramètres
- Sauvegarde automatique dans localStorage
- Export/import en fichiers JSON
- Plus de 50 paramètres (géométrie, caméra, modulation, couleurs)

---

## 🛠️ Développement

### Organisation des Fichiers
- **CSS** : `css/main.css`, `css/canvas.css`, `css/controls.css`
- **Config** : `config/*.json` pour raccourcis clavier, préréglages, métadonnées
- **Logique Principale** : `js/core/` pour ZigzagLine, Emitter, Camera
- **Fonctionnalités** : Modules séparés pour export, UI, gestion des entrées

### Système de Modules
Tout le JavaScript utilise les modules ES6 :
```javascript
import { ZigzagLine } from './core/ZigzagLine.js';
export function exportSVG(ZM) { /* ... */ }
```

### Ajouter des Fonctionnalités

#### Nouveau Format d'Export
1. Créez `js/export/NouveauExporteur.js`
2. Exportez une fonction : `export function exportNouveau(ZM) { ... }`
3. Importez dans `main.js` et ajoutez à `window.ZigMap26`
4. Reliez au bouton UI dans `UIController.js`

#### Nouveau Paramètre
1. Ajoutez à `js/config/defaults.js` dans `DEFAULT_PARAMS`
2. Ajoutez un contrôle UI dans `index.html`
3. Reliez curseur/checkbox dans `UIController.js`
4. Utilisez via `ZM.params.nouveauParametre`

#### Nouveau Raccourci Clavier
1. Ajoutez une entrée à `config/keyboardShortcuts.json`
2. Ajoutez le gestionnaire d'action dans `KeyboardHandler.js::executeAction()`

---

## 📚 Documentation

- **Guide d'utilisation** : [docs/User-Manual-fr.md](docs/User-Manual-fr.md)
- **Documentation technique** : [docs/Documentation-fr.md](docs/Documentation-fr.md)
- **Guide de projection** : [docs/Projection-Matrix-Guide-fr.md](docs/Projection-Matrix-Guide-fr.md)
- **Ce README** : Accessible via le bouton "Lisez-moi" dans l'interface

---

## ✅ Liste de Vérification Tests

1. ✅ Chargement de l'application (pas d'erreurs console)
2. ✅ Rendu du canevas (lignes zigzag visibles)
3. ✅ Contrôles souris (rotation, déplacement, zoom)
4. ✅ Réponse des raccourcis clavier
5. ✅ Changement de curseurs UI
6. ✅ Mode stéréoscopique (bordures vertes, double vue)
7. ✅ Mode framebuffer (bordure grise, résolution fixe)
8. ✅ Export PNG (téléchargement d'image)
9. ✅ Export SVG (fichier vectoriel)
10. ✅ Export carte de profondeur (image en niveaux de gris)
11. ✅ Enregistrement vidéo (WebM/MP4)
12. ✅ Sauvegarde/chargement JSON
13. ✅ Persistance localStorage (recharger = mêmes paramètres)

---

## 🔧 Dépannage

### L'application ne charge pas
- **Vérifiez** : Exécutez-vous via un serveur HTTP ? (pas `file://`)
- **Solution** : Utilisez `python3 -m http.server 8080`
- **Vérifiez** : Console du navigateur pour les erreurs de module

### Erreur "Cannot use import statement outside a module"
- **Cause** : Ouverture directe du fichier HTML sans serveur
- **Solution** : Utilisez un serveur web (voir section Lancer l'Application)

### Les performances sont lentes
- **Réduisez** : Taux d'émission (moins de lignes)
- **Réduisez** : Résolution (en mode framebuffer)
- **Désactivez** : Mode stéréoscopique (rend deux fois)
- **Fermez** : Autres onglets du navigateur

### Écran noir / pas de rendu
- **Vérifiez** : Console du navigateur pour les erreurs
- **Vérifiez** : WebGL activé dans les paramètres du navigateur
- **Essayez** : Rechargement dur (Cmd+Maj+R / Ctrl+Maj+R)

### Exports ne se téléchargent pas
- **Vérifiez** : Paramètres de téléchargement du navigateur
- **Vérifiez** : Les téléchargements ne sont pas bloqués/refusés
- **Essayez** : Un navigateur différent

### Les paramètres ne se sauvegardent pas
- **Vérifiez** : localStorage activé dans le navigateur
- **Vérifiez** : Pas en mode navigation privée
- **Essayez** : Autoriser le stockage pour ce site

---

## 📦 Dépendances Externes

Chargées via CDN dans `index.html` :

- **p5.js 1.9.0** : `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js`
  - Framework de codage créatif
  - Moteur de rendu WebGL

- **CCapture.js 1.1.0** : `https://cdn.jsdelivr.net/npm/ccapture.js@1.1.0/build/CCapture.all.min.js`
  - Capture vidéo image par image
  - Support WebM et formats variés

---

## 💾 Sauvegarde

Le fichier HTML monolithique original a été sauvegardé à :
```
backup/ZigzagEmitter_12_backup_20260309.html
```

Cette sauvegarde contient la version fonctionnelle complète d'avant la modularisation. Utilisez-la comme référence ou pour revenir en arrière si nécessaire.

---

## 🚀 Prochaines Étapes

1. **Explorez** : Cliquez sur tous les contrôles pour comprendre leurs effets
2. **Expérimentez** : Essayez différentes combinaisons de paramètres
3. **Sauvegardez** : Exportez vos préréglages favoris en JSON
4. **Partagez** : Exportez PNG/vidéo pour les réseaux sociaux
5. **Apprenez** : Lisez la documentation technique pour comprendre le code
6. **Contribuez** : Ajoutez de nouvelles fonctionnalités ou améliorations

---

## Historique des Versions

### Version 13 (Mars 2026) - Architecture Modulaire
- **NOUVEAU** : Refactorisation complète en 25 fichiers modulaires
  - 1 HTML (330 lignes)
  - 3 CSS (≈400 lignes)
  - 15 modules JavaScript (≈1500 lignes)
  - 3 fichiers de configuration JSON
- **NOUVEAU** : Documentation complète (README, manuels, guides techniques)
- **AMÉLIORATION** : Séparation claire des responsabilités
- **AMÉLIORATION** : Développement et maintenance plus faciles
- **FIXÉ** : Tous les bugs de la version monolithique

### Version 12 (2025)
- **NOUVEAU** : Système de raccourcis clavier centralisés
  - Tous les 22 raccourcis définis dans un tableau de configuration
  - Plus facile à modifier et documenter
- **NOUVEAU** : Export carte de profondeur
  - Encodage de profondeur en niveaux de gris
  - Applications compositing et VFX
  - Ajustement automatique de la plage de profondeur
- **NOUVEAU** : Compensation de distance FOV
  - Les changements de FOV ajustent la distance de caméra automatiquement
  - Les ajustements de FOV ne font plus l'échelle de la géométrie
- **FIXÉ** : Maximum FOV limité à 180° (était 240°)
- **AMÉLIORATION** : Gestion de la sensibilité de défilement

---

## Compatibilité Navigateurs

- **Chrome/Edge** : ✅ Support complet
- **Firefox** : ✅ Support complet
- **Safari** : ✅ Support complet (modules ES6)
- **Mobile** : ⚠️ Limité (pas de clic droit pour déplacement)

**Exigences minimales** :
- Support ES6/ES2015 (modules, classes, flèches)
- WebGL activé
- localStorage activé (pour persistance des paramètres)

---

## Crédits & Licence

**Développé par** : ddelcourt2026

**Technologies utilisées** :
- [p5.js](https://p5js.org/) — Framework de codage créatif
- [CCapture.js](https://github.com/spite/ccapture.js/) — Capture vidéo
- Modules JavaScript ES6
- WebGL pour le rendu 3D accéléré

**Version monolithique originale** : ZigzagEmitter v1-12  
**Architecture modulaire** : ZigMap26 v13  
**Date de refactorisation** : 9 mars 2026

**Licence** : MIT

---
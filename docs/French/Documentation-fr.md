# Émetteur Zigzag — Documentation technique
ddelcourt2026

**Version 26** — Architecture du code, guide d'implémentation — Structure du code, modèles d'architecture et détails d'implémentation.

---

## Table des matières

- [Vue d'ensemble de l'architecture](#vue-densemble-de-larchitecture)
- [Stack technologique](#stack-technologique)
- [Structure des fichiers](#structure-des-fichiers)
- [Concepts fondamentaux](#concepts-fondamentaux)
- [Structures de données](#structures-de-données)
- [Référence des classes](#référence-des-classes)
- [Référence des fonctions](#référence-des-fonctions)
- [Pipeline de rendu](#pipeline-de-rendu)
- [Système de caméra](#système-de-caméra)
- [Système d'incrustation](#système-dincrustation)
- [Système d'export](#système-dexport)
- [Gestion d'état](#gestion-détat)
- [Gestion des événements](#gestion-des-événements)
- [Considérations de performance](#considérations-de-performance)
- [Guide d'extension](#guide-dextension)
- [Débogage](#débogage)

---

## Vue d'ensemble de l'architecture

L'application suit une architecture à fichier unique avec une séparation des préoccupations assurée par l'organisation du code et l'espacement de noms.

```
┌─────────────────────────────────────────────┐
│        Structure HTML & CSS                 │
│  (Contrôles UI, mise en page, style)        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│        Application JavaScript               │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │     État global & paramètres          │  │
│  │  (params, camera, instances)          │  │
│  └───────────────────────────────────────┘  │
│                    ↓                        │
│  ┌───────────────────────────────────────┐  │
│  │      Classes principales              │  │
│  │  • ZigzagLine                         │  │
│  │  • Emitter                            │  │
│  └───────────────────────────────────────┘  │
│                    ↓                        │
│  ┌───────────────────────────────────────┐  │
│  │      Factory de sketch p5.js          │  │
│  │  (fonction createSketch)              │  │
│  └───────────────────────────────────────┘  │
│                    ↓                        │
│  ┌───────────────────────────────────────┐  │
│  │      Fonctions utilitaires            │  │
│  │  • Aides géométriques                 │  │
│  │  • Fonctions d'export                 │  │
│  │  • Persistance d'état                 │  │
│  └───────────────────────────────────────┘  │
│                    ↓                        │
│  ┌───────────────────────────────────────┐  │
│  │      Gestionnaires d'événements UI    │  │
│  │  • Câblage des curseurs               │  │
│  │  • Gestionnaires de boutons           │  │
│  │  • Raccourcis clavier                 │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Modèles de conception

- **Factory** : `createSketch()` génère des instances p5.js
- **Observer** : les contrôles UI mettent à jour l'objet `params`, déclenchant une persistance automatique
- **Singleton** : instance unique d'`Emitter` partagée entre les vues stéréo
- **Module** : regroupement logique de fonctions apparentées avec commentaires

---

## Stack technologique

### Bibliothèques principales

**[p5.js](https://p5js.org/) v1.9.0**
Framework de codage créatif. Fournit un moteur de rendu WebGL, la gestion du canevas, le dessin, les transformations et la projection en perspective.

**[CCapture.js](https://github.com/spite/ccapture.js/) v1.1.0**
Capture vidéo image par image. Rendu déterministe pour une sortie cohérente. Support WebM et autres formats.

### APIs du navigateur

- **Canvas 2D** : export PNG via `toDataURL()`
- **WebGL** : rendu 3D accéléré via p5.js
- **LocalStorage** : persistance des paramètres
- **File API** : import/export de configuration JSON
- **Fullscreen API** : bascule du mode plein écran

### Fonctionnalités du langage

JavaScript ES6+ : classes, fonctions fléchées, décomposition, littéraux de modèle, opérateur de propagation, portée de bloc `const`/`let`.

---

## Structure des fichiers

```
ZigzagEmitter_10.html    (application à fichier unique)
├── <!DOCTYPE html>
├── <head>
│   ├── Balises meta
│   ├── Imports de bibliothèques externes (p5.js, CCapture.js)
│   └── <style> (CSS)
├── <body>
│   ├── .controls (barre latérale gauche)
│   │   ├── Section UI
│   │   ├── Section Fichier
│   │   ├── Section Caméra
│   │   ├── Section Géométrie
│   │   ├── Section Comportement
│   │   ├── Section Modulations
│   │   ├── Section Couleurs
│   │   └── Section Export
│   └── #canvas-container
│       └── #canvas-wrapper (contenu dynamique)
└── <script>
    ├── Constantes globales & état
    ├── Fonctions d'aide
    ├── Classe ZigzagLine
    ├── Classe Emitter
    ├── Factory createSketch
    ├── Cycle de vie du sketch
    ├── Gestion d'état
    ├── Fonctions d'export
    └── Initialisation UI
```

---

## Concepts fondamentaux

### 1. Systèmes de coordonnées

**Espace écran**
- Origine : coin supérieur gauche
- Unités : pixels
- Plage : `[0, W)` × `[0, H)`
- Utilisation : entrée souris, éléments UI

**Espace canevas**
- Origine : centre du canevas
- Unités : pixels
- Plage : `[-W/2, W/2)` × `[-H/2, H/2)`
- Utilisation : génération de géométrie 2D, limites de génération

**Espace monde**
- Origine : centre de la scène après transformations
- Unités : arbitraires, mis à l'échelle par `geometryScale`
- Utilisation : rendu 3D, transformations de caméra
- Transformations appliquées : translation, rotation, échelle

### 2. Modes de rendu

**Monoscopique (défaut)**
Canevas unique remplissant la fenêtre. Rendu en perspective standard. Bordure gris foncé (1px).

**Stéréoscopique (mode VR)**
Deux canevas côte à côte (œil gauche / droit). Chaque canevas : largeur W/2. Caméra décalée de `±eyeSeparation/2` le long de l'axe X. Bordures vertes indiquant le mode stéréo. Animation synchronisée via `sharedLastTime`.

**Mode framebuffer**
Résolution fixe indépendante de la taille de la fenêtre. Canevas mis à l'échelle pour s'adapter à la fenêtre. Active l'export au pixel près. Bordure gris foncé autour du canevas fixe.

### 3. Boucle d'animation

```
1. Effacer l'arrière-plan (noir)
2. Mettre à jour la caméra depuis l'entrée souris
3. Calculer le temps delta (dt)
4. Mettre à jour l'émetteur (générer nouvelles lignes, déplacer existantes)
5. Appliquer les transformations de caméra (translation, rotation, perspective)
6. Dessiner toutes les lignes zigzag
7. (Si enregistrement) capturer l'image pour l'encodeur vidéo
```

### 4. Génération de géométrie

Les motifs zigzag sont construits comme suit :

1. **Ligne centrale** : série de points formant le chemin zigzag
2. **Décalage de ruban** : décalages perpendiculaires créant l'épaisseur
3. **Joints en onglet** : connexions lisses aux sommets
4. **Embouts** : capuchons verticaux plats au début et en fin
5. **Construction de maillage** : bande de quads depuis les côtés gauche et droit

---

## Structures de données

### Objet `params`

Objet de configuration central stockant tous les paramètres ajustables.

```javascript
const params = {
  // Géométrie
  segmentLength: 120,        // Hauteur de chaque segment zigzag (px)
  lineThickness: 12,         // Largeur du ruban (px)
  emitterRotation: 0,        // Rotation axe Z (degrés)
  geometryScale: 100,        // Échelle uniforme (%)
  fadeDuration: 0.8,         // Durée de fondu d'entrée/sortie (secondes)

  // Palettes de couleurs
  palettes: [                // 4 palettes × 4 couleurs chacune
    [
      { color: [255, 255, 255], role: 'line' },
      { color: [200, 200, 255], role: 'line' },
      { color: [255, 200, 200], role: 'line' },
      { color: [200, 255, 200], role: 'none' }
    ],
    // ... palettes 2–4
  ],
  activePaletteIndex: 0,         // Palette sélectionnée (0–3)
  colorTransitionDuration: 3.0,  // Durée de transition de palette (secondes)
  colorSlotZOffset: 100,         // Multiplicateur de séparation Z

  // Animation
  emitRate: 1.5,             // Lignes générées par seconde
  speed: 80,                 // Vitesse de mouvement de base (px/s)

  // Caméra
  fov: 60,                   // Champ de vision (degrés)
  near: 0.01,                // Plan de découpe proche
  far: 20000,                // Plan de découpe lointain
  cameraRotationX: -0.3,     // Rotation axe X (radians)
  cameraRotationY: 0,        // Rotation axe Y (radians)
  cameraDistance: 600,       // Distance depuis l'origine
  cameraOffsetX: 0,          // Décalage de déplacement X
  cameraOffsetY: 0,          // Décalage de déplacement Y

  // Modulation
  randomThickness: false,    // Activer variation d'épaisseur
  randomSpeed: false,        // Activer variation de vitesse
  thicknessRangeMin: 10,     // Multiplicateur d'épaisseur min (%)
  thicknessRangeMax: 200,    // Multiplicateur d'épaisseur max (%)
  speedRangeMin: 50,         // Multiplicateur de vitesse min (%)
  speedRangeMax: 150,        // Multiplicateur de vitesse max (%)
  ambientSpeedMaster: 100,   // Multiplicateur de vitesse global (%)

  // Rendu
  stereoscopicMode: false,   // Activer stéréo double caméra
  eyeSeparation: 30,         // Distance entre caméras
  framebufferMode: false,    // Verrouiller à résolution fixe
  framebufferPreset: '1920x1080',
  framebufferWidth: 1920,    // Largeur du canevas (px)
  framebufferHeight: 1080,   // Hauteur du canevas (px)

  // Export
  videoDuration: 10,         // Durée d'enregistrement (secondes)
  videoFPS: 30,              // Fréquence d'images
  videoFormat: 'webm'        // Codec vidéo
};
```

### Objet `camera`

État de la caméra indépendant de `params` pour éviter les mises à jour circulaires.

**IMPORTANT** : Lors de la sauvegarde d'états, les paramètres de caméra (`rotationX`, `rotationY`, `distance`, `offsetX`, `offsetY`) sont stockés dans un objet `camera` séparé, distinct de l'objet `params`. Cette séparation permet une gestion plus claire des états et élimine la redondance dans les fichiers JSON de projet.

```javascript
const camera = {
  rotationX: -0.3,     // Tangage (radians)
  rotationY: 0,        // Lacet (radians)
  distance: 600,       // Distance de zoom
  offsetX: 0,          // Décalage de déplacement X
  offsetY: 0,          // Décalage de déplacement Y
  isDragging: false,   // Glissement clic gauche actif
  isPanning: false,    // Glissement clic droit actif
  lastMouseX: 0,       // X souris précédent (pour delta)
  lastMouseY: 0        // Y souris précédent (pour delta)
};
```

### Constantes

```javascript
const SEGMENTS = 16;                // Sommets zigzag par ligne
const FADE_IN_DURATION = 0.3;       // Secondes pour le fondu d'opacité
const FADE_OUT_DISTANCE = 80;       // Pixels de la limite pour commencer le fondu
const STORAGE_KEY = 'zigzagEmitterSettings';  // Clé LocalStorage
```

### Variables d'état global

```javascript
let W, H;                    // Dimensions logiques du canevas
let noiseOffset;             // Décalage temporel du bruit de Perlin
let p5Instance;              // Instance de sketch p5 primaire
let p5InstanceRight;         // Instance secondaire (droite stéréo)
let emitterInstance;         // Objet Emitter partagé
let capturer;                // Instance CCapture
let isRecording;             // Indicateur d'enregistrement actif
let recordingFrameCount;     // Image actuelle dans l'enregistrement
let recordingTotalFrames;    // Nombre d'images cible
let sharedLastTime;          // Horodatage synchronisé pour stéréo
let activeCanvasId;          // Canevas ayant le contrôle de la caméra
let isUpdatingCanvasSize;    // Empêcher redimensionnement récursif
```

---

## Référence des classes

### `ZigzagLine`

Représente un seul ruban zigzag animé.

#### Constructeur

```javascript
constructor({ p, x, y, segmentLength, lineThickness, colorData, vy })
```

**Paramètres**
- `p` (p5) : référence à l'instance p5.js
- `x` (Number) : position X initiale (espace canevas)
- `y` (Number) : position Y initiale (espace canevas)
- `segmentLength` (Number) : hauteur de chaque segment
- `lineThickness` (Number) : largeur du ruban
- `colorData` (Object) : `{color: [r,g,b], slotIndex: 0–3}`
- `vy` (Number) : vélocité en Y (px/s, négatif = vers le haut)

**Propriétés**
- `segments` (Number) : toujours 16
- `step` (Number) : distance de pas diagonal = `segmentLength / √2`
- `totalWidth` (Number) : largeur horizontale totale = `segments × step`
- `alive` (Boolean) : ligne toujours visible
- `age` (Number) : secondes depuis la génération
- `currentColor` (Array) : couleur RGB actuelle `[r, g, b]`
- `startColor` (Array) : couleur au début de la transition
- `targetColor` (Array) : couleur à la fin de la transition
- `colorTransitionProgress` (Number) : progression de transition (0–1)
- `isTransitioning` (Boolean) : transition active
- `colorSlotIndex` (Number) : index (0–3) pour calcul de Z-offset
- `zOffset` (Number) : `(colorSlotIndex - 2) × params.colorSlotZOffset`

#### Méthodes

##### `_buildVertices()`

Génère les points de ligne centrale pour le motif zigzag.

**Retourne** : `Array<{x, y}>` — points 2D dans l'espace local

**Algorithme**
1. Commencer au bord gauche : `x = -totalWidth / 2, y = 0`
2. Pour chaque segment : déplacer à droite de `step`, alterner déplacement haut/bas de `step`
3. Produit un motif zigzag horizontal

##### `update(dt)`

Met à jour la position et vérifie si la ligne doit être éliminée.

**Paramètres** : `dt` (Number) — temps delta en secondes

**Logique**
1. Incrémenter l'âge de `dt`
2. Déplacer la position Y de `vy × dt`
3. Convertir en espace monde : `worldY = y - H/2`
4. Vérifier si hors des limites de génération, définir `alive = false` si c'est le cas

##### `_alpha()`

Calcule l'opacité combinée du fondu d'entrée et de sortie.

**Retourne** : `Number` — valeur alpha dans la plage [0, 1]

**Algorithme**
1. **Fondu d'entrée** : `min(age / FADE_IN_DURATION, 1)`
2. **Fondu de sortie** : calculer la distance à la limite la plus proche, `min(distToBoundary / FADE_OUT_DISTANCE, 1)`
3. Retourner le minimum des deux valeurs

##### `draw(p)`

Rend la ligne zigzag comme une forme remplie.

**Paramètres** : `p` (p5) — instance p5.js

**Étapes**
1. Calculer alpha (plage 0–255)
2. Construire la géométrie du ruban via `buildRibbonSides()`
3. Push matrice (sauvegarder l'état de transformation)
4. Translater à la position monde de la ligne
5. Définir la couleur de remplissage avec alpha
6. Dessiner la forme (boucle de sommets côté gauche, boucle inversée côté droit, fermer le polygone)
7. Pop matrice (restaurer l'état de transformation)

---

### `Emitter`

Gère la génération et la mise à jour de toutes les lignes zigzag.

#### Constructeur

```javascript
constructor({ p, x, y })
```

**Paramètres**
- `p` (p5) : référence à l'instance p5.js
- `x` (Number) : position de génération X (espace canevas)
- `y` (Number) : position de génération Y (espace canevas)

**Propriétés**
- `lines` (Array) : collection d'instances `ZigzagLine`
- `accumulator` (Number) : tampon temporel pour le timing d'émission

#### Méthodes

##### `update(dt)`

Met à jour toutes les lignes et en génère de nouvelles selon le taux d'émission.

**Algorithme**
1. Ajouter `dt` à l'accumulateur
2. Calculer le taux effectif : `emitRate × (ambientSpeedMaster / 100)`
3. Calculer l'intervalle : `1 / effectiveRate`
4. Tant que accumulateur ≥ intervalle : soustraire l'intervalle, appeler `_emit()`
5. Mettre à jour toutes les lignes existantes
6. Filtrer les lignes mortes (`alive === false`)

##### `_emit()`

Génère une seule nouvelle ligne zigzag.

**Algorithme**

1. **Calcul d'épaisseur**
   - Commencer avec `params.lineThickness`
   - Si `randomThickness` activé : échantillonner le bruit de Perlin et une onde sinusoïdale, mélanger (`noise × 0.7 + sine × 0.3`), mapper à la plage `[thicknessRangeMin%, thicknessRangeMax%]`, multiplier par l'épaisseur de base

2. **Calcul de vitesse**
   - Commencer avec `params.speed`
   - Si `randomSpeed` activé : mélange similaire bruit + sinusoïde, mapper à la plage `[speedRangeMin%, speedRangeMax%]`, multiplier par la vitesse de base
   - Appliquer le maître ambiant : `speed × ambientSpeedMaster / 100`

3. **Créer la ligne** : instancier `ZigzagLine` avec les valeurs calculées, vélocité négative (mouvement vers le haut), ajouter au tableau `lines`

##### `draw(p)`

```javascript
for (const line of this.lines) {
  line.draw(p);
}
```

---

## Référence des fonctions

### Fonctions d'aide

#### `getSpawnDistance()`

Calcule la demi-largeur du champ de génération.

**Retourne** : `Number` — distance en pixels

```javascript
const step = params.segmentLength / Math.SQRT2;
return (SEGMENTS * step) / 2;
```

#### `buildRibbonSides(points, halfWidth)`

Convertit une polyligne en chemins décalés pour le rendu de ruban.

**Paramètres**
- `points` (Array) : sommets de ligne centrale `[{x, y}, ...]`
- `halfWidth` (Number) : moitié de l'épaisseur désirée

**Retourne** : `Object` — `{ leftSide: [{x,y}, ...], rightSide: [{x,y}, ...] }`

**Algorithme**

Pour les extrémités (premier / dernier point) : capuchons verticaux plats.
- `leftSide` : `{x: curr.x, y: curr.y + halfWidth}`
- `rightSide` : `{x: curr.x, y: curr.y - halfWidth}`

Pour les points intermédiaires :
1. Obtenir les segments adjacents (précédent et suivant)
2. Calculer les vecteurs perpendiculaires normalisés : `perp1 = normalize([-dy1, dx1])`, `perp2 = normalize([-dy2, dx2])`
3. Moyenner les perpendiculaires : `perp = normalize((perp1 + perp2) / 2)`
4. Décaler le point de `perp × halfWidth`

---

### Cycle de vie du sketch

#### `createSketch(parentId, cameraOffset, isPrimary)`

Fonction factory retournant un sketch p5.js.

**Paramètres**
- `parentId` (String) : ID d'élément DOM pour attacher le canevas
- `cameraOffset` (Number) : décalage de caméra axe X pour stéréo (0 pour mono)
- `isPrimary` (Boolean) : sketch principal (contrôle les mises à jour de l'émetteur)

**Structure**
```javascript
return function(p) {
  let emitter;
  let lastTime;

  p.setup = function() { /* ... */ };
  p.draw = function() { /* ... */ };
  p.mouseWheel = function(event) { /* ... */ };
  p.windowResized = function() { /* ... */ };
};
```

##### `p.setup()`

1. Définir la densité de pixels à 1 (performance)
2. Créer le canevas WebGL : `createCanvas(W, H, WEBGL)`
3. Attacher le canevas à l'élément DOM parent
4. Initialiser ou référencer l'émetteur partagé
5. Configurer les gestionnaires d'événements souris :

```javascript
cnv.mousePressed((event) => {
  if (p.mouseButton === p.LEFT) {
    camera.isDragging = true;
    camera.isPanning = false;
  } else if (p.mouseButton === p.RIGHT || p.mouseButton === p.CENTER) {
    camera.isPanning = true;
    camera.isDragging = false;
  }
  camera.lastMouseX = p.mouseX;
  camera.lastMouseY = p.mouseY;
  return false;
});
```

6. Appliquer le dimensionnement framebuffer si nécessaire
7. Initialiser `lastTime` pour le calcul delta

##### `p.draw()`

1. **Effacer l'image** : `p.background(0)`

2. **Contrôles caméra** (si canevas actif) :
   - Calculer le delta souris : `dx = mouseX - lastMouseX`
   - Si glissement (bouton gauche) : mettre à jour la rotation, contraindre le tangage à `[-π/2, π/2]`
   - Si déplacement (bouton droit) : calculer la sensibilité `max(0.5, distance / 500)`, mettre à jour les décalages
   - Sauvegarder dans `params` et localStorage

3. **Définir la projection** :
```javascript
p.perspective(
  fov * Math.PI / 180,
  W / H,
  Math.max(0.01, params.near),
  params.far
);
```

4. **Calculer le temps delta** :
   - Normal : `dt = (millis() - lastTime) / 1000`
   - Enregistrement : `dt = 1 / fps` (pas de temps fixe)
   - Stéréo secondaire : `dt = 0`

5. **Appliquer la transformation caméra** :
```javascript
p.push();
if (stereo) p.translate(cameraOffset, 0, 0);
p.translate(camera.offsetX, camera.offsetY, 0);
p.translate(0, 0, -camera.distance);
p.rotateX(camera.rotationX);
p.rotateY(camera.rotationY);
p.rotateZ(emitterRotation * Math.PI / 180);
p.scale(geometryScale / 100);
```

6. **Mettre à jour la simulation** (primaire seulement) :
```javascript
if (!stereoscopicMode || isPrimary) {
  noiseOffset += dt * 4;
  emitter.update(dt);
}
```

7. **Dessiner** : `emitter.draw(p)`

8. **Restaurer** : `p.pop()`

##### `p.mouseWheel(event)`

```javascript
distance = clamp(distance + event.delta * 20, 50, 10000);
```
Retourne `false` pour empêcher le défilement de page.

##### `p.windowResized()`

```javascript
if (!isRecording) {
  updateCanvasSize();
}
```

---

### Fonctions d'initialisation

#### `initializeSketches()`

Crée ou recrée les instances p5.js selon le mode actuel.

**Logique**

1. **Nettoyage** : supprimer les instances p5 existantes, effacer le HTML du wrapper, réinitialiser l'état partagé

2. **Calcul des dimensions** :
   - Mode framebuffer : utiliser `framebufferWidth/Height`
   - Stéréoscopique : chaque canevas obtient `windowWidth / 2`
   - Monoscopique : `windowWidth` complet

3. **Configuration stéréoscopique** : créer un conteneur avec divs œil gauche/droite, instancier deux sketches p5 (gauche : `cameraOffset = -eyeSeparation`, droite : `cameraOffset = +eyeSeparation`), partager un émetteur unique

4. **Configuration monoscopique** : créer un div unique, instancier un sketch p5 avec `cameraOffset = 0`

5. **Post-traitement** : appeler `updateCanvasSize()`, délai de 50ms pour assurer la mise à jour du DOM

#### `updateCanvasSize()`

Ajuste la résolution et l'échelle du canevas.

**Mode framebuffer**
1. Définir les dimensions à `framebufferWidth/Height`
2. Calculer l'échelle : `min(windowW / canvasW, windowH / canvasH, 1)`
3. Redimensionner le canevas à la résolution cible
4. Appliquer la transformation d'échelle CSS
5. Ajouter la classe `framebuffer-mode` (bordure gris foncé)

**Mode ajustement fenêtre**
1. Stéréo : `W = windowWidth / 2` ; mono : `W = windowWidth` ; `H = windowHeight`
2. Redimensionner le canevas
3. Supprimer les transformations CSS
4. Supprimer la classe `framebuffer-mode`

**Mise à jour émetteur** : repositionner au centre du canevas `(W/2, H/2 + getSpawnDistance())`.

---

## Gestion d'état

### Architecture des états

Les états capturent des instantanés complets des paramètres et de la position de caméra pour un rappel instantané avec transitions fluides.

**Structure d'objet état** :
```javascript
{
  name: "Nom de l'état",
  params: {
    // Tous les paramètres sauf réglages globaux et caméra
    segmentLength: 30,
    lineThickness: 12,
    emitRate: 1.5,
    speed: 80,
    fov: 70,
    // ... tous les autres paramètres
    
    // Globaux (exclus de la capture d'état) :
    // - overlayImageSrc, overlayVisible, overlayScale, overlayOpacity, overlayX, overlayY
    // - stateTransitionDuration, colorTransitionDuration
    // - autoTriggerEnabled, autoTriggerFrequency
    // - near, far, framebufferMode, framebufferWidth/Height
    // - stereoscopicMode, eyeSeparation
    
    // Paramètres de caméra (stockés séparément dans objet camera) :
    // - cameraRotationX, cameraRotationY, cameraDistance
    // - cameraOffsetX, cameraOffsetY
  },
  camera: {
    rotationX: 0.2,
    rotationY: 0.5,
    distance: 800,
    offsetX: 0,
    offsetY: 0
  },
  metadata: {
    version: "1.0"
  }
}
```

### Exclusion de la gestion d'état

**Implémentation (js/storage/StateManager.js)** :
```javascript
export function captureCurrentState(ZM) {
  const params = { ...ZM.params };
  
  // Supprimer les réglages globaux au projet
  delete params.near;
  delete params.far;
  delete params.framebufferMode;
  delete params.framebufferPreset;
  delete params.framebufferWidth;
  delete params.framebufferHeight;
  delete params.stereoscopicMode;
  delete params.eyeSeparation;
  
  // Exclure les paramètres de caméra (stockés séparément dans objet camera)
  delete params.cameraRotationX;
  delete params.cameraRotationY;
  delete params.cameraDistance;
  delete params.cameraOffsetX;
  delete params.cameraOffsetY;
  
  delete params.overlayImageSrc;
  delete params.overlayVisible;
  delete params.overlayScale;
  delete params.overlayOpacity;
  delete params.overlayX;
  delete params.overlayY;
  
  // Créer l'état avec objet camera séparé
  const state = {
    params: params,
    camera: {
      rotationX: ZM.camera.rotationX,
      rotationY: ZM.camera.rotationY,
      distance: ZM.camera.distance,
      offsetX: ZM.camera.offsetX,
      offsetY: ZM.camera.offsetY
    },
    metadata: {
      version: "1.0"
    }
  };
  
  return state;
}
```

Les réglages d'incrustation persistent lors des changements d'état, permettant une marque cohérente sur tous les états.

---

#### `saveToLocalStorage()`

```javascript
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
} catch(e) {
  console.warn('Échec sauvegarde localStorage:', e);
}
```

Appelé après chaque changement de paramètre.

#### `loadFromLocalStorage()`

**Retourne** : `Boolean` — vrai si des données ont été chargées

1. Tenter de récupérer l'élément par clé
2. Parser la chaîne JSON
3. Fusionner dans `params` via `Object.assign()`
4. Valider et corriger les valeurs problématiques : `near < 0.01` → `0.01`, `camera.distance < 50` → `600`, `camera.offsetX/Y === undefined` → `0`
5. Synchroniser l'état de caméra avec l'objet `camera` via `camera.syncFromParams()`

#### `syncUIFromParams()`

Met à jour tous les contrôles UI pour correspondre aux valeurs `params` actuelles.

1. **Curseurs** : `slider.value = params[key]` + mise à jour de l'affichage
2. **Cases à cocher** : `checkbox.checked = params[key]`
3. **Entrées numériques** : `input.value = params[key]`
4. **Menus déroulants** : `select.value = params[key]`
5. **Boutons bascule** : définir la classe `active` selon `params[key]`
6. **État caméra** : synchroniser `camera.rotationX/Y`, `camera.distance`, `camera.offsetX/Y`
7. **Mise à jour canevas** : appeler `updateCanvasSize()` si nécessaire

#### `wire(sliderId, displayId, paramKey, decimals, suffix)`

Lie un curseur à un paramètre avec persistance automatique.

```javascript
wire('thickness', 'thickness-val', 'lineThickness', 1);
```

1. Obtenir les éléments DOM
2. Définir la valeur du curseur depuis `params`
3. Ajouter un écouteur `input` : mettre à jour `params`, mettre à jour l'affichage, appeler `saveToLocalStorage()`

---

## Référence des fonctions (export)

#### `downloadJSON()`

1. `JSON.stringify(params, null, 2)`
2. Créer un Blob de type `application/json`
3. Déclencher le téléchargement via un `<a>` temporaire

Format du nom de fichier : `zigzag-emitter-AAAA-MM-JJTHH-MM-SS.json`

#### `loadJSON(file)`

1. Créer un `FileReader`
2. Au chargement : parser le JSON, vérifier si le mode stéréoscopique a changé, appeler `initializeSketches()` si nécessaire, `syncUIFromParams()`, sauvegarder dans localStorage
3. Gestion d'erreurs : try-catch avec alerte en cas d'échec de parsing

#### `exportPNG()`

1. Créer un canevas composite avec incrustation (si visible)
2. Obtenir le canevas de l'instance p5 active
3. Calculer les dimensions d'incrustation avec correction de densité de pixels
4. Superposer l'image d'incrustation avec mise à l'échelle et opacité
5. `canvas.toBlob()` pour créer le blob PNG
6. Déclencher le téléchargement

**Formule de mise à l'échelle de l'incrustation** :
```javascript
const displayWidth = overlayNaturalWidth × overlayScale / 100;
const bufferToLogicalRatio = sourceCanvas.width / ZM.W;
const imgWidth = displayWidth × bufferToLogicalRatio × 2;
```

Le multiplicateur × 2 convertit les pixels CSS en pixels de tampon sur les écrans Retina.

Format : `zigmap26-AAAA-MM-JJTHH-MM-SS.png`

#### `exportSVG()`

1. **Configuration** : obtenir les dimensions, calculer la distance de génération, créer l'en-tête SVG
2. **Pour chaque ligne** : construire les sommets, calculer l'alpha, construire les côtés via `buildRibbonSides()`, générer la chaîne de chemin (`M x,y L ... Z`), créer un élément `<path>` avec couleur et opacité
3. **Export** : créer un Blob de type `image/svg+xml`, déclencher le téléchargement

#### `startVideoCapture()`

```javascript
capturer = new CCapture({
  format: params.videoFormat,
  framerate: params.videoFPS,
  verbose: false
});
capturer.start();
```

Les images sont capturées dans `p.draw()` après le rendu. Le pas de temps fixe assure une sortie déterministe.

#### `stopVideoCapture()`

```javascript
capturer.stop();
capturer.save();
```

CCapture gère l'encodage et le téléchargement automatiquement.

---

### Initialisation UI

#### Sections repliables

```javascript
document.querySelectorAll('.section-header').forEach(header => {
  header.addEventListener('click', () => {
    header.classList.toggle('active');
    const content = header.nextElementSibling;
    content.classList.toggle('expanded');
  });
});
```

#### Raccourcis clavier

Tous les raccourcis sont gérés par `js/input/KeyboardHandler.js`, les mappages étant définis dans `config/keyboardShortcuts.json`.

```javascript
const KEYBOARD_SHORTCUTS = [
  { key: 'Tab',        preventDefault: true,  action: 'toggleUIVisibility' },
  { key: 'Enter',      preventDefault: false, action: 'toggleFullscreen' },
  { key: 'p',          preventDefault: false, action: 'exportPNG' },
  { key: 's',          preventDefault: false, action: 'exportSVG' },
  { key: 'd',          preventDefault: false, action: 'exportDepthMap' },
  { key: 'v',          preventDefault: false, action: 'toggleVideoRecording' },
  { key: 'r',          preventDefault: false, action: 'resetCamera' },
  { key: 'R',          preventDefault: false, action: 'resetCameraDistance' },
  { key: '0',          preventDefault: false, action: 'resetCameraRotation' },
  { key: 't',          preventDefault: false, action: 'toggleModulationT' },
  { key: 'm',          preventDefault: false, action: 'toggleModulationM' },
  { key: 'l',          preventDefault: false, action: 'toggleStereoMode' },
  { key: 'ArrowUp',    preventDefault: true,  action: 'incrementSpeed' },
  { key: 'ArrowDown',  preventDefault: true,  action: 'decrementSpeed' },
  { key: 'ArrowLeft',  preventDefault: true,  action: 'rotateCameraLeft' },
  { key: 'ArrowRight', preventDefault: true,  action: 'rotateCameraRight' },
  { key: ' ',          preventDefault: true,  action: 'togglePause' },
  { key: '[',          preventDefault: false, action: 'decreaseLineThickness' },
  { key: ']',          preventDefault: false, action: 'increaseLineThickness' },
  { key: 'Escape',     preventDefault: false, action: 'closeModals' }
];
```

Gestionnaire d'événement :

```javascript
document.addEventListener('keydown', e => {
  const shortcut = KEYBOARD_SHORTCUTS.find(sc =>
    sc.key === e.key &&
    sc.ctrl === (e.ctrlKey || e.metaKey) &&
    sc.shift === e.shiftKey &&
    sc.alt === e.altKey
  );
  if (shortcut) {
    if (shortcut.preventDefault) e.preventDefault();
    executeAction(shortcut.action);
  }
});
```

Exemple de fonctions action :

```javascript
function executeAction(actionName) {
  const actions = {
    toggleUIVisibility: () => {
      controls.classList.toggle('hidden');
      body.classList.toggle('ui-hidden');
    },
    toggleFullscreen: () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    },
    exportPNG: () => exportPNGButton.click(),
    exportSVG: () => exportSVGButton.click(),
    toggleVideoRecording: () => {
      if (isRecording) stopVideoCapture();
      else startVideoCapture();
    },
    resetCamera: () => {
      params.camDistance = 500;
      params.camRotationX = 0;
      params.camRotationY = 0;
    }
  };
  if (actions[actionName]) actions[actionName]();
}
```

#### Système de palettes de couleurs

**Architecture** : 4 palettes × 4 emplacements. Chaque emplacement : `color` (tableau RGB) et `role` ('line', 'background', 'none'). Les lignes sélectionnent aléatoirement parmi les couleurs de rôle 'line' à la génération. L'arrière-plan utilise la première couleur de rôle 'background', ou noir si aucune.

```javascript
function triggerPaletteChange(newIndex) {
  params.activePaletteIndex = newIndex;

  emitterInstance.lines.forEach(line => {
    const colorData = pickRandomLineColor();
    line.transitionToColor(colorData.color);
  });

  SketchFactory.backgroundTransition.start = SketchFactory.backgroundTransition.current;
  SketchFactory.backgroundTransition.target = getBackgroundColor();
  SketchFactory.backgroundTransition.progress = 0;
  SketchFactory.backgroundTransition.isTransitioning = true;

  syncUIFromParams();
  saveToLocalStorage();
}
```

Transition de couleur dans `ZigzagLine` :

```javascript
transitionToColor(newColor) {
  this.startColor = [...this.currentColor];
  this.targetColor = newColor;
  this.colorTransitionProgress = 0;
  this.isTransitioning = true;
}

update(dt) {
  if (this.isTransitioning) {
    this.colorTransitionProgress += dt / params.colorTransitionDuration;
    if (this.colorTransitionProgress >= 1) {
      this.currentColor = [...this.targetColor];
      this.isTransitioning = false;
    } else {
      this.currentColor = lerpColor(
        this.startColor,
        this.targetColor,
        this.colorTransitionProgress
      );
    }
  }
}
```

Z-offset pour séparation de profondeur :

```javascript
this.zOffset = (colorSlotIndex - 2) * params.colorSlotZOffset;
// slotIndex 0 → zOffset: -200
// slotIndex 1 → zOffset: -100
// slotIndex 2 → zOffset:    0
// slotIndex 3 → zOffset: +100
```

#### Curseurs à double plage

```javascript
nearSlider.addEventListener('input', () => {
  if (nearSlider.value >= farSlider.value) {
    nearSlider.value = farSlider.value - 1;
  }
});

farSlider.addEventListener('input', () => {
  if (farSlider.value <= nearSlider.value) {
    farSlider.value = Number(nearSlider.value) + 1;
  }
});
```

#### FOV avec compensation de distance

```javascript
fovSlider.addEventListener('input', () => {
  const oldFOV = params.fov;
  const newFOV = parseFloat(fovSlider.value);

  const oldFOVRad = oldFOV * Math.PI / 180;
  const newFOVRad = newFOV * Math.PI / 180;
  const ratio = Math.tan(oldFOVRad / 2) / Math.tan(newFOVRad / 2);

  const newDistance = clamp(camera.distance * ratio, 50, 10000);

  params.fov = newFOV;
  camera.distance = newDistance;
  params.cameraDistance = newDistance;

  saveToLocalStorage();
});
```

Formule : pour une taille apparente constante, `newDistance = oldDistance × tan(oldFOV/2) / tan(newFOV/2)`.

---

## Pipeline de rendu

### Séquence de rendu d'image

```
┌─────────────────────────────────────┐
│  1. p.background(0)                 │
│     Effacer le canevas en noir      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  2. Mettre à jour la caméra         │
│     - Rotation (glissement gauche)  │
│     - Déplacement (glissement droit)│
│     - Zoom (molette)                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  3. Définir la matrice de           │
│     projection                      │
│     p.perspective(fov, aspect, ...) │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  4. Calculer le temps delta         │
│     dt = (now - lastTime) / 1000    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  5. Push matrice                    │
│     p.push()                        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  6. Appliquer les transformations   │
│     - Décalage stéréo (si activé)   │
│     - Décalage de déplacement       │
│     - Zoom (translate Z)            │
│     - Rotation d'orbite (X, Y)      │
│     - Rotation plan Z               │
│     - Échelle géométrique           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  7. Mettre à jour la simulation     │
│     (primaire uniquement)           │
│     - noiseOffset += dt × 4         │
│     - emitter.update(dt)            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  8. Dessiner toutes les lignes      │
│     emitter.draw(p)                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  9. Pop matrice                     │
│     p.pop()                         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  10. Capturer l'image               │
│      (si enregistrement)            │
│      capturer.capture(canvas)       │
└─────────────────────────────────────┘
```

---

## Système de caméra

### Hiérarchie de transformation

Ordre d'application (de l'intérieur vers l'extérieur) :

```
1. Espace local géométrie (sommets zigzag)
2. Position ligne (translate par line.x, line.y)
3. Échelle géométrique (params.geometryScale)
4. Rotation plan Z (params.emitterRotation)
5. Orbite caméra (rotateY, rotateX)
6. Zoom caméra (translate Z par -distance)
7. Déplacement caméra (translate XY par décalages)
8. Décalage œil stéréo (translate X par ±eyeSeparation/2)
9. Projection (perspective avec FOV)
```

### Exemple de transformation de coordonnées

Point au sommet zigzag `(vx, vy, 0)` :

```javascript
// 1. Position ligne
worldX = vx + (line.x - W/2)
worldY = vy + (line.y - H/2)
worldZ = 0

// 2. Échelle
worldX *= scale / 100
worldY *= scale / 100

// 3. Rotation Z
θ = emitterRotation * Math.PI / 180
x' = worldX * cos(θ) - worldY * sin(θ)
y' = worldX * sin(θ) + worldY * cos(θ)

// 4. Rotation d'orbite : appliquer rotateX puis rotateY

// 5. Zoom + déplacement
x'' = x' + offsetX
y'' = y' + offsetY
z'' = z' - distance

// 6. Décalage stéréo (si applicable)
x''' = x'' + cameraOffset

// 7. Projection : division perspective par profondeur
```

### Mapping souris → caméra

**Rotation (glissement gauche)**
```javascript
const sensitivity = 0.005;
rotationY += dx * sensitivity;
rotationX = clamp(rotationX + dy * sensitivity, -Math.PI/2, Math.PI/2);
```

**Déplacement (glissement droit)**
```javascript
const sensitivity = Math.max(0.5, distance / 500);
offsetX += dx * sensitivity;
offsetY += dy * sensitivity;
```

La sensibilité évolue avec la distance : plus la caméra est éloignée, plus le déplacement est rapide.

**Zoom (défilement)**
```javascript
distance = clamp(distance + event.delta * 20, 50, 10000);
```

---

## Système d'incrustation

Système d'image statique composée par-dessus le canevas pour le branding, les filigranes ou les éléments de design. Introduit dans la v26.

### Architecture

L'incrustation utilise un élément `<img>` HTML positionné de manière absolue au-dessus du canevas, puis composité dans les exports PNG et vidéo.

```html
<img id="overlay-image" alt="Overlay"
  style="position: absolute; z-index: 1000; pointer-events: none; display: none;">
```

- `position: absolute` : positionné au-dessus du canevas en 2D
- `z-index: 1000` : toujours sur la couche supérieure
- `pointer-events: none` : ne bloque pas l'interaction souris
- `display: none` : caché par défaut

### Stockage des paramètres

Les paramètres d'incrustation sont globaux au projet (non sauvegardés par état) :

```javascript
overlayImageSrc: null,   // URL ou URI de données de l'image
overlayVisible: false,   // Visibilité
overlayScale: 100,       // Taille (10–200%)
overlayOpacity: 100,     // Transparence (0–100%)
overlayX: 50,            // Position horizontale (0–100%)
overlayY: 50,            // Position verticale (0–100%)
```

### Système de préréglages

Les préréglages permettent le chargement instantané d'images préconfigurées depuis `assets/overlays/`.

**Structure du répertoire**
```
assets/overlays/
├── area-zero-white.json
├── mapping_white.json
├── ddest_white.json
├── ddest-no-box-white.json
├── promo-logo.json
└── zigmap-white.json
```

**Format JSON**
```json
{
  "id": "logo1",
  "filename": "logo1.png",
  "type": "image/png",
  "data": "data:image/png;base64,iVBORw0KG..."
}
```

**Chargement**
```javascript
async function loadOverlayPresets(ZM) {
  const overlayFiles = [
    'area-zero-white.json',
    'mapping_white.json',
    'ddest_white.json',
    'ddest-no-box-white.json',
    'promo-logo.json',
    'zigmap-white.json'
  ];

  ZM.overlayPresets = [];

  for (const filename of overlayFiles) {
    try {
      const response = await fetch(`assets/overlays/${filename}`);
      if (!response.ok) {
        console.warn(`Préréglage introuvable : ${filename}`);
        continue;
      }
      const preset = await response.json();
      ZM.overlayPresets.push(preset);
    } catch (err) {
      console.warn(`Échec du chargement : ${filename}`, err);
    }
  }
}
```

**Intégration UI**
```javascript
function setupOverlayControls(ZM) {
  await loadOverlayPresets(ZM);

  const presetSelect = document.getElementById('overlay-preset');

  ZM.overlayPresets.forEach((preset) => {
    const option = document.createElement('option');
    option.value = preset.id;
    option.textContent = preset.filename.replace('.json', '').replace(/_/g, ' ');
    presetSelect.appendChild(option);
  });

  const customOption = document.createElement('option');
  customOption.value = 'custom';
  customOption.textContent = '-- Image personnalisée --';
  presetSelect.appendChild(customOption);

  presetSelect.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      loadCustomBtn.click();
      return;
    }
    const preset = ZM.overlayPresets.find(p => p.id === e.target.value);
    if (preset) {
      const overlayImg = document.getElementById('overlay-image');
      overlayImg.src = preset.data;
      ZM.params.overlayImageSrc = preset.data;
      ZM.params.overlayVisible = true;
      document.getElementById('show-overlay').checked = true;
      updateOverlayVisibility(ZM);
      saveParams(ZM);
    }
  });
}
```

### Outil utilitaire de conversion

Emplacement : `utilities/overlay-converter.html`

Outil HTML autonome pour convertir des images au format JSON Base64.

**Fonctionnalités** : interface glisser-déposer, conversion par lots, prévisualisation, génération de fichiers JSON. Formats supportés : SVG, PNG, JPG, GIF.

```javascript
async function convertToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        id: file.name.replace(/\.[^.]+$/, ''),
        filename: file.name,
        type: file.type || 'image/png',
        data: e.target.result
      });
    };
    reader.readAsDataURL(file);
  });
}
```

**Procédure**
1. Ouvrir `utilities/overlay-converter.html` dans le navigateur
2. Glisser-déposer des fichiers images ou les sélectionner via le navigateur de fichiers
3. Cliquer sur **Convert All to Base64**
4. Déplacer les fichiers JSON générés vers `assets/overlays/`
5. Ajouter les noms de fichiers au tableau `overlayFiles` dans `UIController.js`
6. Recharger l'application

**Caractéristiques techniques**
- Aucun serveur requis : Base64 embarqué directement dans le JSON
- Compatible avec le contrôle de version (fichiers JSON suivis dans git)
- Aucune dépendance d'hébergement externe
- L'encodage Base64 augmente la taille de fichier d'environ 33%
- Les préréglages sont mis en cache dans la mémoire du navigateur après le premier chargement

### Synchronisation de l'affichage

```javascript
function updateOverlayPosition(ZM) {
  const overlayImg = document.getElementById('overlay-image');
  const { params } = ZM;
  overlayImg.style.left = `${params.overlayX}%`;
  overlayImg.style.top = `${params.overlayY}%`;
  overlayImg.style.transform = `translate(-50%, -50%) scale(${params.overlayScale / 100})`;
  overlayImg.style.opacity = params.overlayOpacity / 100;
}
```

Chaîne de transformation CSS :
1. `translate(-50%, -50%)` : centre l'incrustation sur le point de position
2. `scale(...)` : applique la mise à l'échelle
3. `left/top` : positionne le point central (0–100% du canevas)
4. `opacity` : transparence (0–1)

### Export PNG avec composition d'incrustation

**Implémentation (js/export/PNGExporter.js)** :

```javascript
function createCompositeCanvas(ZM, sourceCanvas) {
  const overlayImg = document.getElementById('overlay-image');
  const hasOverlay = ZM.params.overlayVisible && ZM.params.overlayImageSrc && 
                     overlayImg && overlayImg.complete;
  
  if (!hasOverlay) {
    return sourceCanvas;
  }
  
  // Créer un canevas composite aux dimensions du tampon
  const composite = document.createElement('canvas');
  composite.width = sourceCanvas.width;
  composite.height = sourceCanvas.height;
  const ctx = composite.getContext('2d');
  
  // 1. Dessiner le canevas p5
  ctx.drawImage(sourceCanvas, 0, 0);
  
  // 2. Calculer les dimensions d'incrustation
  const overlayNaturalWidth = overlayImg.naturalWidth;
  const overlayNaturalHeight = overlayImg.naturalHeight;
  const userScale = ZM.params.overlayScale / 100;
  const opacity = ZM.params.overlayOpacity / 100;
  
  // Taille d'affichage en pixels CSS
  const displayWidth = overlayNaturalWidth * userScale;
  const displayHeight = overlayNaturalHeight * userScale;
  
  // Convertir en pixels de tampon
  // sourceCanvas.width = taille du tampon (inclut pixelDensity)
  // ZM.W = taille logique (pixels CSS)
  const bufferToLogicalRatio = sourceCanvas.width / ZM.W;
  
  // × 2 convertit pixels CSS → pixels de tampon sur écrans Retina
  const imgWidth = displayWidth * bufferToLogicalRatio * 2;
  const imgHeight = displayHeight * bufferToLogicalRatio * 2;
  
  // Position en pourcentage → coordonnées pixel
  const x = (ZM.params.overlayX / 100) * composite.width;
  const y = (ZM.params.overlayY / 100) * composite.height;
  
  // Dessiner l'incrustation avec opacité
  ctx.globalAlpha = opacity;
  ctx.drawImage(
    overlayImg,
    x - imgWidth / 2,
    y - imgHeight / 2,
    imgWidth,
    imgHeight
  );
  ctx.globalAlpha = 1.0;
  
  return composite;
}
```

**Fonctionnalités clés** :
- **Correction de densité de pixels** : mise à l'échelle correcte pour écrans Retina/haute résolution
- **Opacité d'incrustation** : respecte le réglage d'opacité (0–100%)
- **Positionnement précis** : Position X/Y (0–100%) convertie en coordonnées pixel
- **Support de mise à l'échelle** : échelle d'incrustation (10–200%) appliquée correctement
- **Qualité d'export** : utilise la résolution de rendu réelle (ex. 3840px sur canevas Retina 1920px)

**Formule de calcul** :

Mode normal (sans framebuffer) :
```
Largeur affichage = naturalWidth × (overlayScale / 100)
Ratio = sourceCanvas.width / ZM.W      (= pixelDensity, ex. 2 sur Retina)
Largeur image = Largeur affichage × Ratio × 2
```

Mode framebuffer :
```
Largeur affichage = naturalWidth × (overlayScale / 100)
Ratio = sourceCanvas.width / ZM.W      (= 1 en mode framebuffer)
Largeur image = Largeur affichage × Ratio × 2     (= Largeur affichage × 2)
```

Le multiplicateur × 2 est essentiel car `naturalWidth` retourne des pixels d'image qui correspondent à des pixels CSS à l'affichage, mais le contexte 2D du canevas dessine en pixels de tampon (2× sur écrans Retina).

---

## Système d'export

### Comparaison d'export

| Fonctionnalité | PNG | SVG | Carte de profondeur | Vidéo |
|----------------|-----|-----|---------------------|-------|
| Type | Raster | Vectoriel | Raster niveaux de gris | Flux vidéo |
| Résolution | Fixe | Infinie | Fixe | Fixe |
| Éditable | Non | Oui | Non | Non |
| Taille fichier | 100 Ko – 2 Mo | 10 Ko – 500 Ko | 100 Ko – 2 Mo | 5 Mo – 100 Mo+ |
| Animation | Image unique | Image unique | Image unique | Complète |
| Meilleur usage | Partage, réseaux sociaux | Impression, édition | Compositing, post-prod | Présentation |

### Détails techniques — enregistrement vidéo

**Pas de temps fixe**
```javascript
if (isRecording) {
  dt = 1 / params.videoFPS;  // ex. 1/30 = 0.0333...
}
```

**Capture d'image**
```javascript
if (isRecording) {
  capturer.capture(p5Instance.canvas);
  recordingFrameCount++;
  updateProgressBar();
  if (recordingFrameCount >= recordingTotalFrames) {
    stopVideoCapture();
  }
}
```

### Détails techniques — carte de profondeur

**Flux d'implémentation**
```javascript
function exportDepthMap() {
  const buffer = createGraphics(width, height);
  buffer.pixelDensity(1);
  buffer.background(0);

  const polys = activeElements.map(el => ({
    vertices: el.getVertices(),
    color: el.getColor()
  }));

  const [zMin, zMax] = scanDepthRange(polys);
  polys.forEach(poly => rasteriseDepthPolygon(poly.vertices, zMin, zMax, buffer));
  buffer.save('depth_map.png');
}
```

**Algorithme d'auto-ajustement**
```javascript
function scanDepthRange(polygons) {
  let zMin = Infinity;
  let zMax = -Infinity;

  polygons.forEach(poly => {
    for (let i = 0; i < poly.vertices.length; i += 3) {
      const [x, y, z] = [poly.vertices[i], poly.vertices[i+1], poly.vertices[i+2]];
      const projected = projectVertex(x, y, z, camMatrix);
      zMin = Math.min(zMin, projected.z);
      zMax = Math.max(zMax, projected.z);
    }
  });

  return [zMin, zMax];
}
```

Scanner d'abord la plage permet d'utiliser l'intégralité des 256 niveaux de gris et d'éviter le découpage par des plans fixes.

**Encodage de profondeur**
```javascript
let normalized = (depth - zMin) / (zMax - zMin);
normalized = 1.0 - normalized;        // Inverser : proche = blanc
normalized = Math.pow(normalized, 0.6); // Correction gamma
const brightness = Math.floor(normalized * 255);
```

**Caractéristiques**
- Alignement avec SVG : transformation caméra identique (cohérence géométrique)
- Auto-ajustement : plage complète de niveaux de gris utilisée
- Gamma 0.6 : meilleure distribution tonale visuelle
- Convention standard : proche = blanc, loin = noir
- Calcul CPU pur (sans dépendance GPU)
- Format PNG : compatible avec After Effects, Nuke, Blender

---

## Considérations de performance

### Stratégies d'optimisation

**Densité de pixels**
```javascript
p.pixelDensity(1);
```
Empêche la mise à l'échelle haute DPI, réduisant le nombre de pixels jusqu'à 4× sur les écrans 2×.

**Taux d'émission**
Chaque ligne représente environ 34 sommets (16 segments × 2 côtés + capuchons). Un taux élevé augmente proportionnellement la charge de rendu.

**Élimination des lignes hors champ**
Les lignes hors des limites de génération sont supprimées, réduisant les appels de dessin et la consommation mémoire.

**Émetteur partagé**
En mode stéréo, l'instance `Emitter` unique est rendue deux fois mais mise à jour une seule fois — le coût CPU des mises à jour est divisé par deux.

### Métriques de performance

Performance typique sur matériel moderne :

| Scénario | FPS | Lignes actives |
|----------|-----|----------------|
| Défaut (taux 1.5/s) | 60 | ~90 |
| Élevé (taux 5/s) | 55–60 | ~300 |
| Extrême (taux 10/s) | 45–55 | ~600 |
| Stéréo (défaut) | 50–55 | ~90 par œil |

Principaux goulots d'étranglement : traitement de sommets (WebGL), dessin de formes (p5.js), calcul de géométrie de ruban.

---

## Guide d'extension

### Ajouter un contrôle

**1. HTML**
```html
<div class="control-group">
  <label>Nouveau paramètre</label>
  <div class="slider-row">
    <input type="range" id="new-param" min="0" max="100" value="50"/>
    <span class="value-display" id="new-param-val">50</span>
  </div>
</div>
```

**2. Ajouter à `params`**
```javascript
const params = {
  newParameter: 50
};
```

**3. Câbler**
```javascript
wire('new-param', 'new-param-val', 'newParameter');
```

**4. Utiliser**
```javascript
const value = params.newParameter;
```

**5. Ajouter à `syncUIFromParams`**
```javascript
{ id: 'new-param', key: 'newParameter' }
```

### Ajouter une forme personnalisée

```javascript
class CustomShape {
  constructor({ p, x, y, ...customParams }) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.alive = true;
  }

  update(dt) {
    // Mettre à jour la position, définir this.alive = false quand terminé
  }

  draw(p) {
    p.push();
    p.translate(this.x - W/2, this.y - H/2, 0);
    // Rendu
    p.pop();
  }
}
```

Modifier `Emitter._emit()` pour instancier la nouvelle classe selon `params.shapeType`.

### Ajouter un format d'export

```javascript
function exportJPEG() {
  const canvas = p5Instance.canvas;
  const dataURL = canvas.toDataURL('image/jpeg', 0.9);
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = `zigzag-emitter-${formatTimestamp()}.jpg`;
  a.click();
}
```

### Étendre les palettes de couleurs

Ajouter une cinquième palette dans `js/config/defaults.js` :

```javascript
palettes: [
  // palette 5
  [
    { color: [255, 128, 0], role: 'line' },
    { color: [0, 255, 128], role: 'line' },
    { color: [128, 0, 255], role: 'background' },
    { color: [255, 255, 0], role: 'none' }
  ]
],
```

Mettre à jour `js/ui/UIController.js` pour ajouter un cinquième bouton au sélecteur de palette.

Notes techniques :
- Les transitions utilisent l'interpolation linéaire RGB (`lerpColor`)
- Formule de Z-offset : `(slotIndex - 2) × multiplicateur` (centré à 0)
- Les indicateurs `isTransitioning` évitent les calculs inutiles après la fin des transitions

---

## Débogage

### Journalisation console

**Chargement de page**
```
Chargé depuis localStorage, camera.distance = 600
Configuration terminée - camera.distance: 600 isPrimary: true
```

**Événements souris**
```
mousePressed - button: RIGHT
→ mode déplacement
→ état caméra: {isDragging: false, isPanning: true}
```

**Déplacement**
```
PANNING: {dx: 5, dy: -3, sens: 1.2, distance: 600, offsetX: 6, offsetY: -3.6}
```

**Changements FOV**
```
FOV changé: 60.00° → 90.00°, Distance: 600.0 → 346.4 (ratio: 0.577)
```

### Problèmes courants

| Problème | Cause probable | Solution |
|----------|---------------|----------|
| Lignes absentes | `emitRate` à 0, caméra trop éloignée, plans de découpe | Vérifier ces valeurs |
| Déplacement inactif | `camera.distance` < 50 | Vérifier dans les logs |
| Performances faibles | Taux d'émission élevé, résolution haute | Réduire ces valeurs, désactiver les modulations |
| Exports échouent | Autorisations de téléchargement bloquées | Vérifier les paramètres du navigateur |
| Vidéo non enregistrée | Page masquée pendant l'enregistrement | Garder l'onglet actif |

### Outils dev navigateur

- **Console** : logs d'état
- **Réseau** : vérifier le chargement des bibliothèques (p5.js, CCapture.js)
- **Performance** : profiler le timing d'images
- **Application → Local Storage** : inspecter `zigzagEmitterSettings`
- **Éléments** : inspecter les dimensions et classes du canevas

---

# ZigMap26 — Architecture modulaire

## Vue d'ensemble

ZigMap26 est une modularisation complète de l'application ZigzagEmitter originale. Le fichier HTML monolithique a été transformé en une architecture ES6 avec séparation des préoccupations.

## Structure du projet

```
ZigMap26/
├── index.html
├── css/
│   ├── main.css
│   ├── canvas.css
│   └── controls.css
├── js/
│   ├── main.js
│   ├── config/
│   │   ├── defaults.js
│   │   └── constants.js
│   ├── core/
│   │   ├── ZigzagLine.js
│   │   ├── Emitter.js
│   │   ├── Camera.js
│   │   ├── utils.js
│   │   └── Projection.js
│   ├── storage/
│   │   └── localStorage.js
│   ├── rendering/
│   │   └── SketchFactory.js
│   ├── export/
│   │   ├── SVGExporter.js
│   │   ├── PNGExporter.js
│   │   ├── DepthExporter.js
│   │   └── VideoRecorder.js
│   ├── ui/
│   │   └── UIController.js
│   └── input/
│       ├── KeyboardHandler.js
│       └── MouseHandler.js
├── config/
│   ├── keyboardShortcuts.json
│   ├── uiPresets.json
│   └── appInfo.json
├── docs/
│   ├── English/
│   │   ├── README.md
│   │   ├── User-Manual.md
│   │   ├── Documentation.md
│   │   └── Projection-Matrix-Guide.md
│   ├── French/
│   │   ├── README-fr.md
│   │   ├── User-Manual-fr.md
│   │   ├── Documentation-fr.md
│   │   └── Projection-Matrix-Guide-fr.md
│   └── markdown-viewer.html
└── backup/
    └── ZigzagEmitter_12_backup_20260309.html
```

## Principes d'architecture

**Séparation des préoccupations**
- CSS thématique (main, canvas, controls)
- JavaScript organisé par fonction (core, rendering, export, UI, input)
- Configuration externe en JSON (raccourcis, préréglages, métadonnées)

**Injection de dépendances**
Les classes acceptent les dépendances comme paramètres plutôt que de recourir à des variables globales :
```javascript
const line = new ZigzagLine(
  canvasWidth,
  canvasHeight,
  getSpawnDistanceFn,
  buildRibbonSidesFn
);
```

**Modules ES6**
```javascript
import { ZigzagLine } from './core/ZigzagLine.js';
export function exportSVG(ZM) { /* ... */ }
```

**Espace de noms global**
```javascript
window.ZigMap26 = {
  params,
  camera,
  emitterInstance,
  exportSVG(),
  // ...
};
```

## Lancement

Les modules ES6 nécessitent un serveur HTTP (pas le protocole `file://`).

```bash
python3 -m http.server 8080
# Ouvrir http://localhost:8080
```

## Fichiers de configuration

### `config/keyboardShortcuts.json`
```json
[
  {
    "key": "p",
    "action": "exportPNG",
    "description": "Exporter PNG",
    "preventDefault": true
  }
]
```

### `config/uiPresets.json`
```json
{
  "framebufferPresets": [
    { "name": "1920x1080", "width": 1920, "height": 1080 }
  ],
  "colorSwatches": [
    [255, 255, 255],
    [80, 200, 255]
  ]
}
```

### `config/appInfo.json`
```json
{
  "name": "ZigMap26",
  "version": "1.0.0",
  "documentation": { }
}
```

## Détails des modules

### Classes principales

```javascript
class ZigzagLine {
  constructor(canvasWidth, canvasHeight, getSpawnDistanceFn, buildRibbonSidesFn)
  update(dt)
  draw(p5Instance)
  _alpha()
  _buildVertices()
}

class Emitter {
  constructor(params, noiseOffsetGetter, canvasWidth, canvasHeight, utilFns)
  update(dt)
  draw(p5Instance)
  _emit()
}

class Camera {
  constructor(params)
  syncToParams(params)
  reset()
  resetZoom()
}
```

### Système de projection

Mathématiques identiques pour tous les exports (SVG, PNG, profondeur) afin d'assurer l'alignement pixel-parfait.

- **Ordre de rotation** : Z → Y → X (correspond à p5.js WEBGL)
- **Modèle de caméra** : `distance_totale = default_camera_z + user_distance`
- **Perspective** : `screen_x = world_x * (camera_z / -view_z) + width/2`

Voir `docs/French/Projection-Matrix-Guide-fr.md` pour les détails mathématiques.

## Migration depuis l'original

`ZigzagEmitter_12.html` (2 334 lignes) a été divisé en :
- 1 fichier HTML (330 lignes)
- 3 fichiers CSS (~400 lignes)
- 15 modules JavaScript (~1 500 lignes)
- 3 fichiers de configuration JSON (~200 lignes)

**Changements incompatibles** : aucun pour les utilisateurs (clés localStorage préservées). Les développeurs doivent utiliser un serveur HTTP.

**Fonctionnalités préservées** : toutes les fonctionnalités originales, chargement automatique depuis localStorage, raccourcis clavier inchangés, formats d'export identiques.

## Développement

**Ajout d'un format d'export**
1. Créer `js/export/NouvelExporteur.js`, exporter une fonction `exportNouveau(ZM)`
2. Importer dans `main.js`, ajouter à `window.ZigMap26`
3. Connecter au bouton UI dans `UIController.js`

**Ajout d'un paramètre**
1. Ajouter dans `DEFAULT_PARAMS` (`js/config/defaults.js`)
2. Ajouter le contrôle UI dans `index.html`
3. Connecter dans `UIController.js`
4. Utiliser via `ZM.params.nouveauParametre`

**Ajout d'un raccourci clavier**
1. Ajouter une entrée à `config/keyboardShortcuts.json`
2. Ajouter le gestionnaire dans `KeyboardHandler.js::executeAction()`

**Conventions** : modules ES6 (`import`/`export`), dépendances passées comme paramètres, nommage camelCase, commentaires JSDoc pour les fonctions complexes.

## Compatibilité navigateurs

| Navigateur | Support |
|------------|---------|
| Chrome / Edge | Complet |
| Firefox | Complet |
| Safari | Complet (modules ES6) |
| Mobile | Limité (absence de clic droit) |

## Dépendances

- **p5.js 1.9.0** : moteur de rendu 3D
- **CCapture.js 1.1.0** : enregistrement vidéo
- Les deux chargés via CDN dans `index.html`

## Références

- Documentation p5.js : https://p5js.org/reference/
- CCapture.js : https://github.com/spite/ccapture.js/
- WebGL fundamentals : https://webglfundamentals.org/
- Bruit de Perlin : https://fr.wikipedia.org/wiki/Bruit_de_Perlin

---

**Version** : 26
**Auteur** : ddelcourt2026
**Date de refactorisation** : 9 mars 2026
**Licence** : MIT

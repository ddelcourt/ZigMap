# Guide des Matrices de Projection : Conversion 3D WebGL vers 2D SVG

**Projet ZigzagEmitter - Plongée Technique**  
*Auteur : ddelcourt*  
*Date : 9 mars 2026*

---

## 1. Introduction : Le Défi

### Le Problème

Dans le monde des graphiques génératifs modernes, nous rendons souvent des scènes 3D complexes en utilisant WebGL accéléré par GPU, mais devons les exporter en graphiques vectoriels (SVG) pour l'impression, l'édition ultérieure ou l'archivage. Cela présente un défi technique fondamental :

**WebGL utilise le pipeline de transformation intégré du GPU**, qui gère :
- Les transformations de sommets
- Les multiplications de matrices
- La division en perspective
- Le mapping de la fenêtre d'affichage

**SVG est un format vectoriel 2D** qui ne comprend que :
- Les points de coordonnées 2D
- Les chemins et polygones
- Aucun concept de profondeur 3D ou de projection

**Le Défi :** Nous devons répliquer l'intégralité du pipeline de transformation 3D—normalement géré invisiblement par le GPU—en utilisant des calculs JavaScript purs sur CPU pour générer les bonnes coordonnées SVG 2D qui correspondent à la sortie visuelle de la scène WebGL 3D.

### Pourquoi C'est Important

1. **Fidélité Visuelle** : L'export SVG doit être parfait au pixel près avec le rendu WebGL
2. **Réutilisabilité** : Comprendre les mathématiques permet l'adaptation à d'autres projets
3. **Débogage** : Quand les exports sont incorrects, il faut savoir quelle transformation a échoué
4. **Flexibilité** : La projection CPU permet les cartes de profondeur, effets personnalisés et traitement analytique

### Le Cas d'Usage du ZigzagEmitter

Le ZigzagEmitter rend des rubans en zigzag animés dans l'espace 3D avec :
- Caméra contrôlable par l'utilisateur (rotation, zoom, panoramique)
- Champ de vision ajustable
- Plans de découpe proche/lointain
- Rotations 3D appliquées à la géométrie

L'utilisateur peut exporter n'importe quelle frame en SVG, nécessitant une reconstruction en temps réel de toutes ces transformations.

---

## 2. La Logique : Une Explication Littérale

### Le Pipeline de Transformation

Pensez au processus 3D vers 2D comme une série de transformations de systèmes de coordonnées, comme changer de référentiels en physique :

#### **Étape 1 : Espace Local → Espace Monde**

Chaque ruban en zigzag existe dans son propre **système de coordonnées local**. Par exemple, un ruban peut avoir des sommets à des positions comme `(-100, 50)` dans son propre espace.

Pour placer ce ruban dans la scène, nous transformons ces coordonnées locales en **espace monde** :
```
mondeX = (ligneX - largeurCanevas/2 + localX) × échelle
mondeY = (ligneY - hauteurCanevas/2 + localY) × échelle
mondeZ = 0  (les rubans sont plats dans le plan XY)
```

**Pourquoi soustraire le centre du canevas ?** Le mode WEBGL de p5.js place l'origine `(0,0,0)` au centre de l'écran, pas au coin supérieur gauche.

#### **Étape 2 : Appliquer les Rotations 3D**

La géométrie subit **trois rotations séquentielles**, appliquées dans cet ordre spécifique :

1. **rotateZ** (rotation de l'émetteur) : Fait tourner les rubans autour de l'axe Z (comme une roue)
2. **rotateY** (orbite horizontale de la caméra) : Tourne autour de l'axe vertical (regarder gauche/droite)
3. **rotateX** (orbite verticale de la caméra) : Tourne autour de l'axe horizontal (regarder haut/bas)

**Insight critique** : L'ordre de rotation compte ! `rotateX(rotateY(point))` produit des résultats différents de `rotateY(rotateX(point))`.

Chaque rotation est une **transformation de coordonnées 3D** utilisant des fonctions trigonométriques (sinus et cosinus).

#### **Étape 3 : Translation de la Caméra**

Après la rotation, nous simulons la distance de la caméra par rapport à la scène :

```
vueZ = Z_tourné - distanceTotaleCaméra
```

**Où :**
- `distanceTotaleCaméra` = position par défaut de la caméra p5 + distance de zoom de l'utilisateur
- La soustraction déplace les points "loin" de la caméra en Z négatif

#### **Étape 4 : Découpe du Frustum**

Avant la projection, nous vérifions si le point est dans le frustum de vision (la pyramide visible) :

```
si (vueZ >= -proche || vueZ <= -loin) → rejeter le point
```

Les points trop proches (derrière le plan proche) ou trop loin (au-delà du plan lointain) sont éliminés.

#### **Étape 5 : Projection en Perspective**

C'est **l'étape magique** où la 3D devient 2D. Les objets plus éloignés apparaissent plus petits, créant une profondeur réaliste.

**La formule de perspective :**
```
échelle = caméraZParDéfaut / -vueZ
écranX = vueX × échelle + largeurCanevas/2
écranY = vueY × échelle + hauteurCanevas/2
```

**Ce que cela signifie :**
- Les points plus éloignés (plus grand `vueZ` négatif) ont des facteurs d'échelle plus petits
- Les points plus proches ont des facteurs d'échelle plus grands (apparaissent plus grands)
- La division par `vueZ` crée l'effet de "convergence vers un point" de la perspective

#### **Étape 6 : Sortie SVG**

Les coordonnées finales `(écranX, écranY)` sont écrites dans le fichier SVG comme points 2D. L'information de profondeur est perdue (ou optionnellement stockée pour les cartes de profondeur).

---

## 3. L'Algorithme : Implémentation du Code

### 3.1 Pseudocode de Haut Niveau

```
POUR chaque ruban dans la scène:
  verticesLocaux = ruban.construireVertices()  // ex. points zigzag
  
  POUR chaque vertex dans verticesLocaux:
    // Transformer en espace monde
    posMonde = localVersMonde(vertex, ruban.position, échelle)
    
    // Appliquer les rotations
    tourné1 = rotationZ(posMonde, angleÉmetteur)
    tourné2 = rotationY(tourné1, lacetCaméra)
    tourné3 = rotationX(tourné2, tangageCaméra)
    
    // Déplacer vers l'espace de vue
    posVue = translation(tourné3, -distanceCaméra)
    
    // Découper contre le frustum
    SI posVue.z hors de [proche, loin]:
      IGNORER ce vertex
    
    // Division en perspective
    posÉcran = projectionPerspective(posVue, fov, tailleCanevas)
    
    // Stocker la coordonnée 2D
    pointsSVG.push(posÉcran)
  
  // Créer un polygone SVG à partir des points 2D
  polygoneSVG = nouveau Polygone(pointsSVG)
  documentSVG.ajouter(polygoneSVG)
```

### 3.2 Implémentation JavaScript Réelle

Voici le code de transformation de base du ZigzagEmitter :

```javascript
// Fonctions d'aide pour les rotations (matrices de rotation comme fonctions pures)
const rotX = (x, y, z, angle) => ({
  x: x,
  y: y * Math.cos(angle) - z * Math.sin(angle),
  z: y * Math.sin(angle) + z * Math.cos(angle)
});

const rotY = (x, y, z, angle) => ({
  x: x * Math.cos(angle) + z * Math.sin(angle),
  y: y,
  z: -x * Math.sin(angle) + z * Math.cos(angle)
});

const rotZ = (x, y, z, angle) => ({
  x: x * Math.cos(angle) - y * Math.sin(angle),
  y: x * Math.sin(angle) + y * Math.cos(angle),
  z: z
});

// Configuration de la caméra (pré-calculée une fois par export)
const fovRad = params.fov * Math.PI / 180;
const caméraZParDéfaut = (H / 2) / Math.tan(fovRad / 2);
const distanceTotale = caméraZParDéfaut + camera.distance;

// Fonction de projection principale
function projectPoint(x, y, z) {
  // Étape 1 : Rotation autour de Z (rotation de l'émetteur)
  let pt = rotZ(x, y, z, params.emitterRotation * Math.PI / 180);
  
  // Étape 2 : Rotation autour de Y (orbite horizontale)
  pt = rotY(pt.x, pt.y, pt.z, camera.rotationY);
  
  // Étape 3 : Rotation autour de X (orbite verticale)
  pt = rotX(pt.x, pt.y, pt.z, camera.rotationX);
  
  // Étape 4 : Translation vers l'espace de vue (distance caméra)
  pt.z -= distanceTotale;
  
  // Étape 5 : Découpe du frustum
  if (pt.z >= -params.near || pt.z <= -params.far) {
    return null;  // Point hors de la plage visible
  }
  
  // Étape 6 : Projection en perspective
  const échelle = caméraZParDéfaut / -pt.z;
  return {
    x: pt.x * échelle + W / 2,
    y: pt.y * échelle + H / 2
  };
}

// Convertir les coordonnées locales du ruban en espace monde, puis projeter
const valÉchelle = params.geometryScale / 100;

const versÉcran = (ligne, pointsLocaux) => pointsLocaux
  .map(pt => ({
    x: ((ligne.x - W / 2) + pt.x) * valÉchelle,
    y: ((ligne.y - H / 2) + pt.y) * valÉchelle,
    z: 0
  }))
  .map(pt => projectPoint(pt.x, pt.y, pt.z))
  .filter(Boolean);  // Enlever les nulls (points découpés)

// Générer le polygone SVG
const pointsÉcran = versÉcran(ligne, verticesLocaux);
const polygoneSVG = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
polygoneSVG.setAttribute('points', 
  pointsÉcran.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
);
```

### 3.3 Détails d'Implémentation Clés

#### Conversion du Système de Coordonnées
```javascript
// p5.js WEBGL utilise l'origine centrale, mais les positions de ligne sont stockées en coordonnées canvas
mondeX = (ligne.x - W/2 + localX) * échelle
mondeY = (ligne.y - H/2 + localY) * échelle
```

#### L'Ordre de Rotation est Critique
L'ordre **Z → Y → X** correspond à la pile de transformation de p5.js WEBGL. Changer cet ordre produira des résultats incorrects.

#### Convention Z Négatif
OpenGL (et p5.js) utilise un **système de coordonnées à droite** où :
- +X = droite
- +Y = haut  
- **-Z = avant** (vers l'écran)

C'est pourquoi nous utilisons `-vueZ` dans les divisions et vérifions `z <= -loin`.

#### Calcul de la Distance de la Caméra
```javascript
// La caméra par défaut de p5.js WEBGL est positionnée à z = (hauteur/2) / tan(fov/2)
caméraZParDéfaut = (hauteur / 2) / Math.tan(fovRad / 2)

// Le zoom de l'utilisateur s'ajoute à cela
distanceTotale = caméraZParDéfaut + distanceZoomUtilisateur
```

Cette formule garantit que le champ de vision se comporte de manière identique au moteur WEBGL de p5.

---

## 4. Les Mathématiques : Théorie et Preuves

### 4.1 Matrices de Rotation

Chaque rotation est une multiplication de **matrice orthogonale 3×3**. 

#### Rotation Autour de l'Axe X (Tangage)
```
Rₓ(θ) = ┌ 1    0        0     ┐
        │ 0  cos(θ)  -sin(θ) │
        └ 0  sin(θ)   cos(θ) ┘

[x']   [1    0        0     ] [x]
[y'] = [0  cos(θ)  -sin(θ) ] [y]
[z']   [0  sin(θ)   cos(θ) ] [z]

x' = x
y' = y·cos(θ) - z·sin(θ)
z' = y·sin(θ) + z·cos(θ)
```

#### Rotation Autour de l'Axe Y (Lacet)
```
Rᵧ(θ) = ┌ cos(θ)   0  sin(θ) ┐
        │   0      1    0    │
        └-sin(θ)   0  cos(θ) ┘

x' =  x·cos(θ) + z·sin(θ)
y' =  y
z' = -x·sin(θ) + z·cos(θ)
```

#### Rotation Autour de l'Axe Z (Roulis)
```
Rᴢ(θ) = ┌ cos(θ)  -sin(θ)  0 ┐
        │ sin(θ)   cos(θ)  0 │
        └   0        0     1 ┘

x' = x·cos(θ) - y·sin(θ)
y' = x·sin(θ) + y·cos(θ)
z' = z
```

### 4.2 Rotation Composite

Lors de l'application de rotations en séquence : **Z → Y → X**, la transformation combinée est :

```
R_combinée = Rₓ · Rᵧ · Rᴢ

[x'']   
[y''] = Rₓ(θₓ) · Rᵧ(θᵧ) · Rᴢ(θᴢ) · [x]
[z'']                               [y]
                                    [z]
```

**Important :** La multiplication matricielle n'est **pas commutative** : `A·B ≠ B·A`

C'est pourquoi l'ordre de rotation compte. Tourner autour de X puis Y produit des résultats différents de Y puis X.

### 4.3 Formule de Projection en Perspective

La transformation en perspective est dérivée des **triangles semblables** dans l'espace 3D.

#### Dérivation Géométrique

Imaginez regarder un point 3D `P = (x, y, z)` depuis une caméra en position `(0, 0, 0)` :

```
                P(x, y, z)
               /|
              / |
             /  | y
            /   |
           /    |
    Caméra ──────┘
         distance z
         
    Plan d'écran à distance d
```

Par triangles semblables :
```
écranY / d = y / z
écranY = (y · d) / z
```

La **distance focale** `d` est calculée à partir du champ de vision :
```
d = (hauteurCanevas / 2) / tan(fov / 2)
```

Cela garantit que l'étendue verticale du frustum correspond à la hauteur du canevas au plan focal.

#### Équations de Projection Complètes

```
Étant donné le point (x, y, z) dans l'espace de vue :

échelle = distanceFocale / -z

écranX = x · échelle + largeurCanevas / 2
écranY = y · échelle + hauteurCanevas / 2
```

**Pourquoi diviser par `-z` ?** La caméra regarde le long de **l'axe Z négatif**. Les points avec `z = -100` sont plus éloignés que `z = -10`, donc nous utilisons la valeur absolue via négation.

### 4.4 Champ de Vision (FOV) et Distance Focale

La relation entre FOV et distance focale :

```
tan(fov/2) = (hauteurCanevas/2) / distanceFocale

Donc :
distanceFocale = (hauteurCanevas/2) / tan(fov/2)
```

**Intuition :**
- **FOV plus grand** (ex. 90°) → distance focale plus courte → plus de distorsion "grand angle"
- **FOV plus petit** (ex. 30°) → distance focale plus longue → plus de compression "téléobjectif"

C'est identique à l'optique de caméra physique !

### 4.5 Plans de Découpe du Frustum

Le frustum de vision est une pyramide tronquée définie par :

```
-proche ≤ z ≤ -loin  (dans l'espace de vue)
```

**Plan proche** (ex. z = -0,1) : Les points plus proches sont derrière la caméra ou trop proches pour être rendus.

**Plan lointain** (ex. z = -10000) : Les points au-delà sont éliminés pour la performance et la stabilité numérique.

**Condition de découpe :**
```
si (z >= -proche || z <= -loin):
    rejeter le point
```

### 4.6 Pipeline de Transformation Complet comme Matrice

L'intégralité du pipeline peut être exprimée comme une seule **matrice de transformation homogène 4×4** :

```
[x_écran]     [Projection] [Vue] [Modèle] [x_local]
[y_écran]  =  [          ] [    ] [      ] [y_local]
[z_profondeur][          ] [    ] [      ] [z_local]
[    w    ]   [          ] [    ] [      ] [   1   ]
```

Où :
- **Matrice modèle** = Translation vers l'espace monde × Échelle × Rotation émetteur (Z)
- **Matrice vue** = Rotation caméra (Y puis X) × Translation caméra
- **Matrice projection** = Division perspective + mise à l'échelle de la fenêtre

L'implémentation du code calcule ces transformations séquentiellement plutôt que de construire des matrices explicites, mais le résultat mathématique est identique.

---

## 5. Pièges Courants et Solutions

### Problème : L'export SVG ne correspond pas au rendu WebGL

**Causes :**
1. Mauvais ordre de rotation
2. Conversion incorrecte du système de coordonnées (origine en haut à gauche vs centre)
3. Facteur d'échelle manquant
4. FOV calculé incorrectement

**Solution :** La fonction `projectPoint()` doit **répliquer exactement** l'ordre de la pile de transformation de p5.js.

### Problème : Les objets apparaissent étirés ou compressés

**Cause :** Le calcul du FOV ne tient pas compte du ratio d'aspect ou utilise la mauvaise formule de tangente.

**Solution :** Utiliser `(hauteur/2) / tan(fov/2)` pour le calcul de la distance focale.

### Problème : Artefacts de découpe (géométrie qui disparaît)

**Cause :** Le plan proche est trop loin, ou le plan lointain est trop proche.

**Solution :** S'assurer que proche ≥ 0,01 et loin >> plage de profondeur de la scène.

### Problème : Problèmes de performance avec de grandes scènes

**Cause :** Projeter des milliers de points par frame est intensif pour le CPU.

**Solution :** 
- Utiliser WebGL pour le rendu en temps réel
- N'exécuter la projection CPU qu'à l'export
- Considérer l'élimination spatiale avant la projection

---

## 6. Extension à D'autres Projets

### Adapter Cette Approche

Pour utiliser ce système de projection dans un autre projet :

1. **Identifier vos conventions de système de coordonnées 3D**
   - Emplacement de l'origine (centre, haut-gauche, bas-gauche ?)
   - Directions des axes (+Y haut ou +Y bas ?)
   - Orientation (main droite ou main gauche ?)

2. **Extraire les paramètres de transformation**
   - Position et rotation de la caméra
   - Positions et rotations des objets
   - Facteurs d'échelle
   - FOV

3. **Implémenter les fonctions de rotation**
   - Utiliser les formules matricielles de la Section 4.1
   - Maintenir l'ordre correct pour votre framework

4. **Calculer les constantes de projection**
   - Conversion FOV vers distance focale
   - Valeurs des plans proche/lointain

5. **Appliquer le pipeline**
   - Local → Monde → Vue → Découpe → Projection → Écran

### Exemple Three.js

Pour une scène Three.js :

```javascript
// Extraire les paramètres de la caméra
const camera = scene.camera;
const fov = camera.fov * Math.PI / 180;
const aspect = camera.aspect;
const near = camera.near;
const far = camera.far;

// Obtenir les matrices de vue et projection
const viewMatrix = camera.matrixWorldInverse;
const projectionMatrix = camera.projectionMatrix;

// Projeter un point 3D
function projectToScreen(worldPosition, width, height) {
  const clipSpace = worldPosition
    .applyMatrix4(viewMatrix)
    .applyMatrix4(projectionMatrix);
  
  // Division en perspective
  const ndc = {
    x: clipSpace.x / clipSpace.w,
    y: clipSpace.y / clipSpace.w
  };
  
  // NDC vers espace écran
  return {
    x: (ndc.x + 1) * width / 2,
    y: (1 - ndc.y) * height / 2  // Retourner Y pour SVG
  };
}
```

### Cartes de Profondeur et Z-Buffers

La même projection peut stocker la profondeur :

```javascript
function projectWithDepth(x, y, z) {
  // ... rotations et transformations ...
  const échelle = caméraZParDéfaut / -pt.z;
  return {
    x: pt.x * échelle + W / 2,
    y: pt.y * échelle + H / 2,
    profondeur: -pt.z  // Stocker la profondeur en espace de vue
  };
}
```

Cela permet :
- **Cartes de profondeur** (images en niveaux de gris encodant la distance)
- **Élimination par occlusion** (rejeter la géométrie cachée)
- **Rendu Z-buffer** (tri de profondeur approprié)

---

## 7. Références et Lectures Complémentaires

### Fondements Mathématiques
- **Computer Graphics: Principles and Practice** (Foley et al.) - Chapitres sur les matrices de transformation
- **Real-Time Rendering** (Möller & Haines) - Dérivations de projection en perspective
- **Mathematics for 3D Game Programming** (Lengyel) - Matrices de rotation en profondeur

### Spécificités p5.js
- [Documentation du Mode WEBGL p5.js](https://p5js.org/reference/#group-3D)
- [Référence Caméra p5.js](https://p5js.org/reference/#/p5.Camera)
- [Fonctions de Transformation p5.js](https://p5js.org/reference/#group-Transform)

### Concepts Connexes
- **Pipeline de Transformation OpenGL** - Flux graphique 3D standard de l'industrie
- **Coordonnées Homogènes** - Représentation 4D des transformations 3D
- **Quaternions** - Représentation alternative de rotation évitant le blocage de cardan

---

## 8. Résumé

La conversion 3D vers SVG du ZigzagEmitter démontre une **réimplémentation complète** du pipeline de transformation du GPU en JavaScript CPU. 

**Points Clés à Retenir :**

1. **Pipeline en six étapes** : Local → Monde → Rotation → Translation → Découpe → Projection
2. **Ordre de rotation critique** : Z → Y → X (doit correspondre à p5.js WEBGL)
3. **Formule de perspective** : `échelle = distanceFocale / -vueZ`
4. **Relation FOV** : `distanceFocale = (hauteur/2) / tan(fov/2)`
5. **Conscience du système de coordonnées** : p5.js WEBGL utilise l'origine centrale et -Z vers l'avant

Cette approche fournit des **exports parfaits au pixel près** car elle utilise des mathématiques identiques au moteur WebGL. Comprendre ces principes permet des exports vectoriels de haute qualité depuis n'importe quel projet graphique 3D web.

---

*Version du Document : 1.0*  
*Pour questions ou corrections, référez-vous au code source ZigzagEmitter : `ZigzagEmitter_12.html`, lignes 2200-2250 (export SVG) et lignes 1046-1093 (fonctions de projection).*

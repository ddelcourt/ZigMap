# ZigMap Emitter - Manuel Utilisateur

Startup Guide

---

## Démarrage

1. **Ouvrir** `index.html` dans votre navigateur web
2. **Observer** les motifs zigzag animés 
3. **Interagir** avec votre souris
4. **Ajuster** les paramètres dans le panneau de gauche
5. **Exporter** votre création en images ou vidéos

---

## Contrôles Souris

| Ce Que Vous Voulez | Comment Faire |
|-------------------|---------------|
| **Faire pivoter la vue** | Cliquer et glisser avec bouton gauche souris |
| **Déplacer la vue** | Cliquer et glisser avec bouton droit souris |
| **Zoomer/Dézoomer** | Faire défiler la molette souris |

💡 **Astuce** : Les contrôles souris fonctionnent uniquement quand le curseur est sur la zone d'animation (pas sur le panneau de contrôle).

---

## Raccourcis Clavier Essentiels

| Touche | Ce Qu'elle Fait |
|--------|-----------------|
| **H** | Masquer/afficher le panneau de contrôle |
| **Entrée** | Mode plein écran |
| **p** | Enregistrer l'image actuelle en PNG (inclut l'overlay) |
| **s** | Enregistrer l'image actuelle en SVG (vectoriel uniquement) |
| **d** | Enregistrer carte de profondeur |
| **v** | Démarrer/arrêter enregistrement vidéo (inclut l'overlay) |
| **r** | Réinitialiser caméra à position par défaut |
| **0** (zéro) | Réinitialiser niveau de zoom |
| **1** | Basculer vers Palette de Couleurs 1 |
| **2** | Basculer vers Palette de Couleurs 2 |
| **3** | Basculer vers Palette de Couleurs 3 |
| **4** | Basculer vers Palette de Couleurs 4 |
| **y** | Basculer vue stéréoscopique (VR/3D) |

💡 **Astuce** : Les exports PNG et vidéo incluent automatiquement votre image overlay!

---

## Contrôles Principaux (Panneau Gauche)

### 💾 Projet

- **Bouton Save** : Télécharger votre projet complet avec états et positions caméra en fichier JSON
- **Bouton Load** : Ouvrir un projet sauvegardé précédemment

💡 **Nouvel utilisateur** : Lors de la première ouverture, l'application charge automatiquement un projet de démarrage avec des états d'exemple !

### 🎭 États (States) **NOUVEAU**

Sauvegardez et rappelez des instantanés complets de vos paramètres :

- **Liste des États** : Tous vos états sauvegardés apparaissent ici
- **Cliquer sur un état** pour le charger (transitions douces !)
- **Bouton Save** : Capturer la configuration actuelle comme nouvel état
- **Bouton Update** : Écraser l'état sélectionné
- **Bouton Delete** : Supprimer l'état sélectionné
- **Renommer** : Cliquer sur le nom de l'état pour le modifier

**Contrôles de Transition** :
- **State Transition** (0-30s) : Durée de transition entre états
- **Color Transition** (0-30s) : Durée de transition des palettes de couleurs

**Auto-Trigger** :
- ☑️ Cocher **Auto-Trigger** pour changer automatiquement d'état
- **Curseur Frequency** (5-120s) : Fréquence de changement entre états
- 💡 Algorithme de mélange - visite chaque état une fois avant répétition (pas de répétition à court terme)

### 🎨 Palettes de Couleurs

**Quatre palettes de couleurs distinctes**, chacune avec 4 emplacements de couleur :
- **Cliquez sur les boutons de palette (1-4)** en haut pour basculer entre les palettes (ou utilisez les touches 1-2-3-4)
- **Cliquez sur les sélecteurs de couleur** pour personnaliser chaque couleur
- **Définissez les rôles** pour chaque couleur : Line (lignes zigzag) / Background (arrière-plan) / None (désactivé)
- **Color Depth Separation** : Espacement Z entre lignes de différentes couleurs

💡 **Astuce** : Les lignes existantes passent en douceur aux nouvelles couleurs.

### 🎬 Rendu (Rendering)

Contrôles de résolution de sortie (affecte les exports) :

- **Framebuffer Resolution** : ☑️ Cocher pour résolution fixe
- **Menu déroulant Preset** : Tailles communes (HD, 4K, formats Instagram)
- **Champs Resolution** : Largeur × hauteur personnalisées en pixels

### 👁️ Vue (View)

Paramètres caméra et affichage :

- **Field of View** : Angle de "l'objectif" (60° normal, 90°+ dramatique)
- **Clipping Planes** : Plages de visibilité Near/Far
- **Stereoscopic View (VR)** : ☑️ Cocher pour mode VR côte-à-côte 3D
- **Eye Separation** : Distance entre caméras stéréo

### 📐 Géométrie

- **Segment Length** : Longueur de chaque segment zigzag
- **Line Thickness** : Épaisseur des lignes
- **Emitter Rotation** : Rotation du motif d'émission
- **Geometry Scale** : Multiplicateur de taille globale
- **Fade Duration** : Durée de fondu entrée/sortie

### 🎪 Animation

- **Emit Rate** : Nouvelles lignes par seconde
- **Speed** : Vitesse de déplacement des lignes
- **Ambient Speed Master** : Multiplicateur de vitesse global

### 🎲 Modulations

Ajoutez de la variété à vos animations :

- **Random Thickness** : ☑️ Épaisseur variable aléatoire
- **Random Speed** : ☑️ Vitesse variable aléatoire  
- **Thickness Range** : Valeurs min/max pour épaisseur aléatoire
- **Speed Range** : Valeurs min/max pour vitesse aléatoire

### 🖼️ Overlay **NOUVEAU**

Ajoutez des images statiques par-dessus l'animation :

- **Case Show Overlay** : Basculer visibilité overlay
- **Bouton Load Image** : Importer fichiers PNG, JPG ou SVG
- **Scale** (10-200%) : Redimensionner l'image overlay
- **Opacity** (0-100%) : Niveau de transparence
- **Position X/Y** (0-100%) : Placer l'image n'importe où à l'écran
- **Bouton Clear Image** : Supprimer l'overlay actuel

💡 **Astuce** : Les overlays sont inclus dans les exports PNG et vidéo !

---

## Exporter Votre Travail

### Export Rapide (Image Actuelle)

1. **Image PNG** : Appuyez sur **p** (ou cliquez sur bouton "Export PNG")
   - Bon pour : réseaux sociaux, partage rapide
   - **Inclut l'image overlay** si activée
   - Correction automatique pour écrans haute résolution (Retina)
   - Le fichier se télécharge automatiquement

2. **Vecteur SVG** : Appuyez sur **s** (ou cliquez sur bouton "Export SVG")
   - Bon pour : impression, travail de design, logos
   - Peut être édité dans Illustrator, Inkscape, etc.
   - N'inclut pas l'overlay (vectoriel uniquement)

3. **Carte de Profondeur** : Appuyez sur **d** (ou cliquez sur bouton "Export Depth Map")
   - Bon pour : effets 3D, post-production
   - Blanc = proche de la caméra, Noir = loin

💡 **Astuce Overlay** : Les exports PNG composent automatiquement votre image overlay avec l'échelle, l'opacité et la position correctes !

### Enregistrement Vidéo

1. Définir **Duration** (combien de secondes)
2. Définir **Frame Rate** (30 FPS standard)
3. Cliquer bouton **Record Video** (ou appuyez sur **v**)
4. **Attendre** - ne touchez à rien pendant l'enregistrement
5. La vidéo se télécharge automatiquement quand terminée

⚠️ **Important** : 
- Ne cliquez pas et n'interagissez pas avec la page pendant l'enregistrement !
- **Les images overlay sont incluses** dans les exports vidéo
- L'enregistrement compose l'overlay sur chaque frame

### Enregistrement Vidéo

1. Définir **Duration** (combien de secondes)
2. Définir **Frame Rate** (30 FPS est standard)
3. Cliquer sur bouton **Record Video** (ou appuyer sur **v**)
4. **Attendre** - ne touchez à rien pendant l'enregistrement
5. La vidéo se télécharge automatiquement quand c'est terminé

⚠️ **Important** : N'interagissez pas avec la page pendant l'enregistrement !

---

## Tâches Courantes

### Passer en Plein Écran
Appuyez sur **Entrée** (ou cliquez sur bouton "Fullscreen")

### Masquer les Contrôles
Appuyez sur **Tab** pour obtenir une vue nette pour les captures d'écran

### Changer les Couleurs
1. Cliquez sur un bouton de palette (1-4) en haut, ou appuyez sur les touches **1**, **2**, **3**, ou **4**
2. Cliquez sur n'importe quel sélecteur de couleur pour personnaliser les couleurs
3. Définissez quelles couleurs sont utilisées pour les lignes ou l'arrière-plan

### Rendre Plus Chargé
Augmentez le curseur **Emit Rate** (plus de lignes apparaissent)

### Rendre Plus Calme
Diminuez le curseur **Emit Rate** (moins de lignes)

### Rendre les Lignes Plus Épaisses/Fines
Ajustez le curseur **Line Thickness**

### Accélérer ou Ralentir
Ajustez le curseur **Speed** ou **Ambient Speed Master**

### Ajouter de la Variété
Cochez ☑️ **Random Thickness** et **Random Speed**

### Tout Réinitialiser
- Appuyez sur **r** pour réinitialiser position caméra
- Appuyez sur **0** pour réinitialiser le zoom
- Rechargez la page pour réinitialiser tous les paramètres

---

## Résolution & Tailles de Sortie

### Pour Taille de Sortie Fixe

1. Cochez ☑️ **Framebuffer Resolution**
2. Choisissez un **Preset** dans le menu déroulant :
   - **1920×1080** - HD Standard (Instagram, YouTube)
   - **1080×1080** - Carré (posts Instagram)
   - **3840×2160** - Qualité 4K
   - **1080×1440** - Instagram portrait
3. Exportez normalement

### Pour Taille de Fenêtre
Laissez **Framebuffer Resolution** décoché - il utilisera la taille de votre fenêtre navigateur.

---

## Astuces Rapides

✅ **Meilleurs paramètres pour débutants** :
- Emit Rate : 1.5
- Speed : 80
- Line Thickness : 12
- Gardez les options Random DÉSACTIVÉES au début

✅ **Pour animation fluide** :
- Emit rate plus bas = meilleures performances
- Fermez les autres onglets navigateur

✅ **Pour effets dramatiques** :
- Large Field of View (90°-120°)
- Activez Random Speed et Thickness
- Essayez différents angles Z-Plane Rotation

✅ **Pour look épuré et minimal** :
- Faible Emit Rate (0.5-1.0)
- Haute Speed (150-300)
- Pas de modulations aléatoires

---

## Dépannage

| Problème | Solution |
|----------|----------|
| **Rien n'apparaît** | Rafraîchissez la page ; vérifiez que Emit Rate > 0 |
| **Trop chargé** | Baissez le curseur Emit Rate |
| **Trop lent** | Augmentez le curseur Speed |
| **Les lignes disparaissent** | Elles sont hors du champ de vue |
| **Impossible de pivoter caméra** | Assurez-vous que le curseur est sur l'animation, pas le panneau |
| **La vidéo ne se télécharge pas** | Attendez - les grandes vidéos prennent du temps |
| **Impossible de sortir du plein écran** | Appuyez sur la touche **Échap** |

---

## À Quoi Servent les Fichiers

- **index.html** - L'application
- **User-Manual-fr.md** - Ce guide (vous le lisez)
- **README-fr.md** - Fonctionnalités
- **Documentation-fr.md** - Documentation technique
- **Fichiers .json sauvegardés** - Vos paramètres de projet

---

**Note** : Vos paramètres se sauvegardent automatiquement dans votre navigateur. Quand vous quittez la page, les paramètres sont conservés.

.
.
.
.
.
.
.
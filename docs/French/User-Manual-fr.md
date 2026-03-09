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
| **Tab** | Masquer/afficher le panneau de contrôle |
| **Entrée** | Mode plein écran |
| **p** | Enregistrer l'image actuelle en PNG |
| **s** | Enregistrer l'image actuelle en SVG (vectoriel) |
| **d** | Enregistrer carte de profondeur |
| **v** | Démarrer/arrêter enregistrement vidéo |
| **r** | Réinitialiser caméra à position par défaut |
| **0** (zéro) | Réinitialiser niveau de zoom |

---

## Contrôles Principaux (Panneau Gauche)

### 🎨 Couleurs
**Cliquez sur n'importe quel cercle de couleur** pour changer la couleur des lignes.

### 📐 Paramètres de Base

- **Geometry Height** : Hauteur de chaque zigzag (plus grand = motifs plus hauts)
- **Line Thickness** : Épaisseur des lignes (plus grand = plus épais)
- **Emit Rate** : Combien de nouvelles lignes apparaissent par seconde (plus élevé = plus chargé)
- **Speed** : Vitesse de déplacement des lignes (plus élevé = animation plus rapide)

### 🎬 Effets d'Animation

- **Random Thickness** : ☑️ Cocher pour varier l'épaisseur aléatoirement
- **Random Speed** : ☑️ Cocher pour varier la vitesse aléatoirement
- **Ambient Speed Master** : Ralentir ou accélérer tout (curseur)

### 📷 Caméra & Vue

- **Stereoscopic View** : ☑️ Cocher pour mode VR/3D côte-à-côte
- **Field of View** : Ajuster l'angle de "l'objectif" (60° est normal)
- **Z-Plane Rotation** : Faire pivoter le motif entier

### 💾 Sauvegarder & Charger

- **Bouton Save** : Télécharger vos paramètres dans un fichier
- **Bouton Load** : Ouvrir un fichier de paramètres sauvegardé précédemment

---

## Exporter Votre Travail

### Export Rapide (Image Actuelle)

1. **Image PNG** : Appuyez sur **p** (ou cliquez sur bouton "Export PNG")
   - Bon pour : réseaux sociaux, partage rapide
   - Le fichier se télécharge automatiquement

2. **Vecteur SVG** : Appuyez sur **s** (ou cliquez sur bouton "Export SVG")
   - Bon pour : impression, travail de design, logos
   - Peut être édité dans Illustrator, Inkscape, etc.

3. **Carte de Profondeur** : Appuyez sur **d** (ou cliquez sur bouton "Export Depth Map")
   - Bon pour : effets 3D, post-production
   - Blanc = proche de la caméra, Noir = loin

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

### Changer la Couleur
Cliquez sur n'importe quel cercle de couleur dans la section Couleurs

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
# Trace · prototype cliquable

Prototype web de l’application **Trace** (cours Design d’interaction I), basé sur la page Figma
« Trace · Maquette haute fidélité v2 ». Il fonctionne dans n’importe quel navigateur, sur téléphone
comme sur ordinateur, sans installation ni dépendance (HTML, CSS et JavaScript seulement).

## Mettre en ligne avec GitHub Pages

1. Crée un dépôt sur GitHub (ex. `trace-prototype-v2`).
2. Dépose **le contenu** de ce dossier à la racine du dépôt (`index.html` doit être à la racine).
   - Sur github.com : *Add file › Upload files*, glisse tous les fichiers et dossiers, puis *Commit changes*.
   - Ou en ligne de commande :
     ```bash
     git init
     git add .
     git commit -m "Prototype Trace"
     git branch -M main
     git remote add origin https://github.com/<ton-compte>/trace-prototype-v2.git
     git push -u origin main
     ```
3. Dans le dépôt : *Settings › Pages › Build and deployment › Source : Deploy from a branch*,
   branche `main`, dossier `/ (root)`, puis *Save*.
4. Après 1 à 2 minutes, le prototype est accessible à
   `https://<ton-compte>.github.io/trace-prototype-v2/`.

> Un dépôt GitHub Pages gratuit est public. Vérifie que l’équipe a le droit de diffuser les photos
> de vêtements du dossier `img/` avant de le publier.

## Tester

- **Sur téléphone** : ouvre le lien, puis *Partager › Sur l’écran d’accueil* pour l’ouvrir en plein écran.
- **Sur ordinateur** : le téléphone s’affiche au centre, avec la liste des scénarios à gauche.
- Chaque scénario a son propre lien, pratique pour les tests utilisateurs :

| Scénario | Lien à ajouter après l’adresse du site |
|---|---|
| Premier lancement | `#/o1` |
| Connexion | `#/c1` |
| Créer un compte (5 étapes) | `#/c4` |
| Accueil (garde-robe remplie) | `#/accueil` |
| Accueil vide | `#/vide` |
| Ajouter un vêtement | `#/cat` |
| Ajouter par l’étiquette | `#/ad1` |
| Comparer en magasin | `#/scan` |
| Aucune correspondance (Passe) | `#/aucun` |
| Aucun vêtement de ce type | `#/cp2` |
| Photo à reprendre (ajout) | `#/ad3` |
| Photo à reprendre (magasin) | `#/cp3` |
| Ma cabine | `#/cabine` |
| Paramètres | `#/param` |

Les compteurs (comparés, gardés, laissés) et « Ma cabine » se mettent à jour pendant le test et sont
gardés dans le navigateur. Le bouton « Réinitialiser les données de test » (sur ordinateur) les remet à zéro
entre deux participants. Sur téléphone, vide les données du site ou ouvre une fenêtre de navigation privée.

## Ce qui est simulé

- La caméra est réelle : les écrans « Pose ton vêtement à plat », « Vise l’étiquette » et « Comparer »
  ouvrent la caméra arrière du téléphone (ou la webcam sur ordinateur). Le bouton rond prend la photo,
  qui s’affiche ensuite dans « Vérifie tes mesures », « Étiquette lue » et l’écran Résultat.
  L’analyse, elle, est simulée : les mesures et le verdict restent des valeurs fictives.
  Les photos restent dans le navigateur et ne sont envoyées nulle part ; elles disparaissent quand on ferme la page.
- Si la caméra est refusée ou indisponible, le prototype continue avec des photos d’exemple.
  Pour la réactiver : réglages du navigateur › autorisations du site › Caméra.
- Les mesures, les verdicts et les écarts zone par zone sont des valeurs fictives.
- Sur l’écran Résultat, toucher un autre pantalon de la garde-robe change le tracé, le verdict
  (bleu = Prends-le, jaune = Essaie-le, rouge = Passe) et le tableau des écarts.

## Structure

```
index.html        page unique
css/style.css     styles (couleurs, composants, mise en page téléphone)
js/app.js         écrans, données fictives et navigation
img/              photos des vêtements, logo et icône
```

Pour modifier un texte, cherche-le dans `js/app.js` : chaque écran y est une fonction (`SCREENS.accueil`, `SCREENS.resultat`, etc.).

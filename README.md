# Payanké Design — Guide de mise en ligne

Ce dossier contient le code complet de ton site. Voici comment le mettre sur GitHub, puis en ligne.

---

## Étape 1 — Mettre le projet sur GitHub

### Si tu utilises l'interface web GitHub (le plus simple, sans rien installer)

1. Va sur [github.com](https://github.com) et connecte-toi
2. Clique sur le bouton vert **"New"** (ou le **+** en haut à droite → "New repository")
3. Donne un nom à ton dépôt, par exemple `payanke-design`
4. Laisse-le en **Public** (nécessaire pour l'hébergement gratuit) ou **Private** si tu préfères (certains hébergeurs gratuits l'acceptent aussi)
5. Ne coche **aucune** case (pas de README, pas de .gitignore — on les a déjà)
6. Clique **"Create repository"**
7. Sur la page suivante, clique sur **"uploading an existing file"**
8. Glisse-dépose **tout le contenu de ce dossier** (tous les fichiers et le dossier `src/`)
9. En bas de page, clique **"Commit changes"**

Ton code est maintenant sur GitHub.

### Si tu préfères la ligne de commande (pour les prochaines mises à jour, c'est plus rapide)

```bash
cd payanke-deploy
git init
git add .
git commit -m "Premier envoi du site"
git branch -M main
git remote add origin https://github.com/TON-NOM-UTILISATEUR/payanke-design.git
git push -u origin main
```

---

## Étape 2 — Héberger le site (le rendre visible en ligne)

Comme tu pars sur **Hostinger**, voici la marche à suivre. Hostinger héberge habituellement des sites classiques (WordPress, PHP) — notre site est différent : c'est un site "statique" qui doit d'abord être **construit** (compilé) avant d'être mis en ligne.

### A. Construire le site (une seule fois, avant chaque mise en ligne)

Sur ton ordinateur, avec [Node.js installé](https://nodejs.org) :

```bash
cd payanke-deploy
npm install
npm run build
```

Cela crée un dossier `dist/` contenant le site "prêt à l'emploi" (HTML, CSS, JS optimisés).

### B. Envoyer le contenu de `dist/` sur Hostinger

1. Connecte-toi à ton espace **hPanel** Hostinger
2. Va dans **Fichiers → Gestionnaire de fichiers**
3. Ouvre le dossier `public_html` (c'est la racine de ton site)
4. Supprime les fichiers par défaut s'il y en a (comme `default.php`)
5. Upload **tout le contenu du dossier `dist/`** (pas le dossier `dist` lui-même, ce qu'il y a *dedans*) directement dans `public_html`

Ton site est en ligne, accessible via le nom de domaine que tu auras connecté à Hostinger.

### C. Pour les mises à jour futures

Chaque fois que le code change (par exemple si je t'aide à faire une modification) :
1. Mets à jour les fichiers sur GitHub
2. Relance `npm run build` en local
3. Renvoie le nouveau contenu de `dist/` sur Hostinger (ça remplace l'ancien)

---

## Alternative plus simple : Vercel ou Netlify (recommandé si tu bloques sur Hostinger)

Si l'étape "construire puis uploader" sur Hostinger te semble compliquée, sache qu'il existe des hébergeurs **gratuits et automatiques** pensés spécifiquement pour ce type de site :

1. Va sur [vercel.com](https://vercel.com) (ou [netlify.com](https://netlify.com))
2. Connecte-toi avec ton compte GitHub
3. Choisis "Importer un projet" et sélectionne ton dépôt `payanke-design`
4. Laisse les réglages par défaut, clique "Deploy"

Le site est en ligne en 2 minutes, et **se met à jour tout seul** à chaque fois que tu modifies le code sur GitHub — plus besoin de refaire `npm run build` et d'uploader à la main. Tu peux ensuite connecter ton nom de domaine Hostinger à ce site Vercel/Netlify (Hostinger sert alors uniquement à gérer le nom de domaine, pas l'hébergement).

---

## Connecter ton nom de domaine

Que tu choisisses Hostinger seul ou Vercel/Netlify + domaine Hostinger, il faudra à un moment configurer les **DNS** de ton domaine pour qu'il pointe vers ton hébergement. C'est une étape avec ses propres instructions selon l'option choisie — dis-le moi quand tu y seras, je t'accompagne.

---

## Besoin d'aide ?

Si une étape bloque, reviens me voir avec :
- Une capture d'écran de l'endroit où tu es bloqué·e
- Le message d'erreur exact si il y en a un

Je t'aiderai à débloquer la situation.

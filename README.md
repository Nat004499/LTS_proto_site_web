# Fissuro Monitor — Prototype

Prototype visuel d'une interface de monitoring pour fissuromètres.
Stack : **Vite + React + Recharts**, sans backend (données mockées).

## Lancer en local

```bash
npm install
npm run dev
```

L'app se lance sur `http://localhost:5173`.

## Build de production

```bash
npm run build       # génère le dossier dist/
npm run preview     # sert le build localement pour le tester
```

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` déploie automatiquement à chaque
push sur la branche `main`. Voir la procédure détaillée fournie par Claude.

⚠️ **Le champ `base` dans `vite.config.js` doit correspondre au nom du
repository GitHub** (par défaut `/fissuro-monitor/`).

## Fonctionnalités

- Liste d'appareils avec statut (vert / orange / rouge selon le seuil)
- Sélection multiple via cases à cocher
- Détail d'un appareil : statistiques, courbe d'évolution, tableau,
  température corrélée
- Export CSV d'un ou plusieurs appareils sélectionnés

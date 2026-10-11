# Recherche sémantique — Frontend

Interface web d'un moteur de recherche sémantique en français.
L'utilisateur saisit une requête en langage naturel (par exemple
« automobile propre ») et l'application affiche les documents les plus
proches **par le sens**, avec un score de similarité.

> Ce dépôt contient **uniquement le frontend**. Le backend FastAPI existe
> déjà et n'est jamais modifié : les deux applications sont totalement
> séparées et communiquent uniquement via HTTP.

## Sommaire

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Scripts disponibles](#scripts-disponibles)

## Prérequis

- **Node.js** 18.18 ou supérieur (LTS recommandé)
- **npm** (fourni avec Node.js)
- Le **backend FastAPI** démarré et accessible (par défaut sur
  `http://127.0.0.1:8000`)

## Installation

Depuis le dossier `frontend/` :

```bash
npm install
```

## Configuration

L'URL du backend est lue depuis la variable d'environnement
`NEXT_PUBLIC_API_URL`.

1. Copiez le fichier d'exemple :

   ```bash
   cp .env.local.example .env.local
   ```

2. Vérifiez / adaptez la variable si nécessaire :

   ```bash
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```

> Le préfixe `NEXT_PUBLIC_` est obligatoire : Next.js n'expose au navigateur
> que les variables qui commencent par `NEXT_PUBLIC_`. Si la variable n'est
> pas définie, le frontend utilise `http://127.0.0.1:8000` par défaut.

## Lancement

```bash
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

Assurez-vous que le backend FastAPI tourne en parallèle, sinon un message
« Le serveur est injoignable, vérifiez que le backend tourne » s'affichera.

## Architecture

```text
frontend/
├── app/
│   ├── layout.tsx        # Layout racine (lang="fr", polices, métadonnées)
│   ├── page.tsx          # Page d'accueil : orchestration et états
│   └── globals.css       # Styles globaux + Tailwind CSS
├── components/
│   ├── SearchBar.tsx     # Champ de recherche, sélecteur (3/5/10) et bouton
│   ├── ExampleQueries.tsx# Exemples de requêtes cliquables
│   ├── ResultCard.tsx    # Carte d'un document (rang, score, barre, badge)
│   └── ResultList.tsx    # Liste des résultats + chargement + état vide
├── lib/
│   └── api.ts            # searchDocuments(q, k) + types TypeScript
├── .env.local.example    # Modèle de configuration
└── README.md
```

### Séparation frontend / backend

- **Aucune logique métier** dans le frontend : la transformation de la requête
  en *embedding* et le calcul de la **similarité cosinus** sont réalisés par le
  backend FastAPI.
- Le frontend appelle un unique endpoint : `GET /search?q=<texte>&k=<nombre>`.
- Réponse attendue :

  ```json
  [
    { "texte": "La voiture électrique ...", "score": 0.642 }
  ]
  ```

  `score` est une similarité cosinus entre `0` et `1` (plus haut = plus
  pertinent).

### Flux de données

1. L'utilisateur saisit une requête et clique sur **Rechercher** (ou appuie sur
   **Entrée**). Les exemples lancent directement la recherche.
2. `lib/api.ts` envoie la requête HTTP au backend via le `fetch` natif.
3. `app/page.tsx` gère les états : chargement, résultats, aucun résultat,
   requête trop courte (< 2 caractères) et erreur réseau.
4. `ResultList` / `ResultCard` affichent les cartes (rang, texte, score en
   pourcentage, barre de progression et badge de couleur).

### Technologies

- **Next.js 16** (App Router) + **TypeScript** strict
- **Tailwind CSS v4**
- `fetch` natif uniquement — aucune autre bibliothèque (pas d'axios, pas de UI kit)

## Fonctionnalités

- Barre de recherche avec validation par **Entrée** et bouton **Rechercher**.
- Sélecteur du nombre de résultats : **3, 5 ou 10**.
- Exemples de requêtes cliquables qui lancent la recherche.
- Cartes de résultats : texte, rang (`#1`, `#2`…), score en pourcentage et
  barre de progression.
- Badge de couleur selon le score : **vert** (élevé), **orange** (moyen),
  **gris** (faible).
- Temps de réponse affiché en millisecondes.
- Gestion propre des états : **chargement** (squelettes), **aucun résultat**,
  **erreur réseau**, **requête trop courte**.
- Annulation des requêtes précédentes (`AbortController`) pour éviter les
  résultats périmés.
- Design responsive et **mode sombre automatique** selon le système.

## Scripts disponibles

| Script          | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Démarre le serveur de développement          |
| `npm run build` | Compile l'application pour la production     |
| `npm start`     | Démarre l'application compilée               |
| `npm run lint`  | Vérifie le code avec ESLint                  |

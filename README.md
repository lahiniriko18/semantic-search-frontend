# Moteur de recherche sémantique : Frontend

Interface web **Next.js** d'un moteur de recherche sémantique en français, réalisée pour un projet scolaire sur les **embeddings**.

L'utilisateur tape une recherche en langage naturel (ex. « automobile propre ») et l'interface affiche les documents les plus proches par le **sens**, avec leur score de pertinence.

> Ce dépôt contient uniquement le frontend. Toute la logique (embeddings, recherche) est dans le backend FastAPI : _(lien du dépôt backend)_

## Fonctionnalités

- Barre de recherche (bouton ou touche Entrée)
- Choix du nombre de résultats (3, 5 ou 10)
- Exemples de requêtes cliquables
- Résultats sous forme de cartes avec rang, texte, score en pourcentage et barre de progression
- Badge de couleur selon le score (vert, orange, gris)
- Temps de réponse affiché en millisecondes
- États gérés : chargement, aucun résultat, erreur réseau, requête trop courte
- Design responsive, mode sombre automatique

## Architecture

```
Frontend Next.js ──HTTP (fetch)──▶ Backend FastAPI
  localhost:3000                    localhost:8000
```

Le frontend appelle uniquement l'endpoint `GET /search?q=...&k=...` du backend. Il n'effectue aucun calcul d'IA.

## Structure du projet

```
.
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── SearchBar.tsx
│   ├── ResultCard.tsx
│   ├── ResultList.tsx
│   └── ExampleQueries.tsx
├── lib/
│   └── api.ts              # appel à l'API + types TypeScript
├── .env.local.example
└── README.md
```

## Prérequis

- Node.js 18 ou plus récent et npm
- Le **backend FastAPI lancé** (voir le README du dépôt backend)

## Installation

```bash
npm install
```

### Configurer l'URL du backend

Copiez le fichier d'exemple :

```bash
cp .env.local.example .env.local
```

Contenu de `.env.local` :

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Modifiez cette URL si le backend tourne ailleurs (autre port, autre machine, serveur déployé).

## Lancer le projet

### 1. Démarrer le backend

Dans le dépôt backend :

```bash
source ~/venvs/semantic-search/bin/activate
uvicorn main:app --reload
```

### 2. Démarrer le frontend

```bash
npm run dev
```

Ouvrez http://localhost:3000.

## Version de production

```bash
npm run build
npm start
```

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Compilation de production |
| `npm start` | Lance la version compilée |
| `npm run lint` | Vérifie le code |

## Exemples de requêtes à tester

- automobile propre
- comment faire une pâte à pizza
- protéger la planète
- animal de compagnie qui miaule
- apprendre à une machine
- pays de l'océan Indien avec des lémuriens

## Problèmes fréquents

| Problème | Solution |
|---|---|
| « Le serveur est injoignable » | Le backend n'est pas lancé, ou `NEXT_PUBLIC_API_URL` est incorrecte. |
| Erreur CORS dans la console du navigateur | Le backend doit autoriser `http://localhost:3000` dans son middleware CORS. |
| L'URL de l'API ne change pas après modification de `.env.local` | Redémarrez `npm run dev` : les variables d'environnement sont lues au démarrage. |
| Aucun résultat | Vérifiez que l'index a bien été construit côté backend (`python build_index.py`). |

## Technologies

Next.js (App Router), TypeScript, Tailwind CSS, `fetch` natif.

## Auteurs

Projet réalisé par : _(noms de l'équipe)_
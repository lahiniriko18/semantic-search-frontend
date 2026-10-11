/**
 * Couche d'accès à l'API du backend FastAPI.
 *
 * Le frontend ne contient AUCUNE logique métier : le calcul des embeddings et
 * de la similarité cosinus reste entièrement dans le backend. Ce module se
 * contente d'envoyer une requête HTTP et de typer la réponse.
 */

/** Document renvoyé par le moteur de recherche sémantique. */
export type SearchResult = {
  /** Contenu textuel du document. */
  texte: string;
  /** Similarité cosinus entre 0 et 1 (plus c'est haut, plus c'est pertinent). */
  score: number;
};

/**
 * URL de base du backend.
 * Lue depuis la variable d'environnement `NEXT_PUBLIC_API_URL`
 * (voir `.env.local`). Une valeur par défaut est fournie pour le développement.
 */
export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

/** Longueur minimale acceptée par l'API pour la requête `q`. */
export const MIN_QUERY_LENGTH = 2;

/** Nombre de résultats proposés par le sélecteur. */
export const RESULT_COUNT_OPTIONS = [3, 5, 10] as const;

/** Erreur personnalisée pour distinguer les erreurs HTTP des erreurs réseau. */
export class ApiError extends Error {
  /** Code HTTP renvoyé par le serveur (si disponible). */
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Interroge le backend : `GET /search?q=...&k=...`.
 *
 * @param q      Requête en langage naturel (2 caractères minimum).
 * @param k      Nombre de résultats souhaités.
 * @param signal Signal d'annulation permettant d'ignorer une requête périmée.
 * @returns La liste des documents les plus proches par le sens.
 * @throws {ApiError} Si le serveur répond avec un code d'erreur ou une réponse invalide.
 */
export async function searchDocuments(
  q: string,
  k: number,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  const url = new URL("/search", API_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("k", String(k));

  // `fetch` natif uniquement : aucune dépendance externe (pas d'axios).
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new ApiError(
      `Le serveur a répondu avec le code HTTP ${response.status}.`,
      response.status,
    );
  }

  const data: unknown = await response.json();

  // Vérification minimale de la forme de la réponse.
  if (!Array.isArray(data)) {
    throw new ApiError("Réponse invalide du serveur (tableau attendu).");
  }

  return data as SearchResult[];
}

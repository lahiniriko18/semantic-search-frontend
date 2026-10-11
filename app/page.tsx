"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ExampleQueries from "@/components/ExampleQueries";
import ResultList from "@/components/ResultList";
import SearchBar from "@/components/SearchBar";
import {
  API_URL,
  MIN_QUERY_LENGTH,
  searchDocuments,
  type SearchResult,
} from "@/lib/api";

/**
 * États possibles de la page.
 * - idle    : aucune recherche lancée
 * - loading : requête en cours
 * - success : résultats trouvés
 * - empty   : recherche terminée sans résultat
 * - invalid : requête trop courte (validation locale)
 * - error   : backend injoignable ou erreur HTTP
 */
type SearchStatus =
  | "idle"
  | "loading"
  | "success"
  | "empty"
  | "invalid"
  | "error";

/** Détecte une annulation de requête (AbortController). */
function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [resultCount, setResultCount] = useState(5);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [duration, setDuration] = useState<number | null>(null);
  /** Dernière requête réellement envoyée (sert à relancer si k change). */
  const [submittedQuery, setSubmittedQuery] = useState("");

  /** Référence vers la requête en cours, pour pouvoir l'annuler. */
  const abortRef = useRef<AbortController | null>(null);

  // Annule la requête en cours si le composant est démonté.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  /**
   * Lance une recherche : valide la requête, annule la précédente,
   * appelle l'API et met à jour l'état de la page.
   */
  const runSearch = useCallback(async (rawQuery: string, k: number) => {
    const trimmed = rawQuery.trim();

    // Validation locale : évite d'envoyer une requête qui renverrait un 422.
    if (trimmed.length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      setStatus("invalid");
      setResults([]);
      setDuration(null);
      return;
    }

    // Annule la requête précédente pour éviter les résultats périmés.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setDuration(null);
    setSubmittedQuery(trimmed);

    const startedAt = performance.now();

    try {
      const data = await searchDocuments(trimmed, k, controller.signal);

      // La requête a été annulée entre-temps : on ignore la réponse.
      if (controller.signal.aborted) return;

      setResults(data);
      setDuration(Math.round(performance.now() - startedAt));
      setStatus(data.length > 0 ? "success" : "empty");
    } catch (error) {
      if (isAbortError(error)) return; // requête annulée volontairement
      setResults([]);
      setDuration(null);
      setStatus("error");
    }
  }, []);

  // Soumission depuis la barre de recherche.
  const handleSubmit = useCallback(() => {
    void runSearch(query, resultCount);
  }, [query, resultCount, runSearch]);

  // Clic sur un exemple : remplit la barre puis lance la recherche.
  const handleExampleSelect = useCallback(
    (example: string) => {
      setQuery(example);
      void runSearch(example, resultCount);
    },
    [resultCount, runSearch],
  );

  // Changement du nombre de résultats : relance si une recherche est active.
  const handleResultCountChange = useCallback(
    (count: number) => {
      setResultCount(count);
      if (submittedQuery.length >= MIN_QUERY_LENGTH) {
        void runSearch(submittedQuery, count);
      }
    },
    [submittedQuery, runSearch],
  );

  const isLoading = status === "loading";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:py-16">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          Recherche sémantique
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-slate-600 dark:text-slate-400">
          Posez votre question en langage naturel : le moteur compare le sens de
          votre requête et renvoie les documents les plus proches.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          resultCount={resultCount}
          onResultCountChange={handleResultCountChange}
          isLoading={isLoading}
        />
        <ExampleQueries onSelect={handleExampleSelect} disabled={isLoading} />
      </div>

      <section className="mt-8" aria-live="polite">
        {status === "invalid" && (
          <Message
            tone="warning"
            title="Requête trop courte"
            detail={`Saisissez au moins ${MIN_QUERY_LENGTH} caractères pour lancer une recherche.`}
          />
        )}

        {status === "error" && (
          <Message
            tone="error"
            title="Le serveur est injoignable, vérifiez que le backend tourne"
            detail={`Impossible de contacter l'API à l'adresse ${API_URL}.`}
          />
        )}

        {(status === "loading" ||
          status === "success" ||
          status === "empty") && (
          <>
            {!isLoading && duration !== null && (
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                {results.length} résultat{results.length > 1 ? "s" : ""} en{" "}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {duration} ms
                </span>
              </p>
            )}
            <ResultList results={results} isLoading={isLoading} />
          </>
        )}
      </section>

      <footer className="mt-auto pt-10 text-center text-xs text-slate-400 dark:text-slate-600">
        Backend : {API_URL}
      </footer>
    </div>
  );
}

type MessageProps = {
  tone: "warning" | "error";
  title: string;
  detail?: string;
};

/** Encadré de message (avertissement ou erreur). */
function Message({ tone, title, detail }: MessageProps) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
      : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`} role="alert">
      <p className="font-medium">{title}</p>
      {detail && <p className="mt-1 text-sm opacity-90">{detail}</p>}
    </div>
  );
}

"use client";

import type { FormEvent } from "react";
import { RESULT_COUNT_OPTIONS } from "@/lib/api";

type SearchBarProps = {
  /** Texte courant de la barre de recherche (état contrôlé par le parent). */
  value: string;
  /** Appelé à chaque frappe. */
  onChange: (value: string) => void;
  /** Appelé à la soumission (clic sur le bouton ou touche Entrée). */
  onSubmit: () => void;
  /** Nombre de résultats sélectionné. */
  resultCount: number;
  /** Appelé quand l'utilisateur change le nombre de résultats. */
  onResultCountChange: (count: number) => void;
  /** Désactive les contrôles pendant une recherche. */
  isLoading: boolean;
};

/**
 * Barre de recherche contrôlée.
 * La touche Entrée dans le champ déclenche naturellement le `onSubmit`
 * du formulaire, tout comme le bouton « Rechercher ».
 */
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  resultCount,
  onResultCountChange,
  isLoading,
}: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <div className="relative flex-1">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <SearchIcon />
        </span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ex. : automobile propre"
          aria-label="Requête de recherche"
          autoComplete="off"
          autoFocus
          className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
        />
      </div>

      <label className="sr-only" htmlFor="result-count">
        Nombre de résultats
      </label>
      <select
        id="result-count"
        value={resultCount}
        onChange={(event) => onResultCountChange(Number(event.target.value))}
        disabled={isLoading}
        className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        {RESULT_COUNT_OPTIONS.map((count) => (
          <option key={count} value={count}>
            {count} résultats
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Spinner />
            Recherche…
          </>
        ) : (
          "Rechercher"
        )}
      </button>
    </form>
  );
}

/** Petite icône loupe intégrée (pas de librairie d'icônes). */
function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/** Indicateur de chargement affiché dans le bouton. */
function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
      />
    </svg>
  );
}

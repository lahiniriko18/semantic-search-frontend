"use client";

type ExampleQueriesProps = {
  /** Appelé quand l'utilisateur clique sur un exemple : lance la recherche. */
  onSelect: (query: string) => void;
  /** Désactive les exemples pendant une recherche. */
  disabled: boolean;
};

/** Exemples de requêtes proposés pour découvrir le moteur de recherche. */
const EXAMPLES = [
  "automobile propre",
  "comment faire une pâte à pizza",
  "protéger la planète",
  "animal de compagnie qui miaule",
];

export default function ExampleQueries({
  onSelect,
  disabled,
}: ExampleQueriesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        Essayez :
      </span>
      {EXAMPLES.map((example) => (
        <button
          key={example}
          type="button"
          onClick={() => onSelect(example)}
          disabled={disabled}
          className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-indigo-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
        >
          {example}
        </button>
      ))}
    </div>
  );
}

import type { SearchResult } from "@/lib/api";
import ResultCard from "@/components/ResultCard";

type ResultListProps = {
  /** Documents à afficher. */
  results: SearchResult[];
  /** Vrai pendant le chargement : affiche des squelettes. */
  isLoading: boolean;
};

/** Nombre de cartes « squelette » affichées pendant le chargement. */
const SKELETON_COUNT = 3;

/** Liste des résultats, avec état de chargement et état vide. */
export default function ResultList({ results, isLoading }: ResultListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <ResultSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center dark:border-slate-700 dark:bg-slate-800/40">
        <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
          Aucun résultat trouvé
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Essayez une autre formulation ou un thème différent.
        </p>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-4">
      {results.map((result, index) => (
        <li key={`${index}-${result.texte.slice(0, 24)}`}>
          <ResultCard result={result} rank={index + 1} />
        </li>
      ))}
    </ol>
  );
}

/** Carte factice affichée pendant le chargement. */
function ResultSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

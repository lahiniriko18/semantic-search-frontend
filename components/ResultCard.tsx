import type { SearchResult } from "@/lib/api";

type ResultCardProps = {
  /** Document à afficher. */
  result: SearchResult;
  /** Rang du résultat (1 = plus pertinent). */
  rank: number;
};

/** Seuils de couleur pour l'interprétation du score de similarité. */
const SCORE_HIGH = 0.6;
const SCORE_MEDIUM = 0.4;

type ScoreTone = {
  /** Libellé affiché dans le badge. */
  label: string;
  /** Classes du badge de couleur. */
  badgeClass: string;
  /** Classes de la barre de progression. */
  barClass: string;
};

/** Détermine la couleur du badge et de la barre selon le score. */
function getScoreTone(score: number): ScoreTone {
  if (score >= SCORE_HIGH) {
    return {
      label: "Pertinence élevée",
      badgeClass:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      barClass: "bg-emerald-500",
    };
  }
  if (score >= SCORE_MEDIUM) {
    return {
      label: "Pertinence moyenne",
      badgeClass:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      barClass: "bg-amber-500",
    };
  }
  return {
    label: "Pertinence faible",
    badgeClass:
      "bg-slate-200 text-slate-600 dark:bg-slate-600/30 dark:text-slate-300",
    barClass: "bg-slate-400 dark:bg-slate-500",
  };
}

/** Carte présentant un document, son rang et son score. */
export default function ResultCard({ result, rank }: ResultCardProps) {
  const percent = Math.round(result.score * 100);
  const tone = getScoreTone(result.score);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-indigo-600 px-2 text-sm font-semibold text-white">
          #{rank}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${tone.badgeClass}`}
        >
          {tone.label} · {percent}%
        </span>
      </div>

      <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">
        {result.texte}
      </p>

      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Score de similarité : ${percent}%`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${tone.barClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </article>
  );
}

import Link from "next/link";
import { CLUSTERS, type ClusterKey } from "@/lib/cluster-registry";

/**
 * Horizontal pill nav that appears at the top of /guias and every
 * cluster hub page. Lets the reader jump between the master guide
 * archive and the cluster-filtered views.
 *
 * Driven by the cluster registry — adding a new cluster automatically
 * shows up here without code edits.
 */

type Props = {
  /** Active cluster key for highlight. `null` = master /guias view. */
  active: ClusterKey | null;
};

const PILL_ORDER: ClusterKey[] = [
  "seguros",
  "hipotecas",
  "credito",
  "remesas",
  "fiscal",
  "prestamos",
];

export function ClusterFilterNav({ active }: Props): React.ReactElement {
  return (
    <nav className="us-cluster-nav" aria-label="Filtrar guías por tema">
      <Link
        href="/guias"
        className={`us-cluster-pill${active === null ? " is-active" : ""}`}
      >
        Todas
      </Link>
      {PILL_ORDER.map((key) => {
        const def = CLUSTERS[key];
        if (!def) return null;
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={def.path}
            className={`us-cluster-pill${isActive ? " is-active" : ""}`}
          >
            {def.label}
          </Link>
        );
      })}
    </nav>
  );
}

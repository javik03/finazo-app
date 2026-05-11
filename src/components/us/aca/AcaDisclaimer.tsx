/**
 * Mandatory disclaimer block for every page in the /aseguranza-salud pillar.
 * Spec §8.6.3 — required at top (above the fold) AND at the bottom.
 *
 * The disclaimer is non-negotiable because (a) ACA eligibility rules change
 * year over year and with court rulings, (b) we don't want immigrants reading
 * a Finazo article and then making a wrong eligibility claim on
 * Healthcare.gov, and (c) it's the publisher's protection against
 * unauthorized-practice-of-law claims when discussing immigration status.
 */
export function AcaDisclaimer({
  position,
}: {
  position: "top" | "bottom";
}): React.ReactElement {
  return (
    <div
      role="note"
      className="us-aca-disclaimer"
      data-position={position}
    >
      <strong>Aclaración:</strong> Esto no es asesoría legal ni médica. Las
      reglas de elegibilidad para ACA cambian — confirmá tu situación
      específica en{" "}
      <a
        href="https://www.healthcare.gov"
        target="_blank"
        rel="noopener noreferrer"
      >
        Healthcare.gov
      </a>{" "}
      (la herramienta oficial de elegibilidad) o hablá gratis con un navegador
      certificado en{" "}
      <a
        href="https://www.healthcare.gov/find-assistance/"
        target="_blank"
        rel="noopener noreferrer"
      >
        healthcare.gov/find-assistance
      </a>
      . Si tu situación migratoria es complicada, un navegador certificado
      conoce las reglas actuales.
    </div>
  );
}

import { FINAZO_WA_URL } from "@/lib/wa";

type FloatingWAProps = {
  href?: string;
  ariaLabel?: string;
};

export function FloatingWA({
  href = FINAZO_WA_URL,
  ariaLabel = "Pregúntale a Finazo por WhatsApp",
}: FloatingWAProps): React.ReactElement {
  return (
    <a href={href} className="us-float-wa" aria-label={ariaLabel}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.46 0 .1 5.36.1 11.94a11.9 11.9 0 001.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 00-3.47-8.41z" />
      </svg>
    </a>
  );
}

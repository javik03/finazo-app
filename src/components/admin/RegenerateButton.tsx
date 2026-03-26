"use client";

import { useFormStatus } from "react-dom";

export function RegenerateButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {pending ? "Regenerando..." : "Regenerar"}
    </button>
  );
}

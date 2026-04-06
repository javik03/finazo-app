"use client";

import { useState, useEffect } from "react";

type Comment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export function CommentSection({ articleSlug }: { articleSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch(`/api/comments?articleSlug=${encodeURIComponent(articleSlug)}`)
      .then((res) => (res.ok ? (res.json() as Promise<{ comments: Comment[] }>) : null))
      .then((data) => { if (data) setComments(data.comments); })
      .catch(() => { /* silently ignore — comments are non-critical */ });
  }, [articleSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleSlug, authorName: name, authorEmail: email, content }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setContent("");
      } else {
        const data = await res.json() as { error?: string };
        setErrorMsg(data.error ?? "Error al enviar comentario");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Error de conexión. Intenta de nuevo.");
      setStatus("error");
    }
  }

  return (
    <section className="mt-12 border-t border-slate-100 pt-10">
      <h2 className="mb-6 text-xl font-bold text-slate-900">Comentarios</h2>

      {/* Approved comments */}
      {comments.length > 0 && (
        <div className="mb-8 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-100 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-semibold text-slate-800 text-sm">{c.authorName}</span>
                <span className="text-xs text-slate-400">
                  {new Date(c.createdAt).toLocaleDateString("es-SV", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      {status === "success" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Tu comentario fue enviado y será publicado tras revisión. ¡Gracias!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email <span className="text-slate-400">(opcional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={200}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Comentario <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={5}
              maxLength={2000}
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none resize-none"
              placeholder="¿Tienes alguna pregunta o experiencia que compartir?"
            />
            <p className="mt-1 text-xs text-slate-400">{content.length}/2000</p>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {status === "submitting" ? "Enviando..." : "Enviar comentario"}
          </button>
          <p className="text-xs text-slate-400">
            Los comentarios son revisados antes de publicarse.
          </p>
        </form>
      )}
    </section>
  );
}

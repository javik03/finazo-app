"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

type Article = {
  slug: string;
  title: string;
  metaDescription: string | null;
  category: string | null;
  publishedAt: Date | null;
  featuredImageUrl: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  tarjetas: "Tarjetas",
  seguros: "Seguros",
  finanzas: "Finanzas",
};

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const categoryLabel = article.category ? (CATEGORY_LABELS[article.category] ?? article.category) : null;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
    >
      <Link
        href={`/guias/${article.slug}`}
        className="group block overflow-hidden rounded-2xl"
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          textDecoration: "none",
        }}
      >
        {/* Hero image */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "16/9", background: "var(--green-bg)" }}
        >
          {article.featuredImageUrl ? (
            <Image
              src={article.featuredImageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ background: "var(--green-bg)" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 32, height: 32, color: "var(--green)", opacity: 0.4 }}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
          )}
          {/* Category badge overlay */}
          {categoryLabel && (
            <span
              className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: "var(--green)", color: "#fff" }}
            >
              {categoryLabel}
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="p-4">
          <h3
            className="mb-1.5 font-semibold leading-snug transition-colors group-hover:underline"
            style={{ color: "#111", fontSize: "var(--text-sm)" }}
          >
            {article.title}
          </h3>
          {article.metaDescription && (
            <p
              className="line-clamp-2 text-xs leading-relaxed"
              style={{ color: "#666" }}
            >
              {article.metaDescription}
            </p>
          )}
          <p
            className="mt-3 text-xs font-semibold"
            style={{ color: "var(--green)" }}
          >
            Leer guía →
          </p>
        </div>
      </Link>
    </div>
  );
}

export function ArticlesScroll({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      className="px-6 py-16"
      style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              className="mb-1 font-bold"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "var(--text-2xl)",
                color: "#111",
              }}
            >
              Guías y artículos
            </h2>
            <p className="text-sm" style={{ color: "#888" }}>
              Todo lo que necesitas saber para tomar mejores decisiones financieras.
            </p>
          </div>
          <Link
            href="/guias"
            className="shrink-0 text-sm font-medium transition-colors"
            style={{ color: "var(--green)" }}
          >
            Ver todos →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

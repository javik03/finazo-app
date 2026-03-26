"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ArticleMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:bg-slate-100 prose-td:border prose-td:border-slate-200 prose-th:border prose-th:border-slate-200 prose-td:px-3 prose-td:py-2 prose-th:px-3 prose-th:py-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

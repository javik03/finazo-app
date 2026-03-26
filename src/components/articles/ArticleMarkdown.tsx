"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  // Blockquote → "Lo esencial" key-findings callout (NerdWallet-style highlight box)
  blockquote: ({ children }) => (
    <div className="not-prose my-6 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
        Lo esencial
      </p>
      <div className="space-y-1.5 text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  ),

  // Table → scrollable container + dark header (NerdWallet comparison-table style)
  table: ({ children }) => (
    <div className="not-prose my-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-800 text-white">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
      {children}
    </th>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors even:bg-slate-50 hover:bg-emerald-50/40">{children}</tr>
  ),
  td: ({ children }) => (
    <td className="px-5 py-3.5 text-slate-700">{children}</td>
  ),

  // Links → emerald color, opens internal links in same tab
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-emerald-700 no-underline hover:underline"
      {...(href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  ),
};

export function ArticleMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h2:mt-10 prose-h2:text-xl prose-h3:mt-6 prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-strong:text-slate-900 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:text-slate-800 prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

import { markdownToHtml } from "@/lib/markdown";

export async function ArticleMarkdown({ content }: { content: string }) {
  const html = await markdownToHtml(content);

  return (
    <div
      className="prose prose-slate max-w-none
        prose-headings:font-bold prose-headings:text-slate-900
        prose-h2:mt-10 prose-h2:text-xl
        prose-h3:mt-6 prose-h3:text-lg
        prose-p:text-slate-700 prose-p:leading-relaxed
        prose-li:text-slate-700
        prose-strong:text-slate-900 prose-strong:font-semibold
        prose-a:font-medium prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline
        prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5
        prose-code:text-sm prose-code:font-normal prose-code:text-slate-800
        prose-code:before:content-none prose-code:after:content-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

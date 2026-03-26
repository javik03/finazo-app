import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// Allow class attribute so our post-processing injected classes survive sanitization
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "class"],
  },
};

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(markdown);

  let html = result.toString();

  // Blockquote → "Lo esencial" callout box
  html = html.replace(
    /<blockquote>([\s\S]*?)<\/blockquote>/g,
    `<div class="not-prose my-6 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-5"><p class="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">Lo esencial</p><div class="space-y-1.5 text-sm leading-relaxed text-slate-700">$1</div></div>`,
  );

  // Table → scrollable container + dark header
  html = html.replace(
    /<table>([\s\S]*?)<\/table>/g,
    `<div class="not-prose my-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm"><table class="min-w-full divide-y divide-slate-200 text-sm">$1</table></div>`,
  );
  html = html.replace(/<thead>/g, '<thead class="bg-slate-800 text-white">');
  html = html.replace(
    /<th>/g,
    '<th class="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">',
  );
  html = html.replace(/<tbody>/g, '<tbody class="divide-y divide-slate-100 bg-white">');
  html = html.replace(
    /<tr>/g,
    '<tr class="transition-colors even:bg-slate-50 hover:bg-emerald-50/40">',
  );
  html = html.replace(/<td>/g, '<td class="px-5 py-3.5 text-slate-700">');

  // External links → open in new tab
  html = html.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="font-medium text-emerald-700 no-underline hover:underline"',
  );
  // Internal links
  html = html.replace(
    /<a href="(\/[^"]+)"/g,
    '<a href="$1" class="font-medium text-emerald-700 no-underline hover:underline"',
  );

  return html;
}

import { markdownToHtml } from "@/lib/markdown";

/**
 * Renders Markdown content with .us-prose typography (Fraunces headings,
 * Inter body, green links, blockquote in green wash).
 */
export async function ArticleProse({
  content,
}: {
  content: string;
}): Promise<React.ReactElement> {
  const html = await markdownToHtml(content);
  return (
    <div
      className="us-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

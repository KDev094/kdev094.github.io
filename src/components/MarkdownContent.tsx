/** HTML is produced by the build-time Markdown pipeline, never loaded in-browser. */
export function MarkdownContent({ html }: { html: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

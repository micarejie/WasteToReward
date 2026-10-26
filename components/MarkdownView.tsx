import type { ReactNode } from "react";
import { parseMarkdown, type Inline } from "@/lib/markdown";

export function MarkdownView({ source }: { source: string }) {
  const blocks = parseMarkdown(source);
  return (
    <div className="prose-portfolio text-foreground">
      {blocks.map((block, index) => {
        if (block.type === "h2") return <h2 key={index}>{renderInline(block.inlines)}</h2>;
        if (block.type === "h3") return <h3 key={index}>{renderInline(block.inlines)}</h3>;
        if (block.type === "quote") return <blockquote key={index}>{renderInline(block.inlines)}</blockquote>;
        if (block.type === "code") {
          return (
            <pre key={index}>
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const Tag = block.type === "ul" ? "ul" : "ol";
          return (
            <Tag key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </Tag>
          );
        }
        if (block.type === "p") return <p key={index}>{renderInline(block.inlines)}</p>;
        return null;
      })}
    </div>
  );
}

function renderInline(inlines: Inline[]): ReactNode[] {
  return inlines.map((inline, index) => {
    if (inline.type === "strong") return <strong key={index}>{inline.text}</strong>;
    if (inline.type === "em") return <em key={index}>{inline.text}</em>;
    if (inline.type === "code") return <code key={index}>{inline.text}</code>;
    if (inline.type === "link") {
      return (
        <a key={index} href={inline.href} target={inline.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {inline.text}
        </a>
      );
    }
    return <span key={index}>{inline.text}</span>;
  });
}

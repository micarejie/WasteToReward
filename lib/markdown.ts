export type Inline =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "em"; text: string }
  | { type: "code"; text: string }
  | { type: "link"; text: string; href: string };

export type Block =
  | { type: "h2" | "h3"; inlines: Inline[] }
  | { type: "p"; inlines: Inline[] }
  | { type: "ul" | "ol"; items: Inline[][] }
  | { type: "quote"; inlines: Inline[] }
  | { type: "code"; text: string };

const inlinePattern =
  /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\[[^\]]+\]\(mailto:[^\s)]+\))/g;

export function parseInline(source: string): Inline[] {
  const parts: Inline[] = [];
  let last = 0;
  for (const match of source.matchAll(inlinePattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ type: "text", text: source.slice(last, index) });
    const token = match[0];
    if (token.startsWith("**")) parts.push({ type: "strong", text: token.slice(2, -2) });
    else if (token.startsWith("`")) parts.push({ type: "code", text: token.slice(1, -1) });
    else if (token.startsWith("*")) parts.push({ type: "em", text: token.slice(1, -1) });
    else {
      const linked = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linked) parts.push({ type: "link", text: linked[1], href: linked[2] });
    }
    last = index + token.length;
  }
  if (last < source.length) parts.push({ type: "text", text: source.slice(last) });
  return parts.length ? parts : [{ type: "text", text: source }];
}

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", inlines: parseInline(line.slice(4).trim()) });
      index += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", inlines: parseInline(line.slice(3).trim()) });
      index += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      blocks.push({ type: "quote", inlines: parseInline(line.slice(2).trim()) });
      index += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: Inline[][] = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(parseInline(lines[index].slice(2).trim()));
        index += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: Inline[][] = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index])) {
        items.push(parseInline(lines[index].replace(/^\d+\.\s/, "").trim()));
        index += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "p", inlines: parseInline(paragraph.join(" ")) });
  }

  return blocks;
}

function isBlockStart(line: string) {
  return (
    line.startsWith("## ") ||
    line.startsWith("### ") ||
    line.startsWith("- ") ||
    line.startsWith("> ") ||
    line.startsWith("```") ||
    /^\d+\.\s/.test(line)
  );
}

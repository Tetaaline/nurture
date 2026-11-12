import type { ResourceType } from "@generated/prisma/enums";

type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "response"; text: string; number: number }
  | { kind: "why"; text: string };

function parseBlocks(body: string, type: ResourceType): Block[] {
  const blocks: Block[] = [];
  for (const chunk of body.split(/\n\s*\n/)) {
    const text = chunk.trim();
    if (!text) continue;
    const lines = text.split("\n");
    if (lines.every((line) => line.startsWith("- "))) {
      blocks.push({ kind: "list", items: lines.map((line) => line.slice(2)) });
    } else if (type === "SCENARIO" && text.startsWith("Response: ")) {
      const number = blocks.filter((block) => block.kind === "response").length + 1;
      blocks.push({ kind: "response", text: text.slice("Response: ".length), number });
    } else if (type === "SCENARIO" && text.startsWith("Why: ")) {
      blocks.push({ kind: "why", text: text.slice("Why: ".length) });
    } else {
      blocks.push({ kind: "paragraph", text });
    }
  }
  return blocks;
}

export function ResourceBody({ body, type }: { body: string; type: ResourceType }) {
  const blocks = parseBlocks(body, type);
  const responseCount = blocks.filter((block) => block.kind === "response").length;

  return (
    <div className="flex flex-col gap-4 text-ink">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "list":
            return (
              <ul key={index} className="flex list-disc flex-col gap-1.5 pl-5">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "response":
            return (
              <div key={index} className="rounded-[10px] border border-border bg-surface p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  Option {block.number} of {responseCount}
                </p>
                <p className="mt-1">{block.text}</p>
              </div>
            );
          case "why":
            return (
              <div key={index} className="rounded-[10px] bg-accent-soft p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-accent">Why this works</p>
                <p className="mt-1">{block.text}</p>
              </div>
            );
          default:
            return <p key={index}>{block.text}</p>;
        }
      })}
    </div>
  );
}

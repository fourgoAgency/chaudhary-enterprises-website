import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import type { PolicySlug } from "@/lib/site";

// Policy pages are client-supplied Markdown in content/policies/<slug>.md with a small frontmatter block.

export type Policy = {
  title: string;
  effectiveDate: string;
  body: string;
};

export async function getPolicy(slug: PolicySlug): Promise<Policy> {
  "use cache";
  cacheLife("days");

  const file = await readFile(path.join(process.cwd(), "content", "policies", `${slug}.md`), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(file);
  if (!match) throw new Error(`${slug}.md is missing its frontmatter block`);

  const meta = Object.fromEntries(
    match[1].split(/\r?\n/).map((line) => {
      const [key, ...rest] = line.split(":");
      return [key.trim(), rest.join(":").trim().replace(/^"|"$/g, "")];
    }),
  );

  return { title: meta.title, effectiveDate: meta.effectiveDate, body: file.slice(match[0].length) };
}

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Heading text; the word(s) in `highlight` are shown in blue. */
  title: string;
  highlight?: string;
  intro?: string;
  /** Link or button aligned to the right on wide screens. */
  action?: React.ReactNode;
  /** "light" for white sections, "dark" for blue or black ones. */
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
};

/** Section heading with an optional highlighted word, e.g. "Shop by **Category**". */
export function SectionHeading({
  title,
  highlight,
  intro,
  action,
  tone = "light",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const at = highlight ? title.lastIndexOf(highlight) : -1;

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        <Tag className={cn("text-2xl sm:text-3xl", tone === "dark" && "text-white")}>
          {at < 0 || tone === "dark" ? (
            title
          ) : (
            <>
              {title.slice(0, at)}
              <span className="text-blue">{highlight}</span>
              {title.slice(at + highlight!.length)}
            </>
          )}
        </Tag>
        {intro && <p className={cn("mt-2", tone === "dark" ? "text-white" : "text-muted")}>{intro}</p>}
      </div>
      {action}
    </div>
  );
}

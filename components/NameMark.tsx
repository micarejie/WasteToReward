type NameMarkProps = {
  name: string;
  className?: string;
  size?: "hero" | "aside";
};

export function NameMark({ name, className = "", size = "hero" }: NameMarkProps) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? name;
  const rest = parts.slice(1).join(" ");

  return (
    <div
      className={`glow-frame flex w-full items-center justify-center overflow-hidden rounded-[2rem] bg-surface ${className}`}
      aria-label={name}
    >
      <div className="px-6 text-center">
        <p
          className={
            size === "hero"
              ? "text-gradient text-5xl font-bold tracking-tight sm:text-6xl"
              : "text-gradient text-4xl font-bold tracking-tight sm:text-5xl"
          }
        >
          {first}
        </p>
        {rest ? (
          <p
            className={
              size === "hero"
                ? "mt-2 text-3xl font-semibold tracking-tight text-heading sm:text-4xl"
                : "mt-2 text-2xl font-semibold tracking-tight text-heading sm:text-3xl"
            }
          >
            {rest}
          </p>
        ) : null}
      </div>
    </div>
  );
}

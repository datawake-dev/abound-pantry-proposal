/**
 * Placeholder used by page-skeleton stubs so every section has the correct
 * landmark + id + heading from Task 10c onward, while Tasks 14–24 flesh them
 * out. Section-level tests assert `section#<id>` presence against the final
 * component, not the stub — but the stub keeps the page renderable throughout
 * the build so landmark/a11y tests work at each phase.
 */
export default function NotReady({ name }: { name: string }) {
  return (
    <div
      data-stub="true"
      className="mx-auto max-w-[1200px] px-6 py-8 text-[var(--ink-muted)]"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
        {name} — placeholder
      </p>
      <p className="mt-2 text-sm">
        This section is scaffolded. Implementation ships in its dedicated phase
        task.
      </p>
    </div>
  );
}

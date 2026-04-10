export default function HesabimLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 h-8 w-40 animate-pulse rounded bg-slate-100" />
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
          ))}
        </aside>
        <section className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 h-6 w-36 animate-pulse rounded bg-slate-100" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
                </div>
              ))}
              <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

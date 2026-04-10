export default function HakkimizdaLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-4 h-9 w-48 animate-pulse rounded bg-slate-100" />
      <div className="mb-8 h-4 w-80 animate-pulse rounded bg-slate-100" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-slate-100" />
        ))}
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-5">
            <div className="mb-3 h-10 w-10 animate-pulse rounded-full bg-slate-100" />
            <div className="mb-2 h-5 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}

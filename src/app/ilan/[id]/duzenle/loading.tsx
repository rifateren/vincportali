export default function IlanDuzenleLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-2 h-8 w-44 animate-pulse rounded bg-slate-100" />
      <div className="mb-8 h-4 w-56 animate-pulse rounded bg-slate-100" />
      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
        ))}
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
          <div className="h-32 w-full animate-pulse rounded-lg bg-slate-100" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 w-24 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </main>
  );
}

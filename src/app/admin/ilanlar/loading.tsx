export default function AdminIlanlarLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-100" />
        <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="mb-4 flex gap-3">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-9 w-36 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex gap-4 border-b border-slate-100 px-5 py-3">
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-slate-100" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-slate-50 px-5 py-4">
            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-1/6 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-1/6 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-1/6 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}

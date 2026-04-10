export default function GizlilikPolitikasiLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 h-9 w-64 animate-pulse rounded bg-slate-100" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-slate-100" />
        ))}
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="mt-8 space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-slate-100" />
        ))}
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
      </div>
    </main>
  );
}

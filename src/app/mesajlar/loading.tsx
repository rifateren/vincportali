export default function MesajlarLoading() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-8">
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-slate-100" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
          />
        ))}
      </div>
    </main>
  );
}

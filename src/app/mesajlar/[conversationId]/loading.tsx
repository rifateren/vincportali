export default function KonusmalaLoading() {
  return (
    <main className="mx-auto flex h-[calc(100vh-120px)] max-w-3xl flex-col px-4 py-6">
      <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
        <div className="space-y-1">
          <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-hidden">
        {[false, true, false, false, true, false].map((isOwn, i) => (
          <div
            key={i}
            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`h-10 animate-pulse rounded-2xl bg-slate-100 ${
                isOwn ? "w-48" : "w-64"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </main>
  );
}

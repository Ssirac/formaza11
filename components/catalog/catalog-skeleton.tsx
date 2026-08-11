export function CatalogSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-line bg-surface"
        >
          <div className="aspect-[4/5] animate-pulse bg-surface-2" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
            <div className="flex gap-2">
              <div className="h-8 w-10 animate-pulse rounded-lg bg-surface-2" />
              <div className="h-8 w-10 animate-pulse rounded-lg bg-surface-2" />
              <div className="h-8 w-10 animate-pulse rounded-lg bg-surface-2" />
            </div>
            <div className="h-9 w-full animate-pulse rounded-full bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";

export default function CatalogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="h-4 w-20 animate-pulse rounded bg-surface-2" />
      <div className="mt-4 h-12 w-64 animate-pulse rounded bg-surface-2" />
      <div className="mt-8 flex gap-2 border-b border-line pb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 animate-pulse rounded-full bg-surface-2"
          />
        ))}
      </div>
      <div className="mt-10">
        <CatalogSkeleton />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("motion-safe:animate-pulse rounded-2xl bg-primary-soft", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface">
      <Skeleton className="h-44 rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton({ title = true }: { title?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-5 py-14 sm:px-6 lg:px-8">
      {title ? <Skeleton className="h-10 w-56" /> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

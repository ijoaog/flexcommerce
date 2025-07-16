import { Skeleton } from "@/components/ui/skeleton";

export function TabelaSkeleton() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-4 mb-2">
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-full rounded-md" />
      </div>

      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 mb-2">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

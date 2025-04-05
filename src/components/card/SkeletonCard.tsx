import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 w-[100%]">
      <Skeleton className="h-[30vh] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}

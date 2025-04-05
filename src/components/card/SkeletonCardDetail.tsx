import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCardDetail() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] md:w-[200px] sm:w-[220px] lg:w-[200px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] md:w-[200px] sm:w-[220px] lg:w-[200px] " />
        <Skeleton className="h-4 w-[200px] md:w-[200px] sm:w-[220px] lg:w-[200px] " />
      </div>
    </div>
  )
}

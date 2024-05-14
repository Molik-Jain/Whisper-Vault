import { Skeleton } from "@/components/ui/skeleton"

export function Loading() {
  return (
    <div className="flex h-screen m-auto p-auto flex-col space-y-3 justify-center items-center">
      <Skeleton className="h-[325px] w-[450px] rounded-xl" />
      <div className="space-y-2 flex flex-col items-center ">
        <Skeleton className="h-4 w-[350px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    </div>
  )
}
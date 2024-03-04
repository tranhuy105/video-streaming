import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export const VideoSkeleton = ({
  small,
}: {
  small: boolean;
}) => {
  return (
    <div className="w-full space-y-2 group h-fit flex items-center justify-center flex-col opacity-50">
      <Skeleton className="aspect-video w-full h-full" />
      <div className=" flex gap-3 items-start  w-full justify-start">
        <Skeleton
          className={cn(
            "rounded-full aspect-square w-12 h-12",
            small && "w-10 h-10"
          )}
        />
        <div
          className={cn(
            "font-sans flex flex-col space-y-[2px] w-full",
            small && "space-y-0"
          )}
        >
          <div className="flex flex-col items-start justify-center gap-2">
            <Skeleton className={cn("w-3/4 h-5")} />

            <Skeleton className={cn(" w-2/3 h-4")} />
          </div>
        </div>
      </div>
    </div>
  );
};

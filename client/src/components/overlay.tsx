import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";

export const Overlay = ({
  rounded,
}: {
  rounded?: boolean;
}) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 bottom-0 z-[9000] opacity-0 group-hover:opacity-50 bg-black transition-opacity duration-500 h-full w-full",
        rounded &&
          "rounded-full flex items-center justify-center group-hover:opacity-60"
      )}
    >
      {rounded && (
        <Edit className="text-neutral-50" size={32} />
      )}
    </div>
  );
};

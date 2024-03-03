import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="w-screen top-0 bottom-0 right-0 left-0 fixed h-screen bg-neutral-900 animate-pulse flex items-center justify-center z-[9000]">
      <Loader2
        className="animate-spin text-neutral-200/80"
        size={96}
      />
    </div>
  );
};

// @ts-ignore
import VideoThumbnail from "react-video-thumbnail";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const Thumbnail = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  const [imageBase64, setImageBase64] = useState("");
  return (
    <div className={cn("aspect-video", className)}>
      <div className="hidden w-0 h-0" aria-hidden>
        <VideoThumbnail
          videoUrl={src}
          snapshotAtTime={3}
          renderThumbnail={false}
          thumbnailHandler={(thumbnail: any) =>
            setImageBase64(thumbnail)
          }
        />
      </div>
      {imageBase64 ? (
        <img
          src={imageBase64}
          alt=""
          className="w-full h-full rounded-xl"
        />
      ) : (
        <div className="w-full h-full animate-pulse flex items-center justify-center bg-neutral-900">
          <Loader2 className="animate-spin text-neutral-200/80" />
        </div>
      )}
    </div>
  );
};

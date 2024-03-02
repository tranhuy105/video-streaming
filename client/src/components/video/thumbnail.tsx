// @ts-ignore
import VideoThumbnail from "react-video-thumbnail";
import { cn } from "@/lib/utils";

export const Thumbnail = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  return (
    <div className={cn("aspect-video", className)}>
      <VideoThumbnail videoUrl={src} snapshotAtTime={5} />
    </div>
  );
};

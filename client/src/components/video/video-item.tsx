import { useNavigate } from "react-router-dom";
import { VideoType } from "../video-cards";
import { Thumbnail } from "./thumbnail";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Overlay } from "../overlay";
import { vi } from "date-fns/locale";

const placeholder_img =
  "https://avatars.githubusercontent.com/u/136960770?v=4";

interface VideoItemProps {
  video: VideoType;
  small?: boolean;
}

export const VideoItem = ({
  video,
  small,
}: VideoItemProps) => {
  const navigate = useNavigate();
  const updatedAtLabel = formatDistanceToNow(
    video.updated_at,
    {
      addSuffix: true,
      locale: vi,
    }
  );

  return (
    <div
      className={cn(
        "w-full space-y-4 cursor-pointer group h-fit ",
        small && "space-y-2"
      )}
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <div className="relative">
        <Thumbnail
          src={video.src}
          className={cn(
            "w-full rounded-xl bg-neutral-800 p-[2px]"
          )}
        />
        <Overlay />
      </div>

      <div className=" flex gap-3 items-start">
        <img
          src={video.img ? video.img : placeholder_img}
          alt={video.title}
          className={cn(
            "rounded-full aspect-square w-12 h-12",
            small && "w-10 h-10"
          )}
        />
        <div
          className={cn(
            "font-sans flex flex-col space-y-[2px]",
            small && "space-y-0"
          )}
        >
          <p
            className={cn(
              "text-xl font-bold text-neutral-200 -mt-1 line-clamp-2",
              small && "text-lg -mt-[6px]"
            )}
          >
            {video.title}
          </p>
          <div className="flex flex-col ">
            <p
              className={cn(
                "text-neutral-200/60 text-sm",
                small && "text-sm -mt-1"
              )}
            >
              {video.name}
            </p>
            <p
              className={cn(
                "text-neutral-200/60 text-sm -mt-[3px]",
                small && "text-xs -mt-[1px]"
              )}
            >
              {updatedAtLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

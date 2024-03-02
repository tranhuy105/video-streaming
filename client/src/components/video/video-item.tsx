import { useNavigate } from "react-router-dom";
import { VideoType } from "../video-cards";
import { Thumbnail } from "./thumbnail";
import { formatDistanceToNow } from "date-fns";

const placeholder_img =
  "https://yt3.ggpht.com/ytc/AIdro_njJ7pfpxR9y1ocO6GXo6fvf0JEKOnRXX6WKtBXJw=s88-c-k-c0x00ffffff-no-rj";

interface VideoItemProps {
  video: VideoType;
}

export const VideoItem = ({ video }: VideoItemProps) => {
  const navigate = useNavigate();
  const updatedAtLabel = formatDistanceToNow(
    video.updated_at,
    {
      addSuffix: true,
    }
  );

  return (
    <div
      className="w-full space-y-4 cursor-pointer"
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <Thumbnail
        src={video.src}
        className="w-full rounded-xl bg-neutral-800 p-[2px]"
      />

      <div className=" flex gap-3 items-start ">
        <img
          src={video.img ? video.img : placeholder_img}
          alt={video.title}
          className="rounded-full aspect-square w-12 h-12"
        />
        <div className="font-sans flex flex-col space-y-[2px]">
          <p className="text-xl font-bold text-neutral-200 -mt-1">
            {video.title}
          </p>
          <div className="flex flex-col ">
            <p className="text-neutral-200/60 text-sm">
              {video.name}
            </p>
            <p className="text-neutral-200/60 text-sm -mt-[3px]">
              {updatedAtLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

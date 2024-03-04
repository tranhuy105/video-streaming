import { format } from "date-fns";
import { Thumbnail } from "../video/thumbnail";
import { StudioVideoTypes } from "./videos-table";
import { Edit } from "lucide-react";
import { DeleteVideoButton } from "./delete-video-button";

interface StudioVideoItemProps {
  studioVideo: StudioVideoTypes;
  handleDeleteVideo: any;
}

export const StudioVideoItem = ({
  studioVideo,
  handleDeleteVideo,
}: StudioVideoItemProps) => {
  const formattedDate = format(
    studioVideo.created_at,
    "dd 'thg' M, yyyy"
  );

  return (
    <div className="border-b-[1px] border-neutral-700/60 px-4 py-3 flex justify-between items-center bg-neutral-800">
      {/* FIRST 3 ITEMS */}
      <div className="flex gap-6 w-full flex-1">
        <div className="flex flex-col items-center justify-between py-2">
          <Edit
            className="w-5 h-5 cursor-pointer"
            strokeWidth={1}
          />
          <DeleteVideoButton
            filename={studioVideo.filename}
            handleDeleteVideo={handleDeleteVideo}
          />
        </div>
        <Thumbnail src={studioVideo.src} className="h-20" />
        <div className="w-full flex items-center ">
          <p className="font-bold text-lg w-full pl-6 italic line-clamp-1">
            {studioVideo.title}
          </p>
          <p className="text-xs text-neutral-200/50 w-full line-clamp-2 px-3 py-3">
            {studioVideo.description.slice(0, 20)}...
          </p>
        </div>
      </div>

      <div className="w-64 text-center">
        <p>{formattedDate}</p>
        <p className="text-sm text-neutral-200/50">
          Ngày tải lên
        </p>
      </div>
      <div className="w-24 text-neutral-100 text-center">
        {studioVideo.like_count * 1}
      </div>
      <div className="w-24 text-neutral-100 text-center">
        {studioVideo.cmt_count * 1}
      </div>
    </div>
  );
};

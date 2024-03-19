import { Checkbox } from "../ui/checkbox";
import { StudioVideoItem } from "./studio-video-item";

export type StudioVideoTypes = {
  like_count: number;
  cmt_count: number;
  title: string;
  id: string;
  src: string;
  description: string;
  created_at: Date;
  filename: string;
};

interface VideosTableProps {
  studioVideos: StudioVideoTypes[];
  handleDeleteVideo: any;
}

export const VideosTable = ({
  studioVideos,
  handleDeleteVideo,
}: VideosTableProps) => {
  return (
    <>
      <h1 className="text-neutral-100 font-semibold text-2xl m-6">
        Nội dung của kênh
      </h1>
      <div className="border-y-[1px] border-neutral-700/60 bg-neutral-800 px-4 py-3 flex justify-between items-center">
        {/* FIRST 3 ITEMS */}
        <div className="flex gap-6 w-full flex-1 items-center justify-center">
          <Checkbox
            className=" w-5 h-5 mt-8 opacity-0 pointer-events-none"
            aria-hidden
          />
          <div className="w-[200px]"></div>
          <div className="w-full flex items-center ">
            <p className=" text-sm text-neutral-100/50 w-full pl-6">
              Tiêu đề
            </p>
            <p className="text-sm text-neutral-200/50 w-full line-clamp-2 px-3 py-3 ">
              Mô tả
            </p>
          </div>
        </div>

        <p className="w-64 text-center text-sm text-neutral-200/50">
          Ngày
        </p>

        <div className="w-24 text-xs text-neutral-100/50 text-center">
          Số lượt like
        </div>
        <div className="w-24 text-xs text-neutral-100/50 text-center">
          Số lượt bình luận
        </div>
      </div>
      <div className="flex flex-col w-full h-full z-[9999] mb-12">
        {studioVideos.map(
          (studioVideo: StudioVideoTypes) => (
            <StudioVideoItem
              studioVideo={studioVideo}
              key={studioVideo.id}
              handleDeleteVideo={handleDeleteVideo}
            />
          )
        )}
      </div>
    </>
  );
};

import { VideoType } from "../video-cards";
import { VideoItem } from "../video/video-item";

type VideoInfoType = {
  description: string;
  id: string;
  owner_id: string;
  src: string;
  title: string;
  updated_at: Date;
};

export const ChannelVideos = ({
  videos,
  owner_name,
  owner_img,
}: {
  videos: VideoInfoType[] | null;
  owner_name: string;
  owner_img: string;
}) => {
  if (!videos) {
    return <div>no video</div>;
  }

  return (
    <>
      <div className="px-6 mb-7 mt-5 border-b-2 border-neutral-200/30">
        <div className="w-fit px-3 py-3 font-semibold text-md text-neutral-200/80 border-b cursor-pointer -mb-[1px]">
          Video
        </div>
      </div>
      <div className="w-full grid grid-cols-2 px-2 place-items-center gap-4">
        {videos.map((video: VideoInfoType) => (
          <div key={video.id} className="w-[95%]">
            <VideoItem
              video={{
                ...video,
                name: owner_name,
                img: owner_img,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

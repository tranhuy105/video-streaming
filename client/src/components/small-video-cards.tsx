import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { VideoItem } from "./video/video-item";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { VideoSkeleton } from "./video/video-skeletion";

export type VideoType = {
  id: string;
  src: string;
  title: string;
  updated_at: Date;
  name: string;
  img: string;
};

export const SmallVideoCards = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const { video_id } = useParams();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/video");
        setVideos(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [axiosPrivate]);

  return (
    <div
      className={cn(
        "text-white min-h-[calc(100vh-64px)]  grid grid-cols-1 w-full gap-x-3 gap-y-6 p-4 px-3 pr-8"
      )}
    >
      {!isLoading ? (
        videos?.map((video: VideoType) => {
          return (
            video_id !== video.id && (
              <VideoItem
                key={video.id}
                video={video}
                small
              />
            )
          );
        })
      ) : (
        <>
          <VideoSkeleton small />
          <VideoSkeleton small />
          <VideoSkeleton small />
        </>
      )}
    </div>
  );
};

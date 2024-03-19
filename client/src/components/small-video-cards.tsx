import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { VideoSkeleton } from "./video/video-skeletion";
import { Videos } from "./video/videos";
import { LoadVideos } from "./video/load-videos";
import { useParams } from "react-router-dom";

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
  const isFirstRender = useRef(true);

  const { video_id } = useParams();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/video", {
          params: {
            perPage: 4,
            rec: video_id,
          },
        });
        setVideos(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!isFirstRender.current) {
      fetchVideo();
    } else {
      isFirstRender.current = false;
    }
  }, [axiosPrivate, video_id]);

  return (
    <>
      {!isLoading ? (
        <>
          <div
            className={cn(
              "text-white grid grid-cols-1 w-full gap-x-3 gap-y-6 p-4 pr-8"
            )}
          >
            <Videos videos={videos} />
          </div>
          <LoadVideos small video_id={video_id} />
        </>
      ) : (
        <div
          className={cn(
            "text-white grid grid-cols-1 w-full gap-x-3 gap-y-6 p-4 pr-8"
          )}
        >
          <>
            <VideoSkeleton small={false} />
            <VideoSkeleton small={false} />
            <VideoSkeleton small={false} />
            <VideoSkeleton small={false} />
          </>
        </div>
      )}
    </>
  );
};

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { VideoSkeleton } from "./video/video-skeletion";

import { Videos } from "./video/videos";
import { LoadVideos } from "./video/load-videos";

export type VideoType = {
  id: string;
  src: string;
  title: string;
  updated_at: Date;
  name: string;
  img: string;
};

export const VideoCards = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [searchParams] = useSearchParams();

  const query = Object.fromEntries(searchParams);
  const filterQuery = query.filter;

  const searchQuery = query.search;

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/video", {
          params: {
            page: 1,
            filter: filterQuery,
            search: searchQuery,
          },
        });
        // console.log(response.data);
        setVideos(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [filterQuery, searchQuery, axiosPrivate]);

  return (
    <>
      {!isLoading ? (
        <>
          <div
            className={cn(
              "text-white grid grid-cols-3 w-full gap-x-3 gap-y-6 p-4 pr-8"
            )}
          >
            <Videos videos={videos} />
          </div>
          <LoadVideos
            filterQuery={filterQuery}
            searchQuery={searchQuery}
          />
        </>
      ) : (
        <div
          className={cn(
            "text-white grid grid-cols-3 w-full gap-x-3 gap-y-6 p-4 pr-8"
          )}
        >
          <>
            <VideoSkeleton small={false} />
            <VideoSkeleton small={false} />
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

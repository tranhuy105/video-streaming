import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { VideoItem } from "./video/video-item";
import {
  useParams,
  useSearchParams,
} from "react-router-dom";
import { cn } from "@/lib/utils";
import { Loading } from "./loading";

export type VideoType = {
  id: string;
  src: string;
  title: string;
  updated_at: Date;
  name: string;
  img: string;
};

export const VideoCards = ({
  small,
}: {
  small?: boolean;
}) => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [searchParams] = useSearchParams();
  const { video_id } = useParams();

  const query = Object.fromEntries(searchParams);
  const filterQuery = query.filter
    ? "?filter=" + query.filter + "&"
    : "?";
  const searchQuery = query.search
    ? "search=" + query.search
    : "";

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(
          "/video" + filterQuery + searchQuery
        );
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
    <div
      className={cn(
        "text-white min-h-[calc(100vh-64px)]  grid grid-cols-3 w-full gap-x-3 gap-y-6 p-4 pr-8",
        small && "grid-cols-1 px-3 "
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
        <Loading />
      )}
    </div>
  );
};

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { VideoItem } from "./video/video-item";

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

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/video");
        setVideos(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, []);

  return (
    <div className="text-white min-h-[calc(100vh-64px)]  grid grid-cols-3 w-full gap-x-3 gap-y-6 p-4 pr-8">
      {!isLoading ? (
        videos?.map((video: VideoType) => {
          return <VideoItem key={video.id} video={video} />;
        })
      ) : (
        <div>Loading..</div>
      )}
      {!isLoading ? (
        videos?.map((video: VideoType) => {
          return <VideoItem key={video.id} video={video} />;
        })
      ) : (
        <div>Loading..</div>
      )}
      {!isLoading ? (
        videos?.map((video: VideoType) => {
          return <VideoItem key={video.id} video={video} />;
        })
      ) : (
        <div>Loading..</div>
      )}
    </div>
  );
};

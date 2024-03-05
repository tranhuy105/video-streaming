import { useParams } from "react-router-dom";
import { VideoType } from "../video-cards";
import { VideoItem } from "./video-item";

interface VideosProps {
  videos: VideoType[];
}

export const Videos = ({ videos }: VideosProps) => {
  const { video_id } = useParams();

  return videos?.map((video: VideoType) => {
    return (
      video_id !== video.id && (
        <VideoItem key={video.id} video={video} small />
      )
    );
  });
};

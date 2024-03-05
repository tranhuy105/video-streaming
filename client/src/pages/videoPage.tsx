import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { UserInfo } from "@/components/video/user-info";
import { format, formatDistanceToNow } from "date-fns";
import { Loading } from "@/components/loading";
import { SmallVideoCards } from "@/components/small-video-cards";
import { Comments } from "@/components/comment/comments";

type VideoType = {
  id: string;
  owner_id: string;
  src: string;
  title: string;
  description: string;
  updated_at: Date;
  name: string;
  img: string;
  user_has_liked: boolean;
  user_has_sub: boolean;
};

const VideoPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const { video_id } = useParams();
  const [video, setVideo] = useState<VideoType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);
  const updatedAtLabel =
    video &&
    formatDistanceToNow(video.updated_at, {
      addSuffix: true,
    });

  const formattedDate =
    video && format(video.updated_at, "dd 'thg' M, yyyy");

  useEffect(() => {
    const fetchVideo = async () => {
      console.log("fetch video");
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(
          `/video/single/${video_id}`
        );
        // console.log(response.data);
        setVideo(response.data);
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
  }, [video_id, axiosPrivate]);

  if (isLoading)
    return (
      <div className="min-h-[calc(100vh-64px)]">
        <Loading />;
      </div>
    );

  if (!video_id || !video)
    return (
      <div className="min-h-[calc(100vh-64px)]">
        Video dont exist
      </div>
    );

  return (
    <div className="w-full min-h-screen text-white flex container">
      <div className="w-3/4">
        {/* VIDEO CONTAINER */}
        <div className="w-full">
          <video controls className="w-full" autoPlay loop>
            <source src={video.src} type="video/mp4" />
          </video>
          <UserInfo
            video_id={video.id}
            title={video.title}
            name={video.name}
            owner_id={video.owner_id}
            img={video.img}
            user_has_liked={video.user_has_liked}
            user_has_sub={video.user_has_sub}
          />
        </div>

        {/* MO TA */}
        <div className="w-full px-4 py-3 my-4 bg-neutral-800/80  rounded-xl">
          <div className="text-sm text-neutral-200/80 font-semibold">
            {updatedAtLabel} • {formattedDate}
          </div>
          <p className="text-md mt-[2px] text-muted-foreground">
            {video.description}
          </p>
        </div>

        {/* COMMENTS SECTION */}
        <div className="w-full min-h-screen">
          <Comments
            video_id={video.id}
            video_owner_id={video.owner_id}
          />
        </div>
      </div>

      {/* RELATED VIDEO */}
      <div className="w-1/4 mx-4 ml-8">
        <SmallVideoCards />
      </div>
    </div>
  );
};
export default VideoPage;

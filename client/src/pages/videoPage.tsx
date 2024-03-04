import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { UserInfo } from "@/components/video/user-info";
import { format, formatDistanceToNow } from "date-fns";
import { VideoCards } from "@/components/video-cards";
import { Loading } from "@/components/loading";
import { SmallVideoCards } from "@/components/small-video-cards";

// const bagu =
//   "http://localhost:5000/api/v1/video/20240302_234625357_guruguru.mp4";
// const venom =
//   "http://localhost:5000/api/v1/video/20240302_225712791_venom.mp4";
// const idsm =
//   "http://localhost:5000/api/v1/video/20240303_000738902_IDSMILE.mp4";

// const fakeVideo = {
//   id: "1",
//   src: venom,
//   title:
//     "【エイプリルフールver.】ベノム / 休日、趣味人同士で。【エイプリルフールver.】ベノム / 休日、趣味人同士で。",
//   description: "This is a description",
//   updated_at: new Date().toISOString(),

//   // join user table
//   owner_id: "asd",
//   img: "https://yt3.ggpht.com/ytc/AIdro_njJ7pfpxR9y1ocO6GXo6fvf0JEKOnRXX6WKtBXJw=s88-c-k-c0x00ffffff-no-rj",
//   name: "プロセか",
// };

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
  const updatedAtLabel =
    video &&
    formatDistanceToNow(video.updated_at, {
      addSuffix: true,
    });

  const formattedDate =
    video && format(video.updated_at, "dd 'thg' M, yyyy");

  const fetchVideo = useCallback(async () => {
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
  }, [video_id, axiosPrivate]);

  useEffect(() => {
    fetchVideo();
  }, [video_id, fetchVideo]);

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
        <div className="w-full h-screen bg-green-400"></div>
      </div>

      {/* RELATED VIDEO */}
      <div className="w-1/4 mx-4">
        <SmallVideoCards />
      </div>
    </div>
  );
};
export default VideoPage;

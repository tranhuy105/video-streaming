import { cn } from "@/lib/utils";
import { Redo, ThumbsDown, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
const PLACEHOLDER_IMG =
  "https://yt3.ggpht.com/ytc/AIdro_njJ7pfpxR9y1ocO6GXo6fvf0JEKOnRXX6WKtBXJw=s88-c-k-c0x00ffffff-no-rj";

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

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(
          `/video/single/${video_id}`
        );
        setVideo(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!video_id || !video)
    return <div>Video dont exist</div>;

  return (
    <div className="w-full min-h-screen text-white flex container">
      <div className="w-3/4">
        {/* VIDEO CONTAINER */}
        <div className="w-full">
          <video controls className="w-full">
            <source src={video.src} type="video/mp4" />
          </video>
          <div>
            <h1 className="pt-4 pb-2 text-2xl font-bold text-white/90 capitalize">
              {video.title}
            </h1>
            <div className="px-1 py-3 flex justify-between items-center">
              {/* USER INFO */}
              <div className="flex gap-3 px-1 items-center justify-center">
                <img
                  src={
                    video.img ? video.img : PLACEHOLDER_IMG
                  }
                  className="w-12 h-12 rounded-full block cursor-pointer"
                />
                <div className="flex flex-col gap-1 justify-center">
                  <p className="text-xl font-semibold">
                    {video.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {150000} Người đăng kí
                  </p>
                </div>

                {/* SUBSCRIBE */}
                <div
                  className={cn(
                    "bg-neutral-200 text-neutral-900 border font-semibold cursor-pointer border-neutral-900 rounded-full px-3 py-2 ml-4"
                  )}
                >
                  Đăng kí
                </div>
              </div>

              {/* LIKE DISLIKE SHARE */}
              <div className="flex gap-x-8 items-center justify-center">
                {/* LIKE DISLIKE */}
                <div className="flex text-neutral-200/80 divide-x divide-neutral-900">
                  <div className="bg-neutral-800/80 hover:bg-neutral-700 transition duration-300 rounded-l-full px-3 py-2 cursor-pointer flex gap-2 items-center justify-center">
                    <ThumbsUp size={24} strokeWidth={1} />
                    <p className="font-semibold text-sm">
                      202K
                    </p>
                  </div>

                  <div className="bg-neutral-800/80 hover:bg-neutral-700 transition duration-300 rounded-r-full px-3 py-2 cursor-pointer flex items-center justify-center">
                    <ThumbsDown size={24} strokeWidth={1} />
                  </div>
                </div>

                {/* SHARE */}
                <div className="bg-neutral-800/80 hover:bg-neutral-700 transition duration-300 rounded-full px-3 py-2 pl-2 cursor-pointer flex items-center justify-center gap-2 mr-3">
                  <Redo
                    size={24}
                    strokeWidth={1}
                    className="text-neutral-200/60"
                  />
                  <p className="text-neutral-200/80">
                    Chia sẻ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MO TA */}
        <div className="w-full h-32 bg-blue-500"></div>

        {/* COMMENTS SECTION */}
        <div className="w-full h-screen bg-green-400"></div>
      </div>

      {/* RELATED VIDEO */}
      <div className="w-1/4 bg-red-500"></div>
    </div>
  );
};
export default VideoPage;

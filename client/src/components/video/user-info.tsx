import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { cn } from "@/lib/utils";
import { Redo, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { Subcount } from "./subcount";
import { Link } from "react-router-dom";
import { LikeButton } from "./like-button";
import { buttonVariants } from "../ui/button";
const PLACEHOLDER_IMG =
  "https://avatars.githubusercontent.com/u/136960770?v=4";

export const UserInfo = ({
  img,
  name,
  title,
  owner_id,
  video_id,
  user_has_liked,
  user_has_sub,
}: {
  img: string;
  name: string;
  title: string;
  owner_id: string;
  video_id: string;
  user_has_liked: boolean;
  user_has_sub: boolean;
}) => {
  const { auth } = useAuth();
  const [liked, setLiked] = useState(user_has_liked);
  const [subscribed, setSubscribed] =
    useState(user_has_sub);
  const [subCount, setSubCount] = useState<number>(0);
  const [likedCount, setLikedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const POST_DATA = {
    video_id,
    owner_id,
  };

  const handleSub = async () => {
    if (subscribed) {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.post(
          "/user/delete/sub",
          POST_DATA
        );

        setSubCount((cur) => cur - 1);
        setSubscribed(false);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.post(
          "/user/sub",
          POST_DATA
        );
        console.log(subCount);
        setSubCount((cur) => cur + 1);
        setSubscribed(true);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLike = async () => {
    if (liked) {
      try {
        setIsLoading(true);
        const respone = await axiosPrivate.post(
          "/video/delete/like",
          POST_DATA
        );
        console.log(respone.data);
        setLiked(false);
        setLikedCount((cur) => cur - 1);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const respone = await axiosPrivate.post(
          "/video/like",
          POST_DATA
        );

        console.log(respone.data);
        setLikedCount((cur) => cur + 1);
        setLiked(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <h1 className="pt-3 pb-1 text-3xl font-bold text-white/90 capitalize">
        {title}
      </h1>
      <div className="px-1 py-3 flex justify-between items-center">
        {/* USER INFO */}
        <div className="flex gap-3 px-1 items-center justify-center">
          <Link to={`/channel/${owner_id}`}>
            <img
              src={img ? img : PLACEHOLDER_IMG}
              className="w-12 h-12 rounded-full block cursor-pointer"
            />
          </Link>
          <div className="flex flex-col gap-1 justify-center">
            <p className="text-xl font-semibold">{name}</p>
            <Subcount
              owner_id={owner_id}
              subCount={subCount * 1}
              setSubCount={setSubCount}
            />
          </div>

          {/* SUBSCRIBE */}
          {owner_id !== auth.user_id ? (
            <div
              className={cn(
                "bg-neutral-200 text-neutral-900 border font-normal cursor-pointer transition duration-300 border-neutral-900 rounded-full px-3 py-2 ml-4",
                subscribed &&
                  "bg-neutral-800/80 hover:bg-neutral-700  rounded-l-full  py-2 cursor-pointer flex gap-2 items-center justify-center text-neutral-200/80 px-4",
                isLoading &&
                  "pointer-events-none cursor-wait opacity-50"
              )}
              onClick={handleSub}
            >
              {subscribed ? "Đã đăng kí ✔️" : "Đăng kí"}
            </div>
          ) : (
            <Link to={`/channel/${auth.user_id}`}>
              <div
                className={cn(
                  "rounded-full bg-neutral-800/80 hover:bg-neutral-900 duration-300 text-neutral-200 ml-4 px-3 py-3 -mb-1 text-base hover:text-neutral-100/50"
                )}
              >
                Quản lí kênh của bạn
              </div>
            </Link>
          )}
        </div>

        {/* LIKE DISLIKE SHARE */}
        <div className="flex gap-x-8 items-center justify-center">
          {/* LIKE DISLIKE */}
          <div className="flex text-neutral-200/80 divide-x divide-neutral-900">
            <LikeButton
              handleLike={handleLike}
              isLoading={isLoading}
              liked={liked}
              likedCount={likedCount}
              setLikedCount={setLikedCount}
              video_id={video_id}
            />

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
            <p className="text-neutral-200/80">Chia sẻ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

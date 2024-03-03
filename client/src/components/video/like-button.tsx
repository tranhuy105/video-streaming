import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { cn } from "@/lib/utils";
import { ThumbsUp } from "lucide-react";
import { useEffect } from "react";

interface LikeButtonProps {
  handleLike: any;
  liked: boolean;
  isLoading: boolean;
  likedCount: number;
  video_id: string;
  setLikedCount: any;
}

export const LikeButton = ({
  handleLike,
  liked,
  isLoading,
  likedCount,
  video_id,
  setLikedCount,
}: LikeButtonProps) => {
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axiosPrivate.post(
          "/video/likecount",
          { video_id }
        );

        setLikedCount(response.data.number_of_likes * 1);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLikeCount();
  }, [video_id]);

  return (
    <div
      className="bg-neutral-800/80 hover:bg-neutral-700 transition duration-300 rounded-l-full px-3 py-2 cursor-pointer flex gap-2 items-center justify-center"
      onClick={handleLike}
    >
      <ThumbsUp
        size={24}
        strokeWidth={1}
        className="transtion-all duration-500"
        fill={
          liked
            ? "rgb(229 229 229 / 0.8)"
            : "rgb(38 38 38 / 0.8)"
        }
      />
      <p
        className={cn(
          "font-semibold text-sm",
          liked && "text-neutral-200/90",
          isLoading &&
            "pointer-events-none cursor-wait opacity-50"
        )}
      >
        {likedCount}
      </p>
    </div>
  );
};

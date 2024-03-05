import { useEffect, useRef, useState } from "react";
import { Comment } from "./comment";
import useAuth from "@/hooks/useAuth";
import { CommentInputForm } from "./comment-input-form";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";

export type CommentType = {
  id: string;
  user_id: string;
  user_img: string;
  user_name: string;
  created_at: string; // DATE
  parent_id: string | null;
  content: string;
  video_id: string;
};

interface CommentsProps {
  video_id: string;
  video_owner_id: string;
}

export const Comments = ({
  video_id,
  video_owner_id,
}: CommentsProps) => {
  const [commentList, setCommentList] = useState<
    CommentType[]
  >([]);
  const [val, setVal] = useState("");
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const isFirstRender = useRef(true);

  const parentComment = commentList.filter(
    (comment) => comment.parent_id === null
  );
  const childComment = commentList.filter(
    (comment) => comment.parent_id !== null
  );

  useEffect(() => {
    const fetchComment = async () => {
      console.log("fetchcmt");
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(
          `/video/comment/${video_id}`
        );

        setCommentList(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!isFirstRender.current) {
      fetchComment();
    } else {
      isFirstRender.current = false;
    }
  }, [video_id, axiosPrivate]);

  const handleAddComment = async () => {
    try {
      if (val && auth.user_name) {
        const POSTDATA = {
          content: val,
          video_id: video_id,
        };
        setFetchLoading(true);
        const response = await axiosPrivate.post(
          "/video/comment",
          POSTDATA
        );

        setCommentList((cur) => [response.data, ...cur]);
        setVal("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetchLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="w-full flex justify-center mt-12">
        <div className="animate-pulse">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );

  return (
    <div className="w-full h-full text-neutral-50 space-y-4">
      {/* INPUT FORM */}
      <CommentInputForm
        val={val}
        setVal={setVal}
        handleAddComment={handleAddComment}
        isLoading={fetchLoading}
      />
      {/* COMMENT LIST*/}
      {parentComment.map((comment: CommentType) => {
        return (
          <Comment
            video_id={video_id}
            key={comment.id}
            comment={comment}
            childComments={childComment
              .filter(
                (child) => comment.id === child.parent_id
              )
              .reverse()}
            setCommentList={setCommentList}
            video_owner_id={video_owner_id}
          />
        );
      })}
    </div>
  );
};

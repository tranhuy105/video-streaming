import { useRef, useState } from "react";
import { CommentType } from "./comments";
import TextArea from "./text-area";
import { ChevronDown, Reply } from "lucide-react";

import { cn } from "@/lib/utils";
import { CommentInputForm } from "./comment-input-form";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { EditButton } from "./edit-button";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

const placeHolderImgSrc =
  "https://avatars.githubusercontent.com/u/136960770?v=4";

interface CommentProps {
  comment: CommentType;
  childComments: CommentType[];
  isChild?: boolean;
  setCommentList: any;
  video_id: string;
  video_owner_id: string;
}

export const Comment = ({
  comment,
  childComments,
  isChild,
  setCommentList,
  video_id,
  video_owner_id,
}: CommentProps) => {
  const [val, setVal] = useState<string>(comment.content);
  const [showChild, setShowChild] = useState(false);
  const [showReply, setShowReplay] = useState(false);
  const [replyVal, setReplyVal] = useState("");
  const [editVal, setEditVal] = useState(comment.content);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const divRef = useRef(null);

  useOnClickOutside(divRef, () => {
    if (editMode) {
      setEditVal(val);
      setEditMode(false);
    }
  });

  const handleOnOffChild = () => {
    setShowChild((cur) => !cur);
    if (showChild) {
      setShowReplay(false);
    }
  };

  const handleOnOffReplay = () => {
    if (!showChild && !showReply) {
      setShowChild(true);
      setShowReplay(true);
    } else if (showChild && showReply) {
      setShowChild(false);
      setShowReplay(false);
    } else {
      setShowReplay(true);
    }
  };

  const handleAddReply = async () => {
    try {
      if (
        replyVal &&
        auth.user_img &&
        auth.user_name &&
        !isChild
      ) {
        const POSTDATA = {
          content: replyVal,
          parent_id: comment.id,
          video_id: video_id,
          owner_id: video_owner_id,
        };
        setIsLoading(true);
        const response = await axiosPrivate.post(
          "/video/comment",
          POSTDATA
        );

        setCommentList((cur: CommentType[]) => [
          response.data,
          ...cur,
        ]);
        setReplyVal("");
        setShowReplay(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log("finish");
      setIsLoading(false);
    }
  };

  const handleUpdateComment = async () => {
    try {
      setIsLoading(true);
      await axiosPrivate.post("/video/comment/update", {
        id: comment.id,
        content: editVal,
      });
      setVal(editVal);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("finish");
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    try {
      setIsLoading(true);
      await axiosPrivate.post("/video/comment/delete", {
        id: comment.id,
      });
      setCommentList((cur: CommentType[]) =>
        cur.filter(
          (com) =>
            com.id !== comment.id ||
            com.parent_id === comment.id
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      console.log("delete");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", isChild && "pl-12")}>
      <div className={cn("flex w-full gap-3")}>
        {/* AVATAR */}
        <img
          className={cn(
            "w-12 h-12 rounded-full mt-1 cursor-pointer select-none",
            isChild && "w-9 h-9 mt-1"
          )}
          src={
            comment.user_img
              ? comment.user_img
              : placeHolderImgSrc
          }
          alt={comment.user_name}
          onClick={() => {
            navigate(`/channel/${comment.user_id}`);
          }}
        />

        {/* COMMENT INFO */}
        <div className="flex flex-col w-full">
          <div className="flex gap-3 items-center">
            {/* NAME */}
            <div
              className={cn(
                "font-normal text-sm py-[2px] mb-[2px]",
                isChild && "",
                comment.user_id === video_owner_id &&
                  "bg-neutral-200/40 rounded-full px-2 font-bold"
              )}
            >
              @{comment.user_name}
            </div>
            {/* DATE */}
            <div className="text-xs text-neutral-50/50 mt-[3px]">
              {formatDistanceToNow(comment.created_at, {
                addSuffix: true,
              })}
            </div>
          </div>

          {/* CONTENT */}
          <div
            className="flex justify-between w-full relative"
            ref={divRef}
          >
            <TextArea
              disabled={!editMode}
              val={editMode ? editVal : val}
              setVal={editMode ? setEditVal : setVal}
              isChild={isChild}
              className="w-full  h-fit"
              handleSubmit={handleUpdateComment}
              reply={editMode}
              isLoading={isLoading}
            />
            {auth.user_id === comment.user_id && (
              <EditButton
                setEditMode={setEditMode}
                editMode={editMode}
                handleDeleteComment={handleDeleteComment}
              />
            )}
          </div>
        </div>
      </div>
      {!isChild && (
        <div className="flex gap-4">
          <div
            className={cn(
              "text-blue-500 flex mt-[3px] cursor-pointer ml-12 w-fit mb-2 select-none",
              childComments.length === 0 &&
                "pointer-events-none text-neutral-500/50 "
            )}
            onClick={handleOnOffChild}
          >
            <ChevronDown
              className={cn(
                "mr-2 transition-all duration-300 rotate-0",
                showChild && "rotate-180"
              )}
            />
            <div>{childComments.length} phản hồi</div>
          </div>

          <div>
            <Reply
              className="mt-[3px] text-neutral-200/80 hover:text-neutral-200/100 transition-all cursor-pointer"
              onClick={handleOnOffReplay}
            />
          </div>
        </div>
      )}

      {!isChild && showReply && (
        <div className="pl-12 pr-20">
          <CommentInputForm
            reply
            val={replyVal}
            setVal={setReplyVal}
            handleAddComment={handleAddReply}
          />
        </div>
      )}

      {!isChild && (
        <div
          className={cn(
            "space-y-4 pb-1 ",
            showChild
              ? "pb-2 pt-2"
              : " opacity-0 absolute pointer-events-none"
          )}
        >
          {childComments.map((childComment) => (
            <Comment
              video_owner_id={video_owner_id}
              video_id={video_id}
              key={childComment.id}
              comment={childComment}
              childComments={[]}
              isChild
              setCommentList={setCommentList}
            />
          ))}
        </div>
      )}
    </div>
  );
};

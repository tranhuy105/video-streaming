import useAuth from "@/hooks/useAuth";
import TextArea from "./text-area";
import { cn } from "@/lib/utils";

const placeHolderImgSrc =
  "https://avatars.githubusercontent.com/u/136960770?v=4";

interface CommentInputFormProps {
  val: string;
  setVal: any;
  handleAddComment: any;
  reply?: boolean;
  isLoading?: boolean;
}

export const CommentInputForm = ({
  val,
  setVal,
  handleAddComment,
  reply,
  isLoading,
}: CommentInputFormProps) => {
  const { auth } = useAuth();

  return (
    <div className="flex gap-3 items-start mb-6 relative">
      <img
        className={cn(
          "w-12 h-12 rounded-full mt-1 items-start",
          reply && "w-9 h-9"
        )}
        src={
          auth.user_img ? auth.user_img : placeHolderImgSrc
        }
      />
      <div className="border-b border-neutral-50 pb-1 w-full mt-2">
        <TextArea
          reply={reply}
          val={val}
          setVal={setVal}
          disabled={false}
          handleSubmit={handleAddComment}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

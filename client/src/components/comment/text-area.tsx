import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

const TextArea = ({
  val,
  setVal,
  isChild,
  disabled,
  className,
  handleSubmit,
  reply,
  isLoading,
}: {
  val: string;
  setVal: (e: any) => void;
  isChild?: boolean;
  disabled: boolean;
  className?: string;
  handleSubmit?: any;
  reply?: boolean;
  isLoading?: boolean;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleChange = (e: any) => {
    setVal(e.target.value);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";

      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [val]);

  return (
    <>
      <div
        className={cn(
          "flex flex-col space-y-2 text-center w-full",
          !disabled && "pl-0"
        )}
      >
        {/* <span>Input text</span> */}
        <textarea
          className={cn(
            "font-semibold bg-transparent text-neutral-200 active:outline-none focus:outline-none rounded resize-none cursor-default text-sm peer placeholder:font-normal overflow-hidden h-auto",
            isChild && "text-sm",
            !disabled && "text-base cursor-text",
            className,
            reply && "text-sm font-normal",
            isLoading && "pointer-events-none opacity-100"
          )}
          value={val}
          onChange={handleChange}
          rows={1}
          ref={textAreaRef}
          disabled={disabled}
          placeholder="Viết bình luận của bạn"
        ></textarea>
        {!disabled && (
          <div
            onClick={handleSubmit}
            className={cn(
              "absolute opacity-0 right-0 -bottom-12 rounded-2xl hover:bg-neutral-900 transition-all duration-300 hover:text-neutral-200/70 bg-neutral-800 z-[9999] px-3 py-2 cursor-pointer text-neutral-200 peer-focus:opacity-100 peer-active:pointer-events-none hover:opacity-100",
              val.length === 0 &&
                "text-neutral-50/50 pointer-events-none",
              val.length !== 0 && "opacity-100",
              isLoading && "pointer-events-none opacity-100"
            )}
          >
            {!isLoading ? (
              <div>
                {reply
                  ? disabled
                    ? "Phản hồi"
                    : "Cập nhật"
                  : "Bình luận"}
              </div>
            ) : (
              <div>
                <Loader2 className="animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default TextArea;

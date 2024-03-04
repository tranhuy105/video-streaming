import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useRef } from "react";

interface ConfirmPageProps {
  filename: string;
  setShowConfirm: any;
  showConfirm: boolean;
  handleDeleteVideo: any;
}

export const ConfirmPage = ({
  filename,
  setShowConfirm,
  showConfirm,
  handleDeleteVideo,
}: ConfirmPageProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(divRef, () => {
    if (showConfirm) {
      setShowConfirm(false);
    }
  });

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[9999]">
      <div
        className="w-1/3 h-1/3 bg-black/80 rounded-lg text-neutral-50 flex flex-col items-center"
        ref={divRef}
      >
        <h1 className="text-4xl font-extrabold mt-12">
          Bạn chắc chắn chứ?
        </h1>
        <p className="text-neutral-200/60 mt-3">
          Video sau khi xóa sẽ{" "}
          <span className="font-bold text-red-500 italic">
            không thể khôi phục!
          </span>{" "}
        </p>
        <p className="text-neutral-200/40 text-sm underline">
          Vui lòng suy nghĩ thật kĩ trước khi nhấn nút
        </p>
        <div className="flex mt-5 gap-8">
          <div
            className="bg-neutral-800 hover:bg-black/80 transition-all duration-300 px-3 py-2 rounded-full cursor-pointer"
            onClick={() => setShowConfirm(false)}
          >
            Hủy bỏ
          </div>
          <div
            className="bg-red-500 hover:bg-red-500/80 transition-all duration-300 px-3 py-2 rounded-full cursor-pointer text-white"
            onClick={() => handleDeleteVideo(filename)}
          >
            Tiếp tục
          </div>
        </div>
      </div>
    </div>
  );
};

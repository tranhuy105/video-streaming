import { Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmPage } from "./confirm-page";

interface DeleteVideoButtonProps {
  filename: string;
  handleDeleteVideo: any;
}

export const DeleteVideoButton = ({
  filename,
  handleDeleteVideo,
}: DeleteVideoButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Trash
        className="w-5 h-5 cursor-pointer"
        strokeWidth={1}
        onClick={() =>
          !showConfirm ? setShowConfirm(true) : () => {}
        }
      />
      {showConfirm && (
        <ConfirmPage
          handleDeleteVideo={handleDeleteVideo}
          setShowConfirm={setShowConfirm}
          filename={filename}
          showConfirm={showConfirm}
        />
      )}
    </>
  );
};

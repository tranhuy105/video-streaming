import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { cn } from "@/lib/utils";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { useRef, useState } from "react";

export const EditButton = ({
  editMode,
  setEditMode,
  handleDeleteComment,
}: {
  editMode: boolean;
  setEditMode: any;
  handleDeleteComment: any;
}) => {
  const [showEditTab, setShowEditTab] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);

  const handleEnterEditMode = () => {
    setEditMode(true);
    setShowEditTab(false);
  };

  const handleShowEditTab = () => {
    if (!showEditTab) {
      setShowEditTab(true);
    } else {
      setShowEditTab(false);
    }
  };

  useOnClickOutside(divRef, () => {
    if (showEditTab) {
      setShowEditTab(false);
    }
  });

  return (
    <div
      ref={divRef}
      className={cn(
        "relative",
        editMode && "pointer-events-none"
      )}
    >
      <div onClick={handleShowEditTab}>
        <MoreVertical
          size={18}
          className="-mt-[4px] text-neutral-200/80 hover:text-neutral-200/100 transition-all cursor-pointer"
        />
      </div>
      {showEditTab && (
        <div className="absolute rounded-lg w-16  -right-4 top-6 z-[9000] flex items-center justify-center flex-col text-neutral-200/50 bg-neutral-800">
          <div
            className="px-3 w-full py-2 hover:bg-neutral-700 rounded-t-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
            onClick={handleEnterEditMode}
          >
            <Edit className="w-6 h-6" />
          </div>
          <div
            className="px-3 w-full py-2 hover:bg-neutral-700 rounded-b-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
            onClick={handleDeleteComment}
          >
            <Trash className="w-6 h-6" />
          </div>
        </div>
      )}
    </div>
  );
};

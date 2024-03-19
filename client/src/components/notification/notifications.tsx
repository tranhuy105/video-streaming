import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Notification } from "./noti";

export type NotificationType = {
  id: string;
  user_id: string;
  sender_id: string;
  notification_type: "like" | "sub" | "comment";
  object_id: string | null;
  is_read: boolean;
  created_at: Date;
  sender_img: string;
  sender_name: string;
};

export const Notifications = () => {
  const axiosPrivate = useAxiosPrivate();
  const divRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [notifications, setNotifications] = useState<
    NotificationType[]
  >([]);
  const [showNoti, setShowNoti] = useState(false);

  useEffect(() => {
    const fetchNoti = async () => {
      console.log("fetchnoti");
      const response = await axiosPrivate.get("/user/noti");

      setNotifications(response.data);
    };

    if (!isFirstRender.current) {
      fetchNoti();
    } else {
      isFirstRender.current = false;
    }
  }, []);

  const handleShowNoti = () => {
    setShowNoti((cur) => !cur);
  };

  useOnClickOutside(divRef, () => {
    if (showNoti) {
      setShowNoti(false);
    }
  });

  return (
    <div
      className="w-fit p-2 hover:bg-neutral-800 rounded-full cursor-pointer transition-all duration-300 relative"
      ref={divRef}
    >
      <div className="relative" onClick={handleShowNoti}>
        <Bell
          className="text-white transition-colors duration-300"
          fill={showNoti ? "#FFFFFF" : ""}
        />
        <div className="absolute w-4 h-4 top-3 left-3 bg-red-500/80 rounded-full flex items-center justify-center pointer-events-none select-none">
          <p className="text-xs font-semibold">
            {
              notifications.filter(
                (noti: NotificationType) => !noti.is_read
              ).length
            }
          </p>
        </div>
      </div>
      {showNoti && (
        <div className="bg-neutral-800 absolute w- top-12 right-0 w-[480px] z-[10000] rounded-lg text-neutral-200/90">
          <div className="px-4 py-4 border-b text-lg font-semibold">
            Thông báo
          </div>
          {notifications.map((noti: NotificationType) => {
            return (
              <Notification key={noti.id} noti={noti} />
            );
          })}
        </div>
      )}
    </div>
  );
};

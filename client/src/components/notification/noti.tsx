import { formatDistanceToNow } from "date-fns";
import { NotificationType } from "./notifications";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export const Notification = ({
  noti,
}: {
  noti: NotificationType;
}) => {
  const navigate = useNavigate();

  let message;
  if (noti.notification_type === "like") {
    message = `${noti.sender_name} đã thích video của bạn!`;
  } else if (noti.notification_type === "sub") {
    message = `${noti.sender_name} đã đăng kí kênh của bạn`;
  } else {
    message = `${noti.sender_name} đã bình luận video của bạn`;
  }

  const handleClick = () => {
    if (noti.notification_type === "sub") return;
    navigate(`/video/${noti.object_id}`);
  };

  return (
    <div
      className="px-7 py-5 hover:bg-neutral-900 transition-all hover:text-white duration-300 flex items-center gap-3"
      onClick={handleClick}
    >
      {/* AVATAR */}
      <div className="w-12 h-12 rounded-full relative">
        <div className="absolute w-[6px] h-[6px] rounded-full bg-blue-500/60 top-5 right-14" />
        <img
          src={
            noti.sender_img
              ? noti.sender_img
              : "/placeholder_avatar.jpg"
          }
          alt="noti"
          className="object-cover object-center rounded-full"
        />
      </div>

      {/* INFO */}
      <div className="flex flex-col justify-center items-start gap-1">
        <div className="font-semibold">{message}</div>
        <div className="text-xs text-neutral-200/40 font-semibold ">
          {formatDistanceToNow(noti.created_at, {
            addSuffix: true,
            locale: vi,
          })}
        </div>
      </div>
    </div>
  );
};

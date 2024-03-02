import {
  AlignRight,
  Clapperboard,
  Clock,
  Home,
  PlaySquare,
  Settings,
  ThumbsUp,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";

export const Sidebar = () => {
  return (
    <aside className="bg-neutral-900 h-[calc(100vh-64px)] w-64 m-0 fixed  top-16 left-0  text-neutral-50 flex flex-col justify-start items-start gap-1 px-2 py-1">
      <SidebarItem label="Trang chủ">
        <Home strokeWidth={1} />
      </SidebarItem>
      <SidebarItem label="Kênh đăng ký">
        <PlaySquare strokeWidth={1} />
      </SidebarItem>
      <SidebarItem label="Gần đây">
        <Clock strokeWidth={1} />
      </SidebarItem>

      <div className="border-neutral-50 border-t-[1px] w-full my-3" />

      <div className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 w-full rounded-xl cursor-pointer">
        <p className="text-lg font-semibold text-white">
          Bạn
        </p>
        <AlignRight size={18} strokeWidth={1} />
      </div>

      <SidebarItem label="Video của bạn">
        <Clapperboard strokeWidth={1} />
      </SidebarItem>
      <SidebarItem label="Video đã thích">
        <ThumbsUp strokeWidth={1} />
      </SidebarItem>

      <div className="border-neutral-50 border-t-[1px] w-full my-3" />

      <SidebarItem label="Cài đặt">
        <Settings strokeWidth={1} />
      </SidebarItem>
    </aside>
  );
};

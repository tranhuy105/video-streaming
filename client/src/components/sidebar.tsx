import {
  AlignRight,
  Clapperboard,
  Home,
  PlaySquare,
  Settings,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export const Sidebar = () => {
  const [searchParams] = useSearchParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentParam = searchParams.get("filter");

  // function handleFilter(label: string) {
  //   if (label === "") {
  //     const updatedSearchParams = new URLSearchParams(
  //       searchParams
  //     );
  //     updatedSearchParams.delete("filter");
  //     setSearchParams(updatedSearchParams);
  //   }
  //   setSearchParams({ filter: label });
  // }

  return (
    <aside className="bg-neutral-900 h-[calc(100vh-64px)] w-64 m-0 fixed  top-16 left-0  text-neutral-50 flex flex-col justify-start items-start gap-1 px-2 py-1">
      <SidebarItem
        label="Trang chủ"
        onClick={() => navigate("/")}
        paramsLabel=""
        currentParam={
          !currentParam && location.pathname === "/"
            ? ""
            : currentParam
        }
      >
        <Home strokeWidth={1} />
      </SidebarItem>
      <SidebarItem
        label="Kênh đăng ký"
        onClick={() => navigate("/?filter=sub")}
        paramsLabel="sub"
        currentParam={currentParam}
      >
        <PlaySquare strokeWidth={1} />
      </SidebarItem>
      <SidebarItem
        label="Video đã thích"
        onClick={() => navigate("/?filter=liked")}
        paramsLabel="liked"
        currentParam={currentParam}
      >
        <ThumbsUp strokeWidth={1} />
      </SidebarItem>

      <div className="border-neutral-50 border-t-[1px] w-full my-3" />

      <div className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 w-full rounded-xl cursor-pointer">
        <p className="text-lg font-semibold text-white">
          Bạn
        </p>
        <AlignRight size={18} strokeWidth={1} />
      </div>

      <SidebarItem
        label="Kênh của bạn"
        onClick={() => navigate(`/channel/${auth.user_id}`)}
        paramsLabel="channel"
        currentParam={
          location.pathname.startsWith("/channel")
            ? "channel"
            : ""
        }
      >
        <UserRound strokeWidth={1} />
      </SidebarItem>
      <SidebarItem
        label="Video của bạn"
        onClick={() => navigate("/?filter=mine")}
        paramsLabel="mine"
        currentParam={currentParam}
      >
        <Clapperboard strokeWidth={1} />
      </SidebarItem>

      <div className="border-neutral-50 border-t-[1px] w-full my-3" />

      <SidebarItem
        label="Cài đặt"
        onClick={() => {}}
        paramsLabel="setting"
        currentParam={currentParam}
      >
        <Settings strokeWidth={1} />
      </SidebarItem>
    </aside>
  );
};

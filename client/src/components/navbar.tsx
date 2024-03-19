import { useNavigate } from "react-router-dom";
import { SignOutButton } from "./auth/sign-out-button";
import { Youtube } from "lucide-react";
import { SearchInput } from "./search";
import { UploadButton } from "./upload-video/upload-button";
import { Notifications } from "./notification/notifications";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 bg-neutral-900 h-16 flex justify-between items-center px-6 z-[9999]">
      <div
        onClick={() => navigate("/")}
        className="flex gap-2 items-center cursor-pointer "
      >
        <Youtube className=" text-red-500" size={48} />
        <p className=" font-bold text-[24px] text-red-50 leading-loose tracking-normal mb-[2px]">
          YiuTube
        </p>
      </div>
      <div className="md:w-1/2">
        <SearchInput />
      </div>
      <div className="flex text-white items-center gap-4">
        <div className="flex items-center justify-center gap-1">
          <UploadButton />
          <Notifications />
        </div>
        <SignOutButton />
      </div>
    </div>
  );
};

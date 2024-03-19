import { cn } from "@/lib/utils";
import useLogout from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";

export const SignOutButton = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer bg-transparent text-blue-500 border-blue-500 border px-3 py-2 rounded-lg hover:text-white transition-all hover:border-white duration-300 select-none"
      )}
      onClick={handleLogOut}
    >
      Sign Out
    </div>
  );
};

import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
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
        "cursor-pointer",
        buttonVariants({ variant: "outline" })
      )}
      onClick={handleLogOut}
    >
      Sign Out
    </div>
  );
};

import useAuth from "@/hooks/useAuth";

import { Navigate, Outlet } from "react-router-dom";

export const RedirectAuth = () => {
  const { auth } = useAuth();

  // console.log(auth.accessToken);

  return !auth.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to={"/"} replace />
  );
};

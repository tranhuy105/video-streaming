import {
  // useLocation,
  // Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
// import useAuth from "@/hooks/useAuth";
import useJWTSession from "@/hooks/useJWTSession";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

const ProtectedRouteFallBack = () => {
  // const { auth } = useAuth();
  // const location = useLocation();

  const navigate = useNavigate();
  const { session, isSessionFetched } = useJWTSession();
  const { setAuth } = useAuth();

  useEffect(() => {
    if (isSessionFetched && !session) {
      setAuth({
        accessToken: "",
        user_id: "",
      });
      navigate("/login");
    } else if (isSessionFetched && session) {
      setAuth((cur) => ({
        ...cur,
        user_id: session?.user_id,
      }));
    }
  }, [isSessionFetched, session, navigate, setAuth]);

  return !isSessionFetched ? (
    <div>Loading...</div>
  ) : (
    <Outlet />
  );

  // return auth.accessToken ? (
  //   <Outlet />
  // ) : (
  //   <Navigate
  //     to={"/login"}
  //     state={{ from: location }}
  //     replace
  //   />
  // );
  // <div>hello</div>
};

export default ProtectedRouteFallBack;

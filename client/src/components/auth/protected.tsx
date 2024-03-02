import {
  // useLocation,
  // Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
// import useAuth from "@/hooks/useAuth";
import useJWTSession from "@/hooks/useJWTSession";
import { useEffect } from "react";

const ProtectedRouteFallBack = () => {
  // const { auth } = useAuth();
  // const location = useLocation();

  const navigate = useNavigate();
  const { session, isSessionFetched } = useJWTSession();

  useEffect(() => {
    if (isSessionFetched && !session) {
      navigate("/login");
    }
  }, [isSessionFetched, session, navigate]);

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

import {
  // useLocation,
  // Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
// import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

const ProtectedRouteFallBack = () => {
  // const { auth } = useAuth();
  // const location = useLocation();

  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();
  // console.log(auth);

  useEffect(() => {
    if (!auth?.accessToken) {
      setAuth({
        accessToken: "",
        user_id: "",
      });
      navigate("/login");
    }
  }, [navigate, setAuth, auth]);

  return <Outlet />;

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

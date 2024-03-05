import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const isFirstRender = useRef(true);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    if (!isFirstRender.current) {
      !auth?.accessToken
        ? verifyRefreshToken()
        : setIsLoading(false);
    } else {
      isFirstRender.current = false;
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // useEffect(() => {
  //   console.log(`isLoading: ${isLoading}`);
  //   console.log(auth?.accessToken);
  // }, [isLoading]);

  return isLoading ? <p>Loading...</p> : <Outlet />;
};

export default PersistLogin;

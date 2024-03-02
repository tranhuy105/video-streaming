import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "./useAxiosPrivate";

const useJWTSession = () => {
  const [session, setSession] = useState(null);
  const [isSessionFetched, setIsSessionFetched] =
    useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const getCurrentSession = async () => {
      try {
        const response = await axiosPrivate.get("/user");
        if (isMounted) {
          setSession(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setIsSessionFetched(true);
        }
      }
    };

    getCurrentSession();

    return () => {
      isMounted = false;
    };
  }, [axiosPrivate, navigate]);

  return { session, isSessionFetched };
};

export default useJWTSession;

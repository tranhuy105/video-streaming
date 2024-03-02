import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "./useAxiosPrivate";

type sessionType = {
  user_id?: string;
  iat?: number;
  exp?: number;
} | null;

const useJWTSession = () => {
  const [session, setSession] = useState<sessionType>(null);
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

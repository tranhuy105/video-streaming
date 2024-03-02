import { axiosPrivate } from "@/api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept =
      axiosPrivate.interceptors.request.use(
        (config) => {
          // Tức là lần đầu nên chưa có
          if (!config.headers["Authorization"]) {
            config.headers[
              "Authorization"
            ] = `Bearer ${auth?.accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

    const responseIntercept =
      axiosPrivate.interceptors.response.use(
        (response) => {
          return response;
        },

        // nếu nhận được reponse với lỗi token expired thì chạy callback này để refresh, refresh xong lại request tiếp với token mới
        async (error) => {
          const isExpiredTokenError =
            error?.response?.status === 403 &&
            error.response.data.error === "jwt expired";
          const prevRequest = error.config;
          if (isExpiredTokenError && !error.config.sent) {
            console.log("Token vua duoc reset");
            prevRequest.sent = true;
            const newAccessToken = await refresh();
            prevRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          }
          return Promise.reject(error);
        }
      );

    return () => {
      axiosPrivate.interceptors.response.eject(
        responseIntercept
      );
      axiosPrivate.interceptors.request.eject(
        requestIntercept
      );
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;

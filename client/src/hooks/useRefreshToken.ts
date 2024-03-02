import axios from "@/api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post(
      "/auth/refresh_token",
      {},
      {
        withCredentials: true,
      }
    );

    setAuth((cur) => {
      // console.log(JSON.stringify(pre));
      // console.log(response.data.accessToken);
      return {
        ...cur,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;

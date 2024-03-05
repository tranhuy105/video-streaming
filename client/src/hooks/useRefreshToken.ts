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

    console.log(response.data);

    setAuth((cur) => {
      // console.log(JSON.stringify(pre));
      // console.log(response.data.accessToken);
      return {
        ...cur,
        accessToken: response.data.accessToken,
        user_id: response.data.user_id,
        user_img: response.data.user_img,
        user_name: response.data.user_name,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;

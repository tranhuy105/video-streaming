import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({
      // user: { id: "", name: "", email: "" },
      accessToken: "",
    });
    try {
      const response = await axios.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;

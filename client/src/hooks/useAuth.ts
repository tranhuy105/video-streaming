import { useContext } from "react";
import AuthContext from "@/context/AuthProvider";

const useAuth = () => {
  const authContext = useContext(AuthContext);
  const {
    auth = {
      // user: { id: "", name: "", email: "" },
      accessToken: "",
    },
    setAuth = () => {},
  } = authContext || {};
  return { auth, setAuth };
};

export default useAuth;

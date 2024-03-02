// import { useNavigate } from "react-router-dom";
import { SignOutButton } from "./auth/sign-out-button";

// import useJWTSession from "@/hooks/useJWTSession";
// import { useEffect } from "react";

const Homepage = () => {
  return (
    <div>
      <p>Home</p>
      <SignOutButton />
      <p>CURRENT JWT SESSION</p>
      <br />
      {/* <p>{JSON.stringify(session)}</p> */}
    </div>
  );
};
export default Homepage;

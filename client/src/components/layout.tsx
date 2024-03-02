import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full">
      <div className="w-full h-full bg-green-200 flex items-center justify-between py-3 px-2">
        <div onClick={() => navigate("/")}>HOME</div>
        <div onClick={() => navigate("/login")}>LOGIN</div>
        <div onClick={() => navigate("/register")}>
          REGISTER
        </div>
      </div>
      <Outlet />
    </main>
  );
};

export default Layout;

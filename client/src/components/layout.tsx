import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

const Layout = () => {
  return (
    <main className="min-h-screen bg-slate-100 relative">
      <Navbar />
      <Sidebar />

      <div className="h-full pl-64 w-full bg-neutral-900 overflow-y-auto">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;

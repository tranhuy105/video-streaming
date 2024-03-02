import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

const LayoutB = () => {
  return (
    <main className="min-h-screen  relative">
      <Navbar />

      <div className="h-full w-full bg-neutral-900 overflow-y-auto">
        <Outlet />
      </div>
    </main>
  );
};

export default LayoutB;

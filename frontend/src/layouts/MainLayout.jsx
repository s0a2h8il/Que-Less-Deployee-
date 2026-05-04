import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

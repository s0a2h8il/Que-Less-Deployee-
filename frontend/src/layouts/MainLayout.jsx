import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar, Footer } from "../components";

const MainLayout = () => {
  const location = useLocation();
  const hideFooterPaths = [
    "/admin/dashboard",
    "/admin/superadmin",
    "/analytics",
  ];
  const shouldHideFooter = hideFooterPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <div
      className="flex min-h-screen w-full flex-col"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,247,234,1) 0%, rgba(255,252,246,1) 50%, rgba(244,251,247,1) 100%)",
      }}
    >
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;

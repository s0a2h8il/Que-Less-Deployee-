import React from "react";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop";

function App() {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <ScrollToTop />
      <AppRoutes />
    </div>
  );
}

export default App;

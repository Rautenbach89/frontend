import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "./Layout.css";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="SiteWrapper">
      <Header toggleSidebar={toggleSidebar} />
      <main>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

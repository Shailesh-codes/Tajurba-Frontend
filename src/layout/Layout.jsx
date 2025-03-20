import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { Outlet, useLocation } from "react-router-dom";
import LogoutModal from "../authentications/LogoutModal";

const Layout = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (isSidebarOpen) {
      document.querySelector("body").style.overflowY = "hidden";
    } else {
      document.querySelector("body").style.overflowY = "auto";
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-[#0F172A]">
      <SideBar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0F172A] p-4">
          <Outlet />
        </main>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default Layout;

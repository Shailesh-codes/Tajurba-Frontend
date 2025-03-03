import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (isOpen) {
      document.querySelector("body").style.overflowY = "hidden";
    } else {
      document.querySelector("body").style.overflowY = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex">
      <SideBar setIsOpen={setIsOpen} isOpen={isOpen} />
      <Header setIsOpen={setIsOpen} isOpen={isOpen} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

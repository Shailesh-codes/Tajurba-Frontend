import React from "react";
import { NavLink } from "react-router-dom";
import { IoSettingsOutline, IoCalendarOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSecurityScan } from "react-icons/ai";
import Logo from "../assets/images/Tajurba-Logo-Golden.png";
import { icons } from "../assets/SVGComponents/icons";
import { useAuth } from "../contexts/AuthContext";
import { navigationConfig } from "../config/navigation";

const SideBar = ({ isOpen, setIsOpen, setIsLogoutModalOpen }) => {
  const { auth } = useAuth();

  // Convert role name to match navigation config keys
  const getRoleKey = (role) => {
    switch (role) {
      case "Super Admin":
        return "superAdmin";
      case "Regional Director":
        return "regionalDirector";
      default:
        return role.toLowerCase();
    }
  };

  const userRole = getRoleKey(auth.role);

  const getNavigationItems = () => {
    const roleNavigation = navigationConfig[userRole] || [];
    const commonNavigation = navigationConfig.common;
    return [...roleNavigation, ...commonNavigation];
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 rounded-lg transition-all duration-200
     ${
       isActive
         ? "bg-gradient-to-r from-[#cdb065]/20 to-[#cdb065]/5 text-[#cdb065] font-semibold border-l-4 border-[#cdb065]"
         : "text-gray-300 hover:bg-[#1E293B]/70 hover:text-[#cdb065] border-l-4 border-transparent"
     }`;

  const renderIcon = (iconName) => {
    const Icon = icons[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40
          transition-opacity duration-200
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-[#0F172A] z-50
        transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="h-28 flex items-center justify-center px-6 py-8 border-b border-gray-700/30 bg-[#0c1424]">
          <img src={Logo} alt="Tajurba" className="h-20" />
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#0F172A]">
          <nav className="px-4 py-6 space-y-2">
            {getNavigationItems().map((section, index) => (
              <div key={index} className="mb-6">
                <span className="text-[#cdb065] text-sm font-bold uppercase tracking-wider px-4 mb-4 block">
                  {section.title}
                  <hr className="border-gray-700/30 mt-3" />
                </span>
                {section.items.map((item, itemIndex) => (
                  <NavLink
                    key={itemIndex}
                    to={item.path}
                    className={navLinkClass}
                  >
                    {renderIcon(item.icon)}
                    <span className="text-sm font-semibold">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700/30">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-lg 
              text-red-400 hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-amber-500/5 
              hover:text-amber-600 transition-all duration-200
              font-semibold border-l-4 border-transparent hover:border-amber-600"
          >
            <FiLogOut className="text-xl" />
            <span className="text-base font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </>
  );
};

export default SideBar;

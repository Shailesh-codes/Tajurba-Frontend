import React, { useState, useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { BiBell } from "react-icons/bi";
import { RiMessage2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Header = ({ setIsOpen, isOpen }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     const handleScroll = () => {
  //       const currentScroll = window.scrollY;
  //       if (currentScroll > 50) {
  //         setIsCompact(true);
  //       } else {
  //         setIsCompact(false);
  //       }

  //       if (currentScroll > lastScroll && currentScroll > 80) {
  //         setIsVisible(false);
  //       } else {
  //         setIsVisible(true);
  //       }

  //       setLastScroll(currentScroll);
  //     };

  //     window.addEventListener("scroll", handleScroll);
  //     return () => window.removeEventListener("scroll", handleScroll);
  //   }, [lastScroll]);

  return (
    <header
      className={`fixed z-40 top-0 right-0 left-0 transition-all duration-300
        border-b border-gray-700/50 bg-[#0F172A]
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${isCompact ? "h-20" : "h-26"}
        lg:left-64`}
    >
      <div className="flex items-center justify-between px-4 h-full w-full">
        {/* Left side - Menu button for mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-[#1E293B]"
        >
          <FiMenu className="w-6 h-6 text-gray-300" />
        </button>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center space-x-3">
            <button className="relative p-2 rounded-lg hover:bg-[#1E293B]">
              <RiMessage2Line className="w-5 h-5 text-gray-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </button>
            <button className="relative p-2 rounded-lg hover:bg-[#1E293B]">
              <BiBell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full"></span>
            </button>
          </div>

          {/* Profile Section */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1E293B]"
            >
              <img
                src="https://ui-avatars.com/api/?name=Shailesh+Bhosale"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-gray-700"
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0F172A] rounded-lg shadow-lg py-1 border border-gray-700/50">
                <div className="px-4 py-3 border-b border-gray-700/50">
                  <p className="text-sm font-medium text-gray-300">John Doe</p>
                  <p className="text-sm text-gray-400">john@example.com</p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-[#1E293B] flex items-center text-gray-300">
                    <MdOutlinePrivacyTip className="mr-3 text-gray-400" />
                    <span>Privacy Policy</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-[#1E293B] flex items-center text-gray-300">
                    <IoSettingsOutline className="mr-3 text-gray-400" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-[#1E293B] flex items-center text-red-400">
                    <FiLogOut className="mr-3" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

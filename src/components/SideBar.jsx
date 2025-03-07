import React from "react";
import { NavLink } from "react-router-dom";
import { RiDashboardLine, RiTeamLine, RiFileList3Line } from "react-icons/ri";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { BsListCheck, BsSliders } from "react-icons/bs";
import { MdOutlineEventNote, MdOutlinePeople } from "react-icons/md";
import { IoSettingsOutline, IoCalendarOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSecurityScan } from "react-icons/ai";
import Logo from "../assets/images/Tajurba-Logo-Golden.png";

const SideBar = ({ isOpen, setIsOpen }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
     ${
       isActive
         ? "bg-[#27DA68]/10 text-[#27DA68] font-medium border-l-4 border-[#27DA68]"
         : "text-gray-400 hover:bg-[#1E293B]/50 hover:text-white border-l-4 border-transparent"
     }`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40
          transition-opacity duration-200
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0F172A] z-50
        transition-transform duration-300 ease-in-out shadow-xl flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Fixed Logo Section */}
        <div className="h-26 flex items-center justify-center px-6 py-6 border-b border-gray-700/50">
          <img src={Logo} alt="Tajurba" className="h-16" />
        </div>

        {/* Scrollable Navigation Section */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav className="px-3 py-6 space-y-1.5">
            {/* Main Menu Items */}
            <span className="text-white/80 text-xs font-semibold uppercase tracking-wider px-3 mb-4 block">
              Main Menu
              <hr className="border-gray-700/50 mt-2" />
            </span>
            <NavLink to="/" className={navLinkClass}>
              <RiDashboardLine className="text-xl" />
              <span className="text-sm">Dashboard</span>
            </NavLink>

            <NavLink to="/add-member" className={navLinkClass}>
              <RiTeamLine className="text-xl" />
              <span className="text-sm">Add Member</span>
            </NavLink>

            <NavLink to="/assign-certificates" className={navLinkClass}>
              <RiFileList3Line className="text-xl" />
              <span className="text-sm">Assign Certificates</span>
            </NavLink>

            <NavLink to="/broadcast" className={navLinkClass}>
              <HiOutlineSpeakerphone className="text-xl" />
              <span className="text-sm">Broadcast</span>
            </NavLink>

            <NavLink to="/chapters-list" className={navLinkClass}>
              <BsListCheck className="text-xl" />
              <span className="text-sm">Chapters List</span>
            </NavLink>

            <NavLink to="/creative-list" className={navLinkClass}>
              <BsSliders className="text-xl" />
              <span className="text-sm">Creative Sliders List</span>
            </NavLink>

            <NavLink to="/mark-attendance" className={navLinkClass}>
              <MdOutlineEventNote className="text-xl" />
              <span className="text-sm">Mark Attendance & Venue Fees</span>
            </NavLink>

            <NavLink to="/member-list" className={navLinkClass}>
              <MdOutlinePeople className="text-xl" />
              <span className="text-sm">Member List</span>
            </NavLink>

            <NavLink to="/meetings" className={navLinkClass}>
              <IoCalendarOutline className="text-xl" />
              <span className="text-sm">
                Meetings / MDP / Socials & Training List
              </span>
            </NavLink>

            <NavLink to="/visitor-list" className={navLinkClass}>
              <AiOutlineSecurityScan className="text-xl" />
              <span className="text-sm">Visitor List</span>
            </NavLink>
            <NavLink to="/monthly-reward" className={navLinkClass}>
              <AiOutlineSecurityScan className="text-xl" />
              <span className="text-sm">Monthly Reward</span>
            </NavLink>

            {/* Others Section */}
            <div className="mt-8">
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider px-3 mb-4 block">
                Others
                <hr className="border-gray-700/50 mt-2" />
              </span>

              <NavLink to="/calendar" className={navLinkClass}>
                <IoCalendarOutline className="text-xl" />
                <span className="text-sm">Calendar</span>
              </NavLink>

              <NavLink to="/privacy-policy" className={navLinkClass}>
                <AiOutlineSecurityScan className="text-xl" />
                <span className="text-sm">Privacy Policy</span>
              </NavLink>

              <NavLink to="/settings" className={navLinkClass}>
                <IoSettingsOutline className="text-xl" />
                <span className="text-sm">Settings</span>
              </NavLink>
            </div>

            {/* Footer Section */}
            <div className="pt-6 mt-6 space-y-1 border-t border-gray-700/50">
              <button
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg 
                text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200
                font-medium border-l-4 border-transparent hover:border-red-400"
              >
                <FiLogOut className="text-xl" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </nav>
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

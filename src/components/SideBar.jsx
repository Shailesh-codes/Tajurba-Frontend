import React from "react";
import { NavLink } from "react-router-dom";
import { IoSettingsOutline, IoCalendarOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSecurityScan } from "react-icons/ai";
import Logo from "../assets/images/Tajurba-Logo-Golden.png";
import business from "../assets/sidebar-icon/business.svg";
import certificate from "../assets/images/icons/certificate.svg";
import members from "../assets/images/icons/members.svg";
import monthly_reward from "../assets/images/icons/mem-award.svg";
import ref_given from "../assets/images/icons/ref-given.svg";
import request_received from "../assets/images/icons/request.svg";
import dashboard from "../assets/images/icons/dashboard.svg";
import visitors_invited from "../assets/images/icons/visitors_invited.svg";
import DashboardIcon from "../assets/SVGComponents/DashboardIcon";
import AddMemberIcon from "../assets/SVGComponents/AddMemberIcon";
import AssignCertificateIcon from "../assets/SVGComponents/AssignCertificateIcon";
import BroadcastIcon from "../assets/SVGComponents/BroadcastIcon";
import ChapterListIcon from "../assets/SVGComponents/ChapterListIcon";
import SliderIcon from "../assets/SVGComponents/SliderIcon";
import MarkAttandance from "../assets/SVGComponents/MarkAttendanceIcon";
import MeetingsIcon from "../assets/SVGComponents/EventIcon";
import UserListIcon from "../assets/SVGComponents/UserListIcon";
import VisitorIcon from "../assets/SVGComponents/VisitorIcon";
import MonthlyRewardIcon from "../assets/SVGComponents/MonthlyRewardIcon";

const SideBar = ({ isOpen, setIsOpen }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
     ${
       isActive
         ? "bg-[#f69100]/10 text-[#f69100] font-medium border-l-4 border-[#f69100]"
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
              <DashboardIcon color="currentColor" />
              <span className="text-sm">Dashboard</span>
            </NavLink>

            <NavLink to="/add-member" className={navLinkClass}>
              <AddMemberIcon color="currentColor" />
              <span className="text-sm">Add Member</span>
            </NavLink>

            <NavLink to="/assign-certificates" className={navLinkClass}>
              <AssignCertificateIcon color="currentColor" />
              <span className="text-sm">Assign Certificates</span>
            </NavLink>

            <NavLink to="/broadcast" className={navLinkClass}>
              <BroadcastIcon color="currentColor" />
              <span className="text-sm">Broadcast</span>
            </NavLink>

            <NavLink to="/chapters-list" className={navLinkClass}>
              <ChapterListIcon color="currentColor" />
              <span className="text-sm">Chapters List</span>
            </NavLink>

            <NavLink to="/creative-list" className={navLinkClass}>
              <SliderIcon color="currentColor" />
              <span className="text-sm">Creative Sliders List</span>
            </NavLink>

            <NavLink to="/mark-attendance" className={navLinkClass}>
              <MarkAttandance color="currentColor" />
              <span className="text-sm">Mark Attendance & Venue Fees</span>
            </NavLink>

            <NavLink to="/member-list" className={navLinkClass}>
              <UserListIcon color="currentColor" />
              <span className="text-sm">Member List</span>
            </NavLink>

            <NavLink to="/meetings" className={navLinkClass}>
              <MeetingsIcon color="currentColor" />
              <span className="text-sm">
                Meetings / MDP / Socials & Training List
              </span>
            </NavLink>

            <NavLink to="/visitor-list" className={navLinkClass}>
              <VisitorIcon color="currentColor" />
              <span className="text-sm">Visitor List</span>
            </NavLink>
            <NavLink to="/monthly-reward" className={navLinkClass}>
              <MonthlyRewardIcon color="currentColor" />
              <span className="text-sm">Monthly Reward</span>
            </NavLink>

            {/* Members routes */}
            <NavLink to="/member-dashboard" className={navLinkClass}>
              <img src={dashboard} alt="" />
              <span className="text-sm">Member Dashboard</span>
            </NavLink>

            <NavLink to="/bdm" className={navLinkClass}>
              <img src={business} alt="" />
              <span className="text-sm">BDM's Done</span>
            </NavLink>
            <NavLink to="/business-given" className={navLinkClass}>
              <img src={business} alt="" />
              <span className="text-sm">Business Given</span>
            </NavLink>
            <NavLink to="/business-received" className={navLinkClass}>
              <img src={business} alt="" />
              <span className="text-sm">Business Received</span>
            </NavLink>
            <NavLink to="/member-certificate" className={navLinkClass}>
              <img src={certificate} alt="" />
              <span className="text-sm">Member Certificate</span>
            </NavLink>
            <NavLink to="/chapter-members" className={navLinkClass}>
              <img src={members} alt="" />
              <span className="text-sm">Chapter Members</span>
            </NavLink>
            <NavLink to="/meetings-mdp-socials" className={navLinkClass}>
              <img src={members} alt="" />
              <span className="text-sm">
                Meetings / MDP / Socials & Training Attendance & Venue Fees
              </span>
            </NavLink>
            <NavLink to="/member-monthly-reward" className={navLinkClass}>
              <img src={monthly_reward} alt="" />
              <span className="text-sm">Member Monthly Reward</span>
            </NavLink>
            <NavLink to="/ref-given" className={navLinkClass}>
              <img src={ref_given} alt="" />
              <span className="text-sm">Referral Given</span>
            </NavLink>
            <NavLink to="/request-received" className={navLinkClass}>
              <img src={request_received} alt="" />
              <span className="text-sm">Request Received</span>
            </NavLink>
            <NavLink to="/visitors-invited" className={navLinkClass}>
              <img src={visitors_invited} alt="" />
              <span className="text-sm">Visitors Invited</span>
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

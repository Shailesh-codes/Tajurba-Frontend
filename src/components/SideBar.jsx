import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoSettingsOutline, IoCalendarOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSecurityScan } from "react-icons/ai";
import Logo from "../assets/images/Tajurba-Logo-Golden.png";
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
import MemberDashboardIcon from "../assets/SVGComponents/MemberDashboardIcon";
import BDMIcon from "../assets/SVGComponents/BDMIcon";
import BusinessGivenIcon from "../assets/SVGComponents/BusinessGivenIcon";
import BusinessReceivedIcon from "../assets/SVGComponents/BusinessReceivedIcon";
import MemberCertificateIcon from "../assets/SVGComponents/MemberCertificateIcon";
import ReferralIcon from "../assets/SVGComponents/ReferralIcon";
import RequestReceivedIcon from "../assets/SVGComponents/RequestResIcon";
import VisitorsInvitedIcon from "../assets/SVGComponents/VisitorsInvitedIcon";

const SideBar = ({ isOpen, setIsOpen, setIsLogoutModalOpen }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 rounded-lg transition-all duration-200
     ${
       isActive
         ? "bg-gradient-to-r from-[#cdb065]/20 to-[#cdb065]/5 text-[#cdb065] font-semibold border-l-4 border-[#cdb065]"
         : "text-gray-300 hover:bg-[#1E293B]/70 hover:text-[#cdb065] border-l-4 border-transparent"
     }`;

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
        className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-gradient-to-b from-[#0c1424] to-[#0F172A] z-50
        transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="h-28 flex items-center justify-center px-6 py-8 border-b border-gray-700/30 bg-[#0c1424]/50">
          <img src={Logo} alt="Tajurba" className="h-20" />
        </div>

        {/* Scrollable Navigation Section */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav className="px-4 py-6 space-y-2">
            {/* Main Menu Items */}
            <span className="text-[#cdb065] text-sm font-bold uppercase tracking-wider px-4 mb-4 block">
              Main Menu
              <hr className="border-gray-700/30 mt-3" />
            </span>
            <NavLink to="/" className={navLinkClass}>
              <DashboardIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Dashboard
              </span>
            </NavLink>

            <NavLink to="/add-member" className={navLinkClass}>
              <AddMemberIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Add Member
              </span>
            </NavLink>

            <NavLink to="/assign-certificates" className={navLinkClass}>
              <AssignCertificateIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Assign Certificates
              </span>
            </NavLink>

            <NavLink to="/broadcast" className={navLinkClass}>
              <BroadcastIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Broadcast
              </span>
            </NavLink>

            <NavLink to="/chapters-list" className={navLinkClass}>
              <ChapterListIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Chapters List
              </span>
            </NavLink>

            <NavLink to="/creative-list" className={navLinkClass}>
              <SliderIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Creative Sliders List
              </span>
            </NavLink>

            <NavLink to="/mark-attendance" className={navLinkClass}>
              <MarkAttandance color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Mark Attendance & Venue Fees
              </span>
            </NavLink>

            <NavLink to="/member-list" className={navLinkClass}>
              <UserListIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Member List
              </span>
            </NavLink>

            <NavLink to="/meetings" className={navLinkClass}>
              <MeetingsIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Meetings / MDP / Socials & Training List
              </span>
            </NavLink>

            <NavLink to="/visitor-list" className={navLinkClass}>
              <VisitorIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Visitor List
              </span>
            </NavLink>
            <NavLink to="/monthly-reward" className={navLinkClass}>
              <MonthlyRewardIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Monthly Reward
              </span>
            </NavLink>

            {/* Members routes */}
            <NavLink to="/member-dashboard" className={navLinkClass}>
              <MemberDashboardIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Member Dashboard
              </span>
            </NavLink>

            <NavLink to="/bdm" className={navLinkClass}>
              <BDMIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                BDM's Done
              </span>
            </NavLink>
            <NavLink to="/business-given" className={navLinkClass}>
              <BusinessGivenIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Business Given
              </span>
            </NavLink>
            <NavLink to="/business-received" className={navLinkClass}>
              <BusinessReceivedIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Business Received
              </span>
            </NavLink>
            <NavLink to="/member-certificate" className={navLinkClass}>
              <MemberCertificateIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Member Certificate
              </span>
            </NavLink>
            <NavLink to="/chapter-members" className={navLinkClass}>
              <VisitorIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Chapter Members
              </span>
            </NavLink>
            <NavLink to="/meetings-mdp-socials" className={navLinkClass}>
              <MeetingsIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Meetings / MDP / Socials & Training Attendance & Venue Fees
              </span>
            </NavLink>
            <NavLink to="/member-monthly-reward" className={navLinkClass}>
              <MonthlyRewardIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Member Monthly Reward
              </span>
            </NavLink>
            <NavLink to="/ref-given" className={navLinkClass}>
              <ReferralIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Referral Given
              </span>
            </NavLink>
            <NavLink to="/request-received" className={navLinkClass}>
              <RequestReceivedIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Request Received
              </span>
            </NavLink>
            <NavLink to="/visitors-invited" className={navLinkClass}>
              <VisitorsInvitedIcon color="currentColor" />
              <span className="text-sm font-semibold text-white">
                Visitors Invited
              </span>
            </NavLink>

            {/* Others Section */}
            <div className="mt-10">
              <span className="text-[#cdb065] text-sm font-bold uppercase tracking-wider px-4 mb-4 block">
                Others
                <hr className="border-gray-700/30 mt-3" />
              </span>

              <NavLink to="/calendar" className={navLinkClass}>
                <IoCalendarOutline className="text-xl" />
                <span className="text-sm font-semibold">Calendar</span>
              </NavLink>

              <NavLink to="/privacy-policy" className={navLinkClass}>
                <AiOutlineSecurityScan className="text-xl" />
                <span className="text-sm font-semibold">Privacy Policy</span>
              </NavLink>

              <NavLink to="/settings" className={navLinkClass}>
                <IoSettingsOutline className="text-xl" />
                <span className="text-sm font-semibold">Settings</span>
              </NavLink>
            </div>

            {/* Footer Section */}
            <div className="pb-10 space-y-1 border-t border-gray-700/30">
              <button
                className="w-full flex items-center gap-4 px-6 py-4 rounded-lg 
                text-red-400 hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-amber-500/5 
                hover:text-amber-600 transition-all duration-200
                font-semibold border-l-4 border-transparent hover:border-amber-600"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <FiLogOut className="text-xl" />
                <span className="text-base font-semibold">Logout</span>
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

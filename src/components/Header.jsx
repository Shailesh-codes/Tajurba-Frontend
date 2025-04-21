import React, { useState, useEffect, useRef } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { BiBell } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import reward from "../assets/sidebar-icon/reward.svg";
import info from "../assets/sidebar-icon/info.svg";
import api from "../hooks/api";
import Swal from "sweetalert2";
import useClickOutside from "../hooks/useClickOutside";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ setIsSidebarOpen, isSidebarOpen }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  // Add ref for dropdown container
  const dropdownRef = useClickOutside(() => {
    setShowDropdown(false);
  });

  // Fetch broadcasts
  const fetchBroadcasts = async () => {
    try {
      const response = await api.get(`/broadcasts`);
      if (response.data.success) {
        // Only show active broadcasts in header
        const validBroadcasts = response.data.data.filter((broadcast) => {
          const isActive = broadcast.status === "active";
          const isNotExpired =
            !broadcast.end_date || new Date(broadcast.end_date) > new Date();
          return isActive && isNotExpired;
        });
        setBroadcasts(validBroadcasts);
      }
    } catch (error) {
      console.error("Error fetching broadcasts:", error);
      setBroadcasts([]);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
    const interval = setInterval(fetchBroadcasts, 300000);
    return () => clearInterval(interval);
  }, []);

  // Add this function to listen for broadcast status changes
  useEffect(() => {
    // Create an event listener for broadcast updates
    const handleBroadcastUpdate = () => {
      fetchBroadcasts();
    };

    // Listen for the custom event
    window.addEventListener("broadcastUpdated", handleBroadcastUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("broadcastUpdated", handleBroadcastUpdate);
    };
  }, []);

  const showAnnouncementDetails = () => {
    if (!broadcasts || broadcasts.length === 0) {
      Swal.fire({
        title:
          '<span class="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">Welcome to Tajurba CRM!</span>',
        html: `
          <div class="text-left p-4 bg-gray-800/50 rounded-xl border border-amber-500/20">
            <p class="mb-3 text-amber-400 font-medium">📢 No Active Announcements</p>
            <div class="space-y-2 text-gray-200">
              <p class="flex items-center gap-2">
                <span class="text-amber-500">•</span> Check back later for updates
              </p>
            </div>
          </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        background: "#111827",
        customClass: {
          popup: "bg-gray-900 text-white rounded-xl border border-amber-500/20",
          closeButton:
            "text-gray-400 hover:text-amber-500 transition-colors duration-300",
        },
      });
    } else {
      const announcementHtml = broadcasts
        .map(
          (broadcast) => `
        <div class="mb-4 p-4 bg-gray-800/50 rounded-xl border border-amber-500/20 hover:bg-gray-800 transition-all duration-300">
          <div class="flex items-center justify-between mb-2">
            <p class="text-amber-400 font-semibold">📢 Announcement ${
              broadcast.announcement_slot
            }</p>
            <span class="text-xs text-gray-400 px-2 py-1 rounded-full bg-gray-700/50 border border-gray-600/30">
              Slot #${broadcast.announcement_slot}
            </span>
          </div>
          <p class="text-gray-200 leading-relaxed">${
            broadcast.announcement_text
          }</p>
          ${
            broadcast.end_date
              ? `
            <p class="mt-2 text-xs text-gray-400">
              Expires: ${new Date(broadcast.end_date).toLocaleDateString()}
            </p>
          `
              : ""
          }
        </div>
      `
        )
        .join("");

      Swal.fire({
        title:
          '<span class="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">Current Announcements</span>',
        html: `<div class="text-left max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">${announcementHtml}</div>`,
        showCloseButton: true,
        showConfirmButton: false,
        background: "#111827",
        width: "auto",
        customClass: {
          popup:
            "bg-gray-900 text-white rounded-xl border border-amber-500/20 max-w-lg",
          closeButton:
            "text-gray-400 hover:text-amber-500 transition-colors duration-300",
          htmlContainer: "custom-scrollbar",
        },
      });
    }
  };

  const getAnnouncementText = () => {
    if (!broadcasts || broadcasts.length === 0) {
      return "📢No active announcements check back later🌟 ";
    }

    return broadcasts.map((b) => `📢 ${b.announcement_text}`).join("   ●   ");
  };

  // Add logout handler
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setShowDropdown(false); // Close the dropdown after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
      Swal.fire({
        title: "Logout Failed",
        text: "There was an error logging out. Please try again.",
        icon: "error",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#D97706",
      });
    }
  };

  return (
    <header
      className={`fixed z-40 top-0 right-0 left-0 transition-all duration-300
      border-b border-gray-700/50 bg-[#0F172A]
      ${isVisible ? "translate-y-0" : "-translate-y-full"}
      ${isCompact ? "h-20" : "h-28"}
      lg:left-64`}
    >
      <div className="flex items-center justify-between h-full w-full px-4 lg:px-6">
        {/* Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-[#1E293B]"
        >
          <FiMenu className="w-6 h-6 text-gray-300" />
        </button>

        {/* Enhanced Announcement Banner with Improved Width */}
        <div className="flex-1 max-w-[calc(100%-280px)] lg:max-w-[calc(100%-200px)] xl:max-w-[calc(100%-300px)] mx-auto hidden sm:block">
          <div
            onClick={showAnnouncementDetails}
            className="relative group cursor-pointer mx-2 lg:mx-4"
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600/20 via-amber-500/20 to-amber-600/20 animate-gradient-x" />

            {/* Inner Glow Effect */}
            <div className="absolute inset-[1px] rounded-[10px] bg-gradient-to-b from-amber-900/90 to-gray-900/95 backdrop-blur-sm">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent shimmer-effect" />
            </div>

            {/* Content Container */}
            <div className="relative rounded-xl overflow-hidden">
              {/* Top Highlight Line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

              {/* Content with sliding animation */}
              <div className="px-6 py-3.5">
                <div className="sliding-text-container">
                  <div className="sliding-text">
                    <span className="text-amber-200/90 font-medium whitespace-nowrap pr-8 tracking-wide text-[15px]">
                      {getAnnouncementText()}
                    </span>
                  </div>
                  <div className="sliding-text" aria-hidden="true">
                    <span className="text-amber-200/90 font-medium whitespace-nowrap pr-8 tracking-wide text-[15px]">
                      {getAnnouncementText()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Highlight Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>

            {/* Interactive Hover Effects */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-amber-500/10 to-amber-600/10 animate-pulse-slow" />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent" />
            </div>

            {/* Enhanced Edge Fade Effects */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0F172A] via-[#0F172A]/90 to-transparent z-10" />

            {/* Enhanced Click Indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-amber-500/70 group-hover:text-amber-400 transition-all duration-300">
              <span className="text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                View All
              </span>
              <svg
                className="w-5 h-5 animate-bounce-gentle"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* New: Active Indicator Dot */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500/50 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center space-x-3">
            <button className="relative border border-gray-700 p-3 rounded-xl hover:bg-[#1E293B]">
              <div className="">
                <img src={reward} alt="reward" className="w-6 h-6" />
              </div>

              <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-amber-300 to-amber-700 opacity-90 rounded-full animate-bounce"></span>
            </button>
            <button className="relative border border-gray-700 p-3 rounded-xl hover:bg-[#1E293B]">
              <img src={info} alt="info" className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-blue-300 to-blue-700 opacity-90 rounded-full animate-bounce"></span>
            </button>
          </div>

          {/* Profile Section */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1E293B]"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${auth.user?.name}`}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-gray-700"
              />
            </button>

            {/* Enhanced Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0F172A] rounded-xl shadow-2xl py-1 border border-amber-500/20 transform transition-all duration-300 ease-in-out">
                {/* Profile Section */}
                <div className="px-4 py-4 border-b border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${auth.user?.name}`}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border-2 border-amber-500/20"
                    />
                    <div>
                      <p className="text-sm font-medium text-amber-500">
                        {auth.user?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {auth.user?.email}
                      </p>
                      <span className="inline-block px-2 py-1 mt-1 text-[10px] font-medium bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                        {auth.user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2 px-1">
                  {/* Privacy Policy */}
                  <button className="w-full px-4 py-3 text-left text-sm hover:bg-[#1E293B] group flex items-center text-gray-300 rounded-lg transition-all duration-200">
                    <div className="mr-3 p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                      <MdOutlinePrivacyTip className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium group-hover:text-amber-500 transition-colors">
                        Privacy Policy
                      </span>
                      <span className="text-xs text-gray-500">
                        View our policies
                      </span>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="my-2 border-t border-gray-700/50"></div>

                  {/* Updated Logout button */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-red-500/10 group flex items-center text-gray-300 rounded-lg transition-all duration-200"
                  >
                    <div className="mr-3 p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                      <FiLogOut className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium group-hover:text-red-400 transition-colors">
                        Sign out
                      </span>
                      <span className="text-xs text-gray-500">
                        Exit your account
                      </span>
                    </div>
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

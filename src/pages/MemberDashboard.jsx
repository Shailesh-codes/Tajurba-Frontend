import React, { useState } from "react";
import {
  Medal,
  Users,
  Handshake,
  UserPlus,
  BookOpen,
  GraduationCap,
  Calendar,
  Briefcase,
  UserCheck,
  Trophy,
  Target,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

// Import your SVG icons
import meetingIcon from "../assets/images/icons/meeting.svg";
import bdmIcon from "../assets/images/icons/bdm.svg";
import trainingIcon from "../assets/images/icons/training.svg";
import themeEventIcon from "../assets/images/icons/eventt.svg";
import mdpIcon from "../assets/images/icons/bdm.svg";
import training from "../assets/images/flag/icon.svg";
import eventIcon from "../assets/images/icons/eventt.svg";

const StatCard = ({ icon: Icon, title, value, trend, period }) => {
  return (
    <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-purple-500/5 to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg shadow-[#D4B86A]/20 group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
            <Icon className="w-6 h-6 text-gray-900" />
          </div>
          <h3 className="text-[#D4B86A] font-medium tracking-wide">{title}</h3>
        </div>

        <div className="space-y-3 relative">
          <p className="text-4xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
            {value}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-400">
              <TrendingUpIcon />
              <span>+{trend}</span>
            </div>
            <span className="text-gray-400">{period}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendingUpIcon = () => (
  <svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.4318 0.522827L12.4446 0.522827L8.55575 0.522827L7.56859 0.522827C6.28227 0.522827 5.48082 1.91818 6.12896 3.02928L9.06056 8.05489C9.7037 9.1574 11.2967 9.1574 11.9398 8.05489L14.8714 3.02928C15.5196 1.91818 14.7181 0.522828 13.4318 0.522827Z"
      fill="currentColor"
    />
    <path
      opacity="0.4"
      d="M2.16878 13.0485L3.15594 13.0485L7.04483 13.0485L8.03199 13.0485C9.31831 13.0485 10.1198 11.6531 9.47163 10.542L6.54002 5.5164C5.89689 4.41389 4.30389 4.41389 3.66076 5.5164L0.729153 10.542C0.0810147 11.6531 0.882466 13.0485 2.16878 13.0485Z"
      fill="currentColor"
    />
  </svg>
);

const StatisticCard = ({ icon: Icon, title, value, trend, period }) => {
  return (
    <div
      className="p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl hover:bg-gray-900/90 
                    transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-6 h-6 text-[#D4B86A]" />
          <span className="text-gray-300 font-medium">{title}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-white mb-2">{value}</span>
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-emerald-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 20h-2V8l-5.5 5.5-1.42-1.42L12 4.16l7.92 7.92-1.42 1.42L13 8v12z" />
            </svg>
            <span className="text-emerald-500">+{trend}</span>
            <span className="text-gray-400">{period}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ icon, title, value, trend }) => {
  return (
    <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#D4B86A]/20">
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-transparent to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
            {icon}
          </div>
          <h3 className="text-[#D4B86A] font-medium">{title}</h3>
        </div>

        <div className="space-y-3">
          <p className="text-4xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
            {value}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-500">
              <TrendingUpIcon />
              <span className="text-emerald-500">+{trend}</span>
            </div>
            <span className="text-gray-400">this month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemberDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  return (
    <div className="mt-32 p-6 space-y-8 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-950">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-2xl shadow-lg shadow-[#D4B86A]/20">
            <Users className="w-7 h-7 text-gray-900" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white bg-clip-text">
              Dashboard Overview
            </h2>
            <p className="text-gray-400 mt-1">
              Monitor your chapter performance
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-300 shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-transparent to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
        <div className="relative p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Date Range */}
            <div className="relative group space-y-3">
              <label className="text-sm font-semibold text-[#D4B86A] mb-2 block">
                Date Range
              </label>
              <div className="flex gap-4">
                <input
                  type="date"
                  className="flex-1 p-4 bg-gray-800/50 rounded-xl border border-[#D4B86A]/30 focus:border-[#D4B86A] focus:ring-2 focus:ring-[#D4B86A]/20 text-white transition-all duration-300 [color-scheme:dark] text-sm"
                />
                <input
                  type="date"
                  className="flex-1 p-4 bg-gray-800/50 rounded-xl border border-[#D4B86A]/30 focus:border-[#D4B86A] focus:ring-2 focus:ring-[#D4B86A]/20 text-white transition-all duration-300 [color-scheme:dark] text-sm"
                />
              </div>
            </div>

            {/* Chapter Selector */}
            <div className="relative group space-y-3">
              <label className="text-sm font-semibold text-[#D4B86A] mb-2 block">
                Chapter
              </label>
              <select
                className="w-full p-4 bg-gray-800/50 rounded-xl border border-[#D4B86A]/30 focus:border-[#D4B86A] focus:ring-2 focus:ring-[#D4B86A]/20 text-white transition-all duration-300 text-sm appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4B86A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                <option value="">All Chapters</option>
                <option value="chapter-a">Chapter A</option>
                <option value="chapter-b">Chapter B</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}

      {/* Statistics Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        {/* Chapter Statistics */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-300 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-transparent to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold bg-clip-text text-white">
                  Chapter Statistics
                </h2>
                <span className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] text-gray-900">
                  All Chapters
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                icon={() => <Handshake className="w-6 h-6 text-white" />}
                title="Referrals Exchanged"
                value="124"
                trend="12"
                period="last 15 days"
              />
              <StatCard
                icon={() => <Briefcase className="w-6 h-6 text-white" />}
                title="Total Business Revenue"
                value="₹2.4 CR"
                trend="8"
                period="last 15 days"
              />
              <StatCard
                icon={() => <Users className="w-6 h-6 text-white" />}
                title="Total BDMs"
                value="45"
                trend="5"
                period="last 15 days"
              />
              <StatCard
                icon={() => <UserPlus className="w-6 h-6 text-white" />}
                title="Total Guests"
                value="89"
                trend="15"
                period="last 15 days"
              />
            </div>
          </div>
        </div>

        {/* All Chapters Statistics */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-300 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-transparent to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          <div className="relative p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-clip-text text-white">
                All Chapters Statistics
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ActivityCard
                icon={<Users className="w-6 h-6" />}
                title="Meetings"
                value="48"
                trend="6"
              />
              <ActivityCard
                icon={<BookOpen className="w-6 h-6" />}
                title="MDP"
                value="12"
                trend="3"
              />
              <ActivityCard
                icon={<GraduationCap className="w-6 h-6" />}
                title="Socials & Training"
                value="24"
                trend="4"
              />
              <ActivityCard
                icon={<Calendar className="w-6 h-6" />}
                title="Events"
                value="15"
                trend="2"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemberDashboard;

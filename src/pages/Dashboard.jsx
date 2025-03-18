import React, { useState } from "react";
import {
  Medal,
  Users,
  Handshake,
  UserPlus,
  Briefcase,
  GraduationCap,
  Calendar,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Import SVG icons
import meetingIcon from "../assets/images/icons/meeting.svg";
import bdmIcon from "../assets/images/icons/bdm.svg";
import trainingIcon from "../assets/images/icons/training.svg";
import eventIcon from "../assets/images/icons/eventt.svg";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  return (
    <div className="mt-32 lg:p-4 sm:p-6 space-y-6 sm:space-y-8 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-950">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl sm:rounded-2xl shadow-lg shadow-[#D4B86A]/20">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white bg-clip-text">
              Dashboard Overview
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-0.5 sm:mt-1">
              Monitor your performance
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-300 shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-transparent to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
        <div className="relative p-4 sm:p-8">
          <div className="grid grid-cols-1 gap-4 sm:gap-8">
            {/* Date Range */}
            <div className="relative group space-y-2 sm:space-y-3">
              <label className="text-sm font-semibold text-[#D4B86A] mb-1 sm:mb-2 block">
                Date Range
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="date"
                  className="flex-1 p-3 sm:p-4 bg-gray-800/50 rounded-lg sm:rounded-xl border border-[#D4B86A]/30 focus:border-[#D4B86A] focus:ring-2 focus:ring-[#D4B86A]/20 text-white transition-all duration-300 [color-scheme:dark] text-sm"
                />
                <input
                  type="date"
                  className="flex-1 p-3 sm:p-4 bg-gray-800/50 rounded-lg sm:rounded-xl border border-[#D4B86A]/30 focus:border-[#D4B86A] focus:ring-2 focus:ring-[#D4B86A]/20 text-white transition-all duration-300 [color-scheme:dark] text-sm"
                />
              </div>
            </div>

            {/* Status Selector */}
            <div className="relative group space-y-2 sm:space-y-3">
              <label className="text-sm font-semibold text-[#D4B86A] mb-1 sm:mb-2 block">
                Status
              </label>
              <select
                className="w-full p-3 sm:p-4 bg-gray-800/50 rounded-lg sm:rounded-xl border border-[#D4B86A]/30 focus:border-[#D4B86A] focus:ring-2 focus:ring-[#D4B86A]/20 text-white transition-all duration-300 text-sm appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4B86A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chapter Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
      >
        <div className="group relative overflow-hidden p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-purple-500/5 to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg shadow-[#D4B86A]/20 group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
                <Handshake className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-[#D4B86A] font-medium tracking-wide">
                Referrals Exchanged
              </h3>
            </div>

            <div className="space-y-3 relative">
              <p className="text-4xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                6688
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+0</span>
                </div>
                <span className="text-gray-400">last 15 days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-purple-500/5 to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg shadow-[#D4B86A]/20 group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
                <Briefcase className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-[#D4B86A] font-medium tracking-wide">
                Total Business Revenue
              </h3>
            </div>

            <div className="space-y-3 relative">
              <p className="text-4xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                ₹95.59 CR
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+0</span>
                </div>
                <span className="text-gray-400">last 15 days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-purple-500/5 to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg shadow-[#D4B86A]/20 group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
                <Users className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-[#D4B86A] font-medium tracking-wide">
                Total BDMs
              </h3>
            </div>

            <div className="space-y-3 relative">
              <p className="text-4xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                2019
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+0</span>
                </div>
                <span className="text-gray-400">last 15 days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-purple-500/5 to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg shadow-[#D4B86A]/20 group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
                <UserPlus className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-[#D4B86A] font-medium tracking-wide">
                Total Guests
              </h3>
            </div>

            <div className="space-y-3 relative">
              <p className="text-4xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                783
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+0</span>
                </div>
                <span className="text-gray-400">last 15 days</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {/* Card 1 - Meetings & Attendance */}
        <div className="group relative overflow-hidden p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500 hover:transform hover:scale-[1.02]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-purple-500/5 to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg shadow-[#D4B86A]/20 group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
                <Users className="w-4 h-4 text-gray-900" />
              </div>
              <h3 className="text-[#D4B86A] font-medium text-sm">
                Meetings & Attendance
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                  4
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    +0
                  </span>
                  <span className="text-gray-400 text-xs">this month</span>
                </div>
              </div>
              <div className="flex flex-col pt-3 border-t border-gray-800">
                <span className="text-2xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                  54.5%
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    +0%
                  </span>
                  <span className="text-gray-400 text-xs">from last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - MDP & Attendance */}
        <div className="group relative overflow-hidden p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500 hover:transform hover:scale-[1.02]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-purple-500/5 to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg shadow-[#D4B86A]/20 group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
                <Medal className="w-4 h-4 text-gray-900" />
              </div>
              <h3 className="text-[#D4B86A] font-medium text-sm">
                MDP & Attendance
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                  1
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    +0
                  </span>
                  <span className="text-gray-400 text-xs">this month</span>
                </div>
              </div>
              <div className="flex flex-col pt-3 border-t border-gray-800">
                <span className="text-2xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                  33.3%
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    +0%
                  </span>
                  <span className="text-gray-400 text-xs">attendance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - Socials & Training */}
        <div className="group relative overflow-hidden p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500 hover:transform hover:scale-[1.02]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-purple-500/5 to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg shadow-[#D4B86A]/20 group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
                <GraduationCap className="w-4 h-4 text-gray-900" />
              </div>
              <h3 className="text-[#D4B86A] font-medium text-sm">
                Socials & Training
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                  1
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    +0
                  </span>
                  <span className="text-gray-400 text-xs">this month</span>
                </div>
              </div>
              <div className="flex flex-col pt-3 border-t border-gray-800">
                <span className="text-2xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                  33.3%
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    +0%
                  </span>
                  <span className="text-gray-400 text-xs">attendance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 - Total Members */}
        <div className="group relative overflow-hidden p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500 hover:transform hover:scale-[1.02]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-purple-500/5 to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg shadow-[#D4B86A]/20 group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
                <Users className="w-4 h-4 text-gray-900" />
              </div>
              <h3 className="text-[#D4B86A] font-medium text-sm">
                Total Members
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                  4
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    +0
                  </span>
                  <span className="text-gray-400 text-xs">this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#0A0F1C] to-[#1A1F2C] p-4 sm:p-8 mt-6 sm:mt-8 border border-[#D4B86A]/20 hover:border-[#D4B86A]/40 transition-all duration-500"
      >
        {/* Glowing background effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[#D4B86A]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4B86A] to-[#B88746] shadow-lg shadow-[#D4B86A]/20">
                <TrendingUp className="w-5 h-5 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Statistics Overview
              </h3>
            </div>

            <select className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:border-[#D4B86A]/50 focus:border-[#D4B86A] text-white text-sm transition-all duration-300 outline-none backdrop-blur-sm">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Chart */}
          <div className="bg-white/[0.02] rounded-lg sm:rounded-xl p-3 sm:p-6 border border-white/10 backdrop-blur-sm hover:border-[#D4B86A]/30 transition-all duration-500">
            <div className="h-[300px] sm:h-[400px] w-full">
              <Line
                data={{
                  labels: generateLabels(),
                  datasets: [
                    {
                      label: "Referrals",
                      data: generateData(),
                      borderColor: "#D4B86A",
                      backgroundColor: "rgba(212, 184, 106, 0.15)",
                      fill: true,
                      tension: 0.3,
                      borderWidth: 2.5,
                      pointRadius: 2,
                      pointBackgroundColor: "#D4B86A",
                      pointBorderColor: "#D4B86A",
                      pointHoverRadius: 6,
                      pointHoverBackgroundColor: "#D4B86A",
                      pointHoverBorderColor: "#fff",
                      pointHoverBorderWidth: 2,
                      pointShadowBlur: 20,
                    },
                    {
                      label: "Revenue",
                      data: generateData(),
                      borderColor: "#10B981",
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      fill: true,
                      tension: 0.3,
                      borderWidth: 2.5,
                      pointRadius: 2,
                      pointBackgroundColor: "#10B981",
                      pointBorderColor: "#10B981",
                      pointHoverRadius: 6,
                      pointHoverBackgroundColor: "#10B981",
                      pointHoverBorderColor: "#fff",
                      pointHoverBorderWidth: 2,
                      pointShadowBlur: 20,
                    },
                    {
                      label: "BDMs",
                      data: generateData(),
                      borderColor: "#3B82F6",
                      backgroundColor: "rgba(59, 130, 246, 0.15)",
                      fill: true,
                      tension: 0.3,
                      borderWidth: 2.5,
                      pointRadius: 2,
                      pointBackgroundColor: "#3B82F6",
                      pointBorderColor: "#3B82F6",
                      pointHoverRadius: 6,
                      pointHoverBackgroundColor: "#3B82F6",
                      pointHoverBorderColor: "#fff",
                      pointHoverBorderWidth: 2,
                      pointShadowBlur: 20,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: "index",
                    intersect: false,
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(255, 255, 255, 0.03)",
                        drawBorder: false,
                        lineWidth: 1,
                      },
                      ticks: {
                        color: "#94A3B8",
                        padding: 15,
                        font: {
                          size: 11,
                        },
                      },
                      border: {
                        display: false,
                      },
                    },
                    x: {
                      grid: {
                        color: "rgba(255, 255, 255, 0.03)",
                        drawBorder: false,
                        lineWidth: 1,
                      },
                      ticks: {
                        color: "#94A3B8",
                        padding: 15,
                        font: {
                          size: 11,
                        },
                      },
                      border: {
                        display: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: "top",
                      align: "end",
                      labels: {
                        color: "#94A3B8",
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 25,
                        font: {
                          size: 12,
                          weight: "500",
                        },
                        boxWidth: 8,
                        boxHeight: 8,
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.85)",
                      titleColor: "#fff",
                      bodyColor: "#fff",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderWidth: 1,
                      padding: {
                        x: 15,
                        y: 10,
                      },
                      displayColors: true,
                      usePointStyle: true,
                      bodyFont: {
                        size: 12,
                      },
                      titleFont: {
                        size: 13,
                        weight: "bold",
                      },
                      callbacks: {
                        label: function (context) {
                          let label = context.dataset.label || "";
                          if (label) {
                            label += ": ";
                          }
                          if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat("en-US").format(
                              context.parsed.y
                            );
                          }
                          return label;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Add these component definitions above the Dashboard component
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

const ActivityCard = ({ iconSrc, title, value, trend }) => {
  return (
    <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/75 to-gray-900/90 border border-[#D4B86A]/30 hover:border-[#D4B86A]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#D4B86A]/20">
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4B86A]/10 via-transparent to-[#D4B86A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] shadow-lg group-hover:shadow-[#D4B86A]/40 transition-all duration-500">
            <img src={iconSrc} alt={title} className="w-6 h-6 brightness-0" />
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

const generateLabels = () => {
  const months = ["Feb", "Mar"];
  const labels = [];

  months.forEach((month) => {
    for (let i = 1; i <= 15; i++) {
      labels.push(`${month} ${i}`);
    }
  });

  return labels;
};

const generateData = () => {
  return Array.from({ length: 30 }, () => Math.random() * 0.5);
};

export default Dashboard;

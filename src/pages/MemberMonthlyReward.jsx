import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  ChevronLeft,
  Filter,
  Diamond,
  Trophy,
  LucideHandshake,
  Medal,
  Users,
  Handshake,
  UserPlus,
  Target,
  Share2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import calendarIcon from "../assets/images/icons/calender-icon.svg";

const MetricCard = ({
  title,
  value,
  points,
  subtitle,
  maxValue,
  icon: Icon,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-300">{title}</span>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400">
          {points} points
        </span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        {Icon && <Icon className="w-5 h-5 text-amber-500" />}
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-3">{subtitle}</p>}
    </div>
  );
};

const MemberMonthlyReward = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });
  const [selectedChapter, setSelectedChapter] = useState("");

  // Update the achievementCategories data with emojis
  const achievementCategories = [
    {
      icon: <Diamond className="w-5 h-5 text-blue-400" />,
      emoji: "💎",
      title: "Diamond",
      points: "76-100 points",
      memberCount: 0,
      percentage: 0,
    },
    {
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      emoji: "🏆",
      title: "Gold",
      points: "51-75 points",
      memberCount: 0,
      percentage: 0,
    },
    {
      icon: <Medal className="w-5 h-5 text-gray-300" />,
      emoji: "🥈",
      title: "Silver",
      points: "30-50 points",
      memberCount: 0,
      percentage: 0,
    },
    {
      icon: <Medal className="w-5 h-5 text-amber-600" />,
      emoji: "🥉",
      title: "Bronze",
      points: "Below 30 points",
      memberCount: 3,
      percentage: 100,
    },
  ];

  // Update the fortnightRecognition data
  const fortnightRecognition = [
    {
      icon: <Handshake className="w-5 h-5 text-purple-400" />,
      title: "Highest Business Given",
      members: [
        {
          name: "Manish Saroj",
          chapter: "Chapter",
          date: "04-03-2025",
        },
      ],
    },
    {
      icon: <Users className="w-5 h-5 text-purple-400" />,
      title: "Highest Visitor Invited",
      members: [],
    },
    {
      icon: <Target className="w-5 h-5 text-purple-400" />,
      title: "Best Elevator Pitch",
      members: [],
    },
    {
      icon: <Share2 className="w-5 h-5 text-purple-400" />,
      title: "Maximum Referrals Given",
      members: [],
    },
  ];

  // Mock user data
  const userData = {
    meetings: {
      value: 0,
      points: 0,
      maxValue: 2,
      subtitle: "2 more meetings needed",
    },
    bdm: {
      given: 0,
      received: 0,
      points: 0,
      maxValue: 4,
      subtitle: "4 more BDMs needed",
    },
    business: {
      value: 0,
      points: 0,
      maxValue: 500000,
      subtitle: "₹5,00,000 more needed",
    },
    referrals: {
      value: 0,
      points: 0,
      maxValue: 5,
      subtitle: "5 more referrals needed",
    },
    visitors: {
      value: 0,
      points: 0,
      maxValue: 3,
      subtitle: "3 more visitors needed",
    },
    socials: {
      value: 0,
      points: 0,
      maxValue: 3,
      subtitle: "3 more socials needed",
    },
    totalPoints: 0,
  };

  return (
    <div className="mt-32 flex flex-col space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-4">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-2xl border border-amber-500/20">
            <Award className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              Monthly Reward & Recognition
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Track and celebrate member achievements
            </p>
          </div>
        </div>
        <button
          onClick={() => (window.location.href = "/certificates")}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-green-900/20"
        >
          <Award className="w-5 h-5" />
          <span>View Certificates</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <div className="relative flex items-center">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-48 pl-6 py-2.5 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 [color-scheme:dark]"
          />
        </div>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="w-48 px-4 py-2.5 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
        >
          <option value="">All Chapters</option>
          <option value="chapter-a">Chapter A</option>
          <option value="chapter-b">Chapter B</option>
        </select>
      </div>

      {/* Monthly Achievement Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-amber-500" />
          Your Monthly Achievement
        </h3>
        <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-6">
            {/* Profile QR Section */}
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              {/* QR Code Container */}
              <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-2xl shadow-lg shadow-amber-500/10 border border-gray-700">
                <div className="w-full h-full bg-white p-2 rounded-lg">
                  {/* Replace with actual QR code */}
                  <img
                    src="path-to-qr-code"
                    alt="Profile QR"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Total Points Card */}
              <div className="w-40 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20">
                <div className="px-6 py-4 text-center">
                  <div className="text-5xl font-bold text-white mb-1">
                    {userData.totalPoints}
                  </div>
                  <div className="text-white/90 text-sm font-medium">
                    Total Points
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                title="Meetings"
                value={userData.meetings.value}
                points={userData.meetings.points}
                subtitle={userData.meetings.subtitle}
                maxValue={userData.meetings.maxValue}
                icon={Users}
              />

              <MetricCard
                title="BDM"
                value={`${userData.bdm.given} / ${userData.bdm.received}`}
                points={userData.bdm.points}
                subtitle={userData.bdm.subtitle}
                maxValue={userData.bdm.maxValue}
                icon={Handshake}
              />

              <MetricCard
                title="Business"
                value={`₹${userData.business.value}`}
                points={userData.business.points}
                subtitle={userData.business.subtitle}
                maxValue={userData.business.maxValue}
                icon={Briefcase}
              />

              <MetricCard
                title="Referrals"
                value={userData.referrals.value}
                points={userData.referrals.points}
                subtitle={userData.referrals.subtitle}
                maxValue={userData.referrals.maxValue}
                icon={Share2}
              />

              <MetricCard
                title="Visitors"
                value={userData.visitors.value}
                points={userData.visitors.points}
                subtitle={userData.visitors.subtitle}
                maxValue={userData.visitors.maxValue}
                icon={UserPlus}
              />

              <MetricCard
                title="Socials"
                value={userData.socials.value}
                points={userData.socials.points}
                subtitle={userData.socials.subtitle}
                maxValue={userData.socials.maxValue}
                icon={Users}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Categories Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-500" />
          Chapter Achievement Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievementCategories.map((category, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl 
                         border border-gray-700 hover:border-amber-500/30 hover:shadow-lg 
                         hover:shadow-amber-500/5 transition-all duration-300 relative overflow-hidden"
            >
              {/* Large Background Emoji */}
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-[160px] pointer-events-none select-none">
                {category.emoji}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gray-700/50 rounded-xl">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-400">{category.points}</p>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                    {category.memberCount}
                  </span>
                  <p className="text-gray-400 mt-2">
                    Members ({category.percentage}%)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fortnight Recognition Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Chapter Fortnight Recognition
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fortnightRecognition.map((recognition, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-gray-800/40 backdrop-blur-xl border border-gray-700"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gray-700 rounded-lg">
                  {recognition.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {recognition.title}
                </h3>
              </div>
              <div>
                {recognition.members.length > 0 ? (
                  recognition.members.map((member, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-gray-900">
                      <p className="text-white font-medium">{member.name}</p>
                      <div className="flex justify-between mt-2 text-sm text-gray-400">
                        <span>{member.chapter}</span>
                        <span>{member.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-gray-900 text-center">
                    <p className="text-gray-400">
                      No member assigned this certificate
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberMonthlyReward;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import reward from "../assets/images/icons/cup.svg";
import {
  Award,
  Diamond,
  Trophy,
  Medal,
  Users,
  Handshake,
  UserPlus,
  Target,
  Share2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// MetricCard component from MemberMonthlyReward
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

const MonthlyReward = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [loading, setLoading] = useState(true);
  const ADMIN_ROLE = "Admin";
  const [data, setData] = useState({
    categories: [],
    fortnight_recognition: [],
  });

  // Member-specific data
  const [userData, setUserData] = useState({
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
  });

  // Dummy data for demonstration
  const dummyCategories = [
    {
      emoji: "💎",
      title: "Diamond",
      points: "500+ Points",
      memberCount: 25,
      percentage: 15,
    },
    {
      emoji: "🏆",
      title: "Gold",
      points: "400+ Points",
      memberCount: 42,
      percentage: 28,
    },
    {
      emoji: "🥈",
      title: "Silver",
      points: "300+ Points",
      memberCount: 56,
      percentage: 37,
    },
    {
      emoji: "🥉",
      title: "Bronze",
      points: "200+ Points",
      memberCount: 78,
      percentage: 52,
    },
  ];

  const dummyFortnightRecognition = [
    {
      emoji: "🌟",
      title: "Highest Business Given",
      members: [
        { name: "John Doe", chapter: "Mumbai Chapter", date: "15 Mar 2024" },
        { name: "Jane Smith", chapter: "Delhi Chapter", date: "14 Mar 2024" },
      ],
    },
    {
      emoji: "🎯",
      title: "Highest Visitor Invited",
      members: [
        { name: "Alex Johnson", chapter: "Pune Chapter", date: "13 Mar 2024" },
      ],
    },
    {
      emoji: "🤝",
      title: "Best Elevator Pitch",
      members: [
        {
          name: "Sarah Wilson",
          chapter: "Bangalore Chapter",
          date: "12 Mar 2024",
        },
      ],
    },
    {
      emoji: "📈",
      title: "Maximum Referrals Given",
      members: [],
    },
  ];

  function getCurrentMonth() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData({
        categories: dummyCategories,
        fortnight_recognition: dummyFortnightRecognition,
      });
      setLoading(false);
    }, 1500);
  }, [selectedMonth, selectedChapter]);

  const LoadingCard = () => (
    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-700 animate-pulse rounded-xl"></div>
        <div className="flex-1">
          <div className="w-24 h-4 bg-gray-700 animate-pulse rounded mb-1"></div>
          <div className="w-16 h-3 bg-gray-700 animate-pulse rounded"></div>
        </div>
      </div>
      <div className="w-full h-24 bg-gray-700 animate-pulse rounded-lg mb-4"></div>
      <div className="w-full h-8 bg-gray-700 animate-pulse rounded-lg"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-6 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800"
    >
      {/* Header Section */}
      <div className="mt-32 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl shadow-lg"
            >
              <img
                src={reward}
                alt="reward"
                className="w-6 h-6 animate-pulse"
              />
            </motion.div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                Monthly Reward & Fortnight Recognition
              </h2>
              <p className="text-sm text-gray-400">
                Track and celebrate member achievements
              </p>
            </div>
          </div>

          {isAdmin ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/assign-certificates")}
              className="w-full lg:w-auto group flex items-center justify-center gap-2.5 px-5 py-2.5 
                      bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 
                      text-white/90 hover:text-white rounded-xl transition-all duration-300 
                      shadow-lg hover:shadow-xl hover:shadow-amber-900/30"
            >
              <Award className="w-5 h-5" />
              <span className="font-semibold tracking-wide text-sm">
                Assign Certificates
              </span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/member-certificate")}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 
                      hover:from-amber-500 hover:to-amber-600 text-white rounded-xl flex items-center 
                      justify-center gap-2 transition-all duration-300 shadow-lg shadow-green-900/20"
            >
              <Award className="w-5 h-5" />
              <span>View Certificates</span>
            </motion.button>
          )}
        </div>

        {/* Filters Section */}
        <div className="flex justify-end w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
            <div className="relative w-full xs:w-48">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-gray-800 text-gray-100 p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full xs:w-48 bg-gray-800 text-gray-100 p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="all">All Chapters</option>
              <option value="1">Mumbai Chapter</option>
              <option value="2">Delhi Chapter</option>
              <option value="3">Bangalore Chapter</option>
            </select>
          </div>
        </div>
      </div>

      {(!auth?.role || (auth?.role && auth.role !== ADMIN_ROLE)) && (
        <div className="mt-4 lg:mt-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-amber-500" />
            Your Monthly Achievement
          </h3>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 items-center gap-6">
              {/* Profile QR Section */}
              <div className="flex flex-col items-center justify-center gap-6 w-full">
                <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-2xl shadow-lg shadow-amber-500/10 border border-gray-700">
                  <div className="w-full h-full bg-white p-2 rounded-lg">
                    <img
                      src="path-to-qr-code"
                      alt="Profile QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

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
                  value={`${userData.bdm.given}/${userData.bdm.received}`}
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
      )}

      {/* Monthly Achievement Categories */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-gray-100">
            Monthly Achievement Categories
          </h4>
          <Link
            to="/member-levels"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array(4).fill(<LoadingCard />)
            : data.categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-4 rounded-xl bg-gray-800/50 backdrop-blur-xl 
                          border border-gray-700 hover:border-amber-500/20
                          shadow-lg hover:shadow-xl hover:shadow-amber-500/5
                          transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-2 bg-gradient-to-r from-gray-700 to-gray-800 
                                  rounded-xl shadow-lg relative"
                      >
                        <span className="text-xl">{category.emoji}</span>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                      </motion.div>
                      <div>
                        <span className="text-base text-gray-100 font-semibold group-hover:text-amber-400 transition-colors">
                          {category.title}
                        </span>
                        <p className="text-xs text-gray-400">
                          {category.points}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-6 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="text-8xl font-bold text-gray-500">
                        {category.emoji}
                      </span>
                    </div>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative"
                    >
                      <span className="text-4xl font-bold text-gray-100">
                        {category.memberCount}
                      </span>
                      <p className="text-gray-400 text-sm">
                        Members ({category.percentage}%)
                      </p>
                    </motion.div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/member-levels")}
                    className="w-full mt-2 py-2 px-4 bg-gray-900 hover:bg-gray-800 
                            text-gray-100 rounded-lg transition-all duration-300 text-sm
                            relative group/btn"
                  >
                    View All
                    <span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 
                                 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 
                                 transition-all duration-300"
                    >
                      →
                    </span>
                  </motion.button>
                </motion.div>
              ))}
        </div>
      </div>

      {/* Fortnight Recognition */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-gray-100">
            Fortnight Recognition
          </h4>
          <Link
            to="/certificate-list"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array(4).fill(<LoadingCard />)
            : data.fortnight_recognition.map((recognition, index) => (
                <motion.div
                  key={recognition.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-4 rounded-xl bg-gray-800/50 backdrop-blur-xl 
                          border border-gray-700 hover:border-purple-500/20
                          shadow-lg hover:shadow-xl hover:shadow-purple-500/5
                          transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-2 bg-gradient-to-r from-gray-700 to-gray-800 
                              rounded-xl shadow-lg relative"
                    >
                      <span className="text-xl">{recognition.emoji}</span>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                    </motion.div>
                    <span className="text-base text-gray-100 font-semibold group-hover:text-purple-400 transition-colors">
                      {recognition.title}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recognition.members.length > 0 ? (
                      recognition.members.map((member, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gray-900/50 p-3 rounded-lg hover:bg-gray-800/50 
                                  transition-colors duration-300 group/member"
                        >
                          <div className="flex flex-col">
                            <span className="text-gray-100 font-medium group-hover/member:text-white transition-colors">
                              {member.name}
                            </span>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-gray-400 text-xs group-hover/member:text-gray-300">
                                {member.chapter}
                              </span>
                              <span className="text-gray-400 text-xs group-hover/member:text-gray-300">
                                {member.date}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                        <span className="text-gray-400 text-sm">
                          No member assigned this certificate
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MonthlyReward;

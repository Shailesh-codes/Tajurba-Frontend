import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import reward from "../assets/images/icons/cup.svg";

const MonthlyReward = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    categories: [],
    fortnight_recognition: [],
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
    // Simulate API call
    setLoading(true);
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/assign-certificates")}
            className="w-full lg:w-auto group flex items-center justify-center gap-2.5 px-5 py-2.5 
                    bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 
                    text-white/90 hover:text-white rounded-xl transition-all duration-300 
                    shadow-lg hover:shadow-xl hover:shadow-amber-900/30"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-12 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold tracking-wide text-sm">
              Assign Certificates
            </span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex justify-end w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
            <div className="relative w-full xs:w-48">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-gray-800 text-gray-100 p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
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

      {/* Content Sections */}
      <div className="flex flex-col space-y-8 mt-8">
        {/* Monthly Achievement Categories */}
        <div>
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
        <div>
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
      </div>
    </motion.div>
  );
};

export default MonthlyReward;

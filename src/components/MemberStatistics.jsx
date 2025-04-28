import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import stats from "../assets/images/icons/trade.svg";
import api from "../hooks/api";

const MemberStatistics = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  // Dummy data for demonstration
  const dummyMembers = [
    {
      id: 1,
      full_name: "John Doe",
      profile_image: null,
      chapter_name: "Mumbai Chapter",
      level: "Diamond",
      total_points: 550,
      attendance: { total_meetings: 12 },
      bdm: { given: { count: 8 }, received: { count: 5 } },
      business: { total_amount: 1500000 },
      referrals: { count: 15 },
      visitor_invited: { count: 10 },
      social_training: { count: 8 },
    },
    {
      id: 2,
      full_name: "Jane Smith",
      profile_image: null,
      chapter_name: "Delhi Chapter",
      level: "Gold",
      total_points: 420,
      attendance: { total_meetings: 10 },
      bdm: { given: { count: 6 }, received: { count: 4 } },
      business: { total_amount: 800000 },
      referrals: { count: 12 },
      visitor_invited: { count: 8 },
      social_training: { count: 6 },
    },
    // Add more dummy data as needed
  ];

  function getCurrentMonth() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const [year, month] = selectedMonth.split('-');

      // Get all members
      const membersResponse = await api.get("/members/members");
      const members = membersResponse.data.data;

      // Fetch and calculate points for each member
      const membersWithStats = await Promise.all(
        members.map(async (member) => {
          try {
            // Get all metrics for the member
            const [
              attendanceRes,
              bdmRes,
              businessRes,
              referralsRes,
              visitorsRes,
              socialsRes
            ] = await Promise.all([
              api.get("/attendance-venue-fee/monthly-points", {
                params: { memberId: member.id, month, year }
              }),
              api.get("/bdm"),
              api.get("/business"),
              api.get("/referrals"),
              api.get("/visitors/stats"),
              api.get("/attendance-venue-fee/social-stats")
            ]);

            // Calculate BDM stats
            const monthlyBDMs = bdmRes.data.filter(bdm => {
              const bdmDate = new Date(bdm.bdmDate);
              return (
                bdmDate.getMonth() + 1 === parseInt(month) &&
                bdmDate.getFullYear() === parseInt(year) &&
                bdm.status === "verified"
              );
            });
            const givenBDMs = monthlyBDMs.filter(bdm => bdm.givenBy_MemberId === member.id).length;
            const receivedBDMs = monthlyBDMs.filter(bdm => bdm.received_MemberId === member.id).length;

            // Calculate business stats
            const monthlyBusinesses = businessRes.data.filter(business => {
              const businessDate = new Date(business.businessDate);
              return (
                businessDate.getMonth() + 1 === parseInt(month) &&
                businessDate.getFullYear() === parseInt(year) &&
                business.status === "verified"
              );
            });
            const totalBusinessAmount = monthlyBusinesses.reduce((sum, business) => 
              sum + parseFloat(business.amount || 0), 0
            );

            // Calculate points
            const points = {
              attendance: attendanceRes.data?.data?.points || 0,
              bdm: givenBDMs >= 4 ? 20 : givenBDMs >= 3 ? 15 : givenBDMs >= 2 ? 10 : givenBDMs >= 1 ? 5 : 0,
              business: totalBusinessAmount >= 500000 ? 15 : totalBusinessAmount >= 50000 ? 10 : totalBusinessAmount > 0 ? 5 : 0,
              referrals: referralsRes.data?.stats?.points || 0,
              visitors: visitorsRes.data?.data?.stats?.points || 0,
              socials: socialsRes.data?.data?.stats?.points || 0
            };

            const totalPoints = Math.min(
              Object.values(points).reduce((sum, p) => sum + p, 0),
              100
            );

            // Determine member level based on points
            let level;
            if (totalPoints >= 76) level = "Platinum";
            else if (totalPoints >= 51) level = "Gold";
            else if (totalPoints >= 30) level = "Silver";
            else level = "Bronze";

            return {
              id: member.id,
              full_name: member.name,
              profile_image: member.profilePicture,
              chapter_name: member.chapter,
              level,
              total_points: totalPoints,
              attendance: {
                total_meetings: attendanceRes.data?.data?.breakdown?.totalMeetings || 0,
                present: attendanceRes.data?.data?.breakdown?.present || 0,
                points: points.attendance
              },
              bdm: {
                given: { count: givenBDMs },
                received: { count: receivedBDMs },
                points: points.bdm
              },
              business: {
                total_amount: totalBusinessAmount,
                points: points.business
              },
              referrals: {
                count: referralsRes.data?.stats?.totalReferrals || 0,
                points: points.referrals
              },
              visitor_invited: {
                count: visitorsRes.data?.data?.stats?.totalVisitors || 0,
                points: points.visitors
              },
              social_training: {
                count: socialsRes.data?.data?.stats?.totalAttended || 0,
                points: points.socials
              }
            };
          } catch (error) {
            console.error(`Error calculating stats for member ${member.id}:`, error);
            return null;
          }
        })
      );

      // Filter out any null results and sort by total points
      const validMembers = membersWithStats
        .filter(m => m !== null)
        .sort((a, b) => b.total_points - a.total_points);

      setMembers(validMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [selectedMonth, selectedChapter, selectedLevel]);

  const formatIndianCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLevelColor = (level) => {
    const colors = {
      Diamond:
        "from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/20",
      Gold: "from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500/20",
      Silver:
        "from-gray-400/20 to-gray-500/20 text-gray-300 border-gray-400/20",
      Bronze:
        "from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/20",
    };
    return (
      colors[level] ||
      "from-gray-500/20 to-gray-600/20 text-gray-400 border-gray-500/20"
    );
  };

  const LoadingRow = () => (
    <tr className="border-b border-gray-700/50">
      <td colSpan="10" className="px-6 py-4">
        <div className="h-12 bg-gray-700/50 rounded-lg animate-pulse"></div>
      </td>
    </tr>
  );

  const MemberRow = ({ member, index }) => (
    <motion.tr
      key={member.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center border border-amber-500/20">
            <span className="text-amber-500 font-medium">
              {member.full_name.charAt(0)}
            </span>
          </div>
          <span className="text-gray-200 font-medium">{member.full_name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-300">{member.chapter_name}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${getLevelColor(member.level)}`}>
          {member.level}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-300">{member.total_points}</span>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-300">
          <div>{member.attendance.present}/{member.attendance.total_meetings}</div>
          <div className="text-xs text-gray-400">{member.attendance.points} pts</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-300">
          <div>G: {member.bdm.given.count}</div>
          <div>R: {member.bdm.received.count}</div>
          <div className="text-xs text-gray-400">{member.bdm.points} pts</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-300">
          <div>{formatIndianCurrency(member.business.total_amount)}</div>
          <div className="text-xs text-gray-400">{member.business.points} pts</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-300">
          <div>{member.referrals.count}</div>
          <div className="text-xs text-gray-400">{member.referrals.points} pts</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-300">
          <div>{member.visitor_invited.count}</div>
          <div className="text-xs text-gray-400">{member.visitor_invited.points} pts</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-300">
          <div>{member.social_training.count}</div>
          <div className="text-xs text-gray-400">{member.social_training.points} pts</div>
        </div>
      </td>
    </motion.tr>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-32 w-full p-6 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg"
            >
              <img src={stats} alt="statistics" className="w-6 h-6" />
            </motion.div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                Member Statistics
              </h2>
              <p className="text-sm text-gray-400">
                View and filter member achievements by level
              </p>
            </div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-semibold tracking-wide text-sm">Back</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
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
            className="w-full bg-gray-800 text-gray-100 p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">All Chapters</option>
            <option value="1">Mumbai Chapter</option>
            <option value="2">Delhi Chapter</option>
            <option value="3">Bangalore Chapter</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full bg-gray-800 text-gray-100 p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">All Levels</option>
            <option value="diamond">Diamond</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search members..."
              className="w-full bg-gray-800 text-gray-100 pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 relative bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl"
      >
        <div className="relative min-h-[300px] max-h-[calc(100vh-500px)]">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
          <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-gray-800/95 via-gray-800/98 to-gray-800/95 backdrop-blur-xl">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Chapter
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Level
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Meetings
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    BDM
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Business
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Referrals
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Visitors
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Socials & Training
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  Array(5).fill(<LoadingRow />)
                ) : members.length > 0 ? (
                  members.map((member, index) => (
                    <MemberRow key={member.id} member={member} index={index} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg
                          className="w-12 h-12 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="text-gray-400 text-sm">
                          No members found matching your criteria
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberStatistics;

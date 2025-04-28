import React, { useState, useEffect } from "react";
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
import axios from "axios";
import api from "../hooks/api";

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

  const [referralData, setReferralData] = useState({
    totalReferrals: 0,
    referrals: [],
    stats: {
      totalReferrals: 0,
      points: 0,
      nextTierNeeded: 0,
      nextTierPoints: 0,
      maxPoints: 15,
    },
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [bdmData, setBdmData] = useState({
    totalBdms: 0,
    recentBdms: [],
    recentCount: 0,
    memberStats: {},
  });

  const [allReferralsData, setAllReferralsData] = useState({
    totalCount: 0,
    memberStats: {},
    recentReferrals: [],
  });

  const [visitorData, setVisitorData] = useState({
    totalCount: 0,
    recentCount: 0,
    recentVisitors: [],
  });

  const [meetingData, setMeetingData] = useState({
    totalCount: 0,
    recentCount: 0,
    attendance: {
      present: 0,
      absent: 0,
      late: 0,
      rate: 0,
    },
  });

  const [mdpData, setMdpData] = useState({
    totalCount: 0,
    recentCount: 0,
    attendance: { present: 0, absent: 0, late: 0, rate: 0 },
  });

  const [socialData, setSocialData] = useState({
    totalCount: 0,
    recentCount: 0,
    attendance: { present: 0, absent: 0, late: 0, rate: 0 },
  });

  const [memberStats, setMemberStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const [statisticsOverview, setStatisticsOverview] = useState({
    totalMembers: 0,
    totalBdms: 0,
    totalReferrals: 0,
    topPerformers: [],
    recentActivities: [],
  });

  const [bdmStats, setBdmStats] = useState({
    total: 0,
    recent: 0,
    topGivers: [],
  });

  const [referralStats, setReferralStats] = useState({
    total: 0,
    recent: 0,
    topGivers: [],
  });

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        // First, get the auth token from localStorage
        const token = localStorage.getItem("token"); // Make sure this matches how you store your auth token

        const response = await api.get("/referrals/ref-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        });

        console.log("Referral API Response:", response.data); // For debugging

        if (response.data.success) {
          setReferralData({
            totalReferrals: response.data.data.length,
            referrals: response.data.data,
            stats: response.data.stats || {
              totalReferrals: response.data.data.length,
              points: calculatePoints(response.data.data.length),
              nextTierNeeded: calculateNextTier(response.data.data.length),
              maxPoints: 15,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    // Helper function to calculate points based on referral count
    const calculatePoints = (referralCount) => {
      if (referralCount >= 5) return 15;
      if (referralCount >= 3) return 10;
      if (referralCount >= 1) return 5;
      return 0;
    };

    const calculateNextTier = (referralCount) => {
      if (referralCount < 1) return 1;
      if (referralCount < 3) return 3 - referralCount;
      if (referralCount < 5) return 5 - referralCount;
      return 0;
    };

    fetchReferralData();
  }, [dateRange]);

  useEffect(() => {
    const fetchBdmData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/bdm/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        });

        if (response.data && response.data.success) {
          // Process BDMs to get member statistics
          const memberStats = {};
          response.data.data.forEach((bdm) => {
            const giverName = bdm.givenByName || "Unknown";
            if (!memberStats[giverName]) {
              memberStats[giverName] = {
                count: 0,
                points: 0,
              };
            }
            memberStats[giverName].count += 1;
            // Calculate points (you can adjust the point calculation logic)
            memberStats[giverName].points += 5; // Example: 5 points per BDM
          });

          setBdmData({
            totalBdms: response.data.count,
            recentBdms: response.data.data || [],
            recentCount: (response.data.data || []).filter(
              (bdm) =>
                new Date(bdm.created_at) >=
                new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            ).length,
            memberStats: memberStats,
          });
        }
      } catch (error) {
        console.error("Error fetching BDM data:", error);
        setBdmData({
          totalBdms: 0,
          recentBdms: [],
          recentCount: 0,
          memberStats: {},
        });
      }
    };

    fetchBdmData();
  }, [dateRange]);

  useEffect(() => {
    const fetchAllReferralsData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/referrals/ref-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setAllReferralsData(response.data);
        }
      } catch (error) {
        console.error("Error fetching all referrals data:", error);
      }
    };

    fetchAllReferralsData();
  }, []);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/visitors/all-visitors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setVisitorData({
            totalCount: response.data.totalCount,
            recentCount: response.data.recentCount,
            recentVisitors: response.data.recentVisitors,
          });
        }
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      }
    };

    fetchVisitorData();
  }, []);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const token = localStorage.getItem("token");
        // 1. Get all meetings
        const response = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
          params: { type: "meeting" },
        });

        if (response.data.success) {
          const meetings = response.data.data || [];
          if (meetings.length === 0) {
            setMeetingData({
              totalCount: 0,
              recentCount: 0,
              attendance: { present: 0, absent: 0, late: 0, rate: 0 },
            });
            return;
          }

          // 2. Fetch attendance stats for each meeting in parallel
          let totalPresent = 0;
          let totalAbsent = 0;
          let totalLate = 0;
          let totalMarked = 0;

          await Promise.all(
            meetings.map(async (meeting) => {
              try {
                const statsRes = await api.get(
                  "/attendance-venue-fee/meeting-stats",
                  {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { type: "meeting", meeting_id: meeting.meeting_id },
                  }
                );
                if (
                  statsRes.data.success &&
                  statsRes.data.data &&
                  statsRes.data.data.attendance
                ) {
                  const att = statsRes.data.data.attendance;
                  totalPresent += att.present || 0;
                  totalAbsent += att.absent || 0;
                  totalLate += (att.late_less || 0) + (att.late_more || 0);
                  totalMarked += att.marked || 0;
                }
              } catch (err) {}
            })
          );

          // 3. Calculate attendance rate for meetings only
          const attendanceRate =
            totalMarked > 0
              ? Math.round((totalPresent / totalMarked) * 100)
              : 0;

          setMeetingData({
            totalCount: meetings.length,
            recentCount: meetings.filter(
              (meeting) =>
                new Date(meeting.date) >=
                new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            ).length,
            attendance: {
              present: totalPresent,
              absent: totalAbsent,
              late: totalLate,
              rate: attendanceRate,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching meeting data:", error);
        setMeetingData({
          totalCount: 0,
          recentCount: 0,
          attendance: { present: 0, absent: 0, late: 0, rate: 0 },
        });
      }
    };

    fetchMeetingData();
  }, []);

  useEffect(() => {
    const fetchMdpData = async () => {
      try {
        const token = localStorage.getItem("token");
        // 1. Get all MDP meetings
        const response = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
          params: { type: "mdp" },
        });

        if (response.data.success) {
          const mdps = response.data.data || [];
          if (mdps.length === 0) {
            setMdpData({
              totalCount: 0,
              recentCount: 0,
              attendance: { present: 0, absent: 0, late: 0, rate: 0 },
            });
            return;
          }

          // 2. Fetch attendance stats for each MDP in parallel
          let totalPresent = 0;
          let totalAbsent = 0;
          let totalLate = 0;
          let totalMarked = 0;

          await Promise.all(
            mdps.map(async (mdp) => {
              try {
                const statsRes = await api.get(
                  "/attendance-venue-fee/meeting-stats",
                  {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { type: "mdp", meeting_id: mdp.mdp_id },
                  }
                );
                if (
                  statsRes.data.success &&
                  statsRes.data.data &&
                  statsRes.data.data.attendance
                ) {
                  const att = statsRes.data.data.attendance;
                  totalPresent += att.present || 0;
                  totalAbsent += att.absent || 0;
                  totalLate += (att.late_less || 0) + (att.late_more || 0);
                  totalMarked += att.marked || 0;
                }
              } catch (err) {
                // Ignore errors for individual MDPs
              }
            })
          );

          // 3. Calculate attendance rate for MDPs only
          const attendanceRate =
            totalMarked > 0
              ? Math.round((totalPresent / totalMarked) * 100)
              : 0;

          setMdpData({
            totalCount: mdps.length,
            recentCount: mdps.filter(
              (mdp) =>
                new Date(mdp.date) >=
                new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            ).length,
            attendance: {
              present: totalPresent,
              absent: totalAbsent,
              late: totalLate,
              rate: attendanceRate,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching MDP data:", error);
        setMdpData({
          totalCount: 0,
          recentCount: 0,
          attendance: { present: 0, absent: 0, late: 0, rate: 0 },
        });
      }
    };

    fetchMdpData();
  }, []);

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const token = localStorage.getItem("token");
        // 1. Get all social & training meetings
        const response = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
          params: { type: "social_training" },
        });

        if (response.data.success) {
          const socials = response.data.data || [];
          if (socials.length === 0) {
            setSocialData({
              totalCount: 0,
              recentCount: 0,
              attendance: { present: 0, absent: 0, late: 0, rate: 0 },
            });
            return;
          }

          // 2. Fetch attendance stats for each social in parallel
          let totalPresent = 0;
          let totalAbsent = 0;
          let totalLate = 0;
          let totalMarked = 0;

          await Promise.all(
            socials.map(async (social) => {
              try {
                const statsRes = await api.get(
                  "/attendance-venue-fee/meeting-stats",
                  {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                      type: "socialTraining",
                      meeting_id: social.social_training_id,
                    },
                  }
                );
                if (
                  statsRes.data.success &&
                  statsRes.data.data &&
                  statsRes.data.data.attendance
                ) {
                  const att = statsRes.data.data.attendance;
                  totalPresent += att.present || 0;
                  totalAbsent += att.absent || 0;
                  totalLate += (att.late_less || 0) + (att.late_more || 0);
                  totalMarked += att.marked || 0;
                }
              } catch (err) {
                // Ignore errors for individual socials
              }
            })
          );

          // 3. Calculate attendance rate for Social & Training only
          const attendanceRate =
            totalMarked > 0
              ? Math.round((totalPresent / totalMarked) * 100)
              : 0;

          setSocialData({
            totalCount: socials.length,
            recentCount: socials.filter(
              (social) =>
                new Date(social.date) >=
                new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            ).length,
            attendance: {
              present: totalPresent,
              absent: totalAbsent,
              late: totalLate,
              rate: attendanceRate,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching social data:", error);
        setSocialData({
          totalCount: 0,
          recentCount: 0,
          attendance: { present: 0, absent: 0, late: 0, rate: 0 },
        });
      }
    };

    fetchSocialData();
  }, []);

  useEffect(() => {
    const fetchMemberStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/members/members", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Members API Response:", response.data); // For debugging

        if (response.data.success) {
          const members = response.data.data || [];
          setMemberStats({
            total: members.length,
            active: members.filter((m) => m.status === "active").length,
            inactive: members.filter((m) => m.status === "inactive").length,
          });
        }
      } catch (error) {
        console.error("Error fetching member stats:", error);
        setMemberStats({ total: 0, active: 0, inactive: 0 });
      }
    };

    fetchMemberStats();
  }, []);

  useEffect(() => {
    const fetchBdmStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/bdm/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          const bdms = response.data.data;
          const giverStats = {};
          let recentCount = 0;
          const fifteenDaysAgo = new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000
          );

          bdms.forEach((bdm) => {
            const giverName = bdm.givenByName || "Unknown";
            if (!giverStats[giverName]) {
              giverStats[giverName] = { count: 0, points: 0 };
            }
            giverStats[giverName].count += 1;
            giverStats[giverName].points += 5;

            if (new Date(bdm.created_at) >= fifteenDaysAgo) {
              recentCount++;
            }
          });

          const topGivers = Object.entries(giverStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          setBdmStats({
            total: bdms.length,
            recent: recentCount,
            topGivers,
          });
        }
      } catch (error) {
        console.error("Error fetching BDM stats:", error);
      }
    };

    fetchBdmStats();
  }, []);

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/referrals/ref-all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          const referrals = response.data.data;
          const giverStats = {};
          let recentCount = 0;
          const fifteenDaysAgo = new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000
          );

          referrals.forEach((referral) => {
            const giverName = referral.givenByName || "Unknown";
            if (!giverStats[giverName]) {
              giverStats[giverName] = { count: 0, points: 0 };
            }
            giverStats[giverName].count += 1;

            // Update points based on count
            if (giverStats[giverName].count >= 5) {
              giverStats[giverName].points = 15;
            } else if (giverStats[giverName].count >= 3) {
              giverStats[giverName].points = 10;
            } else {
              giverStats[giverName].points = 5;
            }

            if (new Date(referral.created_at) >= fifteenDaysAgo) {
              recentCount++;
            }
          });

          const topGivers = Object.entries(giverStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          setReferralStats({
            total: referrals.length,
            recent: recentCount,
            topGivers,
          });
        }
      } catch (error) {
        console.error("Error fetching referral stats:", error);
      }
    };

    fetchReferralStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
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
                  {allReferralsData.totalCount || 0}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1 text-emerald-400">
                    <div className="flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>
                        {Object.values(
                          allReferralsData.memberStats || {}
                        ).reduce(
                          (total, member) => total + member.points,
                          0
                        )}{" "}
                        total points
                      </span>
                    </div>
                  </div>
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
                  {bdmData.totalBdms}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{bdmData.recentCount}</span>
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
                  {visitorData.totalCount || 0}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{visitorData.recentCount || 0}</span>
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
                    {meetingData.totalCount}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3 h-3" />+
                      {meetingData.recentCount}
                    </span>
                    <span className="text-gray-400 text-xs">
                      total meetings
                    </span>
                  </div>
                </div>
                <div className="flex flex-col pt-3 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      Attendance Rate
                    </span>
                    <span className="text-2xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                      {meetingData.attendance.rate || 0}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-2 text-xs">
                      <span className="text-emerald-400">
                        {meetingData.attendance.present} Present
                      </span>
                      <span className="text-yellow-400">
                        {meetingData.attendance.late} Late
                      </span>
                      <span className="text-red-400">
                        {meetingData.attendance.absent} Absent
                      </span>
                    </div>
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
                    {mdpData.totalCount}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3 h-3" />+{mdpData.recentCount}
                    </span>
                    <span className="text-gray-400 text-xs">last 15 days</span>
                  </div>
                </div>
                <div className="flex flex-col pt-3 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      Attendance Rate
                    </span>
                    <span className="text-2xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                      {mdpData.attendance.rate || 0}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-2 text-xs">
                      <span className="text-emerald-400">
                        {mdpData.attendance.present} Present
                      </span>
                      <span className="text-yellow-400">
                        {mdpData.attendance.late} Late
                      </span>
                      <span className="text-red-400">
                        {mdpData.attendance.absent} Absent
                      </span>
                    </div>
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
                    {socialData.totalCount}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3 h-3" />+
                      {socialData.recentCount}
                    </span>
                    <span className="text-gray-400 text-xs">last 15 days</span>
                  </div>
                </div>
                <div className="flex flex-col pt-3 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      Attendance Rate
                    </span>
                    <span className="text-2xl font-bold text-white group-hover:text-[#D4B86A] transition-colors duration-500">
                      {socialData.attendance.rate || 0}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-2 text-xs">
                      <span className="text-emerald-400">
                        {socialData.attendance.present} Present
                      </span>
                      <span className="text-yellow-400">
                        {socialData.attendance.late} Late
                      </span>
                      <span className="text-red-400">
                        {socialData.attendance.absent} Absent
                      </span>
                    </div>
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
                    {memberStats.total}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-2">
                      <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        <ArrowUpRight className="w-3 h-3" />
                        Active: {memberStats.active}
                      </span>
                      <span className="text-red-400 text-xs flex items-center gap-1 bg-red-400/10 px-2 py-0.5 rounded-full">
                        Inactive: {memberStats.inactive}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Statistics Cards */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/90 rounded-xl border border-[#D4B86A]/30 overflow-hidden mt-20 mb-8"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#D4B86A] mb-4">
              Statistics Overview
            </h3>

            {/* Visual Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* BDM Stats */}
              <div className="bg-gray-900/60 rounded-lg p-4 relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 h-1.5 bg-blue-500"
                  style={{
                    width: `${
                      (bdmStats.total /
                        (bdmStats.total + referralStats.total)) *
                        100 || 0
                    }%`,
                  }}
                ></div>
                <h4 className="text-white text-lg mb-2">BDM Activity</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {bdmStats.total}
                    </p>
                    <p className="text-sm text-gray-400">Total BDMs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-400">
                      +{bdmStats.recent}
                    </p>
                    <p className="text-sm text-gray-400">Recent (15d)</p>
                  </div>
                </div>

                {/* Mini Bar Chart for BDM */}
                <div className="mt-4 h-10 flex items-end gap-1">
                  {bdmStats.topGivers.slice(0, 5).map((giver, index) => (
                    <div
                      key={index}
                      className="bg-blue-500/80 hover:bg-blue-400 transition-all rounded-t w-full h-full flex flex-col justify-end tooltip-trigger"
                      style={{
                        height: `${
                          (giver.count /
                            Math.max(
                              ...bdmStats.topGivers.map((g) => g.count)
                            )) *
                          100
                        }%`,
                      }}
                      title={`${giver.name}: ${giver.count} BDMs`}
                    >
                      <div className="tooltip absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded p-2 hidden">
                        {giver.name}: {giver.count} BDMs
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral Stats */}
              <div className="bg-gray-900/60 rounded-lg p-4 relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 h-1.5 bg-green-500"
                  style={{
                    width: `${
                      (referralStats.total /
                        (bdmStats.total + referralStats.total)) *
                        100 || 0
                    }%`,
                  }}
                ></div>
                <h4 className="text-white text-lg mb-2">Referral Activity</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {referralStats.total}
                    </p>
                    <p className="text-sm text-gray-400">Total Referrals</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-400">
                      +{referralStats.recent}
                    </p>
                    <p className="text-sm text-gray-400">Recent (15d)</p>
                  </div>
                </div>

                {/* Mini Bar Chart for Referrals */}
                <div className="mt-4 h-10 flex items-end gap-1">
                  {referralStats.topGivers.slice(0, 5).map((giver, index) => (
                    <div
                      key={index}
                      className="bg-green-500/80 hover:bg-green-400 transition-all rounded-t w-full flex flex-col justify-end"
                      style={{
                        height: `${
                          (giver.count /
                            Math.max(
                              ...referralStats.topGivers.map((g) => g.count)
                            )) *
                          100
                        }%`,
                      }}
                      title={`${giver.name}: ${giver.count} Referrals`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Member Stats */}
              <div className="bg-gray-900/60 rounded-lg p-4 relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 h-1.5 bg-[#D4B86A]"
                  style={{ width: "100%" }}
                ></div>
                <h4 className="text-white text-lg mb-2">Member Status</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {memberStats.total}
                    </p>
                    <p className="text-sm text-gray-400">Total Members</p>
                  </div>

                  {/* Member Status Pie Chart */}
                  <div className="relative h-16 w-16">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      {/* Active Members */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeDasharray={`${
                          (memberStats.active / memberStats.total) * 100
                        }, 100`}
                        className="rounded-full"
                      />
                      {/* Inactive Members */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="3"
                        strokeDasharray={`${
                          (memberStats.inactive / memberStats.total) * 100
                        }, 100`}
                        strokeDashoffset={`${
                          -1 * ((memberStats.active / memberStats.total) * 100)
                        }`}
                        className="rounded-full"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {Math.round(
                        (memberStats.active / memberStats.total) * 100
                      ) || 0}
                      %
                    </div>
                  </div>
                </div>

                {/* Member Stats Legend */}
                <div className="mt-4 flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="block w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-300">
                      {memberStats.active} Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="block w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-gray-300">
                      {memberStats.inactive} Inactive
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performers Visual */}
            <div className="bg-gray-900/60 rounded-lg p-4">
              <h4 className="text-white text-lg mb-4">Top Performers</h4>
              <div className="space-y-3">
                {[...bdmStats.topGivers, ...referralStats.topGivers]
                  .reduce((acc, current) => {
                    const existing = acc.find(
                      (item) => item.name === current.name
                    );
                    if (existing) {
                      existing.totalPoints += current.points;
                      existing.count += current.count;
                    } else {
                      acc.push({
                        name: current.name,
                        totalPoints: current.points,
                        count: current.count,
                        type:
                          current.count ===
                          bdmStats.topGivers.find(
                            (g) => g.name === current.name
                          )?.count
                            ? "BDM"
                            : "Referral",
                      });
                    }
                    return acc;
                  }, [])
                  .sort((a, b) => b.totalPoints - a.totalPoints)
                  .slice(0, 5)
                  .map((performer, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#D4B86A]/20 text-[#D4B86A] flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="text-white">{performer.name}</span>
                          <span className="text-[#D4B86A]">
                            {performer.totalPoints} pts
                          </span>
                        </div>
                        <div className="w-full mt-1 bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-[#D4B86A] h-1.5 rounded-full"
                            style={{
                              width: `${
                                (performer.totalPoints /
                                  Math.max(
                                    ...[
                                      ...bdmStats.topGivers,
                                      ...referralStats.topGivers,
                                    ]
                                      .reduce((acc, current) => {
                                        const existing = acc.find(
                                          (item) => item.name === current.name
                                        );
                                        if (existing) {
                                          existing.totalPoints +=
                                            current.points;
                                        } else {
                                          acc.push({
                                            name: current.name,
                                            totalPoints: current.points,
                                          });
                                        }
                                        return acc;
                                      }, [])
                                      .map((p) => p.totalPoints)
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
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

const StatisticsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Summary Cards */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-[#D4B86A] mb-4">
          Performance Overview
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total Members</p>
            <p className="text-2xl font-bold text-white">
              {statisticsOverview.totalMembers}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total BDMs</p>
            <p className="text-2xl font-bold text-white">
              {statisticsOverview.totalBdms}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total Referrals</p>
            <p className="text-2xl font-bold text-white">
              {statisticsOverview.totalReferrals}
            </p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-[#D4B86A] mb-4">
          Top Performers
        </h3>
        <div className="space-y-3">
          {statisticsOverview.topPerformers.map((performer, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{index + 1}.</span>
                <span className="text-white">{performer.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#D4B86A]">
                  {performer.totalPoints} pts
                </span>
                <span className="text-xs text-gray-400">
                  {performer.bdms} BDMs | {performer.referrals} Refs
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="md:col-span-2 bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-[#D4B86A] mb-4">
          Recent Activities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statisticsOverview.recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-700/50 rounded"
            >
              <div>
                <span className="text-white">{activity.giverName}</span>
                <span className="text-gray-400 mx-2">→</span>
                <span className="text-white">{activity.receiverName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    activity.type === "BDM"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {activity.type}
                </span>
                <span className="text-[#D4B86A] text-sm">
                  {activity.points} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

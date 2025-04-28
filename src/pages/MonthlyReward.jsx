import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import reward from "../assets/images/icons/cup.svg";
import {
  Award,
  Users,
  Handshake,
  UserPlus,
  Target,
  Share2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../hooks/api";

// MetricCard component from MemberMonthlyReward
const MetricCard = ({
  title,
  value,
  points,
  subtitle,
  maxValue,
  icon: Icon,
  details,
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
      {details && <div className="mt-2 text-xs text-gray-400">{details}</div>}
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
      value: 0,
      points: 0,
      maxValue: 4,
      subtitle: "4 more BDMs needed",
      breakdown: {
        given: 0,
        received: 0,
        total: 0,
        pointsEarned: 0,
        nextTierNeeded: 0,
      },
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

  const [attendanceData, setAttendanceData] = useState({
    points: 0,
    maxPoints: 20,
    breakdown: {
      totalMeetings: 0,
      present: 0,
      late: 0,
      absent: 0,
      deductions: 0,
    },
  });

  // Add this state for tier statistics
  const [tierStats, setTierStats] = useState({
    platinum: 0,
    platinumPercentage: 0,
    gold: 0,
    goldPercentage: 0,
    silver: 0,
    silverPercentage: 0,
    bronze: 0,
    bronzePercentage: 0,
  });

  // Add this state to store all members' data
  const [allMembers, setAllMembers] = useState([]);

  // Add these states
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Dummy data for demonstration
  const MEMBERSHIP_TIERS = {
    BRONZE: {
      name: "Bronze Pin",
      range: [0, 29],
      emoji: "🥉",
      color: "from-amber-700 to-amber-800",
    },
    SILVER: {
      name: "Silver",
      range: [30, 50],
      emoji: "🥈",
      color: "from-gray-300 to-gray-400",
    },
    GOLD: {
      name: "Gold",
      range: [51, 75],
      emoji: "🏆",
      color: "from-amber-400 to-amber-500",
    },
    PLATINUM: {
      name: "Platinum",
      range: [76, 100],
      emoji: "💎",
      color: "from-blue-400 to-blue-500",
    },
  };

  const dummyCategories = [
    {
      ...MEMBERSHIP_TIERS.PLATINUM,
      points: "76-100 Points",
      memberCount: 25,
      percentage: 15,
    },
    {
      ...MEMBERSHIP_TIERS.GOLD,
      points: "51-75 Points",
      memberCount: 42,
      percentage: 28,
    },
    {
      ...MEMBERSHIP_TIERS.SILVER,
      points: "30-50 Points",
      memberCount: 56,
      percentage: 37,
    },
    {
      ...MEMBERSHIP_TIERS.BRONZE,
      points: "0-29 Points",
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

  // Add a function to calculate BDM points
  const calculateBDMPoints = (count) => {
    if (count >= 4) return 20;
    if (count === 3) return 15;
    if (count === 2) return 10;
    if (count === 1) return 5;
    return 0;
  };

  // Add a function to get next tier BDMs needed
  const getNextTierBDMs = (currentCount) => {
    if (currentCount >= 4) return 0;
    const tiers = [1, 2, 3, 4];
    for (const tier of tiers) {
      if (tier > currentCount) {
        return tier - currentCount;
      }
    }
    return 0;
  };

  const calculateBusinessPoints = (amount) => {
    const businessAmount = parseFloat(amount) || 0;
    if (businessAmount >= 500000) return { points: 15 };
    if (businessAmount >= 50000) return { points: 10 };
    if (businessAmount > 0) return { points: 5 };
    return { points: 0 };
  };

  // Update the fetchAttendancePoints function
  const fetchAttendancePoints = async (month, year) => {
    try {
      const response = await api.get("/attendance-venue-fee/monthly-points", {
        params: {
          month: month || new Date().getMonth() + 1,
          year: year || new Date().getFullYear(),
        },
      });

      if (response.data.success) {
        const data = response.data.data;

        // Update the attendance data state
        setAttendanceData({
          points: data.points,
          maxPoints: data.maxPoints,
          breakdown: {
            totalMeetings: data.breakdown.totalMeetings,
            present: data.breakdown.present,
            late: data.breakdown.late,
            absent: data.breakdown.absent,
            deductions: data.breakdown.deductions,
          },
        });

        // Update the meetings metric in userData
        setUserData((prev) => ({
          ...prev,
          meetings: getMeetingsContent(data),
        }));

        // Update total points
        setUserData((prev) => ({
          ...prev,
          totalPoints:
            prev.totalPoints - (prev.meetings.points || 0) + data.points,
        }));
      }
    } catch (error) {
      console.error("Error fetching attendance points:", error);
    }
  };

  // Update the getAttendanceSubtitle function
  const getAttendanceSubtitle = (data) => {
    const { totalMeetings, present, late, deductions } = data.breakdown;

    if (totalMeetings === 0) {
      return "No meetings this month";
    }

    if (present === 0) {
      return "No points - Absent from all meetings";
    }

    if (late > 0) {
      return `${late} late arrival(s) (-${deductions} points)`;
    }

    if (present === totalMeetings) {
      return "Maximum points - All meetings attended!";
    }

    if (present >= 2) {
      return `20 points - Attended ${present} meetings`;
    }

    if (present === 1) {
      return `10 points - Attended 1 meeting`;
    }

    return `${totalMeetings - present} more meetings needed`;
  };

  // Also update the meetings card content display
  const getMeetingsContent = (data) => {
    const { totalMeetings, present } = data.breakdown;

    return {
      points: data.points,
      maxPoints: 20,
      ratio: `${present}/${totalMeetings}`,
      subtitle: getAttendanceSubtitle(data),
      details: [
        `Total Monthly Meetings: ${totalMeetings}`,
        `Meetings Attended: ${present}`,
        present >= 2
          ? "20 points - Multiple meetings attended"
          : present === 1
          ? "10 points - One meeting attended"
          : "0 points - No meetings attended",
      ],
    };
  };

  // Update useEffect to fetch attendance data when month changes
  useEffect(() => {
    const [year, month] = selectedMonth.split("-");
    fetchAttendancePoints(parseInt(month), parseInt(year));
  }, [selectedMonth]);

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

  // Update the useEffect to fetch and calculate BDM data
  useEffect(() => {
    const fetchUserBDMs = async () => {
      try {
        const [year, month] = selectedMonth.split("-");
        // First get all BDMs for the user
        const response = await api.get("/bdm", {
          params: {
            memberId: auth.user.id,
          },
        });

        if (response.data) {
          // Filter BDMs for current month and verified status
          const monthlyBDMs = response.data.filter((bdm) => {
            const bdmDate = new Date(bdm.bdmDate);
            return (
              bdmDate.getMonth() + 1 === parseInt(month) &&
              bdmDate.getFullYear() === parseInt(year) &&
              bdm.status === "verified"
            );
          });

          const givenBDMs = monthlyBDMs.filter(
            (bdm) => bdm.givenBy_MemberId === auth.user.id
          ).length;
          const receivedBDMs = monthlyBDMs.filter(
            (bdm) => bdm.received_MemberId === auth.user.id
          ).length;

          // Calculate points
          let points = 0;
          if (givenBDMs >= 4) points = 20;
          else if (givenBDMs === 3) points = 15;
          else if (givenBDMs === 2) points = 10;
          else if (givenBDMs === 1) points = 5;

          setUserData((prev) => ({
            ...prev,
            bdm: {
              value: `${givenBDMs}/${receivedBDMs}`, // Format as "given/received"
              points: points,
              maxValue: 4,
              subtitle:
                givenBDMs >= 4
                  ? "Maximum points achieved"
                  : `${4 - givenBDMs} more BDM${
                      4 - givenBDMs > 1 ? "s" : ""
                    } needed for maximum points`,
              breakdown: {
                given: givenBDMs,
                received: receivedBDMs,
                total: givenBDMs + receivedBDMs,
                pointsEarned: points,
                nextTierNeeded: givenBDMs >= 4 ? 0 : 4 - givenBDMs,
              },
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching BDM data:", error);
        // Set default values on error
        setUserData((prev) => ({
          ...prev,
          bdm: {
            value: "0/0",
            points: 0,
            maxValue: 4,
            subtitle: "4 more BDMs needed",
            breakdown: {
              given: 0,
              received: 0,
              total: 0,
              pointsEarned: 0,
              nextTierNeeded: 4,
            },
          },
        }));
      }
    };

    fetchUserBDMs();
  }, [selectedMonth, auth.user.id]);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const [year, month] = selectedMonth.split("-");
        // First get all businesses for the user
        const response = await api.get("/business", {
          params: {
            memberId: auth.user.id,
          },
        });

        if (response.data) {
          // Filter businesses for current month and verified status
          const monthlyBusinesses = response.data.filter((business) => {
            const businessDate = new Date(business.businessDate);
            return (
              businessDate.getMonth() + 1 === parseInt(month) &&
              businessDate.getFullYear() === parseInt(year) &&
              business.status === "verified"
            );
          });

          // Calculate total amount
          const totalAmount = monthlyBusinesses.reduce((sum, business) => {
            return sum + (parseFloat(business.amount) || 0);
          }, 0);

          // Calculate points
          let points = 0;
          let nextTierAmount = 0;
          if (totalAmount >= 500000) {
            points = 15;
            nextTierAmount = 0;
          } else if (totalAmount >= 50000) {
            points = 10;
            nextTierAmount = 500000 - totalAmount;
          } else if (totalAmount > 0) {
            points = 5;
            nextTierAmount = 50000 - totalAmount;
          } else {
            nextTierAmount = 50000;
          }

          setUserData((prev) => ({
            ...prev,
            business: {
              value: totalAmount.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }),
              points: points,
              maxValue: 500000,
              subtitle:
                nextTierAmount === 0
                  ? "Maximum points achieved"
                  : `₹${nextTierAmount.toLocaleString()} more needed for next tier`,
              tier:
                points === 15
                  ? "Maximum"
                  : points === 10
                  ? "Intermediate"
                  : points === 5
                  ? "Basic"
                  : "No Business",
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching business data:", error);
        // Set default values on error
        setUserData((prev) => ({
          ...prev,
          business: {
            value: "₹0",
            points: 0,
            maxValue: 500000,
            subtitle: "₹50,000 more needed for next tier",
            tier: "No Business",
          },
        }));
      }
    };

    fetchBusinessData();
  }, [selectedMonth, auth.user.id]);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const [year, month] = selectedMonth.split("-");
        const response = await api.get("/referrals", {
          params: {
            month,
            year,
            memberId: auth.user.id,
          },
        });

        if (response.data.success) {
          const { stats } = response.data;
          const referralCount = stats.totalReferrals;

          // Calculate points based on referral count
          let points = 0;
          let nextTierNeeded = 0;
          if (referralCount >= 5) {
            points = 15;
            nextTierNeeded = 0;
          } else if (referralCount >= 3) {
            points = 10;
            nextTierNeeded = 5 - referralCount;
          } else if (referralCount >= 1) {
            points = 5;
            nextTierNeeded = 3 - referralCount;
          } else {
            nextTierNeeded = 1;
          }

          setUserData((prev) => ({
            ...prev,
            referrals: {
              value: referralCount,
              points: points,
              maxValue: 5,
              subtitle:
                nextTierNeeded === 0
                  ? "Maximum points achieved"
                  : `${nextTierNeeded} more referral${
                      nextTierNeeded > 1 ? "s" : ""
                    } needed for next tier`,
              details: `
                • 1-2 referrals: 5 points
                • 3-4 referrals: 10 points
                • 5+ referrals: 15 points (max)
              `,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    fetchReferralData();
  }, [selectedMonth, auth.user.id]);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const [year, month] = selectedMonth.split("-");
        const response = await api.get("/visitors/stats", {
          params: {
            month,
            year,
            memberId: auth.user.id,
          },
        });

        if (response.data.success) {
          const { stats } = response.data.data;
          const visitorCount = stats.totalVisitors;

          // Calculate points based on visitor count
          let points = 0;
          let nextTierNeeded = 0;
          if (visitorCount >= 3) {
            points = 15;
            nextTierNeeded = 0;
          } else if (visitorCount === 2) {
            points = 10;
            nextTierNeeded = 1;
          } else if (visitorCount === 1) {
            points = 5;
            nextTierNeeded = 2;
          } else {
            nextTierNeeded = 3;
          }

          setUserData((prev) => ({
            ...prev,
            visitors: {
              value: visitorCount,
              points: points,
              maxValue: 3,
              subtitle:
                nextTierNeeded === 0
                  ? "Maximum points achieved"
                  : `${nextTierNeeded} more visitor${
                      nextTierNeeded > 1 ? "s" : ""
                    } needed for next tier`,
              details: `
                • 1 visitor: 5 points
                • 2 visitors: 10 points
                • 3+ visitors: 15 points (max)
              `,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      }
    };

    fetchVisitorData();
  }, [selectedMonth, auth.user.id]);

  useEffect(() => {
    const fetchSocialTrainingData = async () => {
      try {
        const response = await api.get("/attendance-venue-fee/social-stats");
        if (response.data.success) {
          const { stats, breakdown } = response.data.data;

          // Calculate points based on attendance count
          let points = 0;
          let subtitle = "";

          if (stats.totalAttended >= 3) {
            points = 15;
            subtitle = "Maximum points achieved";
          } else if (stats.totalAttended === 2) {
            points = 10;
            subtitle = "1 more social/training needed for 15 points";
          } else if (stats.totalAttended === 1) {
            points = 5;
            subtitle = "2 more socials/trainings needed for 15 points";
          } else {
            points = 0;
            subtitle = "3 socials/trainings needed for 15 points";
          }

          setUserData((prev) => ({
            ...prev,
            socials: {
              value: stats.totalAttended,
              points: points,
              maxValue: 3,
              subtitle: subtitle,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching social training data:", error);
      }
    };

    fetchSocialTrainingData();
  }, [auth.user.id]);

  useEffect(() => {
    // Calculate total points whenever any of the individual metrics change
    const totalPoints = Math.min(
      attendanceData.points +
        userData.bdm.points +
        userData.business.points +
        userData.referrals.points +
        userData.socials.points +
        userData.visitors.points,
      100 // Cap at 100 points
    );

    // Update only the totalPoints in userData
    setUserData((prev) => ({
      ...prev,
      totalPoints: totalPoints,
    }));
  }, [
    attendanceData.points,
    userData.bdm.points,
    userData.business.points,
    userData.referrals.points,
    userData.socials.points,
    userData.visitors.points,
  ]);

  // Utility function to calculate total points for a member
  const calculateTotalPoints = (points) => {
    return (
      (points.attendance || 0) +
      (points.bdm || 0) +
      (points.business || 0) +
      (points.referrals || 0) +
      (points.visitors || 0) +
      (points.socials || 0)
    );
  };

  const fetchAllMembers = async () => {
    try {
      setLoadingStats(true);
      setStatsError(null);

      // Get all members with their monthly stats in a single API call
      const [year, month] = selectedMonth.split("-");

      // Get all members
      const membersResponse = await api.get("/members/members");
      const members = membersResponse.data.data;

      // Calculate points for each member
      const membersWithPoints = await Promise.all(
        members
          .filter((member) => member.status === "active")
          .map(async (member) => {
            try {
              // Get all metrics for the member
              const [
                attendanceRes,
                bdmRes,
                businessRes,
                referralsRes,
                visitorsRes,
                socialsRes,
              ] = await Promise.all([
                api.get(
                  `/attendance-venue-fee/monthly-points?memberId=${member.id}&month=${month}&year=${year}`
                ),
                api.get(`/bdm?memberId=${member.id}`),
                api.get(`/business?memberId=${member.id}`),
                api.get(`/referrals?memberId=${member.id}`),
                api.get(`/visitors/stats?memberId=${member.id}`),
                api.get(
                  `/attendance-venue-fee/social-stats?memberId=${member.id}`
                ),
              ]);

              // Calculate points for each category
              const points = {
                attendance: attendanceRes.data?.data?.points || 0,
                bdm: calculateBDMPoints(bdmRes.data?.length || 0),
                business: calculateBusinessPoints(
                  businessRes.data?.total_amount || 0
                ).points,
                referrals: referralsRes.data?.stats?.points || 0,
                visitors: visitorsRes.data?.data?.stats?.points || 0,
                socials: socialsRes.data?.data?.stats?.points || 0,
              };

              const totalPoints = Math.min(
                Object.values(points).reduce((sum, p) => sum + p, 0),
                100
              );

              return {
                ...member,
                totalPoints,
                pointsBreakdown: points,
              };
            } catch (error) {
              console.error(
                `Error calculating points for member ${member.id}:`,
                error
              );
              return null;
            }
          })
      );

      // Filter out failed calculations and sort by points
      const validMembers = membersWithPoints
        .filter((m) => m !== null)
        .sort((a, b) => b.totalPoints - a.totalPoints);

      // Calculate tier statistics
      const stats = {
        platinum: 0,
        platinumPercentage: 0,
        gold: 0,
        goldPercentage: 0,
        silver: 0,
        silverPercentage: 0,
        bronze: 0,
        bronzePercentage: 0,
        total: validMembers.length,
      };

      // Distribute members based on points criteria
      validMembers.forEach((member) => {
        if (member.totalPoints >= 76) {
          stats.platinum++;
        } else if (member.totalPoints >= 51) {
          stats.gold++;
        } else if (member.totalPoints >= 30) {
          stats.silver++;
        } else {
          stats.bronze++;
        }
      });

      // Calculate percentages
      if (stats.total > 0) {
        stats.platinumPercentage = Math.round(
          (stats.platinum / stats.total) * 100
        );
        stats.goldPercentage = Math.round((stats.gold / stats.total) * 100);
        stats.silverPercentage = Math.round((stats.silver / stats.total) * 100);
        stats.bronzePercentage = Math.round((stats.bronze / stats.total) * 100);
      }

      // Log distribution for verification
      console.log("Member Distribution:", {
        totalMembers: stats.total,
        byTier: {
          platinum: `${stats.platinum} members (${stats.platinumPercentage}%)`,
          gold: `${stats.gold} members (${stats.goldPercentage}%)`,
          silver: `${stats.silver} members (${stats.silverPercentage}%)`,
          bronze: `${stats.bronze} members (${stats.bronzePercentage}%)`,
        },
      });

      setAllMembers(validMembers);
      setTierStats(stats);
    } catch (error) {
      console.error("Error fetching members:", error);
      setStatsError("Failed to load member statistics");
    } finally {
      setLoadingStats(false);
    }
  };

  // Update useEffect to fetch data when month changes
  useEffect(() => {
    fetchAllMembers();
  }, [selectedMonth]);

  // Update the getCategoryData function
  const getCategoryData = () => {
    return [
      {
        name: "Platinum",
        points: "76-100 Points",
        emoji: "🏆",
        memberCount: tierStats.platinum,
        percentage: tierStats.platinumPercentage,
        color: "from-amber-500 to-amber-600",
      },
      {
        name: "Gold",
        points: "51-75 Points",
        emoji: "🥇",
        memberCount: tierStats.gold,
        percentage: tierStats.goldPercentage,
        color: "from-yellow-500 to-yellow-600",
      },
      {
        name: "Silver",
        points: "30-50 Points",
        emoji: "🥈",
        memberCount: tierStats.silver,
        percentage: tierStats.silverPercentage,
        color: "from-gray-300 to-gray-400",
      },
      {
        name: "Bronze",
        points: "0-29 Points",
        emoji: "🥉",
        memberCount: tierStats.bronze,
        percentage: tierStats.bronzePercentage,
        color: "from-orange-600 to-orange-700",
      },
    ];
  };

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
      className="w-full p-6 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] opacity-[0.03] [background-size:16px_16px]"></div>

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
                <div className="w-50 h-40 flex items-center justify-center">
                  <div className="relative animate-bounce">
                    <div className="text-9xl">🏆</div>
                    <div className="absolute -top-2 -right-2 text-4xl animate-ping">
                      ✨
                    </div>
                    <div className="absolute -bottom-2 -left-2 text-4xl animate-ping delay-100">
                      ✨
                    </div>
                  </div>
                </div>

                <div className="w-40 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20">
                  <div className="px-6 py-9 text-center">
                    <div className="text-5xl font-bold text-white mb-1">
                      {userData.totalPoints}
                    </div>
                    <div className="text-white/90 text-sm font-medium">
                      Total Points
                    </div>
                    <div className="text-white/70 text-xs mt-1">
                      {Math.round((userData.totalPoints / 100) * 100)}% Complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  title="Meetings"
                  value={`${attendanceData.breakdown.present}/${attendanceData.breakdown.totalMeetings}`}
                  points={attendanceData.points}
                  subtitle={getAttendanceSubtitle(attendanceData)}
                  maxValue={attendanceData.maxPoints}
                  icon={Users}
                  details={
                    <div className="mt-2 text-xs text-gray-400">
                      <p>
                        Total Meetings: {attendanceData.breakdown.totalMeetings}
                      </p>
                      <p>Present: {attendanceData.breakdown.present}</p>
                      {attendanceData.breakdown.late > 0 && (
                        <p>
                          Late Arrivals: {attendanceData.breakdown.late} (-
                          {attendanceData.breakdown.deductions} points)
                        </p>
                      )}
                      {attendanceData.breakdown.absent > 0 && (
                        <p className="text-red-400">
                          Absent: {attendanceData.breakdown.absent}
                        </p>
                      )}
                    </div>
                  }
                />

                <MetricCard
                  title="BDM"
                  value={`${userData.bdm.breakdown.given}/${userData.bdm.breakdown.received}`}
                  points={userData.bdm.points}
                  subtitle={userData.bdm.subtitle}
                  maxValue={userData.bdm.maxValue}
                  icon={Handshake}
                  details={
                    <div className="mt-2 text-xs text-gray-400">
                      <p>Given: {userData.bdm.breakdown.given}</p>
                      <p>Received: {userData.bdm.breakdown.received}</p>
                      <p>Total Points: {userData.bdm.points}/20</p>
                    </div>
                  }
                />

                <MetricCard
                  title="Business"
                  value={`${userData.business.value}`}
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
                  details={
                    <div className="mt-2 text-xs text-gray-400">
                      <p>Current Points: {userData.referrals.points}/15</p>
                      <pre className="whitespace-pre-wrap font-sans">
                        {userData.referrals.details}
                      </pre>
                    </div>
                  }
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
                  value={`${userData.socials.value}/3`}
                  points={userData.socials.points}
                  subtitle={userData.socials.subtitle}
                  maxValue={userData.socials.maxValue}
                  icon={Users}
                  details={
                    <div className="mt-2 text-xs space-y-2">
                      <div className="text-gray-400">
                        <p className="font-medium text-amber-500 mb-1">
                          Current Status:
                        </p>
                        <p>Total Attended: {userData.socials.value}</p>
                        {userData.socials.breakdown && (
                          <>
                            <p>
                              • Present: {userData.socials.breakdown.present}
                            </p>
                            <p>• Late: {userData.socials.breakdown.late}</p>
                          </>
                        )}
                        <p className="mt-1">
                          Points Earned: {userData.socials.points}/15
                        </p>
                      </div>
                      <div className="text-gray-400">
                        <p className="font-medium text-amber-500 mb-1">
                          Points System:
                        </p>
                        <pre className="whitespace-pre-wrap font-sans">
                          {userData.socials.details}
                        </pre>
                      </div>
                    </div>
                  }
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

        {loadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(<LoadingCard />)}
          </div>
        ) : statsError ? (
          <div className="text-red-500 text-center p-4">{statsError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getCategoryData().map((category, index) => (
              <motion.div
                key={category.points}
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
                        {category.name}
                      </span>
                      <p className="text-xs text-gray-400">{category.points}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-6 relative">
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
        )}
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

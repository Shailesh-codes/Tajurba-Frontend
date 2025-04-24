import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import meetings from "../assets/images/icons/meeting.svg";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../hooks/api";
import { useAuth } from "../contexts/AuthContext";

const MeetingsMDP = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [selectedType, setSelectedType] = useState("meetings");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVenueFee, setSelectedVenueFee] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    meetings: { total: 0, present: 0, late: 0, absent: 0, substitutes: 0 },
    mdp: { total: 0, present: 0, late: 0, absent: 0 },
    social: { total: 0, present: 0, late: 0, absent: 0 },
  });
  const [scheduleData, setScheduleData] = useState({
    meetings: [],
    mdp: [],
    socialTraining: [],
  });

  // Helper function to get the correct ID field based on schedule type
  const getScheduleId = (schedule, type) => {
    switch (type) {
      case "meeting":
        return schedule.meeting_id;
      case "mdp":
        return schedule.mdp_id;
      case "socialTraining":
        return schedule.social_training_id;
      default:
        return null;
    }
  };

  // Helper function to check if schedule is relevant for the user
  const isScheduleRelevantForUser = (schedule) => {
    // If user is Admin or Regional Director, show all schedules
    if (
      auth.role === "Admin" ||
      auth.role === "Regional Director" ||
      auth.role === "Super Admin"
    ) {
      return true;
    }

    // For regular members, check if the schedule is for their chapter
    if (schedule.chapters && Array.isArray(schedule.chapters)) {
      return schedule.chapters.some(
        (chapter) => chapter.chapter_id === auth.chapter
      );
    }

    // If no chapters specified, check if schedule.chapter matches auth's chapter
    return schedule.chapter === auth.chapter;
  };

  // Updated processScheduleData function
  const processScheduleData = async (schedules, type) => {
    try {
      return await Promise.all(schedules.map(async (schedule) => {
        const scheduleId = getScheduleId(schedule, type);
        
        if (!scheduleId) {
          console.error(`Invalid schedule ID for type: ${type}`, schedule);
          return null;
        }

        try {
          // Get attendance stats for the authenticated user
          const statsResponse = await api.get(`/attendance-venue-fee/meeting-stats`, {
            params: {
              type: type,
              meeting_id: scheduleId,
              member_id: auth.user.id // Add member_id to get user-specific stats
            }
          });

          const stats = statsResponse.data.success ? statsResponse.data.data : null;

          // Get user's specific attendance record
          const attendanceResponse = await api.get(`/attendance-venue-fee/meeting-members`, {
            params: {
              type: type,
              meeting_id: scheduleId
            }
          });

          const userAttendance = attendanceResponse.data.success ? 
            attendanceResponse.data.data.find(record => record.id === auth.user.id) : null;

          return {
            id: scheduleId,
            title: schedule.title,
            date_time: `${new Date(schedule.date).toLocaleDateString()} ${schedule.time}`,
            venue: schedule.venue,
            status: userAttendance ? userAttendance.status : 'pending',
            venue_fee: {
              amount: schedule.fee_amount,
              status: userAttendance ? userAttendance.venue_fee_status : "not paid"
            },
            attendance_stats: stats,
            type: type,
            chapters: schedule.chapters || [],
            chapter: schedule.chapter,
            user_attendance: userAttendance
          };
        } catch (error) {
          console.error(`Error fetching stats for ${type} ID ${scheduleId}:`, error);
          return {
            id: scheduleId,
            title: schedule.title,
            date_time: `${new Date(schedule.date).toLocaleDateString()} ${schedule.time}`,
            venue: schedule.venue,
            status: 'pending',
            venue_fee: {
              amount: schedule.fee_amount,
              status: "not paid"
            },
            attendance_stats: null,
            type: type,
            chapters: schedule.chapters || [],
            chapter: schedule.chapter,
            user_attendance: null
          };
        }
      }));
    } catch (error) {
      console.error(`Error processing ${type} schedules:`, error);
      return [];
    }
  };

  // Updated fetchScheduleData function
  const fetchScheduleData = async () => {
    try {
      setLoading(true);

      // Get all schedules
      const response = await api.get(`/schedules`);
      
      if (response.data.success) {
        const { meetings = [], mdp = [], socialTraining = [] } = response.data.data;
        
        // Filter schedules based on user's role and chapter
        const filterSchedulesByUserAccess = (schedules) => {
          if (auth.role === "Admin" || auth.role === "Regional Director" || auth.role === "Super Admin") {
            return schedules; // Admins see all schedules
          }
          
          // Regular members only see schedules for their chapter
          return schedules.filter(schedule => {
            // Check if schedule has chapters array
            if (schedule.chapters && Array.isArray(schedule.chapters)) {
              return schedule.chapters.some(chapter => chapter.chapter_id === auth.user.chapter);
            }
            // Fallback to direct chapter comparison
            return schedule.chapter === auth.user.chapter;
          });
        };

        // Process and filter schedules based on user's role and chapter
        const processedMeetings = (await processScheduleData(
          filterSchedulesByUserAccess(meetings), 
          "meeting"
        )).filter(Boolean);
        
        const processedMDP = (await processScheduleData(
          filterSchedulesByUserAccess(mdp), 
          "mdp"
        )).filter(Boolean);
        
        const processedSocial = (await processScheduleData(
          filterSchedulesByUserAccess(socialTraining), 
          "socialTraining"
        )).filter(Boolean);

        setScheduleData({
          meetings: processedMeetings,
          mdp: processedMDP,
          socialTraining: processedSocial
        });

        // Update stats only for relevant schedules
        setStats({
          meetings: calculateTypeStats(processedMeetings),
          mdp: calculateTypeStats(processedMDP),
          social: calculateTypeStats(processedSocial)
        });
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  // Get current data based on selected type
  const getCurrentData = () => {
    switch (selectedType) {
      case "meetings":
        return scheduleData.meetings;
      case "mdp":
        return scheduleData.mdp;
      case "social":
        return scheduleData.socialTraining;
      default:
        return [];
    }
  };

  // Filter data based on selected filters
  const filteredData = getCurrentData().filter((item) => {
    if (selectedStatus !== "all" && item.status !== selectedStatus)
      return false;
    if (
      selectedVenueFee !== "all" &&
      item.venue_fee.status !== selectedVenueFee
    )
      return false;
    return true;
  });

  // Update the view button handler
  const handleViewClick = (item) => {
    navigate(`/members-mdp-events?type=${item.type}&meeting_id=${item.id}`);
  };

  // Updated getOverallStatus function with error handling
  const getOverallStatus = (stats) => {
    if (!stats || !stats.attendance) return "pending";

    try {
      const {
        present = 0,
        absent = 0,
        late_less = 0,
        late_more = 0,
      } = stats.attendance;
      const total = present + absent + late_less + late_more;

      if (total === 0) return "pending";
      if (present > total * 0.7) return "present";
      if (absent > total * 0.3) return "absent";
      return "late";
    } catch (error) {
      console.error("Error calculating status:", error);
      return "pending";
    }
  };

  // Updated calculateTypeStats function with error handling
  const calculateTypeStats = (items) => {
    const stats = {
      total: items.length,
      present: 0,
      late: 0,
      absent: 0,
      substitutes: 0,
    };

    items.forEach((item) => {
      if (item?.attendance_stats?.attendance) {
        const { attendance } = item.attendance_stats;
        stats.present += attendance.present || 0;
        stats.late += (attendance.late_less || 0) + (attendance.late_more || 0);
        stats.absent += attendance.absent || 0;
        stats.substitutes += attendance.substitutes || 0;
      }
    });

    return stats;
  };

  // Helper functions for status display
  const getStatusClass = (status) => {
    const classes = {
      present: "bg-green-500/10 text-green-500",
      late_less: "bg-amber-500/10 text-amber-500",
      late_more: "bg-amber-500/10 text-amber-500",
      absent: "bg-red-500/10 text-red-500",
    };
    return classes[status] || "bg-gray-500/10 text-gray-500";
  };

  const getVenueFeeClass = (status) => {
    return status === "paid"
      ? "bg-green-500/10 text-green-500"
      : "bg-red-500/10 text-red-500";
  };

  // Add chapter information to the table
  const renderChapterInfo = (item) => {
    if (
      auth.role === "Admin" ||
      auth.role === "Regional Director" ||
      auth.role === "Super Admin"
    ) {
      if (item.chapters && item.chapters.length > 0) {
        return (
          <span className="text-sm text-gray-400">
            {item.chapters.map((ch) => ch.chapter_name).join(", ")}
          </span>
        );
      }
      return (
        <span className="text-sm text-gray-400">
          {item.chapter || "All Chapters"}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="mt-32 p-1 lg:p-6 flex flex-col space-y-5">
      {/* Header Section with Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={meetings} alt="meetings" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Meeting Attendance & Venue Fees
            </h2>
            <p className="text-sm text-gray-400">
              View your meeting attendance records
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto group flex items-center justify-center sm:justify-start gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            <path
              d="M12.5 5L7.5 10L12.5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold tracking-wide text-sm">Back</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Meetings Stats */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400">Meetings</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.meetings.total}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <svg
                className="w-6 h-6 text-amber-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">
                {stats.meetings.present} Present
              </span>
            </div>
            <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
              <span className="text-sm text-amber-500">
                {stats.meetings.late} Late
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.meetings.absent} Absent
              </span>
            </div>
          </div>
        </div>

        {/* MDP Stats */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400">MDP</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.mdp.total}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <svg
                className="w-6 h-6 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 14L12 4M12 14L9 11M12 14L15 11M3 12V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">
                {stats.mdp.present} Present
              </span>
            </div>
            <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
              <span className="text-sm text-amber-500">
                {stats.mdp.late} Late
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.mdp.absent} Absent
              </span>
            </div>
          </div>
        </div>

        {/* Social & Training Stats */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400">Social & Training</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.social.total}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <svg
                className="w-6 h-6 text-purple-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M17 20H7M17 20C18.1046 20 19 19.1046 19 18V8.82843C19 8.29799 18.7893 7.78929 18.4142 7.41421L14.5858 3.58579C14.2107 3.21071 13.702 3 13.1716 3H7C5.89543 3 5 3.89543 5 5V18C5 19.1046 5.89543 20 7 20M17 20H7M9 9H13M9 13H15M9 17H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">
                {stats.social.present} Present
              </span>
            </div>
            <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
              <span className="text-sm text-amber-500">
                {stats.social.late} Late
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.social.absent} Absent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="border-b border-gray-700 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Schedule Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none bg-gray-800 text-gray-300 pl-10 pr-10 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-amber-500 text-sm"
            >
              <option value="meetings">Meetings</option>
              <option value="mdp">MDP</option>
              <option value="social">Social & Training</option>
            </select>
          </div>
          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none bg-gray-800 text-gray-300 pl-10 pr-10 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-amber-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Venue Fee Filter */}
          <div className="relative">
            <select
              value={selectedVenueFee}
              onChange={(e) => setSelectedVenueFee(e.target.value)}
              className="w-full appearance-none bg-gray-800 text-gray-300 pl-10 pr-10 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-amber-500 text-sm"
            >
              <option value="all">All Venue Fees</option>
              <option value="paid">Paid</option>
              <option value="not_paid">Not Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl"
      >
        <div className="relative min-h-[300px] max-h-[calc(100vh-500px)]">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
          <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80">
            <table className="w-full">
              <thead className="sticky top-0 z-20">
                <tr className="bg-gradient-to-r from-gray-800/95 via-gray-800/98 to-gray-800/95 backdrop-blur-xl">
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Title
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Date & Time
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Venue
                    </span>
                  </th>
                  {(auth.role === "Admin" ||
                    auth.role === "Regional Director" ||
                    auth.role === "Super Admin") && (
                    <th className="px-6 py-4 text-left border-b border-gray-700">
                      <span className="text-sm font-semibold text-gray-300">
                        Chapter
                      </span>
                    </th>
                  )}
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Venue Fee
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      No schedules found matching the selected filters
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={`${item.type}-${item.id}`}
                      className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {item.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">
                          {item.date_time}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">
                          {item.venue}
                        </span>
                      </td>
                      {(auth.role === "Admin" ||
                        auth.role === "Regional Director" ||
                        auth.role === "Super Admin") && (
                        <td className="px-6 py-4">{renderChapterInfo(item)}</td>
                      )}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-sm ${getStatusClass(item.user_attendance?.status || 'pending')}`}>
                          {(item.user_attendance?.status || 'pending')
                            .replace("_", " ")
                            .charAt(0)
                            .toUpperCase() + 
                            (item.user_attendance?.status || 'pending').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVenueFeeClass(item.user_attendance?.venue_fee_status || 'not paid')}`}>
                          ₹{item.venue_fee.amount} - {item.user_attendance?.venue_fee_status || 'not paid'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleViewClick(item)}
                            className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600/90 to-amber-800/90 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-amber-900/30 hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                            <FiEye className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Empty State */}
            {(!scheduleData || scheduleData.meetings.length === 0) && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="p-3 bg-gray-800/50 rounded-xl mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-center">No schedules found</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MeetingsMDP;

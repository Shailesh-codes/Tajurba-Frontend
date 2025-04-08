import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import api from "../hooks/api";
import attendanceIcon from "../assets/images/icons/attendance-icon.svg";
import calendarIcon from "../assets/images/icons/calender-icon.svg";

const AttendanceVenueFee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const markingType = queryParams.get("marking_type") || "attendance";
  const type = queryParams.get("type");
  const meetingId = queryParams.get("meeting_id");

  const [meetingDetails, setMeetingDetails] = useState({
    type: "-",
    title: "-",
    date: "-",
    time: "-",
    chapters: [],
  });
  const [stats, setStats] = useState({
    total_members: 0,
    attendance: {
      marked: 0,
      present: 0,
      absent: 0,
      late_less: 0,
      late_more: 0,
    },
    venue_fee: {
      collected: 0,
      total_expected: 0,
      paid_count: 0,
      unpaid_count: 0,
    },
  });
  const [members, setMembers] = useState([]);
  const [chapterMembers, setChapterMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMeetingData = async () => {
    if (!type || !meetingId) {
      navigate("/mark-attendance");
      return;
    }

    setLoading(true);
    try {
      const scheduleType =
        type === "meetings"
          ? "meeting"
          : type === "social"
          ? "socialTraining"
          : type;

      // First get attendance/venue fee data to ensure we have latest data
      const attendanceResponse = await axios.get(
        `${api}/attendance-venue-fee/meeting-members`,
        {
          params: {
            type: scheduleType,
            meeting_id: meetingId,
          },
        }
      );

      // Get meeting details with its chapters
      const meetingResponse = await axios.get(
        `${api}/schedules/${scheduleType}/${meetingId}`
      );

      if (meetingResponse.data.success) {
        const meetingData = meetingResponse.data.data;

        // Get all members
        const membersResponse = await axios.get(`${api}/members/members`);

        if (membersResponse.data.success) {
          // Get meeting chapters
          const meetingChapters = meetingData.chapters || [];

          // Create chapter groups
          const groupedByChapter = {};

          // Process each chapter in the meeting
          meetingChapters.forEach((chapter) => {
            // Filter members for this chapter
            const chapterMembers = membersResponse.data.data.filter(
              (member) =>
                parseInt(member.chapter) === parseInt(chapter.chapter_id) &&
                member.status === "active"
            );

            if (chapterMembers.length > 0) {
              groupedByChapter[chapter.chapter_name] = {
                chapter_id: chapter.chapter_id,
                members: chapterMembers
                  .map((member) => {
                    // Find existing attendance data
                    const existingData = attendanceResponse.data.data.find(
                      (m) => m.id === member.id
                    );

                    return {
                      id: member.id,
                      full_name: member.name,
                      chapter: member.chapter,
                      chapter_name: chapter.chapter_name,
                      is_active: member.status === "active",
                      status: existingData?.status || null,
                      venue_fee_status: existingData?.venue_fee_status || null,
                      payment_date: existingData?.payment_date || null,
                      late_minutes: existingData?.late_minutes || null,
                      is_substitute: existingData?.is_substitute || 0,
                      total_absences: member.total_absences || 0,
                      total_substitutes: member.total_substitutes || 0,
                    };
                  })
                  .sort((a, b) => a.full_name.localeCompare(b.full_name)),
              };

              // Initialize chapter stats
              groupedByChapter[chapter.chapter_name].stats = {
                total: chapterMembers.length,
                marked: 0,
                present: 0,
                substitutes: 0,
                absent: 0,
                late: 0,
                paid: 0,
                unpaid: 0,
              };

              // Calculate chapter stats
              groupedByChapter[chapter.chapter_name].members.forEach(
                (member) => {
                  if (member.status)
                    groupedByChapter[chapter.chapter_name].stats.marked++;

                  // Count present only for non-substitutes
                  if (member.status === "present" && member.is_substitute !== 1)
                    groupedByChapter[chapter.chapter_name].stats.present++;

                  // Count substitutes separately
                  if (member.status === "present" && member.is_substitute === 1)
                    groupedByChapter[chapter.chapter_name].stats.substitutes++;

                  if (member.status === "absent")
                    groupedByChapter[chapter.chapter_name].stats.absent++;
                  if (member.status === "late")
                    groupedByChapter[chapter.chapter_name].stats.late++;
                  if (member.venue_fee_status === "paid")
                    groupedByChapter[chapter.chapter_name].stats.paid++;
                  if (member.venue_fee_status === "unpaid")
                    groupedByChapter[chapter.chapter_name].stats.unpaid++;
                }
              );
            }
          });

          setMeetingDetails({
            type:
              type === "social"
                ? "socialTraining"
                : type === "mdp"
                ? "MDP"
                : type.charAt(0).toUpperCase() + type.slice(1),
            title: meetingData.title,
            date: meetingData.date,
            time: meetingData.time,
            chapters: meetingChapters,
          });

          setChapterMembers(groupedByChapter);

          // Set members as a flat array of all chapter members
          const allMembers = Object.values(groupedByChapter).reduce(
            (acc, chapter) => [...acc, ...chapter.members],
            []
          );
          setMembers(allMembers);
        }

        // Get overall stats
        const statsResponse = await axios.get(
          `${api}/attendance-venue-fee/meeting-stats`,
          {
            params: {
              type: scheduleType,
              meeting_id: meetingId,
            },
          }
        );

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }
      }
    } catch (error) {
      showError(`Failed to load meeting data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingData();
  }, [type, meetingId]);

  const handleAttendanceChange = (memberId, status) => {
    // Update members state
    setMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            status,
            late_minutes: status === "late" ? "less_than_10" : null,
          };
        }
        return member;
      })
    );

    // Update chapterMembers state
    setChapterMembers((prevChapterMembers) => {
      const newChapterMembers = { ...prevChapterMembers };
      Object.keys(newChapterMembers).forEach((chapterName) => {
        newChapterMembers[chapterName].members = newChapterMembers[
          chapterName
        ].members.map((member) => {
          if (member.id === memberId) {
            return {
              ...member,
              status,
              late_minutes: status === "late" ? "less_than_10" : null,
            };
          }
          return member;
        });

        // Update chapter stats - recalculate all stats
        const stats = newChapterMembers[chapterName].stats;
        stats.marked = 0;
        stats.present = 0;
        stats.substitutes = 0;
        stats.absent = 0;
        stats.late = 0;

        newChapterMembers[chapterName].members.forEach((member) => {
          if (member.status) stats.marked++;

          // Count present only for non-substitutes
          if (member.status === "present" && member.is_substitute !== 1)
            stats.present++;

          // Count substitutes separately
          if (member.status === "present" && member.is_substitute === 1)
            stats.substitutes++;

          if (member.status === "absent") stats.absent++;
          if (member.status === "late") stats.late++;
        });
      });
      return newChapterMembers;
    });
  };

  const handleSubstituteChange = (memberId, checked) => {
    // Update members state
    setMembers(
      members.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            is_substitute: checked ? 1 : 0,
          };
        }
        return member;
      })
    );

    // Update chapterMembers state with recalculated stats
    setChapterMembers((prevChapterMembers) => {
      const updatedChapterMembers = { ...prevChapterMembers };

      Object.keys(updatedChapterMembers).forEach((chapterName) => {
        // Update member data
        updatedChapterMembers[chapterName].members = updatedChapterMembers[
          chapterName
        ].members.map((member) => {
          if (member.id === memberId) {
            return {
              ...member,
              is_substitute: checked ? 1 : 0,
            };
          }
          return member;
        });

        // Recalculate chapter stats for present and substitutes
        const stats = updatedChapterMembers[chapterName].stats;
        stats.present = 0;
        stats.substitutes = 0;

        updatedChapterMembers[chapterName].members.forEach((member) => {
          if (member.status === "present" && member.is_substitute !== 1)
            stats.present++;
          if (member.status === "present" && member.is_substitute === 1)
            stats.substitutes++;
        });
      });

      return updatedChapterMembers;
    });
  };

  const handleLateMinutesChange = (memberId, minutes) => {
    // Update both states
    setMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            late_minutes: minutes,
          };
        }
        return member;
      })
    );

    setChapterMembers((prevChapterMembers) => {
      const newChapterMembers = { ...prevChapterMembers };
      Object.keys(newChapterMembers).forEach((chapterName) => {
        newChapterMembers[chapterName].members = newChapterMembers[
          chapterName
        ].members.map((member) => {
          if (member.id === memberId) {
            return {
              ...member,
              late_minutes: minutes,
            };
          }
          return member;
        });
      });
      return newChapterMembers;
    });
  };

  const handleVenueFeeChange = (memberId, status) => {
    const currentDate = new Date().toISOString().split("T")[0];

    // Update members state
    setMembers(
      members.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            venue_fee_status: status,
            payment_date: status === "paid" ? currentDate : null,
          };
        }
        return member;
      })
    );

    // Update chapterMembers state
    setChapterMembers((prevChapterMembers) => {
      const updatedChapterMembers = { ...prevChapterMembers };
      Object.keys(updatedChapterMembers).forEach((chapterName) => {
        updatedChapterMembers[chapterName].members = updatedChapterMembers[
          chapterName
        ].members.map((member) => {
          if (member.id === memberId) {
            return {
              ...member,
              venue_fee_status: status,
              payment_date: status === "paid" ? currentDate : null,
            };
          }
          return member;
        });

        // Update chapter stats
        const stats = updatedChapterMembers[chapterName].stats;
        stats.paid = 0;
        stats.unpaid = 0;
        updatedChapterMembers[chapterName].members.forEach((member) => {
          if (member.venue_fee_status === "paid") stats.paid++;
          if (member.venue_fee_status === "unpaid") stats.unpaid++;
        });
      });
      return updatedChapterMembers;
    });
  };

  const handlePaymentDateChange = (memberId, date) => {
    setMembers(
      members.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            payment_date: date,
          };
        }
        return member;
      })
    );

    // Update chapterMembers state
    setChapterMembers((prevChapterMembers) => {
      const updatedChapterMembers = { ...prevChapterMembers };
      Object.keys(updatedChapterMembers).forEach((chapterName) => {
        updatedChapterMembers[chapterName].members = updatedChapterMembers[
          chapterName
        ].members.map((member) => {
          if (member.id === memberId) {
            return {
              ...member,
              payment_date: date,
            };
          }
          return member;
        });
      });
      return updatedChapterMembers;
    });
  };

  const validateAttendanceData = () => {
    const unmarkedMembers = members.filter((member) => !member.status);
    if (unmarkedMembers.length > 0) {
      return {
        isValid: false,
        message: `${unmarkedMembers.length} member(s) have no attendance status marked`,
      };
    }
    return { isValid: true };
  };

  const hasMarkedAttendance = () => {
    return Object.values(chapterMembers).some((chapter) =>
      chapter.members.some((member) => member.status)
    );
  };

  const saveData = async () => {
    try {
      // Collect attendance data in the exact format backend expects
      const attendanceData = [];
      Object.values(chapterMembers).forEach((chapter) => {
        chapter.members.forEach((member) => {
          if (member.status) {
            // Create a clean object with only the fields the backend expects
            attendanceData.push({
              member_id: member.id,
              attendance_status: member.status,
              late_minutes:
                member.status === "late" ? member.late_minutes : null,
              is_substitute: Boolean(member.is_substitute), // Convert to proper JavaScript boolean
              venue_fee_status: member.venue_fee_status || null,
              payment_date: member.payment_date || null,
            });
          }
        });
      });

      if (attendanceData.length === 0) {
        await Swal.fire({
          icon: "warning",
          title: "No Attendance Marked",
          text: "Please mark attendance for at least one member before saving.",
          background: "#111827",
          color: "#fff",
        });
        return;
      }

      // Show saving dialog
      Swal.fire({
        title: "Saving...",
        text: "Please wait while we save the data",
        allowOutsideClick: false,
        showConfirmButton: false,
        background: "#111827",
        color: "#fff",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const requestData = {
        type:
          type === "meetings"
            ? "meeting"
            : type === "social"
            ? "socialTraining"
            : type,
        meeting_id: parseInt(meetingId),
        attendance_data: attendanceData,
      };

      console.log("Sending request:", JSON.stringify(requestData, null, 2));

      // Make the API call with proper error handling
      try {
        const response = await axios.post(
          `${api}/attendance-venue-fee/save-attendance`,
          requestData
        );

        Swal.close(); // Close loading dialog

        if (response.data.success) {
          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: `Successfully saved attendance for ${attendanceData.length} members`,
            background: "#111827",
            color: "#fff",
          });

          // Refresh the data
          await fetchMeetingData();
        } else {
          throw new Error(response.data.message || "Failed to save attendance");
        }
      } catch (error) {
        Swal.close(); // Ensure loading dialog is closed
        console.error("API Error:", error);

        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || error.message,
          background: "#111827",
          color: "#fff",
        });
      }
    } catch (error) {
      Swal.close(); // Ensure loading dialog is closed
      console.error("Error in saveData:", error);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        background: "#111827",
        color: "#fff",
      });
    }
  };

  const showError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
      background: "#111827",
      color: "#fff",
    });
  };

  const filteredMembers = members.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.chapter_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-32 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={attendanceIcon} alt="attendance" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {markingType === "attendance"
                ? "Mark Attendance"
                : "Update Venue Fees"}
            </h2>
            <p className="text-sm text-gray-400">
              Record{" "}
              {markingType === "attendance" ? "attendance" : "venue fees"} for
              meetings
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/mark-attendance")}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700"
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

      {/* Meeting Details Card */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Meeting Type</p>
            <h3 className="text-xl font-semibold text-white">
              {meetingDetails.type}
            </h3>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Meeting Name</p>
            <h3 className="text-xl font-semibold text-white">
              {meetingDetails.title}
            </h3>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Meeting Date</p>
            <h3 className="text-xl font-semibold text-white">
              {new Date(meetingDetails.date).toLocaleDateString("en-GB")}{" "}
              {meetingDetails.time}
            </h3>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Total Members Card */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:bg-gray-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Members</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.total_members}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:bg-gray-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Marked Attendance</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.attendance.marked}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="px-2.5 py-1 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">
                {stats.attendance.present} Present
              </span>
            </div>
            {type === "meetings" && (
              <div className="px-2.5 py-1 bg-blue-500/10 rounded-lg">
                <span className="text-sm text-blue-500">
                  {stats.attendance.substitutes || 0} Substitutes
                </span>
              </div>
            )}

            <div className="px-2.5 py-1 bg-yellow-500/10 rounded-lg">
              <span className="text-sm text-yellow-500">
                {stats.attendance.late_total ||
                  parseInt(stats.attendance.late_less || 0) +
                    parseInt(stats.attendance.late_more || 0)}{" "}
                Late
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.attendance.absent} Absent
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:bg-gray-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Venue Fee Collection</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                ₹{stats.venue_fee.collected} / ₹{stats.venue_fee.total_expected}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 6V12M12 12V18M12 12H18M12 12H6"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
              <span className="text-sm text-amber-500">
                {stats.venue_fee.paid_count} Paid
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.venue_fee.unpaid_count} Unpaid
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mt-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0"
          />
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-400">
            Loading members...
          </div>
        ) : Object.keys(chapterMembers).length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            No active members found in selected chapters
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(chapterMembers).map(([chapterName, data]) => {
              // Filter members in this chapter based on search term
              const filteredMembers = data.members.filter((member) =>
                member.full_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              );

              // Skip rendering this chapter section if no members match the search
              if (filteredMembers.length === 0) return null;

              return (
                <div key={chapterName} className="space-y-4">
                  {/* Chapter Header */}
                  <div className="bg-gray-700/50 p-4 rounded-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {chapterName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {filteredMembers.length} Active Members
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {markingType === "attendance" ? (
                          <>
                            <div className="px-3 py-1.5 bg-green-500/10 rounded-lg">
                              <span className="text-sm text-green-400">
                                Present: {data.stats.present}
                              </span>
                            </div>

                            {type === "meetings" && (
                              <div className="px-3 py-1.5 bg-blue-500/10 rounded-lg">
                                <span className="text-sm text-blue-400">
                                  Substitutes: {data.stats.substitutes || 0}
                                </span>
                              </div>
                            )}

                            <div className="px-3 py-1.5 bg-red-500/10 rounded-lg">
                              <span className="text-sm text-red-400">
                                Absent: {data.stats.absent}
                              </span>
                            </div>
                            <div className="px-3 py-1.5 bg-yellow-500/10 rounded-lg">
                              <span className="text-sm text-yellow-400">
                                Late: {data.stats.late}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="px-3 py-1.5 bg-green-500/10 rounded-lg">
                              <span className="text-sm text-green-400">
                                Paid: {data.stats.paid}
                              </span>
                            </div>
                            <div className="px-3 py-1.5 bg-red-500/10 rounded-lg">
                              <span className="text-sm text-red-400">
                                Unpaid: {data.stats.unpaid}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Members Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-gray-800">
                          <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap">
                            #
                          </th>
                          <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap">
                            Member
                          </th>
                          {markingType === "attendance" ? (
                            <>
                              {type === "meetings" && (
                                <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">
                                  Substitute
                                </th>
                              )}
                              <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">
                                Present
                              </th>
                              <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">
                                Absent
                              </th>
                              <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">
                                Late
                              </th>
                              <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">
                                Minutes Late
                              </th>
                            </>
                          ) : (
                            <>
                              <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">
                                Paid
                              </th>
                              <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">
                                Unpaid
                              </th>
                              <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">
                                Payment Date
                              </th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {filteredMembers.map((member, index) => (
                          <tr key={member.id} className="hover:bg-gray-800/50">
                            <td className="p-4 text-gray-300">{index + 1}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-1">
                                  <span className="px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-500 rounded-full">
                                    Active
                                  </span>
                                  <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-500 rounded-full">
                                    {member.total_absences} A
                                  </span>
                                  {type === "meetings" && (
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-500 rounded-full">
                                      {member.total_substitutes}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-white">
                                    {member.full_name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            {markingType === "attendance" ? (
                              <>
                                {type === "meetings" && (
                                  <td className="p-4 text-center">
                                    <input
                                      type="checkbox"
                                      checked={member.is_substitute === 1}
                                      onChange={(e) => {
                                        handleSubstituteChange(
                                          member.id,
                                          e.target.checked
                                        );
                                        // If checked as substitute, automatically mark as present
                                        if (
                                          e.target.checked &&
                                          member.status !== "present"
                                        ) {
                                          handleAttendanceChange(
                                            member.id,
                                            "present"
                                          );
                                        }
                                      }}
                                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                  </td>
                                )}
                                <td className="p-4 text-center">
                                  <input
                                    type="radio"
                                    name={`attendance_${member.id}`}
                                    value="present"
                                    checked={member.status === "present"}
                                    onChange={() =>
                                      handleAttendanceChange(
                                        member.id,
                                        "present"
                                      )
                                    }
                                    className="attendance-radio"
                                  />
                                </td>
                                <td className="p-4 text-center">
                                  <input
                                    type="radio"
                                    name={`attendance_${member.id}`}
                                    value="absent"
                                    checked={member.status === "absent"}
                                    onChange={() =>
                                      handleAttendanceChange(
                                        member.id,
                                        "absent"
                                      )
                                    }
                                    className="attendance-radio"
                                  />
                                </td>
                                <td className="p-4 text-center">
                                  <input
                                    type="radio"
                                    name={`attendance_${member.id}`}
                                    value="late"
                                    checked={member.status === "late"}
                                    onChange={() =>
                                      handleAttendanceChange(member.id, "late")
                                    }
                                    className="attendance-radio"
                                  />
                                </td>
                                <td className="p-4 text-center">
                                  <select
                                    value={
                                      member.late_minutes || "less_than_10"
                                    }
                                    onChange={(e) =>
                                      handleLateMinutesChange(
                                        member.id,
                                        e.target.value
                                      )
                                    }
                                    disabled={member.status !== "late"}
                                    className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-amber-500 focus:ring-0"
                                  >
                                    <option value="less_than_10">
                                      Less than 10
                                    </option>
                                    <option value="more_than_10">
                                      More than 10
                                    </option>
                                  </select>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="p-4 text-center">
                                  <input
                                    type="radio"
                                    name={`venue_fee_${member.id}`}
                                    value="paid"
                                    checked={member.venue_fee_status === "paid"}
                                    onChange={(e) =>
                                      handleVenueFeeChange(
                                        member.id,
                                        e.target.value
                                      )
                                    }
                                    className="venue-fee-radio"
                                  />
                                </td>
                                <td className="p-4 text-center">
                                  <input
                                    type="radio"
                                    name={`venue_fee_${member.id}`}
                                    value="unpaid"
                                    checked={
                                      member.venue_fee_status === "unpaid"
                                    }
                                    onChange={(e) =>
                                      handleVenueFeeChange(
                                        member.id,
                                        e.target.value
                                      )
                                    }
                                    className="venue-fee-radio"
                                  />
                                </td>
                                <td className="p-4 text-center">
                                  <div className="relative">
                                    <input
                                      type="date"
                                      value={member.payment_date || ""}
                                      onChange={(e) =>
                                        handlePaymentDateChange(
                                          member.id,
                                          e.target.value
                                        )
                                      }
                                      disabled={
                                        member.venue_fee_status !== "paid"
                                      }
                                      className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                                    />
                                    <img
                                      src={calendarIcon}
                                      alt="calendar"
                                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                                    />
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="bg-gray-900 p-4 mt-4">
        {/* <button
          onClick={async () => {
            console.log("Debug button clicked");
            console.log("Current state:", {
              type,
              meetingId,
              chapterMembers,
              members,
            });
          }}
          className="mr-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Debug Log
        </button> */}
        <button
          onClick={saveData}
          disabled={!hasMarkedAttendance()}
          className={`ml-auto flex items-center gap-2 px-6 py-3 ${
            hasMarkedAttendance()
              ? "bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950"
              : "bg-gray-700 cursor-not-allowed"
          } text-white rounded-xl transition-all duration-300`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3.33301 10L8.33301 15L16.6663 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {markingType === "attendance" ? "Save Attendance" : "Save Venue Fee"}
        </button>
      </div>
    </div>
  );
};

export default AttendanceVenueFee;

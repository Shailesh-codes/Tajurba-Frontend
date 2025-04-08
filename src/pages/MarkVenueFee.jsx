import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import attendanceIcon from "../assets/images/icons/attendance-icon.svg";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import api from "../hooks/api";

const MarkvenueFee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const meetingId = queryParams.get("meeting_id");

  const [meetingDetails, setMeetingDetails] = useState({
    type: "-",
    title: "-",
    date: "-",
    time: "-",
  });

  const [stats, setStats] = useState({
    total_members: 0,
    venue_fee: {
      collected: 0,
      total_expected: 0,
      paid_count: 0,
      unpaid_count: 0,
    },
  });

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [chapterMembers, setChapterMembers] = useState({});

  useEffect(() => {
    if (!type || !meetingId) {
      navigate("/mark-attendance");
      return;
    }
    fetchMeetingData();
  }, [type, meetingId]);

  const fetchMeetingData = async () => {
    if (!type || !meetingId) {
      navigate("/mark-attendance");
      return;
    }

    setLoading(true);
    try {
      // For fetching, use socialTraining
      const scheduleType =
        type === "meetings"
          ? "meeting"
          : type === "social"
          ? "socialTraining"
          : type;

      // Get attendance/venue fee data
      const attendanceResponse = await axios.get(
        `${api}/attendance-venue-fee/meeting-members`,
        {
          params: {
            type: scheduleType,
            meeting_id: meetingId,
          },
        }
      );

      // Get meeting details
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
              const membersWithData = chapterMembers
                .map((member) => {
                  // Find existing attendance data
                  const existingData = attendanceResponse.data.data.find(
                    (m) => m.id === member.id
                  );

                  // Format the payment date properly
                  let formattedPaymentDate = null;
                  if (existingData?.payment_date) {
                    try {
                      // Convert to YYYY-MM-DD format for the date input
                      formattedPaymentDate = formatDate(
                        existingData.payment_date
                      );
                    } catch (err) {
                      console.error(
                        `Error formatting payment date for member ${member.id}:`,
                        err
                      );
                    }
                  }

                  return {
                    id: member.id,
                    full_name: member.name,
                    chapter: member.chapter,
                    chapter_name: chapter.chapter_name,
                    is_active: member.status === "active",
                    venue_fee_status: existingData?.venue_fee_status || null,
                    payment_date: formattedPaymentDate, // Use the formatted date
                  };
                })
                .sort((a, b) => a.full_name.localeCompare(b.full_name));

              groupedByChapter[chapter.chapter_name] = {
                chapter_id: chapter.chapter_id,
                members: membersWithData,
              };

              // Initialize chapter stats
              groupedByChapter[chapter.chapter_name].stats = {
                total: chapterMembers.length,
                paid: 0,
                unpaid: 0,
              };

              // Calculate chapter stats
              membersWithData.forEach((member) => {
                if (member.venue_fee_status === "paid")
                  groupedByChapter[chapter.chapter_name].stats.paid++;
                if (member.venue_fee_status === "unpaid")
                  groupedByChapter[chapter.chapter_name].stats.unpaid++;
              });
            }
          });

          setMeetingDetails({
            type:
              type === "social"
                ? "Social Training"
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

  const formatDate = (date) => {
    if (!date) return null;

    try {
      // If it's already in YYYY-MM-DD format, return it
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }

      // If it's a date string with time information
      if (typeof date === "string") {
        // Try to extract just the date part
        const datePart = date.split("T")[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          return datePart;
        }
      }

      // Create a new date object
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        console.error("Invalid date:", date);
        return null;
      }

      // Format as YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  const handleVenueFeeChange = (memberId, status) => {
    // Only set a date when the status is "paid"
    const currentDate = status === "paid" ? formatDate(new Date()) : null;

    console.log(
      `Setting member ${memberId} to ${status} with date ${currentDate}`
    );

    // Update members state
    setMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            venue_fee_status: status,
            payment_date: currentDate,
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
              venue_fee_status: status,
              payment_date: currentDate,
            };
          }
          return member;
        });

        // Recalculate chapter stats
        const chapterStats = newChapterMembers[chapterName].stats;
        chapterStats.paid = newChapterMembers[chapterName].members.filter(
          (m) => m.venue_fee_status === "paid"
        ).length;
        chapterStats.unpaid = newChapterMembers[chapterName].members.filter(
          (m) => m.venue_fee_status === "unpaid"
        ).length;
      });
      return newChapterMembers;
    });
  };

  const handlePaymentDateChange = (memberId, date) => {
    const formattedDate = formatDate(date);

    // Update members state
    setMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            payment_date: formattedDate,
            venue_fee_status: formattedDate ? "paid" : "unpaid",
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
              payment_date: formattedDate,
              venue_fee_status: formattedDate ? "paid" : "unpaid",
            };
          }
          return member;
        });

        // Recalculate chapter stats
        const chapterStats = newChapterMembers[chapterName].stats;
        chapterStats.paid = newChapterMembers[chapterName].members.filter(
          (m) => m.venue_fee_status === "paid"
        ).length;
        chapterStats.unpaid = newChapterMembers[chapterName].members.filter(
          (m) => m.venue_fee_status === "unpaid"
        ).length;
      });
      return newChapterMembers;
    });
  };

  const saveData = async () => {
    try {
      // Filter out members without venue fee status
      const data = members
        .filter((member) => member.venue_fee_status)
        .map((member) => {
          let formattedDate = null;
          if (member.venue_fee_status === "paid") {
            // If no payment date is set but status is "paid", use today's date
            formattedDate = formatDate(member.payment_date || new Date());
          }

          return {
            member_id: member.id,
            venue_fee_status: member.venue_fee_status,
            payment_date: formattedDate, // Use the formatted date
          };
        });

      if (data.length === 0) {
        await Swal.fire({
          icon: "warning",
          title: "No Data to Save",
          text: "Please mark venue fee status for at least one member",
          background: "#111827",
          color: "#fff",
        });
        return;
      }

      // Show loading state
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

      // Prepare request data
      const requestData = {
        meeting_id: parseInt(meetingId),
        type:
          type === "meetings"
            ? "meeting"
            : type === "social"
            ? "socialTraining"
            : type,
        venue_fee_data: data,
      };

      console.log("Sending request data:", requestData);

      // Make the API call
      const response = await axios.post(
        `${api}/attendance-venue-fee/save-venue-fee`,
        requestData
      );

      // Close loading alert
      Swal.close();

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Venue fees saved successfully",
          background: "#111827",
          color: "#fff",
        });

        // Refresh the data
        await fetchMeetingData();
      } else {
        throw new Error(response.data.message || "Failed to save venue fees");
      }
    } catch (error) {
      console.error("Error saving venue fees:", error);

      // Close loading state if it's still open
      Swal.close();

      // Show error message
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to save venue fees. Please try again.",
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
            <h2 className="text-2xl font-bold text-white">Update Venue Fees</h2>
            <p className="text-sm text-gray-400">
              Record venue fees for meetings
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-gray-400">Meeting Type</p>
            <h3 className="text-xl font-semibold text-white">
              {meetingDetails.type}
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Meeting Name</p>
            <h3 className="text-xl font-semibold text-white">
              {meetingDetails.title}
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Meeting Date & Time</p>
            <h3 className="text-xl font-semibold text-white">
              {new Date(meetingDetails.date).toLocaleDateString()}{" "}
              {meetingDetails.time}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
      >
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-600/30 rounded-xl p-6 border border-blue-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Members</p>
              <h3 className="text-3xl font-bold text-white mt-2">
                {stats.total_members}
              </h3>
            </div>
            <div className="p-4 bg-blue-500/20 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-600/30 rounded-xl p-6 border border-purple-800/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400">Venue Fee Collection</p>
              <h3 className="text-3xl font-bold text-white mt-2">
                ₹{stats.venue_fee.collected} / ₹{stats.venue_fee.total_expected}
              </h3>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-xl">
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
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-green-500/20 rounded-lg">
              <span className="text-sm text-green-400">
                {stats.venue_fee.paid_count} Paid
              </span>
            </div>
            <div className="px-3 py-1.5 bg-red-500/20 rounded-lg">
              <span className="text-sm text-red-400">
                {stats.venue_fee.unpaid_count} Unpaid
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Members Table */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
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
        ) : filteredMembers.length === 0 ? (
          <div className="py-8 text-center text-gray-400">No members found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-700/50">
                  <th className="p-4 font-semibold text-gray-300">#</th>
                  <th className="p-4 font-semibold text-gray-300">Member</th>
                  <th className="p-4 text-center font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="p-4 text-center font-semibold text-gray-300">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-4 text-gray-300">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            member.is_active ? "bg-amber-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-white">
                            {member.full_name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {member.chapter_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`venue_fee_${member.id}`}
                            value="paid"
                            checked={member.venue_fee_status === "paid"}
                            onChange={() =>
                              handleVenueFeeChange(member.id, "paid")
                            }
                            className="venue-fee-radio-paid"
                          />
                          <span className="text-green-400">Paid</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`venue_fee_${member.id}`}
                            value="unpaid"
                            checked={member.venue_fee_status === "unpaid"}
                            onChange={() =>
                              handleVenueFeeChange(member.id, "unpaid")
                            }
                            className="venue-fee-radio-unpaid"
                          />
                          <span className="text-red-400">Unpaid</span>
                        </label>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="relative">
                        <input
                          type="date"
                          value={member.payment_date || ""}
                          onChange={(e) =>
                            handlePaymentDateChange(member.id, e.target.value)
                          }
                          disabled={member.venue_fee_status !== "paid"}
                          max={formatDate(new Date())}
                          className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                        />
                        <img
                          src={calendarIcon}
                          alt="calendar"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="sticky -bottom-5 bg-gray-900 p-4 mt-4">
        <button
          onClick={saveData}
          className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3.33301 10L8.33301 15L16.6663 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Save Venue Fee
        </button>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .venue-fee-radio-paid,
        .venue-fee-radio-unpaid {
          appearance: none;
          width: 1.2rem;
          height: 1.2rem;
          border: 2px solid #374151;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .venue-fee-radio-paid:checked {
          border-color: #22c55e;
          background-color: #22c55e;
        }

        .venue-fee-radio-unpaid:checked {
          border-color: #ef4444;
          background-color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default MarkvenueFee;

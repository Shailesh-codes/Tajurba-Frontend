import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import api from "../hooks/api";

// Import icons
import eventIcon from "../assets/images/icons/event.svg";
import addIcon from "../assets/images/icons/add.svg";
import viewIcon from "../assets/images/icons/view.svg";
import editIcon from "../assets/images/icons/edit.svg";
import deleteIcon from "../assets/images/icons/delete.svg";

const ScheduleMeetings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allChapters, setAllChapters] = useState([]);

  // Helper function to determine schedule type
  const getScheduleType = (schedule) => {
    if (schedule.meeting_id) return "meeting";
    if (schedule.event_id) return "event";
    if (schedule.mdp_id) return "mdp";
    if (schedule.social_training_id) return "socialTraining";
    return "unknown";
  };

  // Helper function to get schedule ID
  const getScheduleId = (schedule) => {
    return (
      schedule.meeting_id ||
      schedule.event_id ||
      schedule.mdp_id ||
      schedule.social_training_id ||
      "unknown"
    );
  };

  // Fetch schedules from backend
  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${api}/schedules${selectedType ? `?type=${selectedType}` : ""}`
      );

      if (response.data.success) {
        let schedulesData = [];
        if (selectedType) {
          schedulesData = response.data.data.map((schedule) => ({
            ...schedule,
            type: selectedType,
          }));
        } else {
          // Combine all schedule types and add type identifier
          schedulesData = [
            ...(response.data.data.meetings?.map((meeting) => ({
              ...meeting,
      type: "meeting",
            })) || []),
            ...(response.data.data.events?.map((event) => ({
              ...event,
      type: "event",
            })) || []),
            ...(response.data.data.mdp?.map((mdp) => ({
              ...mdp,
      type: "mdp",
            })) || []),
            ...(response.data.data.socialTraining?.map((st) => ({
              ...st,
      type: "socialTraining",
            })) || []),
          ];
        }
        setSchedules(schedulesData);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to fetch chapters
  const fetchChapters = async () => {
    try {
      const response = await axios.get(`${api}/chapters`);
      if (response.data.status === "success") {
        setAllChapters(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  // Update useEffect to fetch both schedules and chapters
  useEffect(() => {
    fetchSchedules();
    fetchChapters();
  }, [selectedType]);

  // Helper function to get chapter names from chapter IDs
  const getChapterNames = (chapterIds) => {
    if (!chapterIds) return "No chapters";
    
    // Handle both array and JSON string cases
    const ids = Array.isArray(chapterIds) ? chapterIds : JSON.parse(chapterIds);
    
    return allChapters
      .filter(chapter => ids.includes(chapter.chapter_id))
      .map(chapter => chapter.chapter_name)
      .join(", ") || "No chapters";
  };

  // Update the filteredSchedules function to handle type checking more safely
  const filteredSchedules = schedules.filter((schedule) => {
    if (!searchTerm) return true;
    
    const searchValue = searchTerm.toLowerCase().trim();
    
    // Check title
    const titleMatch = schedule.title?.toLowerCase().includes(searchValue) || false;
    
    // Check venue
    const venueMatch = schedule.venue?.toLowerCase().includes(searchValue) || false;
    
    // Check type safely
    let typeMatch = false;
    try {
      const scheduleType = schedule.type || getScheduleType(schedule);
      if (scheduleType) {
        const typeName = scheduleType === "socialTraining" 
          ? "Social Training" 
          : scheduleType === "mdp" 
            ? "MDP" 
            : scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1);
        typeMatch = typeName.toLowerCase().includes(searchValue);
      }
    } catch (error) {
      console.error("Error checking type:", error);
    }

    // Return true if any of the fields match
    return titleMatch || venueMatch || typeMatch;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case "meeting":
        return "blue";
      case "event":
        return "amber";
      case "mdp":
        return "purple";
      case "socialTraining":
        return "orange";
      default:
        return "gray";
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case "socialTraining":
        return "Social Training";
      case "mdp":
        return "MDP";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Update the formatDateTime function
  const formatDateTime = (date, time) => {
    if (!date) return "Not specified";
    try {
      // Format date to YYYY-MM-DD
      const formattedDate = new Date(date).toISOString().split('T')[0];
      // Combine date and time
      const dateTimeString = `${formattedDate}T${time}`;
      const dateObj = new Date(dateTimeString);

      if (isNaN(dateObj.getTime())) {
        return "Invalid date";
      }

    return dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      hour12: true,
    });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDelete = async (type, id) => {
    const result = await Swal.fire({
      title: '<span class="text-white">Are you sure?</span>',
      html: `<span class="text-gray-300">This ${getTypeName(
        type
      )} will be permanently deleted.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1F2937",
      customClass: {
        popup: "bg-gray-800 rounded-xl border border-gray-700",
        title: "text-white",
        htmlContainer: "text-gray-300",
        confirmButton:
          "bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-6 py-2",
        cancelButton:
          "bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg px-6 py-2",
      },
    });

    if (result.isConfirmed) {
      // Add delete logic here
      Swal.fire({
        icon: "success",
        title: '<span class="text-white">Deleted!</span>',
        text: "Schedule has been deleted.",
        background: "#1F2937",
        customClass: {
          popup: "bg-gray-800 rounded-xl border border-gray-700",
          title: "text-white",
          htmlContainer: "text-gray-300",
        },
      });
    }
  };

  const showAttendanceInfo = (type) => {
    Swal.fire({
      icon: "info",
      title: '<span class="text-white">Cannot Delete</span>',
      html: `<span class="text-gray-300">This ${getTypeName(
        type
      )} cannot be deleted because attendance or venue fee records exist.</span>`,
      background: "#1F2937",
      customClass: {
        popup: "bg-gray-800 rounded-xl border border-gray-700",
        title: "text-white",
        htmlContainer: "text-gray-300",
        confirmButton:
          "bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-6 py-2",
      },
    });
  };

  // Update the table row rendering
  const renderTableRow = (schedule, index) => {
    const scheduleType = schedule.type || getScheduleType(schedule);
    const scheduleId = getScheduleId(schedule);

    return (
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        key={scheduleId}
        className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
      >
        <td className="py-4 px-6">
          <span
            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border ${
              scheduleType === "meeting"
                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                : scheduleType === "event"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : scheduleType === "mdp"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                scheduleType === "meeting"
                  ? "bg-blue-400"
                  : scheduleType === "event"
                  ? "bg-amber-400"
                  : scheduleType === "mdp"
                  ? "bg-purple-400"
                  : "bg-orange-400"
              }`}
            />
            {getTypeName(scheduleType)}
          </span>
        </td>
        <td className="py-4 px-6">
          <div className="flex flex-col">
            <span className="text-white font-medium group-hover:text-amber-400 transition-colors">
              {schedule.title}
            </span>
            {/* <span className="text-xs text-gray-500">
              ID: #{scheduleId.toString().padStart(4, "0")}
            </span> */}
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-gray-300">{schedule.venue}</span>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
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
            <span className="text-gray-300">
              {formatDateTime(schedule.date, schedule.time)}
            </span>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-gray-300">
              {getChapterNames(schedule.chapters)}
            </span>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-300">
              {formatCurrency(schedule.fee_amount)}
            </span>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => navigate(`/view-schedule/${scheduleType}/${scheduleId}`)}
              className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <img
                src={viewIcon}
                alt="View"
                className="w-4 h-4 transition-transform hover:scale-110"
              />
            </button>
            <button
              onClick={() => navigate(`/edit-schedule/${scheduleId}`)}
              className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
            >
              <img
                src={editIcon}
                alt="Edit"
                className="w-4 h-4 transition-transform hover:scale-110"
              />
            </button>
            {schedule.has_attendance === "1" ? (
              <button
                onClick={() => showAttendanceInfo(scheduleType)}
                className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/25"
              >
                <svg
                  className="w-4 h-4 transition-transform hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => handleDelete(scheduleType, scheduleId)}
                className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                <img
                  src={deleteIcon}
                  alt="Delete"
                  className="w-4 h-4 transition-transform hover:scale-110"
                />
              </button>
            )}
          </div>
        </td>
      </motion.tr>
    );
  };

  return (
    <div className="mt-32 p-2 lg:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={eventIcon} alt="Events" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Schedule Management
            </h2>
            <p className="text-sm text-gray-400">
              Manage all meetings, events, MDP and social training
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/add-schedule")}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
        >
          <img
            src={addIcon}
            alt="Add"
            className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-semibold tracking-wide text-sm">
            Add New Schedule
          </span>
        </button>
      </motion.div>

      {/* Add search and filter section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search schedules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-gray-800/40 text-white p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-0 placeholder-gray-400"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-gray-800/40 text-white p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-0"
        >
          <option value="">All Types</option>
          <option value="meeting">Meetings</option>
          <option value="event">Events</option>
          <option value="mdp">MDP</option>
          <option value="social_training">Social Training</option>
        </select>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-gray-400">
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchSchedules}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-gray-400">
            <svg
              className="w-16 h-16 mb-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-xl font-semibold mb-2">No Schedules Found</p>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by adding a new schedule"}
            </p>
          </div>
        ) : (
        <div className="relative min-h-[350px] max-h-[calc(100vh-500px)]">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
          <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80 scrollbar-hide">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-gray-800/95 via-gray-800/98 to-gray-800/95 backdrop-blur-xl">
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-300">
                        Type
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-300">
                        Title
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-300">
                        Venue
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-300">
                        Date & Time
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-300">
                        Chapters
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-300">
                        Fee
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-300">
                        Actions
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                  {filteredSchedules.map((schedule, index) =>
                    renderTableRow(schedule, index)
                  )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </motion.div>

      {/* Pagination Section */}
      <div className="p-6 border-t border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing{" "}
            <span className="font-medium text-white">
              {filteredSchedules.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-white">{schedules.length}</span>{" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm text-gray-400 bg-gray-900/50 rounded-lg border border-gray-700 hover:bg-gray-700 transition-all duration-300">
              Previous
            </button>
            <button className="px-4 py-2 text-sm text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-all duration-300">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetings;

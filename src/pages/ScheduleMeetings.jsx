import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  // Dummy data for UI development
  const dummySchedules = [
    {
      id: 1,
      type: "meeting",
      title: "Monthly Chapter Meeting",
      venue: "Grand Hotel Conference Room",
      date: "2024-03-15",
      time: "10:00",
      chapters: "Chapter One, Chapter Two",
      fee_amount: 1000,
      has_attendance: "1",
    },
    {
      id: 2,
      type: "event",
      title: "Annual Business Summit",
      venue: "Convention Center",
      date: "2024-03-20",
      time: "09:00",
      chapters: "All Chapters",
      fee_amount: 2500,
      has_attendance: "0",
    },
    {
      id: 3,
      type: "mdp",
      title: "Leadership Development Program",
      venue: "Business School Campus",
      date: "2024-03-25",
      time: "14:00",
      chapters: "Chapter Three",
      fee_amount: 5000,
      has_attendance: "0",
    },
    {
      id: 4,
      type: "socialTraining",
      title: "Digital Marketing Workshop",
      venue: "Virtual Meeting Room",
      date: "2024-03-18",
      time: "11:00",
      chapters: "All Chapters",
      fee_amount: 1500,
      has_attendance: "1",
    },
  ];

  // Filter schedules based on search term and type
  useEffect(() => {
    let filtered = [...dummySchedules];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.chapters.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter((schedule) => schedule.type === selectedType);
    }

    setFilteredSchedules(filtered);
  }, [searchTerm, selectedType]);

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

  const formatDateTime = (date, time) => {
    if (!date) return "Not specified";
    const dateObj = new Date(`${date} ${time || "00:00"}`);
    return dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: time ? "numeric" : undefined,
      minute: time ? "2-digit" : undefined,
      hour12: true,
    });
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

  return (
    <div className="mt-32 p-6">
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

      {/* Replace the existing table section with this updated version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden shadow-xl"
      >
        {/* Search and Filter Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-gray-300 pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-300"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-900/50 text-gray-300 px-4 py-2.5 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-300"
              >
                <option value="">All Types</option>
                <option value="meeting">Meeting</option>
                <option value="event">Event</option>
                <option value="mdp">MDP</option>
                <option value="socialTraining">Social Training</option>
              </select>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("");
                }}
                className="flex items-center gap-2 bg-gray-900/50 text-gray-300 px-4 py-2.5 rounded-xl border border-gray-700 hover:bg-gray-700 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/50">
                <th className="py-5 px-6 text-left">
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
                <th className="py-5 px-6 text-left">
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
                <th className="py-5 px-6 text-left">
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
                <th className="py-5 px-6 text-left">
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
                <th className="py-5 px-6 text-left">
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
                <th className="py-5 px-6 text-left">
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
                <th className="py-5 px-6 text-left">
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
              {filteredSchedules.map((schedule, index) => (
                <tr
                  key={schedule.id}
                  className={`group hover:bg-gray-800/50 transition-all duration-300 ${
                    index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-800/10"
                  }`}
                >
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border ${
                        schedule.type === "meeting"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : schedule.type === "event"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : schedule.type === "mdp"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          schedule.type === "meeting"
                            ? "bg-blue-400"
                            : schedule.type === "event"
                            ? "bg-amber-400"
                            : schedule.type === "mdp"
                            ? "bg-purple-400"
                            : "bg-orange-400"
                        }`}
                      ></span>
                      {getTypeName(schedule.type)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-white font-medium group-hover:text-amber-400 transition-colors">
                        {schedule.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: #{schedule.id.toString().padStart(4, "0")}
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
                      <span className="text-gray-300">{schedule.chapters}</span>
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
                        onClick={() =>
                          navigate(`/view-schedule/${schedule.id}`)
                        }
                        className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                      >
                        <img
                          src={viewIcon}
                          alt="View"
                          className="w-4 h-4 transition-transform hover:scale-110"
                        />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/edit-schedule/${schedule.id}`)
                        }
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
                          onClick={() => showAttendanceInfo(schedule.type)}
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
                          onClick={() =>
                            handleDelete(schedule.type, schedule.id)
                          }
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-6 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing{" "}
              <span className="font-medium text-white">
                {filteredSchedules.length}
              </span>{" "}
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
      </motion.div>
    </div>
  );
};

export default ScheduleMeetings;

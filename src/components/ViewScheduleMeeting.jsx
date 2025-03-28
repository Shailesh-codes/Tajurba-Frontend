import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import api from "../hooks/api";
import eventIcon from "../assets/images/icons/event.svg";
import editIcon from "../assets/images/icons/edit.svg";
import deleteIcon from "../assets/images/icons/delete.svg";
import { showToast } from "../utils/toast";

const ViewScheduleMeeting = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allChapters, setAllChapters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const scheduleResponse = await axios.get(
          `${api}/schedules/${type}/${id}`
        );
        const chaptersResponse = await axios.get(`${api}/chapters`);

        if (
          scheduleResponse.data.success &&
          chaptersResponse.data.status === "success"
        ) {
          const scheduleData = scheduleResponse.data.data;

          // If QR code is a Buffer or Uint8Array, convert it to base64
          if (scheduleData.qr_code && scheduleData.qr_code.type === "Buffer") {
            scheduleData.qr_code = Buffer.from(scheduleData.qr_code).toString(
              "base64"
            );
          }

          setSchedule(scheduleData);
          setAllChapters(chaptersResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast({
          title: "Error",
          message: "Failed to load schedule details",
          icon: "error",
          status: "error",
        });
        setError("Failed to load schedule details");
      } finally {
        setLoading(false);
      }
    };

    if (type && id) {
      fetchData();
    }
  }, [type, id]);

  const getScheduleType = () => {
    return type || "unknown";
  };

  const getChapterNames = (chapterIds) => {
    if (!chapterIds || !allChapters.length) return [];
    try {
      const ids = Array.isArray(chapterIds)
        ? chapterIds
        : JSON.parse(chapterIds);
      return allChapters
        .filter((chapter) => ids.includes(chapter.chapter_id))
        .map((chapter) => chapter.chapter_name);
    } catch (error) {
      console.error("Error parsing chapters:", error);
      return [];
    }
  };

  const formatDateTime = (date, time) => {
    if (!date) return "Not specified";
    try {
      let dateObj;

      if (date instanceof Date) {
        dateObj = date;
      } else {
        // Handle different date string format
        const dateStr = typeof date === "string" ? date.split("T")[0] : date;
        dateObj = new Date(dateStr);
      }

      // Format time if provided
      if (time) {
        // Ensure time is in HH:mm format
        const timeStr = typeof time === "string" ? time.split(".")[0] : time;
        // Combine date and time
        dateObj = new Date(`${dateObj.toISOString().split("T")[0]}T${timeStr}`);
      }

      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date:", date, time);
        return "Invalid date";
      }

      // Format the date and time
      return dateObj.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: time ? "numeric" : undefined,
        minute: time ? "2-digit" : undefined,
        hour12: true,
      });
    } catch (error) {
      console.error(
        "Date formatting error:",
        error,
        "Date:",
        date,
        "Time:",
        time
      );
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

  if (loading) {
    return (
      <div className="mt-24 flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="mt-24 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
        <p className="text-red-400 mb-4">{error || "Schedule not found"}</p>
        <button
          onClick={() => navigate("/meetings")}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
        >
          Back to Schedules
        </button>
      </div>
    );
  }

  const scheduleType = getScheduleType();

  return (
    <div className="mt-32 lg:px-6 pb-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 p-8 rounded-3xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  scheduleType === "meeting"
                    ? "bg-blue-500/10 text-blue-400"
                    : scheduleType === "event"
                    ? "bg-amber-500/10 text-amber-400"
                    : scheduleType === "mdp"
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-orange-500/10 text-orange-400"
                }`}
              >
                {scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1)}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-white">
                {schedule.title}
              </h1>
              <p className="mt-2 text-gray-400 max-w-2xl">
                {schedule.description || "No description available"}
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/50 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm">Back</span>
              </button>
              
              <button
                onClick={() => navigate(`/edit-schedule/${type}/${id}`)}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
              >
                <img src={editIcon} alt="Edit" className="w-4 h-4 transition-transform hover:scale-110" />
                <span className="text-sm font-medium">Edit Schedule</span>
              </button>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Date & Time */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <svg
                  className="w-6 h-6 text-blue-400"
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
              <div>
                <p className="text-sm text-gray-400">Date & Time</p>
                <p className="text-white font-medium">
                  {formatDateTime(schedule.date, schedule.time)}
                </p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <svg
                  className="w-6 h-6 text-amber-400"
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
              </div>
              <div>
                <p className="text-sm text-gray-400">Venue</p>
                <p className="text-white font-medium">{schedule.venue}</p>
              </div>
            </div>

            {/* Fee Amount */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Fee Amount</p>
                <p className="text-white font-medium">
                  {formatCurrency(schedule.fee_amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Description Card */}
          <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Description
            </h2>
            <p className="text-gray-300">
              {schedule.description || "No description available"}
            </p>
          </div>

          {/* Chapters Card */}
          <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Participating Chapters
            </h2>
            <div className="flex flex-wrap gap-2">
              {getChapterNames(schedule.chapters).length > 0 ? (
                getChapterNames(schedule.chapters).map((chapter, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-xl bg-gray-900/50 text-gray-300 border border-gray-700/50"
                  >
                    {chapter}
                  </span>
                ))
              ) : (
                <span className="px-4 py-2 rounded-xl bg-gray-900/50 text-gray-300 border border-gray-700/50">
                  No chapters available
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Payment Details Card */}
          <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Payment Details
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700/50">
                <div className="flex flex-col items-center">
                  {schedule.payment_method === "custom" && (
                    <>
                      {schedule.qr_code ? (
                        <div className="mb-3">
                          {typeof schedule.qr_code === "string" ? (
                            // If QR code is already a base64 string
                            <img
                              src={`data:image/png;base64,${schedule.qr_code}`}
                              alt="Payment QR"
                              className="w-48 h-48 rounded-xl"
                              onError={(e) => {
                                console.error("Error loading QR code image");
                                e.target.src = ""; // Clear the broken image
                                e.target.alt = "QR code not available";
                                e.target.className += " hidden";
                              }}
                            />
                          ) : (
                            // If QR code is a Uint8Array or Buffer
                            <img
                              src={`data:image/png;base64,${Buffer.from(
                                schedule.qr_code
                              ).toString("base64")}`}
                              alt="Payment QR"
                              className="w-48 h-48 rounded-xl"
                              onError={(e) => {
                                console.error("Error loading QR code image");
                                e.target.src = ""; // Clear the broken image
                                e.target.alt = "QR code not available";
                                e.target.className += " hidden";
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="mb-3 w-48 h-48 rounded-xl bg-gray-700/50 flex items-center justify-center">
                          <p className="text-gray-400 text-sm">
                            No QR code available
                          </p>
                        </div>
                      )}
                      {schedule.upi_id && (
                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-1">UPI ID</p>
                          <p className="text-white font-medium bg-gray-700/50 px-4 py-2 rounded-lg">
                            {schedule.upi_id}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {schedule.payment_method === "default" && (
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 text-gray-500 mb-3 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-white opacity-80">
                        Using default payment method
                      </p>
                      {schedule.default_payment_id && (
                        <p className="text-sm text-gray-400 mt-2">
                          ID: {schedule.default_payment_id}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewScheduleMeeting;

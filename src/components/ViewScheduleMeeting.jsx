import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Import icons
import eventIcon from "../assets/images/icons/event.svg";
import editIcon from "../assets/images/icons/edit.svg";
import deleteIcon from "../assets/images/icons/delete.svg";

const ViewScheduleMeeting = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data
  const schedule = {
    id: 1,
    type: "meeting",
    title: "Monthly Chapter Meeting",
    description:
      "Monthly meeting to discuss chapter progress and upcoming events. All members are requested to attend.",
    venue: "Grand Hotel Conference Room",
    date: "2024-03-15",
    time: "10:00",
    chapters: "Chapter One, Chapter Two",
    fee_amount: 1000,
    organizer: "John Doe",
    contact: "+1234567890",
    max_participants: 50,
    current_participants: 35,
    agenda: [
      "Welcome and Introduction",
      "Previous Meeting Minutes",
      "Financial Updates",
      "Upcoming Events Discussion",
      "Open Forum",
      "Closing Remarks",
    ],
    additional_notes:
      "Please bring your member ID cards. Refreshments will be provided.",
    payment_method: "default",
    qr_code: "https://example.com/qr-code.png",
    upi_id: "business@upi",
  };

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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mt-24 lg:px-6 pb-6">
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
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-white">
                {schedule.title}
              </h1>
              <p className="mt-2 text-gray-400 max-w-2xl">
                {schedule.description}
              </p>
            </div>
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
              <span>Back</span>
            </button>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
          {/* Agenda Card */}
          <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Agenda</h2>
            <div className="space-y-4">
              {schedule.agenda.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-700/50"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400 font-medium">
                    {index + 1}
                  </span>
                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chapters Card */}
          <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Participating Chapters
            </h2>
            <div className="flex flex-wrap gap-2">
              {schedule.chapters.split(", ").map((chapter, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-xl bg-gray-900/50 text-gray-300 border border-gray-700/50"
                >
                  {chapter}
                </span>
              ))}
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
                  {schedule.qr_code && (
                    <img
                      src={schedule.qr_code}
                      alt="Payment QR"
                      className="w-48 h-48 rounded-xl mb-3"
                    />
                  )}
                  {schedule.upi_id && (
                    <p className="text-sm text-gray-400">
                      UPI: {schedule.upi_id}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Participants Card */}
          <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Participation
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Participants</span>
                <span className="text-white font-medium">
                  {schedule.current_participants} / {schedule.max_participants}
                </span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (schedule.current_participants /
                        schedule.max_participants) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Organizer</p>
                  <p className="text-white">{schedule.organizer}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <svg
                    className="w-5 h-5 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Contact</p>
                  <p className="text-white">{schedule.contact}</p>
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

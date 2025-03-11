import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiInfo,
  FiDollarSign,
} from "react-icons/fi";
import {
  BsQrCodeScan,
  BsGraphUp,
  BsPersonCheck,
  BsCreditCard2Front,
  BsBuilding,
} from "react-icons/bs";
import events from "../assets/images/icons/events.svg";

const EventDetails = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  // Dummy data for demonstration
  const mdpEvents = [
    {
      id: 1,
      title: "Business Growth Workshop",
      dateTime: "2024-03-15 10:00 AM",
      venue: "Hotel Grand Plaza",
      status: "present",
      venueFee: {
        amount: 500,
        status: "paid",
        paymentDate: "2024-03-14",
      },
    },
    {
      id: 2,
      title: "Leadership Development Session",
      dateTime: "2024-03-20 02:00 PM",
      venue: "Business Center",
      status: "upcoming",
      venueFee: {
        amount: 750,
        status: "pending",
      },
    },
  ];

  const formatStatus = (status) => {
    const statusMap = {
      present: "bg-green-500/10 text-green-500",
      absent: "bg-red-500/10 text-red-500",
      late_less: "bg-yellow-500/10 text-yellow-500",
      late_more: "bg-orange-500/10 text-orange-500",
      "not marked": "bg-gray-500/10 text-gray-500",
    };

    return statusMap[status] || "bg-gray-500/10 text-gray-500";
  };

  const formatVenueStatus = (status) => {
    const statusMap = {
      paid: "bg-green-500/10 text-green-500",
      "not paid": "bg-red-500/10 text-red-500",
      pending: "bg-amber-500/10 text-amber-500",
    };

    return statusMap[status] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <div className="mt-32 flex flex-col space-y-8 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-5 group">
          <div className="p-4 bg-gradient-to-br from-amber-500 to-purple-600 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-all duration-300">
            <img src={events} alt="events" className="w-7 h-7 invert" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-purple-500 bg-clip-text text-transparent">
              Event Details
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              View detailed information about this event
            </p>
          </div>
        </div>
        <button
          onClick={() => history.back()}
          className="group flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-amber-500/10 to-purple-500/10 text-white rounded-xl transition-all duration-300 border border-gray-700 hover:border-amber-500/50 hover:scale-105"
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

      {/* Enhanced Event Details Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Event Info Card */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:shadow-[0_0_50px_rgba(245,158,11,0.15)] transition-all duration-500"
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-purple-600 rounded-xl transform -rotate-6 hover:rotate-0 transition-all duration-300">
                <BsGraphUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Business Growth Workshop</h3>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-5 group hover:bg-gray-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-purple-600 transition-all duration-300">
                  <FiCalendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Date & Time</p>
                  <p className="text-base text-white group-hover:text-amber-500 transition-colors duration-300">
                    March 15, 2024 10:00 AM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group hover:bg-gray-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-purple-600 transition-all duration-300">
                  <FiMapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Venue</p>
                  <p className="text-base text-white group-hover:text-amber-500 transition-colors duration-300">Hotel Grand Plaza</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group hover:bg-gray-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-purple-600 transition-all duration-300">
                  <FiInfo className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Description</p>
                  <p className="text-base text-white group-hover:text-amber-500 transition-colors duration-300">
                    Meetings are an essential part of effective team
                    collaboration – but we've all been in meetings that were a
                    complete waste of everyone's time. The participants would
                    come unprepared, the discussion would get side-tracked, and
                    hours would go by with no decisions made. While some
                    meetings simply shouldn't happen at all – status updates or
                    daily standups, for example, – others are necessary. And
                    when you do need to have a meeting with your team, an
                    effective meeting agenda is of paramount importance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] transition-all duration-500">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl transform rotate-6 hover:rotate-0 transition-all duration-300">
                <BsPersonCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Attendance Status</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300">
                <span className="text-gray-400">Status</span>
                <span className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  Present
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300">
                <span className="text-gray-400">Check-in Time</span>
                <span className="text-white">09:55 AM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Section with enhanced styling */}
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:shadow-[0_0_50px_rgba(245,158,11,0.15)] transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2.5 bg-amber-500/10 rounded-xl">
                <BsQrCodeScan className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">Payment Methods</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex flex-col items-center p-8 bg-gradient-to-br from-amber-500/5 to-purple-500/5 rounded-2xl border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="p-3 bg-white rounded-xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <img src="https://dummyimage.com/128x128/000/fff&text=QR+Code" alt="QR Code" className="w-32 h-32" />
                </div>
                <p className="text-sm text-gray-400 mt-2">Scan QR code to pay</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiDollarSign className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-400">UPI ID</p>
                    <p className="text-white">example@upi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Venue Fee Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:shadow-[0_0_50px_rgba(245,158,11,0.15)] transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2.5 bg-amber-500/10 rounded-xl">
                <BsBuilding className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">Venue Fee Details</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-xl font-semibold text-white">₹500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span className="inline-flex px-3 py-1 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-500">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;

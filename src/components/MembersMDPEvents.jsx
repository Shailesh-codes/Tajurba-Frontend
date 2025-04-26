import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiClock, FiInfo } from "react-icons/fi";
import {
  BsQrCodeScan,
  BsGraphUp,
  BsPersonCheck,
  BsCreditCard2Front,
  BsBuilding,
} from "react-icons/bs";
import events from "../assets/images/icons/events.svg";
import { IndianRupee } from "lucide-react";
import { useLocation } from "react-router-dom";
import api from "../hooks/api";
import { useAuth } from "../contexts/AuthContext";

const EventDetails = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [defaultPaymentSettings, setDefaultPaymentSettings] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const meetingId = searchParams.get("meeting_id");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchEventDetails(), fetchAttendanceDetails()]);
      setLoading(false);
    };
    fetchData();
  }, [type, meetingId]);

  useEffect(() => {
    if (eventDetails?.payment_method === "default") {
      fetchDefaultPaymentSettings();
    }
  }, [eventDetails]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/schedules/${type}/${meetingId}`);
      if (response.data.success) {
        setEventDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const fetchAttendanceDetails = async () => {
    try {
      const response = await api.get(`/attendance-venue-fee/meeting-members`, {
        params: {
          type: type,
          meeting_id: meetingId,
        },
      });

      if (response.data.success) {
        const userAttendance = response.data.data.find(
          (record) => record.id === auth.user.id
        );
        setAttendanceDetails(userAttendance);
      }
    } catch (error) {
      console.error("Error fetching attendance details:", error);
    }
  };

  const fetchDefaultPaymentSettings = async () => {
    try {
      const response = await api.get("/admin-settings/payment-info");
      if (response.data.success) {
        setDefaultPaymentSettings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching default payment settings:", error);
    }
  };

  if (loading) {
    return (
      <div className="mt-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="mt-32 text-center text-gray-400">
        Event details not found
      </div>
    );
  }

  const formatDateTime = (date, time) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${formattedDate} ${time}`;
  };

  return (
    <div className="mt-32 p-2 lg:p-6 flex flex-col space-y-8 relative">
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
              <h3 className="text-2xl font-bold text-white">
                {eventDetails.title}
              </h3>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-5 group hover:bg-gray-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-purple-600 transition-all duration-300">
                  <FiCalendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Date & Time
                  </p>
                  <p className="text-base text-white group-hover:text-amber-500 transition-colors duration-300">
                    {formatDateTime(eventDetails.date, eventDetails.time)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group hover:bg-gray-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-purple-600 transition-all duration-300">
                  <FiMapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Venue
                  </p>
                  <p className="text-base text-white group-hover:text-amber-500 transition-colors duration-300">
                    {eventDetails.venue}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group hover:bg-gray-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-purple-600 transition-all duration-300">
                  <FiInfo className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Description
                  </p>
                  <p className="text-base text-white group-hover:text-amber-500 transition-colors duration-300">
                    {eventDetails.description || "No description available"}
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
              <h3 className="text-xl font-bold text-white">
                Attendance Status
              </h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300">
                <span className="text-gray-400">Status</span>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    attendanceDetails?.status === "present"
                      ? "bg-green-500/10 text-green-500"
                      : attendanceDetails?.status === "absent"
                      ? "bg-red-500/10 text-red-500"
                      : attendanceDetails?.status === "late"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {attendanceDetails?.status
                    ? attendanceDetails.status.charAt(0).toUpperCase() +
                      attendanceDetails.status.slice(1)
                    : "Not Marked"}
                </span>
              </div>
              {attendanceDetails?.status === "late" && (
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300">
                  <span className="text-gray-400">Late Duration</span>
                  <span className="text-white">
                    {attendanceDetails.late_minutes === "less_than_10"
                      ? "Less than 10 minutes"
                      : "More than 10 minutes"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Section */}
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
              <h3 className="text-xl font-semibold text-white">
                Payment Methods
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {/* QR Code Display */}
              {((eventDetails.payment_method === "custom" &&
                eventDetails.qr_code) ||
                (eventDetails.payment_method === "default" &&
                  defaultPaymentSettings?.qrCodeUrl)) && (
                <div className="flex flex-col items-center p-8 bg-gradient-to-br from-amber-500/5 to-purple-500/5 rounded-2xl border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300">
                  <div className="p-3 bg-white rounded-xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img
                      src={
                        eventDetails.payment_method === "custom"
                          ? `data:image/png;base64,${eventDetails.qr_code}`
                          : defaultPaymentSettings?.qrCodeUrl
                      }
                      alt="QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Scan QR code to pay
                  </p>
                </div>
              )}

              {/* UPI Details */}
              <div className="space-y-4">
                {eventDetails.payment_method === "custom" &&
                  eventDetails.upi_id && (
                    <div className="flex items-center gap-3">
                      <IndianRupee className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-sm text-gray-400">UPI ID</p>
                        <p className="text-white">{eventDetails.upi_id}</p>
                      </div>
                    </div>
                  )}
                {eventDetails.payment_method === "default" &&
                  defaultPaymentSettings?.upiId && (
                    <div className="flex items-center gap-3">
                      <IndianRupee className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-sm text-gray-400">Default UPI ID</p>
                        <p className="text-white">
                          {defaultPaymentSettings.upiId}
                        </p>
                      </div>
                    </div>
                  )}
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
              <h3 className="text-xl font-semibold text-white">
                Venue Fee Details
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-xl font-semibold text-white">
                  ₹{eventDetails.fee_amount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span
                  className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${
                    attendanceDetails?.venue_fee_status === "paid"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {attendanceDetails?.venue_fee_status
                    ? attendanceDetails.venue_fee_status
                        .charAt(0)
                        .toUpperCase() +
                      attendanceDetails.venue_fee_status.slice(1)
                    : "Not Paid"}
                </span>
              </div>
              {attendanceDetails?.venue_fee_status === "paid" &&
                attendanceDetails?.payment_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment Date</span>
                    <span className="text-white">
                      {new Date(
                        attendanceDetails.payment_date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;

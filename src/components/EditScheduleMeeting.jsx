import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import eventIcon from "../assets/images/icons/event.svg";
import infoIcon from "../assets/images/icons/info.svg";

const EditScheduleMeeting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    venue: "",
    date: "",
    time: "",
    description: "",
    fee_amount: "",
    payment_method: "default",
    upi_id: "",
    qr_code: "",
    chapters: [],
  });

  // Dummy chapters data (replace with API call)
  const chapters = [
    { id: 1, name: "Chapter One" },
    { id: 2, name: "Chapter Two" },
    { id: 3, name: "Chapter Three" },
  ];

  useEffect(() => {
    loadExistingData();
  }, [id]);

  const loadExistingData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await fetch(`/api/schedule/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error loading data:", error);
      showError("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChapterToggle = (chapterId) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.includes(chapterId)
        ? prev.chapters.filter((id) => id !== chapterId)
        : [...prev.chapters, chapterId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/schedule/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccess("Schedule updated successfully");
        navigate(-1);
      } else {
        throw new Error("Failed to update schedule");
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const showSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      background: "#1F2937",
      customClass: {
        popup: "bg-gray-800 rounded-xl border border-gray-700",
        title: "text-white",
        htmlContainer: "text-gray-300",
      },
    });
  };

  const showError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
      background: "#1F2937",
      customClass: {
        popup: "bg-gray-800 rounded-xl border border-gray-700",
        title: "text-white",
        htmlContainer: "text-gray-300",
      },
    });
  };

  if (loading) {
    return (
      <div className="mt-32 p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-32 p-1lg:p-6">
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
            <h2 className="text-2xl font-bold text-white">Update Schedule</h2>
            <p className="text-sm text-gray-400">
              Update existing {formData.type.toLowerCase()}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
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
          <span className="font-semibold tracking-wide text-sm">Back</span>
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <div className="p-6 rounded-2xl bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Basic Information
                </h3>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0"
                      placeholder="Enter title"
                    />
                  </div>

                  {/* Venue Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Venue <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0"
                      placeholder="Enter venue"
                    />
                  </div>

                  {/* Date Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 [color-scheme:dark]"
                    />
                  </div>

                  {/* Time Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 resize-none"
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Selection Card */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-300"
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
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Select Chapters <span className="text-red-500">*</span>
                </h3>
              </div>

              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <label
                    key={chapter.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-700/50 border border-gray-600 cursor-pointer hover:bg-gray-700 transition-all duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={formData.chapters.includes(chapter.id)}
                      onChange={() => handleChapterToggle(chapter.id)}
                      className="form-checkbox bg-gray-600 border-gray-500 rounded text-amber-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-gray-300">{chapter.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Payment Settings */}
          <div className="p-6 rounded-2xl bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <svg
                  className="w-5 h-5 text-emerald-300"
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
              <h3 className="text-lg font-semibold text-white">
                Payment Details
              </h3>
            </div>

            <div className="space-y-6">
              {/* Fee Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Fee Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="fee_amount"
                    value={formData.fee_amount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0"
                    placeholder="Enter fee amount"
                  />
                  <img
                    src={infoIcon}
                    alt="info"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-help"
                    title="Enter the fee amount"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-xl border border-gray-600 cursor-pointer hover:bg-gray-700 transition-all duration-300">
                    <input
                      type="radio"
                      name="payment_method"
                      value="default"
                      checked={formData.payment_method === "default"}
                      onChange={handleInputChange}
                      className="text-amber-500 bg-gray-700 border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">Default Payment</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-xl border border-gray-600 cursor-pointer hover:bg-gray-700 transition-all duration-300">
                    <input
                      type="radio"
                      name="payment_method"
                      value="custom"
                      checked={formData.payment_method === "custom"}
                      onChange={handleInputChange}
                      className="text-amber-500 bg-gray-700 border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">Custom Payment</span>
                  </label>
                </div>
              </div>

              {/* Custom Payment Fields */}
              {formData.payment_method === "custom" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      name="upi_id"
                      value={formData.upi_id}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0"
                      placeholder="Enter UPI ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      QR Code
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        // Handle file upload
                      }}
                      className="hidden"
                      id="qr-upload"
                    />
                    <label
                      htmlFor="qr-upload"
                      className="block px-4 py-2 bg-gray-700 text-gray-300 rounded-xl border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Preview */}
          <div className="p-6 rounded-2xl bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">
                QR Code Preview
              </h3>
            </div>

            <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="flex flex-col items-center justify-center">
                {formData.qr_code ? (
                  <img
                    src={formData.qr_code}
                    alt="QR Code"
                    className="max-w-[200px] rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">
                    No QR code uploaded
                  </div>
                )}
                {formData.upi_id && (
                  <p className="mt-3 text-sm text-gray-400">
                    UPI ID: {formData.upi_id}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Update Schedule
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default EditScheduleMeeting;

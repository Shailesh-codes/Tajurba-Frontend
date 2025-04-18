import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../hooks/api";

import eventIcon from "../assets/images/icons/event.svg";

const AddMeetings = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("meeting");
  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    date: "",
    time: "",
    description: "",
    fee_amount: "",
    payment_method: "default",
    chapters: [],
    upi_id: "",
    default_payment_id: "",
  });
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [defaultPaymentInfo, setDefaultPaymentInfo] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  useEffect(() => {
    loadChapters();
    const fetchPaymentSettings = async () => {
      try {
        const response = await api.get("/admin-settings/payment-info");
        if (response.data.success) {
          setDefaultPaymentInfo(response.data.data);
          if (formData.payment_method === "default") {
            setFormData((prev) => ({
              ...prev,
              default_payment_id: response.data.data.id,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching payment settings:", error);
        showToast({
          title: "Error",
          message: "Failed to load payment settings",
          icon: "error",
          status: "error",
        });
      }
    };

    fetchPaymentSettings();
  }, []);

  const loadChapters = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/chapters`);
      if (response.data.status === "success") {
        const sortedChapters = response.data.data.sort((a, b) =>
          a.chapter_name.localeCompare(b.chapter_name)
        );
        setChapters(sortedChapters);
      }
    } catch (error) {
      console.error("Error loading chapters:", error);
      setError("Failed to load chapters");
    } finally {
      setIsLoading(false);
    }
  };

  const typeOptions = [
    {
      value: "meeting",
      label: "Meeting",
      icon: "M8 14v1m5-1v1M4 4h16M4 10h16M4 16h16M4 22h16",
      color: "blue",
    },
    {
      value: "event",
      label: "Event",
      icon: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-3 10H8m4-4v8",
      color: "green",
    },
    {
      value: "mdp",
      label: "MDP",
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
      color: "yellow",
    },
    {
      value: "social_training",
      label: "Social & Training",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      color: "purple",
    },
  ];

  const resetForm = () => {
    setFormData({
      title: "",
      venue: "",
      date: "",
      time: "",
      description: "",
      fee_amount: "",
      payment_method: "default",
      chapters: [],
      upi_id: "",
      default_payment_id: "",
    });
    setSelectedType("meeting");
  };

  const showAlert = (icon, text) => {
    Swal.fire({
      background: "#111827",
      color: "#fff",
      icon,
      text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: "bg-gray-900 border-gray-700 rounded-2xl border",
      },
    });
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setFormData((prev) => ({
      ...prev,
      payment_method: method,
      default_payment_id:
        method === "default" ? defaultPaymentInfo?.id || "" : "",
      upi_id: method === "default" ? "" : prev.upi_id,
    }));

    if (method === "default" && defaultPaymentInfo?.qrCodeUrl) {
      setQrPreview(defaultPaymentInfo.qrCodeUrl);
    } else {
      setQrPreview(null);
    }
  };

  const handleQrCodeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 200 * 1024) {
        showAlert("error", "File size must be less than 200KB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setQrPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      if (qrPreview && qrPreview.startsWith("blob:")) {
        URL.revokeObjectURL(qrPreview);
      }
    };
  }, [qrPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      const timeValue = formData.time || "";

      formDataToSend.append("type", selectedType);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("venue", formData.venue);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("time", timeValue);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("fee_amount", formData.fee_amount);
      formDataToSend.append("payment_method", formData.payment_method);
      formDataToSend.append("chapters", JSON.stringify(formData.chapters));

      if (formData.payment_method === "custom") {
        formDataToSend.append("upi_id", formData.upi_id);
        const qrFileInput = document.querySelector('input[type="file"]');
        if (qrFileInput && qrFileInput.files[0]) {
          formDataToSend.append("qr_code", qrFileInput.files[0]);
        }
      } else {
        formDataToSend.append(
          "default_payment_id",
          formData.default_payment_id
        );
      }

      const response = await api.post(`/schedules`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showAlert(
          "success",
          `${
            selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
          } created successfully`
        );
        resetForm();
        navigate("/meetings");
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      showAlert(
        "error",
        error.response?.data?.error || "Failed to create schedule"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-900 pt-32 pb-16 sm:px-6 lg:px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section with Enhanced Design */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
            <div className="relative bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-gray-700/50 shadow-lg">
                    <img src={eventIcon} alt="Events" className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                      Add New Schedule
                    </h1>
                    <p className="text-gray-400 mt-1">
                      Create new meeting, event, MDP, or social training
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="group flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-all duration-300 transform group-hover:-translate-x-1"
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
                  <span className="text-gray-400 group-hover:text-white">
                    Back
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Type Selection with Enhanced Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {typeOptions.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`relative group p-4 rounded-xl border transition-all duration-300 ${
                  selectedType === type.value
                    ? `bg-${type.color}-500/10 border-${type.color}-500/30`
                    : "bg-gray-800/40 border-gray-700 hover:bg-gray-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      selectedType === type.value
                        ? `bg-${type.color}-500/20`
                        : "bg-gray-700/50 group-hover:bg-gray-600/50"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-colors duration-300 ${
                        selectedType === type.value
                          ? `text-${type.color}-400`
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={type.icon}
                      />
                    </svg>
                  </div>
                  <span
                    className={`font-medium transition-colors duration-300 ${
                      selectedType === type.value
                        ? `text-${type.color}-400`
                        : "text-gray-400 group-hover:text-gray-300"
                    }`}
                  >
                    {type.label}
                  </span>
                </div>
                {selectedType === type.value && (
                  <motion.div
                    layoutId="activeType"
                    className="absolute inset-0 border-2 border-blue-500/50 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6"
          >
            {/* Basic Information Card */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Meeting Information */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`p-2 rounded-lg bg-${
                        selectedType === "meeting"
                          ? "blue"
                          : selectedType === "event"
                          ? "green"
                          : selectedType === "mdp"
                          ? "yellow"
                          : "purple"
                      }-500/20`}
                    >
                      <svg
                        className={`w-5 h-5 text-${
                          selectedType === "meeting"
                            ? "blue"
                            : selectedType === "event"
                            ? "green"
                            : selectedType === "mdp"
                            ? "yellow"
                            : "purple"
                        }-400`}
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
                    <h3 className="text-lg font-semibold text-gray-100">
                      {selectedType.charAt(0).toUpperCase() +
                        selectedType.slice(1)}{" "}
                      Information
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Title Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full bg-gray-700/50 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-0 placeholder-gray-400"
                          placeholder={`Enter the ${selectedType} title`}
                          required
                        />
                      </div>

                      {/* Venue Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Venue <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.venue}
                          onChange={(e) =>
                            setFormData({ ...formData, venue: e.target.value })
                          }
                          className="w-full bg-gray-700/50 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-0 placeholder-gray-400"
                          placeholder="Enter the venue location"
                          required
                        />
                      </div>

                      {/* Date Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full bg-gray-700/50 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-0 [color-scheme:dark]"
                          required
                        />
                      </div>

                      {/* Time Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          className="w-full bg-gray-700/50 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-0 [color-scheme:dark]"
                          required
                        />
                      </div>
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows="4"
                        className="w-full bg-gray-700/50 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-0 resize-none placeholder-gray-400"
                        placeholder={`Enter a detailed description of the ${selectedType}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Chapter Selection */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-xl">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-lg">
                        <svg
                          className="w-5 h-5 text-white"
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
                    {isLoading && (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-500 border-t-transparent" />
                    )}
                  </div>

                  {error ? (
                    <div className="text-center py-4">
                      <p className="text-red-400">{error}</p>
                      <button
                        onClick={loadChapters}
                        className="mt-2 text-sm text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        Try again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="relative flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300 mb-2">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-500 bg-gray-700/50 checked:border-amber-500 checked:bg-amber-500/20 hover:border-amber-400 transition-all duration-300"
                            onChange={(e) => {
                              const newChapters = e.target.checked
                                ? chapters.map((c) => c.chapter_id)
                                : [];
                              setFormData({
                                ...formData,
                                chapters: newChapters,
                              });
                            }}
                            checked={
                              formData.chapters.length === chapters.length
                            }
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500 opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
                            Select All Chapters
                          </span>
                          <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                            {formData.chapters.length} of {chapters.length}{" "}
                            selected
                          </span>
                        </div>
                      </label>

                      <div className="border-t border-gray-700/50 my-2" />

                      <div className="max-h-[240px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80 pr-2">
                        {chapters.map((chapter) => (
                          <motion.label
                            key={chapter.chapter_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                value={chapter.chapter_id}
                                checked={formData.chapters.includes(
                                  chapter.chapter_id
                                )}
                                onChange={(e) => {
                                  const newChapters = e.target.checked
                                    ? [...formData.chapters, chapter.chapter_id]
                                    : formData.chapters.filter(
                                        (id) => id !== chapter.chapter_id
                                      );
                                  setFormData({
                                    ...formData,
                                    chapters: newChapters,
                                  });
                                }}
                                className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-500 bg-gray-700/50 checked:border-amber-500 checked:bg-amber-500/20 hover:border-amber-400 transition-all duration-300"
                              />
                              <svg
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500 opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
                                {chapter.chapter_name}
                              </span>
                            </div>
                            <div className="ml-auto">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  formData.chapters.includes(chapter.chapter_id)
                                    ? "bg-amber-500 animate-pulse"
                                    : "bg-gray-600"
                                } transition-colors duration-300`}
                              />
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Payment Settings Card */}
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100">
                    Payment Details
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Fee Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fee Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.fee_amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fee_amount: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700/50 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-0 placeholder-gray-400"
                        placeholder="Enter the fee amount"
                        min="0"
                        step="0.01"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Payment Method
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <label className="relative flex items-center p-3 bg-gray-700/50 rounded-xl border border-gray-600 cursor-pointer group hover:bg-gray-700/70 transition-colors">
                        <input
                          type="radio"
                          name="payment_method"
                          value="default"
                          checked={formData.payment_method === "default"}
                          onChange={handlePaymentMethodChange}
                          className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                        />
                        <span className="ml-2 text-gray-300 group-hover:text-gray-100">
                          Default Payment
                        </span>
                      </label>
                      <label className="relative flex items-center p-3 bg-gray-700/50 rounded-xl border border-gray-600 cursor-pointer group hover:bg-gray-700/70 transition-colors">
                        <input
                          type="radio"
                          name="payment_method"
                          value="custom"
                          checked={formData.payment_method === "custom"}
                          onChange={handlePaymentMethodChange}
                          className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                        />
                        <span className="ml-2 text-gray-300 group-hover:text-gray-100">
                          Custom Payment
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Show default payment info when default is selected */}
                  {formData.payment_method === "default" &&
                    defaultPaymentInfo && (
                      <div className="mt-4 p-4 bg-gray-700/30 rounded-xl">
                        <p className="text-sm text-gray-300">
                          Default Payment ID: {defaultPaymentInfo.id}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          Default UPI ID: {defaultPaymentInfo.upiId}
                        </p>
                      </div>
                    )}

                  {/* Custom Payment Fields */}
                  {formData.payment_method === "custom" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          value={formData.upi_id}
                          onChange={(e) =>
                            setFormData({ ...formData, upi_id: e.target.value })
                          }
                          className="w-full bg-gray-700/50 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 placeholder-gray-400"
                          placeholder="Enter UPI ID (e.g., username@bankname)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          UPI QR Code
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="px-4 py-2 bg-gray-700/50 rounded-xl border border-gray-600 text-gray-300 cursor-pointer hover:bg-gray-700/70 transition-colors">
                            Choose File
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleQrCodeChange}
                            />
                          </label>
                          <span className="text-sm text-gray-400">
                            {document.querySelector('input[type="file"]')
                              ?.files[0]?.name || "No file chosen"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Preview */}
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <svg
                      className="w-5 h-5 text-purple-400"
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
                  <h3 className="text-lg font-semibold text-gray-100">
                    QR Code Preview
                  </h3>
                </div>

                <div className="flex items-center justify-center h-[200px] bg-gray-700/50 rounded-xl border border-gray-600">
                  {qrPreview ? (
                    <img
                      src={qrPreview}
                      alt="QR Code"
                      className="max-h-full max-w-full object-contain rounded-lg"
                      onError={(e) => {
                        console.error("Error loading QR code image");
                        e.target.style.display = "none";
                        setQrPreview(null);
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">No QR code selected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700/50 transition-all duration-300"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                Save Meeting
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </form>
  );
};

export default AddMeetings;

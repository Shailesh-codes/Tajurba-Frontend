import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import visitorIcon from "../assets/images/icons/users.svg";

const VisitorInviteAddEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    visitorName: "",
    visitorEmail: "",
    mobile: "",
    companyName: "",
    companyCategory: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      // Load invite details if editing
      loadInviteDetails(id);
    } else {
      // Set today's date as default
      setFormData((prev) => ({
        ...prev,
        date: new Date().toISOString().split("T")[0],
      }));
    }
  }, [id]);

  const loadInviteDetails = async (inviteId) => {
    try {
      const response = await fetch(
        `backend/controllers/visitor-invites.php?id=${inviteId}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setFormData(data.data);
      } else {
        throw new Error(data.message || "Failed to load invite details");
      }
    } catch (error) {
      console.error("Error loading invite details:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("api/v1/add-visitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          action: id ? "update" : "add",
          invite_id: id,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        navigate("/member-visitor-invites");
      } else {
        throw new Error(data.message || "Failed to save invite");
      }
    } catch (error) {
      console.error("Error handling invite:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-32 p-1 lg:p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl shadow-lg">
            <img src={visitorIcon} alt="visitorIcon" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">
              {id ? "Edit Visitor Invite" : "Add Visitor Invite"}
            </h2>
            <p className="text-sm lg:text-base text-gray-400">
              {id
                ? "Update existing visitor invite"
                : "Create new visitor invite"}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
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

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visitor Name */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Visitor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.visitorName}
                onChange={(e) =>
                  setFormData({ ...formData, visitorName: e.target.value })
                }
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter visitor name"
              />
            </div>

            {/* Visitor Email */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Visitor Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.visitorEmail}
                onChange={(e) =>
                  setFormData({ ...formData, visitorEmail: e.target.value })
                }
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter visitor email"
              />
            </div>

            {/* Mobile Number */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter 10-digit mobile number"
              />
            </div>

            {/* Company Name */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter company name"
              />
            </div>

            {/* Company Category */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Business Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.companyCategory}
                onChange={(e) =>
                  setFormData({ ...formData, companyCategory: e.target.value })
                }
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter business category"
              />
            </div>

            {/* Date */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                />
                <img
                  src={calendarIcon}
                  alt="calendar"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="relative group">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              className="w-full p-4 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 resize-none"
              placeholder="Enter description here..."
            ></textarea>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  visitorName: "",
                  visitorEmail: "",
                  mobile: "",
                  companyName: "",
                  companyCategory: "",
                  date: new Date().toISOString().split("T")[0],
                  description: "",
                })
              }
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Reset
            </button>
            <button
              type="submit"
              className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              <span className="relative z-10">
                {id ? "Update Invite" : "Add Invite"}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VisitorInviteAddEdit;

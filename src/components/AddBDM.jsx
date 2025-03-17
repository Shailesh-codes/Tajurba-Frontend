import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsClipboardData } from "react-icons/bs";
import { FiCalendar, FiUsers, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import calendarIcon from "../assets/images/icons/calender-icon.svg";

const AddBDM = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chapter: "",
    member: "",
    bdmDate: "",
    description: "",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-32 p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl shadow-lg">
            <BsClipboardData className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Add BDM</h2>
            <p className="text-sm text-gray-400">Fill in the details below</p>
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
        <form className="space-y-6">
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chapter Selection */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Chapter <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.chapter}
                  onChange={(e) =>
                    setFormData({ ...formData, chapter: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                >
                  <option value="">Select Chapter</option>
                  {/* Add chapter options here */}
                </select>
                <FiHome className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Member Selection */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.member}
                  onChange={(e) =>
                    setFormData({ ...formData, member: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                >
                  <option value="">Select Member</option>
                  {/* Add member options here */}
                </select>
                <FiUsers className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Updated Date Input */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.bdmDate}
                  onChange={(e) =>
                    setFormData({ ...formData, bdmDate: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                />
                <img
                  src={calendarIcon}
                  alt="calendar"
                  className="absolute right-4 top-[50%] -translate-y-[50%] w-6 h-6 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Description Textarea */}
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

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setFormData({ chapter: "", member: "", bdmDate: "", description: "" })}
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700/50 transition-all duration-300"
            >
              Reset
            </button>
            <button
              type="submit"
              className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              <span className="relative z-10">Save BDM</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddBDM;

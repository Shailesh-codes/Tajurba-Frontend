import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Home, Calendar, Phone, ChevronLeft, ScrollText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import referralIcon from "../assets/images/icons/ref-given.svg";

const MemberReferEditAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    chapter: "",
    member: "",
    referralFor: "",
    mobile: "",
    date: "",
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
          <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-800  rounded-xl shadow-lg">
            <img src={referralIcon} alt="referralIcon" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {id ? "Edit Referral" : "Add Referral"}
            </h2>
            <p className="text-sm text-gray-400">
              {id ? "Update existing referral" : "Create new referral"}
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
        <form className="space-y-6">
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Home className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
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
                <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Referral For Input */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Referral For
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.referralFor}
                  onChange={(e) =>
                    setFormData({ ...formData, referralFor: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                  placeholder="Enter referred person name"
                />
                <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Mobile Input */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Mobile
              </label>
              <div className="relative">
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                  placeholder="Enter mobile number"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Date Input */}
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
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* Description field with updated icon */}
          <div className="relative group">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Description
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="4"
                className="w-full p-4 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 resize-none pr-12"
                placeholder="Enter description here..."
              ></textarea>
              <ScrollText className="absolute right-4 top-4 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
            </div>
          </div>

          {/* Enhanced Submit and Reset Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setFormData({
                chapter: "",
                member: "",
                referralFor: "",
                mobile: "",
                date: "",
                description: "",
              })}
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Reset
            </button>
            <button
              type="submit"
              className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              <span className="relative z-10">{id ? "Update Referral" : "Save Referral"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MemberReferEditAdd;

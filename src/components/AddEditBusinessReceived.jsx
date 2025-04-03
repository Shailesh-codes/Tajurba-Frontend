import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsClipboardData } from "react-icons/bs";
import { FiUsers, FiHome } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../hooks/api";

import buss from "../assets/images/icons/buss.svg";

const AddEditBusinessReceived = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    chapter: "",
    member: "",
    amount: "",
    businessDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  // Fetch members from the backend
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/members/members`);

      if (response.data && response.data.data) {
        setMembers(response.data.data);
      } else if (Array.isArray(response.data)) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle member selection
  const handleMemberSelect = (e) => {
    const selectedMemberId = e.target.value;
    const selectedMember = members.find(
      (member) => member.id === parseInt(selectedMemberId)
    );

    if (selectedMember) {
      setFormData({
        ...formData,
        member: selectedMemberId,
        chapter: selectedMember.chapter_name || selectedMember.chapter,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.member || !formData.amount || !formData.businessDate) {
      alert("Please fill in all required fields");
      return;
    }

    const businessData = {
      given_by_memberId: parseInt(formData.member),
      receiver_memberId: 1,
      memberName:
        members.find((m) => m.id === parseInt(formData.member))?.name || "",
      chapter: formData.chapter,
      amount: parseFloat(formData.amount),
      businessDate: formData.businessDate,
      description: formData.description || "",
    };

    try {
      setLoading(true);
      if (id) {
        await axios.put(`${api}/business-received/${id}`, businessData);
      } else {
        await axios.post(`${api}/business-received`, businessData);
      }
      navigate("/business-received");
    } catch (error) {
      console.error("Error saving business:", error.response?.data || error);
      alert("Error saving business. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchMembers();

    // If editing, fetch existing business data
    if (id) {
      const fetchBusiness = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${api}/business-received/${id}`);
          if (response.data) {
            const businessData = response.data;
            setFormData({
              chapter: businessData.chapter,
              member: businessData.given_by_memberId.toString(),
              amount: businessData.amount,
              businessDate: businessData.businessDate.split("T")[0],
              description: businessData.description || "",
            });
          }
        } catch (error) {
          console.error("Error fetching business:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBusiness();
    }
  }, [id]);

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
            <img src={buss} alt="businessIcon" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {id ? "Edit Business Received" : "Add Business Received"}
            </h2>
            <p className="text-sm text-gray-400">
              {id
                ? "Update existing business received entry"
                : "Create new business received entry"}
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
            {/* Member Selection */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Business Given Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.member}
                  onChange={handleMemberSelect}
                  disabled={loading}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                >
                  <option value="">Select Member</option>
                  {Array.isArray(members) &&
                    members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                </select>
                <FiUsers className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Chapter Selection */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Chapter <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.chapter}
                  readOnly
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
                <FiHome className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Amount Input */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                  placeholder="Enter amount"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400">
                  ₹
                </span>
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
                  value={formData.businessDate}
                  onChange={(e) =>
                    setFormData({ ...formData, businessDate: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 "
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

          {/* Submit and Reset Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  chapter: "",
                  member: "",
                  amount: "",
                  businessDate: new Date().toISOString().split("T")[0],
                  description: "",
                })
              }
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700/50 transition-all duration-300"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              <span className="relative z-10">
                {loading
                  ? "Saving..."
                  : id
                  ? "Update Business"
                  : "Save Business"}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddEditBusinessReceived;

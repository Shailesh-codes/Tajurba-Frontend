import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsClipboardData } from "react-icons/bs";
import { FiCalendar, FiUsers, FiHome, FiDollarSign } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../hooks/api";
import { useAuth } from "../contexts/AuthContext";
import calendarIcon from "../assets/images/icons/calender-icon.svg";

const AddBusiness = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    given_by_memberId: auth.user?.id,
    receiver_memberId: "",
    memberName: "",
    chapter: "",
    amount: "",
    businessDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  // Updated fetchMembers function with better debugging
  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/members/members`);

      if (response.data && response.data.data) {
        // Check for nested data structure
        setMembers(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Check if response is direct array
        setMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Updated member selection dropdown
  const renderMemberOptions = () => {
    if (!Array.isArray(members)) {
      return <option value="">No members available</option>;
    }

    return (
      <>
        <option value="">Select Member</option>
        {members.map((member) => (
          <option
            key={member.id || member.member_id}
            value={member.id || member.member_id}
          >
            {member.name || member.member_name}
          </option>
        ))}
      </>
    );
  };

  // Updated handleMemberSelect
  const handleMemberSelect = (e) => {
    const selectedMember = members.find(
      (member) => member.id === parseInt(e.target.value)
    );
    if (selectedMember) {
      setFormData({
        ...formData,
        receiver_memberId: selectedMember.id,
        memberName: selectedMember.name,
        chapter: selectedMember.chapter_name || selectedMember.chapter,
      });
    }
  };

  // Updated handleSubmit function with proper data formatting
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.receiver_memberId ||
      !formData.amount ||
      !formData.businessDate
    ) {
      return;
    }

    // Format the data properly
    const businessData = {
      receiver_memberId: parseInt(formData.receiver_memberId),
      memberName: formData.memberName,
      chapter: formData.chapter,
      amount: parseFloat(formData.amount),
      businessDate: new Date(formData.businessDate).toISOString().split("T")[0],
      description: formData.description || "",
    };

    try {
      setLoading(true);

      if (id) {
        await api.put(`/business/${id}`, businessData);
      } else {
        await api.post(`/business`, businessData);
      }
      navigate("/business-given");
    } catch (error) {
      console.error("Error saving business:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchMembers();
  }, []);

  // Fetch business data if editing
  useEffect(() => {
    if (id) {
      const fetchBusiness = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/business/${id}`);
          if (response.data) {
            setFormData(response.data);
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
            <BsClipboardData className="w-6 h-6 text-white" />
          </div>
          <div>
            {id ? (
              <>
                <h2 className="text-2xl font-bold text-white">Edit Business</h2>
                <p className="text-sm text-gray-400">
                  Fill in the details below
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">Add Business</h2>
                <p className="text-sm text-gray-400">
                  Fill in the details below
                </p>
              </>
            )}
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Member Selection */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.receiver_memberId}
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
              </div>
            </div>

            {/* Chapter (Read-only) */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Chapter
              </label>
              <input
                type="text"
                value={formData.chapter}
                readOnly
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 text-white transition-all duration-300"
              />
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
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
                <img
                  src={calendarIcon}
                  alt="calendar"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none"
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
                  given_by_memberId: "",
                  receiver_memberId: "",
                  memberName: "",
                  chapter: "",
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
              <span className="relative z-10">
                {loading ? "Saving..." : "Save Business"}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddBusiness;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../hooks/api";
import { BsPersonPlus } from "react-icons/bs";
import { motion } from "framer-motion";
import { showToast } from "../utils/toast";

const VisitorInviteAddEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get visitor ID from URL if editing
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    visitor_name: "",
    visitor_email: "",
    mobile: "",
    company_name: "",
    company_category: "",
    invite_date: new Date().toISOString().split("T")[0],
    description: "",
  });

  // Fetch visitor data if editing
  useEffect(() => {
    const fetchVisitor = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get(`/visitors/${id}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          const visitor = response.data.data;
          // Format the date properly for the input field
          const formattedDate = new Date(visitor.invite_date)
            .toISOString()
            .split("T")[0];

          setFormData({
            visitor_name: visitor.visitor_name,
            visitor_email: visitor.visitor_email,
            mobile: visitor.mobile,
            company_name: visitor.company_name,
            company_category: visitor.company_category,
            invite_date: formattedDate,
            description: visitor.description || "",
          });
        }
      } catch (error) {
        showToast({
          message: "Failed to fetch visitor details",
          status: "error",
          icon: "error",
        });
        navigate("/visitors-invited");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitor();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let response;

      // Format the date properly
      const formattedData = {
        ...formData,
        invite_date: new Date(formData.invite_date).toISOString(),
      };

      if (id) {
        // Update existing visitor
        response = await api.put(`/visitors/${id}`, formattedData, {
          withCredentials: true,
        });
      } else {
        // Create new visitor
        response = await api.post(`/visitors`, formattedData, {
          withCredentials: true,
        });
      }

      if (response.data.success) {
        showToast({
          title: "Success",
          message: id
            ? "Visitor updated successfully"
            : "Visitor created successfully",
          status: "success",
          icon: "success",
        });
        navigate("/visitors-invited");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast({
        message: error.response?.data?.error || "Failed to save visitor",
        status: "error",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="mt-32 flex justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-12 h-12 text-amber-500 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <div className="text-gray-400 text-sm">
            {id ? "Loading visitor details..." : "Processing..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-32 max-w-4xl mx-auto px-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <BsPersonPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">
              {id ? "Edit Visitor Invite" : "Add Visitor Invite"}
            </h2>
            <p className="text-sm lg:text-base text-gray-400">
              {id
                ? "Update existing visitor invitation"
                : "Create a new visitor invitation"}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-32 sm:w-auto group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700"
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
          <span className="font-semibold tracking-wide text-sm lg:text-base">
            Back
          </span>
        </button>
      </div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visitor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Visitor Name
              </label>
              <input
                type="text"
                name="visitor_name"
                value={formData.visitor_name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter visitor name"
              />
            </div>

            {/* Visitor Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Visitor Email
              </label>
              <input
                type="email"
                name="visitor_email"
                value={formData.visitor_email}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter visitor email"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter mobile number"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter company name"
              />
            </div>

            {/* Company Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Category
              </label>
              <input
                type="text"
                name="company_category"
                value={formData.company_category}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                placeholder="Enter company category"
              />
            </div>

            {/* Invite Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Invite Date
              </label>
              <input
                type="date"
                name="invite_date"
                value={formData.invite_date}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
              placeholder="Enter description (optional)"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/visitors-invited")}
              className="px-6 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-gray-700/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : id ? "Update Invite" : "Create Invite"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VisitorInviteAddEdit;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../hooks/api";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  User,
  Building2,
  FileText,
  ChevronLeft,
  Edit3,
  Users,
} from "lucide-react";
import { showToast } from "../utils/toast";

const ViewMemberVisitor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitorData, setVisitorData] = useState({
    visitor_name: "",
    visitor_email: "",
    mobile: "",
    company_name: "",
    company_category: "",
    invite_date: "",
    description: "",
  });

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api}/visitors/${id}`, {
          withCredentials: true
        });

        if (response.data.success) {
          const data = response.data.data;
          setVisitorData({
            visitor_name: data.visitor_name,
            visitor_email: data.visitor_email,
            mobile: data.mobile,
            company_name: data.company_name,
            company_category: data.company_category,
            invite_date: new Date(data.invite_date).toLocaleDateString(),
            description: data.description || "No description provided",
          });
        }
      } catch (err) {
        console.error("Error fetching visitor data:", err);
        setError("Failed to load visitor information");
        showToast({
          message: "Failed to load visitor information",
          status: "error",
          icon: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVisitorData();
  }, [id]);

  if (loading) {
    return (
      <div className="mt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-32 flex flex-col items-center gap-4">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-32 p-1 lg:p-6 space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-2xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Visitor Invite Details
            </h2>
            <p className="text-sm lg:text-base text-gray-400 mt-1">
              View comprehensive visitor information
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/edit-visitor/${id}`)}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5"
          >
            <Edit3 className="w-4 h-4" />
            <span className="text-sm lg:text-base">Edit Invite</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700 hover:border-amber-500/30"
          >
            <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-semibold tracking-wide text-sm lg:text-base">
              Back
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visitor Profile Card */}
        <div className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="lg:mt-30 w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {visitorData.visitor_name}
            </h3>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
              {visitorData.company_name}
            </span>
          </div>
        </div>

        {/* Visitor Details */}
        <div className="lg:col-span-2 bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Contact Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: User,
                label: "Visitor Name",
                value: visitorData.visitor_name,
              },
              {
                icon: Mail,
                label: "Email Address",
                value: visitorData.visitor_email,
              },
              {
                icon: Phone,
                label: "Mobile Number",
                value: visitorData.mobile,
              },
              {
                icon: Building2,
                label: "Company Name",
                value: visitorData.company_name,
              },
              {
                icon: Briefcase,
                label: "Business Category",
                value: visitorData.company_category,
              },
              {
                icon: Calendar,
                label: "Invite Date",
                value: visitorData.invite_date,
              },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-amber-500" />
                  {item.label}
                </label>
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <p className="font-medium text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description Section */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Description
            </label>
            <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <p className="text-white whitespace-pre-wrap">
                {visitorData.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewMemberVisitor;

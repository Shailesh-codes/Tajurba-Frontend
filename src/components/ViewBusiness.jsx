import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsClipboardData } from "react-icons/bs";
import {
  FiUsers,
  FiMail,
  FiPhone,
  FiGlobe,
  FiBriefcase,
  FiFolder,
  FiCalendar,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../hooks/api";
import { format } from "date-fns";
import { useAuth } from "../contexts/AuthContext";

const ViewBusiness = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [businessData, setBusinessData] = useState({
    memberName: "",
    chapter: "",
    amount: "",
    businessDate: "",
    email: "",
    mobile: "",
    website: "",
    company: "",
    businessCategory: "",
    description: "",
    profileImage: "https://avatar.iran.liara.run/public",
    socialMedia: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      whatsapp: "",
    },
    status: "pending",
    verifiedDate: null,
    verifiedBy: null,
    created_at: "",
    joiningDate: "",
    memberStatus: "active",
    GivenByMember: {
      name: "",
    },
    ReceivedByMember: {
      name: "",
    }
  });
  const [loading, setLoading] = useState(true);
  const [isGiver, setIsGiver] = useState(false);
  const { auth } = useAuth();

  // Status badge styles based on status
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-amber-500/20 text-amber-400";
    }
  };

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        const businessResponse = await api.get(`/business/${id}`);
        const businessData = businessResponse.data;

        // Determine if current user is giver or receiver
        const currentUserIsGiver = businessData.given_by_memberId === auth.user.id;
        setIsGiver(currentUserIsGiver);

        // Get the ID of the member whose details we need to display
        const targetMemberId = currentUserIsGiver 
          ? businessData.receiver_memberId 
          : businessData.given_by_memberId;

        // Fetch member details
        const memberResponse = await api.get(`/members/members`);
        const targetMember = memberResponse.data.data.find(m => m.id === targetMemberId);

        setBusinessData({
          memberName: businessData.memberName,
          chapter: businessData.chapter,
          amount: businessData.amount,
          businessDate: businessData.businessDate,
          email: targetMember?.email || "",
          mobile: targetMember?.mobile || "",
          website: targetMember?.website || "",
          company: targetMember?.company || "",
          businessCategory: targetMember?.business_category || "",
          description: businessData.description || "",
          profileImage: targetMember?.profile_image || "https://avatar.iran.liara.run/public",
          joiningDate: targetMember?.joiningDate || "",
          memberStatus: targetMember?.status || "active",
          socialMedia: {
            facebook: targetMember?.facebook || "",
            twitter: targetMember?.twitter || "",
            linkedin: targetMember?.linkedin || "",
            instagram: targetMember?.instagram || "",
            whatsapp: targetMember?.whatsapp || "",
          },
          status: businessData.status,
          verifiedDate: businessData.updated_at,
          verifiedBy: businessData.verifiedBy,
          created_at: businessData.created_at,
          GivenByMember: {
            name: currentUserIsGiver ? auth.user.name : targetMember?.name || "",
          },
          ReceivedByMember: {
            name: currentUserIsGiver ? targetMember?.name : auth.user.name || "",
          }
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch business details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusinessData();
    }
  }, [id]);

  // Add loading indicator
  if (loading) {
    return (
      <div className="mt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Update the Edit button visibility based on status
  if (businessData.status === "pending") {
    <button
      onClick={() => navigate(`/add-business/${id}`)}
      className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      <span>Edit Business</span>
    </button>;
  }

  // Update the amount display to use proper formatting
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Update the date formatting function
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "Invalid Date";
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
            <BsClipboardData className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Business Details</h2>
            <p className="text-sm text-gray-400">
              {isGiver ? "Business Given To" : "Business Received From"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {businessData.status === "pending" && (
            <button
              onClick={() => navigate(`/add-business/${id}`)}
              className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Edit Business</span>
            </button>
          )}

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
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
        >
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/20">
                <img
                  src={businessData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 p-2 bg-amber-500 rounded-full border-4 border-gray-800">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              {isGiver ? businessData.ReceivedByMember?.name : businessData.GivenByMember?.name}
            </h3>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
              {businessData.chapter}
            </span>

            <div className="flex gap-3 mb-6">
              {Object.entries(businessData.socialMedia).map(
                ([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 rounded-lg hover:bg-amber-500/20 hover:text-amber-500 transition-all duration-300"
                    >
                      <img
                        src={`/src/assets/socials-media-logos/${platform}.png`}
                        alt={platform}
                        className="w-5 h-5"
                      />
                    </a>
                  );
                }
              )}
            </div>

            <div className="w-full border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-base font-semibold text-white">
                    {formatAmount(parseFloat(businessData.amount))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Business Date</p>
                  <p className="text-base font-semibold text-white">
                    {formatDate(businessData.businessDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FiUsers className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Contact Information
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  {isGiver ? "Given To" : "Received From"}
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
                  <FiUsers className="w-5 h-5 text-amber-500" />
                  <p className="font-medium text-white">
                    {isGiver ? businessData.ReceivedByMember?.name : businessData.GivenByMember?.name}
                  </p>
                </div>
              </div>

              {[
                { icon: FiMail, label: "Email", value: businessData.email },
                { icon: FiPhone, label: "Mobile", value: businessData.mobile },
                {
                  icon: FiGlobe,
                  label: "Website",
                  value: businessData.website,
                },
                {
                  icon: FiBriefcase,
                  label: "Company",
                  value: businessData.company,
                },
                {
                  icon: FiFolder,
                  label: "Business Category",
                  value: businessData.businessCategory,
                },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    {item.label}
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
                    <item.icon className="w-5 h-5 text-amber-500" />
                    <p className="font-medium text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Verification Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`p-2 rounded-lg ${
                businessData.status === "verified"
                  ? "bg-green-500/20"
                  : businessData.status === "rejected"
                  ? "bg-red-500/20"
                  : "bg-amber-500/20"
              }`}
            >
              <svg
                className={`w-5 h-5 ${
                  businessData.status === "verified"
                    ? "text-green-400"
                    : businessData.status === "rejected"
                    ? "text-red-400"
                    : "text-amber-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Verification Details
            </h3>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-xl">
            {businessData.status === "verified" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <p className="text-gray-300">
                    Verified on{" "}
                    <span className="text-green-400 font-medium">
                      {formatDate(businessData.verifiedDate)}
                    </span>
                  </p>
                </div>
                {businessData.verifiedBy && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <p className="text-gray-300">
                      Verified by{" "}
                      <span className="text-green-400 font-medium">
                        {businessData.verifiedBy}
                      </span>
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                    ✓ Verification Approved
                  </div>
                </div>
              </div>
            ) : businessData.status === "rejected" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <p className="text-gray-300">
                    Rejected on{" "}
                    <span className="text-red-400 font-medium">
                      {formatDate(businessData.verifiedDate)}
                    </span>
                  </p>
                </div>
                {businessData.verifiedBy && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <p className="text-gray-300">
                      Rejected by{" "}
                      <span className="text-red-400 font-medium">
                        {businessData.verifiedBy}
                      </span>
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                    ✕ Verification Rejected
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <p className="text-gray-300">Awaiting verification</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium">
                    ⏳ Pending Verification
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Business Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-3 bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <BsClipboardData className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Business Description
            </h3>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-xl">
            <p className="text-gray-300 whitespace-pre-wrap">
              {businessData.description}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ViewBusiness;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsClipboardData } from "react-icons/bs";
import {
  FiCalendar,
  FiUsers,
  FiHome,
  FiMail,
  FiPhone,
  FiGlobe,
  FiBriefcase,
  FiFolder,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const ViewBDM = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bdmData, setBdmData] = useState({
    memberName: "John Doe",
    chapter: "Chapter A",
    status: "verified",
    bdmDate: "2024-03-15",
    email: "john@example.com",
    mobile: "+1234567890",
    website: "www.example.com",
    company: "Tech Corp",
    businessCategory: "Technology",
    description: "Detailed description of the BDM meeting...",
    profileImage: "https://avatar.iran.liara.run/public",
    socialMedia: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    verifyStatus: "pending",
  });

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
    const fetchBDMData = async () => {
      try {
        const response = await fetch(`/api/bdm/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch BDM data");
        }
        const data = await response.json();
        setBdmData({
          memberName: data.member_name,
          chapter: data.chapter,
          status: data.status,
          bdmDate: data.bdm_date,
          email: data.email,
          mobile: data.mobile,
          website: data.website,
          company: data.company,
          businessCategory: data.business_category,
          description: data.description,
          profileImage: data.profile_image,
          socialMedia: {
            facebook: data.social_media.facebook,
            twitter: data.social_media.twitter,
            linkedin: data.social_media.linkedin,
            instagram: data.social_media.instagram,
          },
          verifiedDate: data.verified_date || null,
          verifiedBy: data.verified_by || null,
          verifyStatus: data.verify_status || "pending",
        });
      } catch (err) {
        console.error("Error fetching BDM data:", err);
      }
    };

    if (id) {
      fetchBDMData();
    }
  }, [id]);

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
          <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg">
            <BsClipboardData className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">BDM Details</h2>
            <p className="text-sm text-gray-400">View BDM information</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/edit-bdm/${id}`)}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
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
            <span>Edit BDM</span>
          </button>

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
                  src={bdmData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 p-2 bg-amber-500 rounded-full border-4 border-gray-800">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              {bdmData.memberName}
            </h3>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
              {bdmData.chapter}
            </span>

            <div className="flex gap-3 mb-6">
              {Object.entries(bdmData.socialMedia).map(([platform, url]) => (
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
              ))}
            </div>

            <div className="w-full border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">BDM Date</p>
                  <p className="text-base font-semibold text-white">
                    {bdmData.bdmDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeStyle(
                      bdmData.status
                    )}`}
                  >
                    {bdmData.status.charAt(0).toUpperCase() +
                      bdmData.status.slice(1)}
                  </span>
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
                  Member Name
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
                  <FiUsers className="w-5 h-5 text-amber-500" />
                  <p className="font-medium text-white">{bdmData.memberName}</p>
                </div>
              </div>

              {[
                { icon: FiMail, label: "Email", value: bdmData.email },
                { icon: FiPhone, label: "Mobile", value: bdmData.mobile },
                { icon: FiGlobe, label: "Website", value: bdmData.website },
                { icon: FiBriefcase, label: "Company", value: bdmData.company },
                {
                  icon: FiFolder,
                  label: "Business Category",
                  value: bdmData.businessCategory,
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

        {/* Verification Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3 bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-amber-400"
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
            {bdmData.verifyStatus === "verified" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <p className="text-gray-300">
                    Verified on{" "}
                    <span className="text-white font-medium">
                      {new Date(bdmData.verifiedDate).toLocaleDateString()} at{" "}
                      {new Date(bdmData.verifiedDate).toLocaleTimeString()}
                    </span>
                  </p>
                </div>
                {bdmData.verifiedBy && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <p className="text-gray-300">
                      Verified by{" "}
                      <span className="text-white font-medium">
                        {bdmData.verifiedBy}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ) : bdmData.verifyStatus === "rejected" ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <p className="text-red-400 font-medium">
                  Verification rejected
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <p className="text-amber-400 font-medium">
                  Pending verification
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Description Section - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <BsClipboardData className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              BDM Description
            </h3>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-xl">
            <p className="text-gray-300 whitespace-pre-wrap">
              {bdmData.description}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ViewBDM;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import referralIcon from "../assets/images/icons/ref-given.svg";
import {
  Users,
  Mail,
  Phone,
  Globe,
  Briefcase,
  CheckCircle,
  Folder,
  ClipboardList,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../hooks/api";
import Swal from "sweetalert2";

const MemberReferView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState({
    receivedMemberName: "",
    receivedChapter: "",
    referralDate: "",
    verifyStatus: "pending",
    verifiedDate: "",
    email: "",
    receivedMobile: "",
    refer_name: "",
    company: "",
    business_category: "",
    description: "",
    givenByMember: null,
    receivedByMember: null,
    profileImage: "https://avatar.iran.liara.run/public",
    socialMedia: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      whatsapp: "",
    },
  });
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        // First fetch referral data to get member IDs
        const referralResponse = await axios.get(`${api}/referrals/${id}`);

        if (referralResponse.data.success) {
          const referralData = referralResponse.data.data;

          const membersResponse = await axios.get(`${api}/members/members`);
          if (membersResponse.data.success) {
            const allMembers = membersResponse.data.data;

            const givenByMember = allMembers.find(
              (m) => m.id === referralData.given_by_member_id
            );
            const receivedByMember = allMembers.find(
              (m) => m.id === referralData.received_member_id
            );

            setReferralData((prevData) => ({
              ...prevData,

              refer_name: referralData.refer_name || "N/A",
              referralDate:
                referralData.referral_date || new Date().toISOString(),
              description:
                referralData.description || "No description provided",
              verifyStatus: referralData.verify_status || "pending",
              verifiedDate: referralData.verified_date || "",
              receivedMobile: referralData.mobile || "N/A",

              givenByMember: givenByMember || null,
              receivedByMember: receivedByMember || null,
              receivedMemberName: receivedByMember?.name || "N/A",
              receivedChapter: receivedByMember?.chapter_name || "N/A",
              email: receivedByMember?.email || "N/A",
              company: receivedByMember?.company_name || "N/A",
              business_category: receivedByMember?.business_category || "N/A",

              // Social Media
              socialMedia: {
                ...prevData.socialMedia,
                whatsapp: referralData.mobile
                  ? `https://wa.me/${referralData.mobile.replace(
                      /[^0-9]/g,
                      ""
                    )}`
                  : "",
              },
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch details",
          text: error.message || "There was an error loading the data.",
          background: "#1F2937",
          color: "#fff",
          confirmButtonColor: "#F59E0B",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMemberData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mt-32 p-1 lg:p-6 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <div className="text-gray-400 text-sm">
            Loading referral details...
          </div>
        </div>
      </div>
    );
  }

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
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={referralIcon} alt="Referral Icon" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Referral Details</h2>
            <p className="text-sm text-gray-400">View referral information</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/add-edit-ref-given/${id}`)}
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
            <span>Edit Referral</span>
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
                  src={referralData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 p-2 bg-amber-500 rounded-full border-4 border-gray-800">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              {Object.entries(referralData.socialMedia).map(
                ([platform, url]) => {
                  if (!url) return null;

                  // Platform-specific color configurations
                  const socialColors = {
                    facebook: {
                      bg: "bg-[#0866ff]",
                      hover: "hover:bg-[#1877F2]/30",
                      text: "hover:text-[#1877F2]",
                    },
                    twitter: {
                      bg: "bg-[#000000]",
                      hover: "hover:bg-[#1DA1F2]/30",
                      text: "hover:text-[#1DA1F2]",
                    },
                    linkedin: {
                      bg: "bg-[#0a66C2]",
                      hover: "hover:bg-[#0A66c2]/20",
                      text: "hover:text-[#0A66C2]",
                    },
                    instagram: {
                      bg: "bg-gradient-to-r from-[#f74f5a] to-[#f63b8c]",
                      hover:
                        "hover:bg-gradient-to-r hover:from-[#e1036b]/30 hover:to-[#e4405f]/30",
                      text: "hover:text-[#E4405F]",
                    },
                    whatsapp: {
                      bg: "bg-[#25d366]",
                      hover: "hover:bg-[#25D366]/30",
                      text: "hover:text-[#25D366]",
                    },
                  };

                  const colors = socialColors[platform];

                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-all duration-300 ${colors.bg} ${colors.hover} ${colors.text}`}
                    >
                      <img
                        src={`/src/assets/images/socials-media-logos/${platform}.svg`}
                        alt={platform}
                        className="w-5 h-5"
                      />
                    </a>
                  );
                }
              )}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              {referralData.receivedMemberName}
            </h3>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
              {referralData.receivedChapter}
            </span>

            <div className="w-full border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">Referral Date</p>
                  <p className="text-base font-semibold text-white">
                    {new Date(referralData.referralDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p
                    className={`text-base font-semibold ${
                      referralData.verifyStatus === "verified"
                        ? "text-green-500"
                        : referralData.verifyStatus === "rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {referralData.verifyStatus.charAt(0).toUpperCase() +
                      referralData.verifyStatus.slice(1)}
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
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Contact Information
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Users,
                  label: "Given By Member",
                  value: referralData.givenByMember?.name || "N/A",
                },
                {
                  icon: Users,
                  label: "Received By Member",
                  value: referralData.receivedMemberName,
                },
                {
                  icon: Users,
                  label: "Refer To",
                  value: referralData.refer_name,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: referralData.receivedByMember?.email || "N/A",
                },
                {
                  icon: Phone,
                  label: "Referred Mobile ",
                  value: referralData.receivedMobile,
                },
                {
                  icon: Folder,
                  label: "Chapter",
                  value: referralData.receivedByMember?.chapter_name || "N/A",
                },
                {
                  icon: Briefcase,
                  label: "Company",
                  value: referralData.receivedByMember?.company || "N/A",
                },
                {
                  icon: Folder,
                  label: "Business Category",
                  value:
                    referralData.receivedByMember?.business_category || "N/A",
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

        {/* Verification Details and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
        >
          <div className="space-y-6">
            {/* Verification Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  referralData.verifyStatus === "verified"
                    ? "bg-green-500/20"
                    : referralData.verifyStatus === "rejected"
                    ? "bg-red-500/20"
                    : "bg-amber-500/20"
                }`}>
                  <svg
                    className={`w-5 h-5 ${
                      referralData.verifyStatus === "verified"
                        ? "text-green-400"
                        : referralData.verifyStatus === "rejected"
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
                {referralData.verifyStatus === "verified" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <p className="text-gray-300">
                        Verified on{" "}
                        <span className="text-green-400 font-medium">
                          {formatDate(referralData.verifiedDate)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                        ✓ Verification Approved
                      </div>
                    </div>
                  </div>
                ) : referralData.verifyStatus === "rejected" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <p className="text-gray-300">
                        Rejected on{" "}
                        <span className="text-red-400 font-medium">
                          {formatDate(referralData.rejectedDate)}
                        </span>
                      </p>
                    </div>
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
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Referral Description
                </h3>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-xl">
                <p className="text-white whitespace-pre-wrap">
                  {referralData.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MemberReferView;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Phone, Globe, Briefcase, Folder } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import memberIcon from "../assets/images/icons/members.svg";

const ChapterMemberView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [memberData, setMemberData] = useState({
    fullName: "John Smith",
    chapterName: "Chapter A",
    email: "john@example.com",
    mobile: "+91 9876543210",
    websiteLink: "www.johnsmith.com",
    companyName: "Tech Solutions Ltd",
    businessCategory: "IT Services",
    joiningDate: "2024-03-15",
    createdAt: "2024-01-01",
    profileImage: "https://avatar.iran.liara.run/public",
    socialMedia: {
      whatsapp: "https://wa.me/919876543210",
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-32 p-1 lg:p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={memberIcon} alt="member-icon" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Member Profile</h2>
            <p className="text-sm text-gray-400">View member details</p>
          </div>
        </div>
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
                  src={memberData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 p-2 bg-amber-500 rounded-full border-4 border-gray-800">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              {Object.entries(memberData.socialMedia).map(([platform, url]) => {
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
              })}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              {memberData.fullName}
            </h3>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-4">
              {memberData.chapterName}
            </span>

            <div className="w-full border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">Created At</p>
                  <p className="font-semibold text-white">
                    {new Date(memberData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Join Date</p>
                  <p className="font-semibold text-white">
                    {new Date(memberData.joiningDate).toLocaleDateString()}
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
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Contact Information
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Users, label: "Full Name", value: memberData.fullName },
              { icon: Phone, label: "Mobile Number", value: memberData.mobile },
              { icon: Mail, label: "Email Address", value: memberData.email },
              {
                icon: Globe,
                label: "Website Link",
                value: memberData.websiteLink,
              },
              {
                icon: Briefcase,
                label: "Company Name",
                value: memberData.companyName,
              },
              {
                icon: Folder,
                label: "Business Category",
                value: memberData.businessCategory,
              },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  {item.label}
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChapterMemberView;

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
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const ViewReceivedBusiness = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [businessData, setBusinessData] = useState({
    givenByName: "Shailesh Bhosale",
    givenByChapter: "Chapter A",
    amount: "50000",
    businessDate: "2024-03-15",
    givenByEmail: "shailesh@example.com",
    givenByMobile: "+91 9876543210",
    givenByWebsite: "www.shailesh.com",
    givenByCompany: "Tech Solutions Ltd",
    givenByBusiness: "IT Services",
    description: "Provided IT consulting services for web application development and cloud infrastructure setup. The project included full-stack development, database design, and deployment strategies.",
    profileImage: "https://avatar.iran.liara.run/public",
    socialMedia: {
      facebook: "https://facebook.com/shailesh",
      twitter: "https://twitter.com/shailesh",
      linkedin: "https://linkedin.com/in/shailesh",
      instagram: "https://instagram.com/shailesh",
      whatsapp: "https://wa.me/919876543210",
    },
  });

  useEffect(() => {
    // Comment out the actual API call for now since we're using dummy data
    // const fetchBusinessData = async () => {
    //   try {
    //     const response = await fetch(`/api/received-business/${id}`);
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch business data");
    //     }
    //     const data = await response.json();
    //     setBusinessData({...});
    //   } catch (err) {
    //     console.error("Error fetching business data:", err);
    //   }
    // };

    // if (id) {
    //   fetchBusinessData();
    // }
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
            <h2 className="text-2xl font-bold text-white">Business Received Details</h2>
            <p className="text-sm text-gray-400">View business information</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/edit-received-business/${id}`)}
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

            <div className="flex gap-3 mb-4">
              {Object.entries(businessData.socialMedia).map(([platform, url]) => {
                if (!url) return null;
                
                // Platform-specific color configurations
                const socialColors = {
                  facebook: {
                    bg: "bg-[#1877F2]/20",
                    hover: "hover:bg-[#1877F2]/30",
                    text: "hover:text-[#1877F2]"
                  },
                  twitter: {
                    bg: "bg-[#1DA1F2]/20",
                    hover: "hover:bg-[#1DA1F2]/30",
                    text: "hover:text-[#1DA1F2]"
                  },
                  linkedin: {
                    bg: "bg-[#0A66C2]/20",
                    hover: "hover:bg-[#0A66C2]/30",
                    text: "hover:text-[#0A66C2]"
                  },
                  instagram: {
                    bg: "bg-[#E4405F]/20",
                    hover: "hover:bg-[#E4405F]/30",
                    text: "hover:text-[#E4405F]"
                  },
                  whatsapp: {
                    bg: "bg-[#25D366]/20",
                    hover: "hover:bg-[#25D366]/30",
                    text: "hover:text-[#25D366]"
                  }
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
              {businessData.givenByName}
            </h3>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
              {businessData.givenByChapter}
            </span>

            <div className="w-full border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-base font-semibold text-white">
                    ₹{parseFloat(businessData.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Business Date</p>
                  <p className="text-base font-semibold text-white">
                    {new Date(businessData.businessDate).toLocaleDateString()}
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
              {[
                { icon: FiUsers, label: "Member Name", value: businessData.givenByName },
                { icon: FiMail, label: "Email", value: businessData.givenByEmail },
                { icon: FiPhone, label: "Mobile", value: businessData.givenByMobile },
                { icon: FiGlobe, label: "Website", value: businessData.givenByWebsite },
                { icon: FiBriefcase, label: "Company", value: businessData.givenByCompany },
                { icon: FiFolder, label: "Business Category", value: businessData.givenByBusiness },
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

        {/* Business Description */}
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

export default ViewReceivedBusiness;

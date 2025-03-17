import React, { useState } from "react";
import { motion } from "framer-motion";
import { BsAward } from "react-icons/bs";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import view from "../assets/images/icons/view.svg";
import download from "../assets/images/icons/download.svg";

const MemberCertificate = () => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  // Dummy data for demonstration
  const certificates = [
    {
      id: 1,
      type: "highest_business",
      issueDate: "2024-03-15",
    },
    {
      id: 2,
      type: "highest_visitor",
      issueDate: "2024-03-10",
    },
  ];

  const formatCertificateType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl shadow-lg">
            <BsAward className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Your Certificates</h2>
            <p className="text-sm text-gray-400">
              View and download your earned certificates
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
      >
        {/* Filters Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Certificate Type Filter */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Certificate Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
            >
              <option value="">All Types</option>
              <option value="highest_business">Highest Business Given</option>
              <option value="highest_visitor">Highest Visitor Invited</option>
              <option value="best_elevator_pitch">Best Elevator Pitch</option>
              <option value="maximum_referrals">Maximum Referrals Given</option>
              <option value="mdp_attended">MDP Attended</option>
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Month
            </label>
            <div className="relative">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
              />
              <img
                src={calendarIcon}
                alt="calendar"
                className="absolute right-4 top-[50%] -translate-y-[50%] w-6 h-6 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Table Section - With Simplified Hover Effect */}
        <div className="relative min-h-[300px] max-h-[calc(100vh-500px)]">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
          {/* Add scrollbar container div */}
          <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80">
            <table className="w-full min-w-[800px] text-left border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 bg-gray-800 first:rounded-tl-xl whitespace-nowrap">
                    Sr No.
                  </th>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 bg-gray-800 whitespace-nowrap">
                    Certificate Type
                  </th>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 bg-gray-800 whitespace-nowrap">
                    Issue Date
                  </th>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 bg-gray-800 text-center last:rounded-tr-xl whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {certificates.map((cert, index) => (
                  <motion.tr
                    key={cert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700/50 text-amber-500 font-medium group-hover:bg-gray-700">
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50 text-amber-500 group-hover:bg-gray-700">
                        {formatCertificateType(cert.type)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      {formatDate(cert.issueDate)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            /* Handle view */
                          }}
                          className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-600 hover:bg-amber-500 transition-all duration-300"
                        >
                          <img src={view} alt="View" className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Empty State - Move inside scroll container */}
            {certificates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <BsAward className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Certificates Available
                </h3>
                <p className="text-gray-400 text-center">
                  No certificates have been issued to you yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberCertificate;

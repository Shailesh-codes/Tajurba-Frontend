import React, { useState } from "react";
import { motion } from "framer-motion";
// import { BsUsers } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import users from "../assets/images/icons/members.svg";

const ChapterMembers = () => {
  const [search, setSearch] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  // Dummy data for demonstration
  const members = [
    {
      id: 1,
      fullName: "Shailesh Bhosale",
      mobile: "+91 9876543210",
      email: "shailesh@example.com",
      chapter: "Chapter A",
      joiningDate: "2024-03-15",
    },
    {
      id: 2,
      fullName: "Steve Smith",
      mobile: "+91 9876543211",
      email: "steve@example.com",
      chapter: "Chapter B",
      joiningDate: "2024-03-10",
    },
  ];

  // Table headers
  const tableHeaders = [
    "SR No.",
    "Member Name",
    "Mobile Number",
    "Email",
    "Chapter",
    "Join Date",
    "Actions",
  ];

  return (
    <div className="mt-32 flex flex-col space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
            <img src={users} alt="members" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Chapter Members</h2>
            <p className="text-sm text-gray-400">View chapter members list</p>
          </div>
        </div>
        <button
          onClick={() => history.back()}
          className="w-full sm:w-auto group flex items-center justify-center sm:justify-start gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-green-500 rounded-xl transition-all duration-300 border border-gray-700"
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

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-auto order-2 sm:order-1">
          <div className="relative h-[56px]">
            <input
              type="text"
              placeholder="Search by member name, mobile or chapter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-[400px] lg:w-[500px] h-full bg-gray-800 text-gray-300 pl-12 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="order-1 sm:order-2 sm:ml-auto relative">
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="w-full sm:w-auto pl-14 pr-6 py-2 bg-gray-800 text-white text-lg font-normal rounded-2xl h-[56px] border border-gray-600/50 focus:outline-none hover:bg-gray-700/80 transition-colors appearance-none"
          >
            <option value="">All Chapters</option>
            <option value="Chapter A">Chapter A</option>
            <option value="Chapter B">Chapter B</option>
          </select>
          <svg
            className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
        </div>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl"
      >
        <div className="relative min-h-[300px] max-h-[calc(100vh-500px)]">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
          <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-gray-800/95 via-gray-800/98 to-gray-800/95 backdrop-blur-xl">
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-4 text-left border-b border-gray-700"
                    >
                      <span className="text-sm font-semibold text-gray-300">
                        {header}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {members.map((member, index) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={member.id}
                    className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                  >
                    <td className="px-6 py-4">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/50 text-amber-500 font-medium">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {member.fullName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">
                        {member.mobile}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">
                        {member.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-amber-500">
                        {member.chapter}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {member.joiningDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600/90 to-amber-800/90 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-amber-900/30">
                          <div className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                          <FiEye className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative z-10" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChapterMembers;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";
import referralIcon from "../assets/images/icons/ref-given.svg";
import { useNavigate } from "react-router-dom";
import api from "../hooks/api";
import Swal from "sweetalert2";
import { format } from "date-fns";

const MemberReferGiven = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    points: 0,
    nextTierNeeded: 0,
    nextTierPoints: 0
  });

  // Table headers
  const tableHeaders = [
    "SR No.",
    "Referral Type",
    "Member Name",
    "Mobile Number",
    "Chapter",
    "Status",
    "Verification Date",
    "Referral Date",
    "Actions",
  ];

  // Fetch referrals data
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/referrals`);

        if (response.data.success) {
          setReferrals(response.data.data);
          setReferralStats(response.data.stats);
        } else {
          throw new Error(response.data.message || "Failed to fetch referrals");
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch referrals",
          text:
            error.message || "There was an error loading the referrals data.",
          background: "#1F2937",
          color: "#fff",
          confirmButtonColor: "#F59E0B",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  // Filter referrals based on search and status
  const filteredReferrals = referrals.filter((referral) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      referral.refer_name?.toLowerCase().includes(searchLower) ||
      referral.receivedByMember?.Chapter?.chapter_name
        ?.toLowerCase()
        .includes(searchLower) ||
      referral.mobile?.includes(search);

    const matchesStatus =
      selectedStatus === "" || referral.verify_status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch {
      return "-";
    }
  };

  return (
    <div className="mt-32 p-1 lg:p-6 flex flex-col gap-1 space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746]  rounded-xl">
            <img src={referralIcon} alt="referrals" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Referrals Given</h2>
            <p className="text-sm text-gray-400">View your referrals list</p>
          </div>
        </div>
        <button
          onClick={() => history.back()}
          className="w-full sm:w-auto group flex items-center justify-center sm:justify-start gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700"
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
              placeholder="Search by name, mobile or chapter..."
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

        <div className="order-1 sm:order-2 sm:ml-auto">
          <button
            onClick={() => navigate("/add-edit-ref-given")}
            className="flex justify-center w-full sm:w-auto px-10 py-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white text-lg font-normal rounded-2xl h-[56px] border border-gray-600/50 focus:outline-none transition-colors items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4V16M4 10H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add New Referral
          </button>
        </div>
      </div>

      {/* Points Summary Section */}
      <div className="mb-6">
        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Monthly Points Summary</h3>
              <p className="text-sm text-gray-400">
                Current Points: {referralStats.points}/15
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">
                Total Referrals: {referralStats.totalReferrals}
              </p>
              {referralStats.nextTierNeeded > 0 && (
                <p className="text-sm text-amber-500">
                  {referralStats.nextTierNeeded} more for {referralStats.nextTierPoints} points
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-400">
            <p>• 1-2 referrals: 5 points</p>
            <p>• 3-4 referrals: 10 points</p>
            <p>• 5+ referrals: 15 points (max)</p>
          </div>
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
              <thead className="sticky top-0 z-20">
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
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                        <div className="text-gray-400 text-sm">
                          Loading referrals...
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filteredReferrals.length > 0 ? (
                  filteredReferrals.map((referral, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={referral.referral_id}
                      className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                    >
                      <td className="px-6 py-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/50 text-amber-500 font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          referral.isGiver 
                            ? "bg-green-500/10 text-green-500"
                            : "bg-blue-500/10 text-blue-500"
                        }`}>
                          {referral.isGiver ? "Given To" : "Received From"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            {referral.displayName || referral.refer_name}
                          </span>
                          {referral.refer_name && (
                            <span className="text-xs text-gray-400">
                              Referred: {referral.refer_name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">
                          {referral.mobile || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">
                          {referral.chapter || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          referral.verify_status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : referral.verify_status === "verified"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}>
                          {referral.verify_status.charAt(0).toUpperCase() +
                            referral.verify_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {referral.verify_status === "verified"
                            ? formatDate(referral.verified_date)
                            : referral.verify_status === "rejected"
                            ? formatDate(referral.rejected_date)
                            : "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {formatDate(referral.referral_date)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() =>
                              navigate(
                                `/view-ref-given/${referral.referral_id}`
                              )
                            }
                            className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600/90 to-amber-800/90 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-amber-900/30"
                          >
                            <div className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                            <FiEye className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative z-10" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg
                          className="w-12 h-12 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="text-gray-400 text-sm">
                          No referrals found matching your search criteria
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemberReferGiven;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  ChevronLeft,
  Briefcase,
  IndianRupee,
  FileText,
  Check,
  X,
} from "lucide-react";
import requestIcon from "../assets/images/icons/request.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../hooks/api";
import { format } from "date-fns";

const MemberReqReceived = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("bdm");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    bdm: { total: 0, verified: 0, pending: 0, rejected: 0 },
    business: { total: 0, verified: 0, pending: 0, rejected: 0 },
    referral: { total: 0, verified: 0, pending: 0, rejected: 0 },
  });
  const [requests_data, setRequestsData] = useState([]);

  // Fetch BDM requests and stats
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/bdm`);
      const bdms = response.data || [];

      const formattedBdms = bdms.map((bdm) => ({
        ...bdm,
        id: bdm.bdm_id,
        request_type: bdm.request_type || "BDM", 
        date: bdm.bdmDate || bdm.created_at, 
      }));

      // Rest of your filtering logic
      let filteredBdms = formattedBdms;
      if (selectedStatus !== "all") {
        filteredBdms = filteredBdms.filter(
          (bdm) => bdm.status === selectedStatus
        );
      }
      if (selectedChapter !== "all") {
        filteredBdms = filteredBdms.filter(
          (bdm) => bdm.chapter === selectedChapter
        );
      }

      setStats({
        bdm: {
          total: formattedBdms.length,
          verified: formattedBdms.filter((b) => b.status === "verified").length,
          pending: formattedBdms.filter((b) => b.status === "pending").length,
          rejected: formattedBdms.filter((b) => b.status === "rejected").length,
        },
        business: { total: 0, verified: 0, pending: 0, rejected: 0 },
        referral: { total: 0, verified: 0, pending: 0, rejected: 0 },
      });

      setRequestsData(filteredBdms);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle request verification
  const handleVerification = async (requestId, action) => {
    try {
      const status = action === "verify" ? "verified" : "rejected";
      const currentDate = new Date().toISOString();
      
      // Include the verification/rejection date in the request
      const updateData = {
        status,
        verified_date: status === "verified" ? currentDate : null,
        rejected_date: status === "rejected" ? currentDate : null
      };

      await axios.put(`${api}/bdm/${requestId}`, updateData);
      fetchRequests(); // Refresh the data
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  // Add a helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedStatus, selectedChapter]);

  const getStatusClass = (status) => {
    const classes = {
      verified: "bg-green-500/10 text-green-500",
      pending: "bg-amber-500/10 text-amber-500",
      rejected: "bg-red-500/10 text-red-500",
    };
    return classes[status] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <div className="mt-32 p-1 lg:p-6 flex flex-col space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={requestIcon} alt="requests" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Requests Received</h2>
            <p className="text-sm text-gray-400">
              View and verify member requests
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto group flex items-center justify-center sm:justify-start gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700"
        >
          <ChevronLeft
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          <span className="font-semibold tracking-wide text-sm">Back</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* BDM Stats */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400">BDM Requests</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.bdm.total}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Briefcase className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">
                {stats.bdm.verified} Verified
              </span>
            </div>
            <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
              <span className="text-sm text-amber-500">
                {stats.bdm.pending} Pending
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.bdm.rejected} Rejected
              </span>
            </div>
          </div>
        </div>

        {/* Business Stats */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400">Business Requests</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.business.total}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <IndianRupee className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">
                {stats.business.verified} Verified
              </span>
            </div>
            <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
              <span className="text-sm text-amber-500">
                {stats.business.pending} Pending
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.business.rejected} Rejected
              </span>
            </div>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400">Referral Requests</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.referral.total}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">
                {stats.referral.verified} Verified
              </span>
            </div>
            <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
              <span className="text-sm text-amber-500">
                {stats.referral.pending} Pending
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.referral.rejected} Rejected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="border-b border-gray-700 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Request Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none bg-gray-800 text-gray-300 pl-10 pr-10 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-amber-500 text-sm"
            >
              <option value="bdm">BDM Requests</option>
              <option value="business">Business Requests</option>
              <option value="referral">Referral Requests</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none bg-gray-800 text-gray-300 pl-10 pr-10 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-amber-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Chapter Filter */}
          <div className="relative">
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full appearance-none bg-gray-800 text-gray-300 pl-10 pr-10 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-amber-500 text-sm"
            >
              <option value="all">All Chapters</option>
              <option value="mumbai">Mumbai Central</option>
              <option value="delhi">Delhi North</option>
            </select>
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
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-gray-800/95 via-gray-800/98 to-gray-800/95 backdrop-blur-xl">
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Member Name
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Chapter
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Request Type
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Date
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : requests_data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  requests_data.map((request) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    key={request.id}
                    className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {request.memberName || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">
                          {request.chapter || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                          {request.request_type || "BDM"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">
                          {formatDate(request.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-sm ${getStatusClass(
                          request.status
                        )}`}
                      >
                          {request.status
                            ? request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)
                            : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleVerification(request.id, "verify")
                                }
                                className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm transition-all duration-300 flex items-center gap-1"
                              >
                              <Check size={16} />
                              Verify
                            </button>
                              <button
                                onClick={() =>
                                  handleVerification(request.id, "reject")
                                }
                                className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm transition-all duration-300 flex items-center gap-1"
                              >
                              <X size={16} />
                              Reject
                            </button>
                            </>
                          )}
                          <button
                            onClick={() => navigate(`/view-bdm/${request.id}`)}
                            className="px-3 py-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg text-sm transition-all duration-300"
                          >
                              <Eye size={16} />
                            </button>
                      </div>
                    </td>
                  </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemberReqReceived;

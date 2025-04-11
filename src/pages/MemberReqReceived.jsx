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
  const [referralData, setReferralData] = useState([]);
  const [businessData, setBusinessData] = useState([]);

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

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/referrals`);
      console.log("API Response:", response);

      if (response.data.success) {
        const referrals = response.data.data;
        console.log("Raw Referrals Data:", referrals);

        const referralStats = {
          total: referrals.length,
          verified: referrals.filter((r) => r.verify_status === "verified")
            .length,
          pending: referrals.filter((r) => r.verify_status === "pending")
            .length,
          rejected: referrals.filter((r) => r.verify_status === "rejected")
            .length,
        };

        setStats((prevStats) => ({
          ...prevStats,
          referral: referralStats,
        }));

        const formattedReferrals = referrals.map((referral) => ({
          id: referral.referral_id,
          givenByName: referral.givenByMember?.name || "N/A",
          receivedByName: referral.receivedByMember?.name || "N/A",
          chapter: referral.givenByMember?.Chapter?.chapter_name || "N/A",
          refer_name: referral.refer_name,
          mobile: referral.mobile,
          status: referral.verify_status,
          date: referral.referral_date,
          verified_date: referral.verified_date,
          rejected_date: referral.rejected_date,
        }));

        setReferralData(formattedReferrals);
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (requestId, action) => {
    try {
      const status = action === "verify" ? "verified" : "rejected";
      const currentDate = new Date().toISOString();

      const updateData = {
        status,
        verified_date: status === "verified" ? currentDate : null,
        rejected_date: status === "rejected" ? currentDate : null,
      };

      await axios.put(`${api}/bdm/${requestId}`, updateData);
      fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch BDM data
        const bdmResponse = await axios.get(`${api}/bdm`);
        const bdms = bdmResponse.data || [];
        const formattedBdms = bdms.map((bdm) => ({
          ...bdm,
          id: bdm.bdm_id,
          request_type: bdm.request_type || "BDM",
          date: bdm.bdmDate || bdm.created_at,
        }));

        // Filter BDMs based on selected filters
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

        // Fetch referral data
        const referralResponse = await axios.get(`${api}/referrals`);
        const referrals = referralResponse.data.success
          ? referralResponse.data.data
          : [];

        // Calculate stats for both BDM and referrals
        const bdmStats = {
          total: formattedBdms.length,
          verified: formattedBdms.filter((b) => b.status === "verified").length,
          pending: formattedBdms.filter((b) => b.status === "pending").length,
          rejected: formattedBdms.filter((b) => b.status === "rejected").length,
        };

        const referralStats = {
          total: referrals.length,
          verified: referrals.filter((r) => r.verify_status === "verified")
            .length,
          pending: referrals.filter((r) => r.verify_status === "pending")
            .length,
          rejected: referrals.filter((r) => r.verify_status === "rejected")
            .length,
        };

        // Format referral data
        const formattedReferrals = referrals.map((referral) => ({
          id: referral.referral_id,
          givenByName: referral.givenByMember?.name || "N/A",
          receivedByName: referral.receivedByMember?.name || "N/A",
          chapter: referral.givenByMember?.Chapter?.chapter_name || "N/A",
          refer_name: referral.refer_name,
          mobile: referral.mobile,
          status: referral.verify_status,
          date: referral.referral_date,
          verified_date: referral.verified_date,
          rejected_date: referral.rejected_date,
        }));

        // Add business data fetch
        const businessResponse = await axios.get(`${api}/business`);
        const businesses = businessResponse.data || [];

        // Format business data with giver's name
        const formattedBusinesses = businesses.map(business => ({
          id: business.business_id,
          givenByName: business.Member?.name || "N/A",
          memberName: business.memberName,
          chapter: business.chapter,
          amount: business.amount,
          status: business.status,
          date: business.businessDate,
          verified_date: business.verified_date,
          rejected_date: business.rejected_date
        }));

        // Calculate business stats
        const businessStats = {
          total: businesses.length,
          verified: businesses.filter(b => b.status === "verified").length,
          pending: businesses.filter(b => b.status === "pending").length,
          rejected: businesses.filter(b => b.status === "rejected").length
        };

        // Update all state at once
        setStats({
          bdm: bdmStats,
          referral: referralStats,
          business: businessStats
        });
        setRequestsData(filteredBdms);
        setReferralData(formattedReferrals);
        setBusinessData(formattedBusinesses);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedStatus, selectedChapter]);

  useEffect(() => {}, [selectedType]);

  const handleReferralVerification = async (referralId, action) => {
    try {
      const status = action === "verify" ? "verified" : "rejected";
      const currentDate = new Date().toISOString();

      const updateData = {
        verify_status: status,
        verified_date: status === "verified" ? currentDate : null,
        rejected_date: status === "rejected" ? currentDate : null,
      };

      await axios.put(`${api}/referrals/${referralId}`, updateData);
      fetchReferrals(); // Refresh referral data
    } catch (error) {
      console.error("Error updating referral:", error);
    }
  };

  const handleBusinessVerification = async (businessId, action) => {
    try {
      const status = action === "verify" ? "verified" : "rejected";
      const currentDate = new Date().toISOString();

      const updateData = {
        status,
        verified_date: status === "verified" ? currentDate : null,
        rejected_date: status === "rejected" ? currentDate : null
      };

      // Optimistically update the UI
      setBusinessData(prevData => 
        prevData.map(business => 
          business.id === businessId
            ? {
                ...business,
                status,
                verified_date: status === "verified" ? currentDate : business.verified_date,
                rejected_date: status === "rejected" ? currentDate : business.rejected_date
              }
            : business
        )
      );

      // Update stats immediately
      setStats(prevStats => {
        const newStats = { ...prevStats };
        newStats.business = {
          ...newStats.business,
          pending: newStats.business.pending - 1,
          [status]: newStats.business[status] + 1
        };
        return newStats;
      });

      // Make API call
      await axios.put(`${api}/business/${businessId}`, updateData);

    } catch (error) {
      console.error("Error updating business:", error);
      // Revert changes if API call fails
      fetchAllData();
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      verified: "bg-green-500/10 text-green-500",
      pending: "bg-amber-500/10 text-amber-500",
      rejected: "bg-red-500/10 text-red-500",
    };
    return classes[status] || "bg-gray-500/10 text-gray-500";
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          </td>
        </tr>
      );
    }

    if (selectedType === "referral") {
      return referralData.length === 0 ? (
        <tr>
          <td colSpan={6} className="text-center py-8 text-gray-400">
            No referrals found ({loading ? "Loading..." : "Empty data"})
          </td>
        </tr>
      ) : (
        referralData.map((referral) => {
          return (
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              key={referral.id}
              className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {referral.givenByName || "N/A"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    For: {referral.refer_name || "N/A"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-300">
                  {referral.chapter}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                  Referral
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-300">
                  {formatDate(referral.date)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-lg text-sm ${getStatusClass(
                    referral.status
                  )}`}
                >
                  {referral.status.charAt(0).toUpperCase() +
                    referral.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  {referral.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleReferralVerification(referral.id, "verify")
                        }
                        className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm transition-all duration-300 flex items-center gap-1"
                      >
                        <Check size={16} />
                        Verify
                      </button>
                      <button
                        onClick={() =>
                          handleReferralVerification(referral.id, "reject")
                        }
                        className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm transition-all duration-300 flex items-center gap-1"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => navigate(`/view-ref-given/${referral.id}`)}
                    className="px-3 py-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg text-sm transition-all duration-300"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </td>
            </motion.tr>
          );
        })
      );
    } else if (selectedType === "business") {
      return businessData.length === 0 ? (
        <tr>
          <td colSpan={6} className="text-center py-8 text-gray-400">
            No business data found ({loading ? "Loading..." : "Empty data"})
          </td>
        </tr>
      ) : (
        businessData.map((business) => (
          <motion.tr
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            key={business.id}
            className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
          >
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {business.givenByName}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Amount: ₹{business.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-300">{business.chapter}</span>
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                Business
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-300">
                {formatDate(business.date)}
              </span>
            </td>
            <td className="px-6 py-4">
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: business.status === "pending" ? 1 : [1, 1.1, 1] }}
                className={`px-2.5 py-1 rounded-lg text-sm ${getStatusClass(
                  business.status
                )}`}
              >
                {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
              </motion.span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-center gap-2">
                {business.status === "pending" && (
                  <motion.div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleBusinessVerification(business.id, "verify")
                      }
                      className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm transition-all duration-300 flex items-center gap-1"
                    >
                      <Check size={16} />
                      Verify
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleBusinessVerification(business.id, "reject")
                      }
                      className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm transition-all duration-300 flex items-center gap-1"
                    >
                      <X size={16} />
                      Reject
                    </motion.button>
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/view-business/${business.id}`)}
                  className="px-3 py-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg text-sm transition-all duration-300"
                >
                  <Eye size={16} />
                </motion.button>
              </div>
            </td>
          </motion.tr>
        ))
      );
    } else {
      // Return existing BDM table content
      return requests_data.length === 0 ? (
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
                      onClick={() => handleVerification(request.id, "verify")}
                      className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm transition-all duration-300 flex items-center gap-1"
                    >
                      <Check size={16} />
                      Verify
                    </button>
                    <button
                      onClick={() => handleVerification(request.id, "reject")}
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
      );
    }
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
                {stats.business.total || 0}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <IndianRupee className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">
                {stats.business.verified || 0} Verified
              </span>
            </div>
            <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
              <span className="text-sm text-amber-500">
                {stats.business.pending || 0} Pending
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.business.rejected || 0} Rejected
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
                {stats.referral.total || 0}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">
                {stats.referral.verified || 0} Verified
              </span>
            </div>
            <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
              <span className="text-sm text-amber-500">
                {stats.referral.pending || 0} Pending
              </span>
            </div>
            <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
              <span className="text-sm text-red-500">
                {stats.referral.rejected || 0} Rejected
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
                {renderTableContent()}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemberReqReceived;

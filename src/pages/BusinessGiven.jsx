import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { BsClipboardData } from "react-icons/bs";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import DeleteModal from "../layout/DeleteModal";
import api from "../hooks/api";
import { format } from "date-fns";
import {
  Search,
  Bell,
  Building2,
  ListFilter,
  ChevronDown,
  Plus,
} from "lucide-react";

// Update table headers to match business data
const tableHeaders = [
  "SR No.",
  "Member Name",
  "Chapter",
  "Amount",
  "Status",
  "Business Date",
  "Actions",
];

// Add status options constant
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

const BusinessGiven = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [chapters, setChapters] = useState([]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/business`);
      let filteredData = response.data;

      // Apply search filter
      if (search) {
        filteredData = filteredData.filter((business) =>
          business.memberName.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filteredData = filteredData.filter(
          (business) => business.status === statusFilter
        );
      }

      // Apply chapter filter
      if (chapterFilter !== "all") {
        filteredData = filteredData.filter(
          (business) => business.chapter === chapterFilter
        );
      }

      // Calculate pagination
      const totalItems = filteredData.length;
      const calculatedTotalPages = Math.ceil(totalItems / resultsPerPage);
      setTotalPages(calculatedTotalPages);

      // Apply pagination
      const startIndex = (currentPage - 1) * resultsPerPage;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + resultsPerPage
      );

      setBusinesses(paginatedData);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chapters for filter
  const fetchChapters = async () => {
    try {
      const response = await api.get(`/chapters`);
      setChapters(response.data.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  // Add filter handlers
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleChapterFilter = (e) => {
    setChapterFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [search, statusFilter, chapterFilter, currentPage, resultsPerPage]);

  const handleView = (id) => {
    navigate(`/view-business/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/add-business/${id}`);
  };

  const handleDelete = (id) => {
    setBusinessToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/business/${businessToDelete}`);

      fetchBusinesses();
      setIsDeleteModalOpen(false);
      setBusinessToDelete(null);
    } catch (error) {
      console.error("Error deleting business:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="mt-32 p-1 lg:p-6 flex flex-col space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <BsClipboardData className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Business Given List
            </h2>
            <p className="text-sm text-gray-400">
              View and manage business given
            </p>
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

      {/* Update Search and Filters Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {/* Search Bar */}
          <div className="w-full lg:max-w-[350px]">
            <div className="relative h-[56px]">
              <input
                type="text"
                placeholder="Search by member name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full bg-gray-800 text-gray-300 pl-12 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Filters Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div className="relative h-[56px]">
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full h-full bg-gray-800 text-gray-300 pl-12 pr-10 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400 appearance-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Chapter Filter */}
            <div className="relative h-[56px]">
              <select
                value={chapterFilter}
                onChange={handleChapterFilter}
                className="w-full h-full bg-gray-800 text-gray-300 pl-12 pr-10 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400 appearance-none"
              >
                <option value="all">All Chapters</option>
                {chapters.map((chapter) => (
                  <option key={chapter.chapter_id} value={chapter.chapter_name}>
                    {chapter.chapter_name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building2 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Results per page dropdown */}
            <div className="relative h-[56px]">
              <select
                value={resultsPerPage}
                onChange={(e) => setResultsPerPage(Number(e.target.value))}
                className="w-full h-full bg-gray-800 text-gray-300 pl-12 pr-10 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400 appearance-none"
              >
                {[10, 25, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value} per page
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ListFilter className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 sm:order-2 sm:ml-auto">
          <Link
            to="/add-business"
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white/90 hover:text-white rounded-lg flex items-center justify-center gap-2 h-[56px] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Business</span>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl"
      >
        {/* Dynamic height container with max-height limit */}
        <div className="relative min-h-[300px] max-h-[calc(100vh-500px)]">
          {/* Subtle gradient overlay - Updated to amber */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />

          {/* Table container with custom scrollbar - Updated to amber */}
          <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80">
            <table className="w-full">
              {/* Enhanced Header */}
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-gray-800/95 via-gray-800/98 to-gray-800/95 backdrop-blur-xl">
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-4 text-left border-b border-gray-700 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      <div className="flex items-center gap-2 group">
                        <span className="text-sm font-semibold text-gray-300 group-hover:text-amber-500 transition-colors">
                          {header}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Enhanced Table Body */}
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg
                          className="w-12 h-12 text-gray-500 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <div className="text-gray-400 text-sm">
                          Loading businesses...
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : businesses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
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
                          {search
                            ? "No businesses found matching your search"
                            : "No businesses have been added yet"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  businesses.map((business, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={business.business_id}
                      className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                    >
                      <td className="px-6 py-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/50 text-amber-500 font-medium">
                          {(currentPage - 1) * resultsPerPage + index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {business.memberName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-amber-500">
                          {business.chapter}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">
                          {formatAmount(business.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            business.status === "verified"
                              ? "bg-green-500/10 text-green-500"
                              : business.status === "rejected"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {business.status.charAt(0).toUpperCase() +
                            business.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {formatDate(business.businessDate)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(business.business_id)}
                            className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600/90 to-amber-800/90 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-amber-900/30"
                          >
                            <div className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                            <FiEye className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative" />
                          </button>
                          {business.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleEdit(business.business_id)}
                                className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-green-600/90 to-green-800/90 hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-green-900/30"
                              >
                                <div className="absolute inset-0 rounded-xl bg-green-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                                <FiEdit className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(business.business_id)
                                }
                                className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-red-600/90 to-red-800/90 hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-900/30"
                              >
                                <div className="absolute inset-0 rounded-xl bg-red-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                                <FiTrash2 className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative" />
                              </button>
                            </>
                          )}
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

      {/* Pagination Section */}
      {!loading && businesses.length > 0 && (
        <div className="flex items-center justify-center gap-3 py-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              currentPage === 1
                ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                : "bg-gray-700 text-white"
            }`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 rounded-xl shadow-lg">
            <input
              type="number"
              value={currentPage}
              min={1}
              max={totalPages}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= totalPages) {
                  setCurrentPage(value);
                }
              }}
              className="w-12 text-center bg-transparent border-none focus:outline-none text-white text-lg font-medium"
            />
            <span className="text-gray-400 text-lg font-medium">/</span>
            <span className="text-gray-400 text-lg font-medium">
              {totalPages}
            </span>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              currentPage === totalPages
                ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                : "bg-gray-700 text-white"
            }`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBusinessToDelete(null);
        }}
        onDelete={confirmDelete}
        itemName="Business Entry"
      />
    </div>
  );
};

export default BusinessGiven;

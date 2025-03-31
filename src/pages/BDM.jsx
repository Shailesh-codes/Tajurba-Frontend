import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsClipboardData, BsPlus } from "react-icons/bs";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import DeleteModal from "../layout/DeleteModal";
import axios from "axios";
import api from "../hooks/api";
import { format } from "date-fns";

// Add this dummy data array
const dummyBDMs = [
  {
    id: 1,
    memberName: "John Doe",
    chapter: "Chapter A",
    status: "verified",
    bdmDate: "2024-03-15",
    createdDate: "2024-03-10",
  },
  {
    id: 2,
    memberName: "Jane Smith",
    chapter: "Chapter B",
    status: "pending",
    bdmDate: "2024-03-16",
    createdDate: "2024-03-11",
  },
  {
    id: 3,
    memberName: "Mike Johnson",
    chapter: "Chapter C",
    status: "rejected",
    bdmDate: "2024-03-17",
    createdDate: "2024-03-12",
  },
  {
    id: 4,
    memberName: "Sarah Williams",
    chapter: "Chapter A",
    status: "pending",
    bdmDate: "2024-03-18",
    createdDate: "2024-03-13",
  },
  {
    id: 5,
    memberName: "Robert Brown",
    chapter: "Chapter B",
    status: "verified",
    bdmDate: "2024-03-19",
    createdDate: "2024-03-14",
  },
];

// Add these constants for table headers
const tableHeaders = [
  "SR No.",
  "Member Name",
  "Chapter",
  "Status",
  "BDM Date",
  "Created Date",
  "Actions",
];

const BDM = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bdms, setBdms] = useState(dummyBDMs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBdmId, setSelectedBDMId] = useState(null);
  const [chapters, setChapters] = useState([]);

  // Options for results per page dropdown
  const resultsPerPageOptions = [10, 25, 50, 100];

  // Fetch BDMs
  const fetchBDMs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/bdm`);
      let filteredBdms = response.data;

      // Apply search filter
      if (search) {
        filteredBdms = filteredBdms.filter(bdm => 
          bdm.memberName.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filteredBdms = filteredBdms.filter(bdm => 
          bdm.status === statusFilter
        );
      }

      // Apply chapter filter
      if (chapterFilter !== 'all') {
        filteredBdms = filteredBdms.filter(bdm => 
          bdm.chapter === chapterFilter
        );
      }

      // Calculate pagination
      const totalItems = filteredBdms.length;
      const calculatedTotalPages = Math.ceil(totalItems / resultsPerPage);
      setTotalPages(calculatedTotalPages);

      // Apply pagination
      const startIndex = (currentPage - 1) * resultsPerPage;
      const paginatedBdms = filteredBdms.slice(startIndex, startIndex + resultsPerPage);

      setBdms(paginatedBdms);
    } catch (error) {
      console.error("Error fetching BDMs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chapters for filter
  const fetchChapters = async () => {
    try {
      const response = await axios.get(`${api}/chapters`);
      setChapters(response.data.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  // Handle results per page change
  const handleResultsPerPageChange = (e) => {
    const newResultsPerPage = parseInt(e.target.value);
    setResultsPerPage(newResultsPerPage);
    setCurrentPage(1); // Reset to first page when changing results per page
  };

  // Add this component for the results per page dropdown
  const ResultsPerPageDropdown = () => (
    <div className="relative h-[56px] w-full sm:w-auto">
      <select
        id="results-per-page"
        value={resultsPerPage}
        onChange={handleResultsPerPageChange}
        className="w-full sm:w-[120px] h-full bg-gray-800 text-gray-300 pl-12 pr-10 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400 select-reset appearance-none"
      >
        {resultsPerPageOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 left-0 pl-[18px] flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 9L12 16L5 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );

  // Update the handleView function in BDM.jsx
  const handleView = (id) => {
    navigate(`/view-bdm/${id}`);
  };

  // Dummy handlers for actions
  const handleEdit = (id) => {
    console.log("Editing BDM:", id);
  };

  const handleDelete = (id) => {
    setSelectedBDMId(id);
    setShowDeleteModal(true);
  };

  // Delete BDM
  const confirmDelete = async () => {
    if (selectedBdmId) {
      try {
        await axios.delete(`${API_URL}/${selectedBdmId}`);
        toast.success("BDM deleted successfully");
        fetchBDMs(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete BDM");
        console.error("Error deleting BDM:", error);
      }
      setShowDeleteModal(false);
      setSelectedBDMId(null);
    }
  };

  // Update the search input handler
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Update the status filter handler
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Update the chapter filter handler
  const handleChapterFilter = (e) => {
    setChapterFilter(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  useEffect(() => {
    fetchBDMs();
  }, [search, statusFilter, chapterFilter, currentPage, resultsPerPage]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="mt-32 p-1 flex flex-col space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <BsClipboardData className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">BDM List</h2>
            <p className="text-sm text-gray-400">View and manage BDMs</p>
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

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {/* Search Bar */}
          <div className="w-full lg:max-w-[350px]">
            <div className="h-[56px] w-full bg-gray-800 rounded-lg px-[18px]">
              <div className="flex w-full h-full items-center space-x-[15px]">
                <span>
                  <svg
                    className="stroke-white"
                    width="21"
                    height="22"
                    viewBox="0 0 21 22"
                    fill="none"
                  >
                    <circle
                      cx="9.80204"
                      cy="10.6761"
                      r="8.98856"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.0537 17.3945L19.5777 20.9094"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by member name..."
                  className="w-full bg-gray-800 text-white border-none px-0 focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400"
                />
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
                className="w-full h-full bg-gray-800 text-gray-300 pl-12 pr-10 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400 select-reset"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Chapter Filter */}
            <div className="relative h-[56px]">
              <select
                value={chapterFilter}
                onChange={handleChapterFilter}
                className="w-full h-full bg-gray-800 text-gray-300 pl-12 pr-10 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400 select-reset"
              >
                <option value="all">All Chapters</option>
                {chapters.map((chapter) => (
                  <option key={chapter.chapter_id} value={chapter.chapter_name}>
                    {chapter.chapter_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Per Page */}
            <div className="relative h-[56px]">
              <select
                value={resultsPerPage}
                onChange={handleResultsPerPageChange}
                className="w-full h-full bg-gray-800 text-gray-300 pl-12 pr-10 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400 select-reset"
              >
                {resultsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-[18px] flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Add New BDM Button */}
        <div className="w-full lg:w-auto">
          <Link to="/add-bdm">
            <button className="w-full lg:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold hover:shadow-amber-900/30  hover:text-white rounded-lg flex items-center justify-center gap-2 h-[56px] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4V16M4 10H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="whitespace-nowrap">Add New BDM</span>
            </button>
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
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />

          {/* Table container with custom scrollbar */}
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
                    <td colSpan={7} className="px-6 py-8 text-center">
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
                          Loading BDMs...
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : bdms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
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
                            ? "No BDMs found matching your search"
                            : "No BDMs have been added yet"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bdms.map((bdm, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={bdm.id}
                      className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                    >
                      <td className="px-6 py-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/50 text-amber-500 font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {bdm.memberName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-amber-500">
                          {bdm.chapter}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            bdm.status === "verified"
                              ? "bg-green-500/10 text-green-500"
                              : bdm.status === "rejected"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {bdm.status.charAt(0).toUpperCase() +
                            bdm.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {formatDate(bdm.bdmDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {formatDate(bdm.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(bdm.id)}
                            className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600/90 to-amber-800/90 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-amber-900/30"
                          >
                            <div className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                            <Eye className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative" />
                          </button>
                          {bdm.status === "pending" && (
                            <>
                              <button
                                onClick={() => navigate(`/edit-bdm/${bdm.id}`)}
                                className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-green-600/90 to-green-800/90 hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-amber-900/30"
                              >
                                <div className="absolute inset-0 rounded-xl bg-green-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                                <Edit className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative" />
                              </button>
                              <button
                                onClick={() => handleDelete(bdm.id)}
                                className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-red-600/90 to-red-800/90 hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-900/30"
                              >
                                <div className="absolute inset-0 rounded-xl bg-red-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                                <Trash2 className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative" />
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
      {!loading && bdms.length > 0 && (
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
            <ChevronLeft className="w-5 h-5" />
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
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        itemName="BDM"
      />
    </div>
  );
};

export default BDM;

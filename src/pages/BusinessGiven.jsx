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

// Dummy data for testing
const dummyBusinessData = [
  {
    id: 1,
    memberName: "John Doe",
    chapter: "Chapter A",
    amount: 50000,
    status: "verified",
    businessDate: "2024-03-15",
    createdDate: "2024-03-10",
  },
  {
    id: 2,
    memberName: "Jane Smith",
    chapter: "Chapter B",
    amount: 75000,
    status: "pending",
    businessDate: "2024-03-16",
    createdDate: "2024-03-11",
  },
  {
    id: 3,
    memberName: "Mike Johnson",
    chapter: "Chapter C",
    amount: 100000,
    status: "rejected",
    businessDate: "2024-03-17",
    createdDate: "2024-03-12",
  },
  {
    id: 4,
    memberName: "Sarah Williams",
    chapter: "Chapter A",
    amount: 25000,
    status: "pending",
    businessDate: "2024-03-18",
    createdDate: "2024-03-13",
  },
  {
    id: 5,
    memberName: "Robert Brown",
    chapter: "Chapter B",
    amount: 150000,
    status: "verified",
    businessDate: "2024-03-19",
    createdDate: "2024-03-14",
  },
];

// Add these constants for table headers
const tableHeaders = [
  "SR No.",
  "Member Name",
  "Chapter",
  "Amount",
  "Status",
  "Business Date",
  "Actions",
];

const BusinessGiven = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businessData, setBusinessData] = useState(dummyBusinessData);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);

  useEffect(() => {
    // Simulating data fetch
    setLoading(true);
    setTimeout(() => {
      setBusinessData(dummyBusinessData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const total = Math.ceil(businessData.length / resultsPerPage);
    setTotalPages(total);
  }, [businessData, resultsPerPage]);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return businessData.slice(startIndex, endIndex);
  };

  const handleView = (id) => {
    navigate(`/view-business/${id}`);
  };

  const handleEdit = (id) => {
    // Find the business data for the selected ID
    const businessToEdit = businessData.find((business) => business.id === id);
    // Navigate to add-business with state containing the business data
    navigate("/add-business", { state: { businessToEdit } });
  };

  const handleDelete = (id) => {
    setBusinessToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const updatedBusinessData = businessData.filter(
      (business) => business.id !== businessToDelete
    );
    setBusinessData(updatedBusinessData);
    setIsDeleteModalOpen(false);
    setBusinessToDelete(null);

    // You would typically make an API call here
    // Example:
    // try {
    //   await axios.delete(`/api/business/${businessToDelete}`);
    //   setBusinessData(updatedBusinessData);
    // } catch (error) {
    //   console.error('Error deleting business:', error);
    // }
  };

  return (
    <div className="mt-32 flex flex-col space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3  bg-gradient-to-r from-amber-500 to-amber-800 rounded-xl">
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

      {/* Search and Add New Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-auto order-2 sm:order-1">
          <div className="relative h-[56px]">
            <input
              type="text"
              placeholder="Search by member name or chapter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-[400px] lg:w-[500px] h-full bg-gray-800 text-gray-300 pl-12 rounded-lg border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 19L14.65 14.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="order-1 sm:order-2 sm:ml-auto">
          <Link
            to="/add-business"
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white/90 hover:text-white rounded-lg flex items-center justify-center gap-2 h-[56px] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
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
                        {header !== "Actions" && (
                          <svg
                            className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16V4m0 0L3 8m4-4l4 4m-4 4v8m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        )}
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
                          Loading business entries...
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : getPaginatedData().length === 0 ? (
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
                            ? "No business entries found matching your search"
                            : "No business entries have been added yet"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  getPaginatedData().map((business, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={business.id}
                      className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                    >
                      <td className="px-6 py-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/50 text-amber-500 font-medium">
                          {index + 1}
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
                          ₹{business.amount.toLocaleString()}
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
                          {business.businessDate}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(business.id)}
                            className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600/90 to-amber-800/90 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-amber-900/30"
                          >
                            <div className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                            <FiEye className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative" />
                          </button>
                          {business.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleEdit(business.id)}
                                className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-green-600/90 to-green-800/90 hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-green-900/30"
                              >
                                <div className="absolute inset-0 rounded-xl bg-green-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                                <FiEdit className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative" />
                              </button>
                              <button
                                onClick={() => handleDelete(business.id)}
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
      {!loading && getPaginatedData().length > 0 && (
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

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
import api from "../hooks/api";
import DeleteModal from "../layout/DeleteModal";
import { useAuth } from "../contexts/AuthContext";

// Table headers
const tableHeaders = [
  "SR No.",
  "Given By",
  "Chapter",
  "Amount",
  "Business Date",
  "Actions",
];

const BusinessReceived = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businessData, setBusinessData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const { auth } = useAuth();

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/business-received`);

      if (response.data) {
        let filteredData = response.data;

        // Apply search filter
        if (search) {
          filteredData = filteredData.filter(
            (business) =>
              business.GivenByMember?.name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              business.memberName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              business.chapter?.toLowerCase().includes(search.toLowerCase())
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

        setBusinessData(paginatedData);
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const handleView = (id) => {
    navigate(`/view-res-business/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/add-res-business/${id}`);
  };

  const handleDelete = (id) => {
    setBusinessToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!businessToDelete) return;

    try {
      setLoading(true);
      await api.delete(`/business-received/${businessToDelete}`);
      await fetchBusinessData(); // Refresh the data
      setIsDeleteModalOpen(false);
      setBusinessToDelete(null);
    } catch (error) {
      console.error("Error deleting business:", error);
      alert("Failed to delete business entry");
    } finally {
      setLoading(false);
    }
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return businessData.slice(startIndex, endIndex);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mt-32 flex flex-col space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <BsClipboardData className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Business Received List
            </h2>
            <p className="text-sm text-gray-400">
              View and manage received business
            </p>
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
          </div>
        </div>

        <div className="order-1 sm:order-2 sm:ml-auto">
          <Link
            to="/add-res-business"
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
            <span>Add Business Received</span>
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
        <div className="relative min-h-[300px] max-h-[calc(100vh-500px)]">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />

          <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80">
            <table className="w-full">
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

              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
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
                    <td colSpan={6} className="px-6 py-8 text-center">
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
                          {business.GivenByMember?.name || business.memberName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-amber-500">
                          {business.chapter}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">
                          ₹{parseFloat(business.amount).toLocaleString()}
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
                            <FiEye className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative z-10" />
                          </button>
                          <button
                            onClick={() => handleEdit(business.business_id)}
                            className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-green-600/90 to-green-800/90 hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-green-900/30"
                          >
                            <div className="absolute inset-0 rounded-xl bg-green-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                            <FiEdit className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative z-10" />
                          </button>
                          <button
                            onClick={() => handleDelete(business.business_id)}
                            className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-red-600/90 to-red-800/90 hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-900/30"
                          >
                            <div className="absolute inset-0 rounded-xl bg-red-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                            <FiTrash2 className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative z-10" />
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

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-amber-500 disabled:opacity-50 disabled:hover:text-gray-400"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <span className="flex items-center px-4 py-2 rounded-lg bg-gray-800 text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-amber-500 disabled:opacity-50 disabled:hover:text-gray-400"
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

export default BusinessReceived;

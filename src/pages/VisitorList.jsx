import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import VisitorIcon from "../assets/images/icons/users.svg";
import { Download, Eye } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import api from "../hooks/api";

const VisitorList = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    total: 0,
  });
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = [
    "Sr No",
    "Invited By",
    "Chapter",
    "Visitor Name",
    "Company",
    "Category",
    "Mobile",
    "Email",
    "Invite Date",
    "Actions",
  ];

  // Fetch visitors data
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api}/visitors`, {
          params: {
            page: pagination.currentPage,
            limit: pagination.limit,
            search: searchTerm,
          },
        });

        if (response.data.success) {
        const { data, pagination: paginationData } = response.data;
        setVisitors(data);
        setFilteredVisitors(data);
          setPagination(prev => ({
          ...prev,
            total: paginationData.total || 0,
            totalPages: paginationData.pages || 1
        }));
        }
        
      } catch (error) {
        console.error("Error fetching visitors:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch visitors",
          text: "There was an error loading the visitor data.",
          background: "#1F2937",
          color: "#fff",
          confirmButtonColor: "#F59E0B",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, [pagination.currentPage, pagination.limit, searchTerm]);

  // Filter visitors based on search and chapter
  useEffect(() => {
    if (visitors.length > 0) {
      const filtered = visitors.filter((visitor) => {
        const matchesSearch =
          searchTerm === ""
            ? true
            : Object.values(visitor)
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesChapter =
          selectedChapter === "all"
            ? true
            : visitor.chapter_name === selectedChapter;

        return matchesSearch && matchesChapter;
      });

      setFilteredVisitors(filtered);
    }
  }, [visitors, searchTerm, selectedChapter]);

  const exportToCSV = () => {
    try {
      // Convert data to CSV format
      const csvContent = [
        // Headers
        headers.slice(0, -1).join(","), // Exclude "Actions" column
        // Data rows
        ...filteredVisitors.map((visitor) =>
          [
            visitor.sr_no,
            visitor.invited_by_name,
            visitor.chapter_name,
            visitor.visitor_name,
            visitor.company_name,
            visitor.company_category,
            visitor.mobile,
            visitor.visitor_email,
            visitor.invite_date,
          ].join(",")
        ),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `visitors_list_${new Date().toLocaleDateString()}.csv`);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Export Successful",
        text: "The CSV file has been downloaded successfully!",
        background: "#1F2937",
        color: "#fff",
        confirmButtonColor: "#F59E0B",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "There was an error exporting the data. Please try again.",
        background: "#1F2937",
        color: "#fff",
        confirmButtonColor: "#F59E0B",
      });
    }
  };

  const exportToExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = filteredVisitors.map((visitor) => ({
        "Sr No": visitor.sr_no,
        "Invited By": visitor.invited_by_name,
        Chapter: visitor.chapter_name,
        "Visitor Name": visitor.visitor_name,
        Company: visitor.company_name,
        Category: visitor.company_category,
        Mobile: visitor.mobile,
        Email: visitor.visitor_email,
        Date: visitor.invite_date,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Visitors");

      // Save file
      XLSX.writeFile(
        wb,
        `visitors_list_${new Date().toLocaleDateString()}.xlsx`
      );

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Export Successful",
        text: "The Excel file has been downloaded successfully!",
        background: "#1F2937",
        color: "#fff",
        confirmButtonColor: "#F59E0B",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "There was an error exporting the data. Please try again.",
        background: "#1F2937",
        color: "#fff",
        confirmButtonColor: "#F59E0B",
      });
    }
  };

  const downloadVisitorPDF = useCallback(
    async (visitor) => {
      if (!visitor || downloadingId) return;

      try {
        setDownloadingId(visitor.id);
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.setTextColor(44, 62, 80);
        doc.text("Visitor Information", 15, 15);

        // Add metadata
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 25);

        // Prepare table data
        const tableData = [
          ["Name", visitor.visitor_name || "N/A"],
          ["Email", visitor.visitor_email || "N/A"],
          ["Mobile", visitor.mobile || "N/A"],
          ["Purpose", visitor.purpose || "N/A"],
          [
            "Visit Date",
            visitor.visitDate
              ? new Date(visitor.visitDate).toLocaleDateString()
              : "N/A",
          ],

          ["Company", visitor.company_name || "N/A"],
        ];

        // Generate table
        autoTable(doc, {
          startY: 35,
          head: [["Field", "Information"]],
          body: tableData,
          theme: "grid",
          styles: {
            fontSize: 10,
            cellPadding: 5,
          },
          headStyles: {
            fillColor: [211, 184, 106],
            textColor: [0, 0, 0],
            fontSize: 12,
            fontStyle: "bold",
          },
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40 },
            1: { cellWidth: "auto" },
          },
        });

        // Save PDF
        doc.save(
          `visitor-${
            visitor.visitor_name?.toLowerCase().replace(/\s+/g, "-") || "info"
          }.pdf`
        );
      } catch (error) {
        console.error("Error generating PDF:", error);
        Swal.fire({
          icon: "error",
          title: "PDF Generation Error",
          text: "Failed to generate PDF. Please try again later.",
          background: "#1F2937",
          color: "#fff",
          confirmButtonColor: "#F59E0B",
        });
      } finally {
        setDownloadingId(null);
      }
    },
    [downloadingId]
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  return (
    <div className="mt-32 min-h-screen bg-gray-900 p-1 lg:p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 via-gray-700/25 to-gray-800/50 blur-3xl" />
          <div className="relative bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl border border-amber-500/20 shadow-lg">
                  <img src={VisitorIcon} alt="visitor" className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-clip-text bg-gradient-to-r text-white">
                    Visitor List
                  </h1>
                  <p className="text-gray-400 mt-1">
                    View all visitors invited by members
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={exportToCSV}
                  className="relative group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/10 to-green-700/10 text-green-500 font-medium border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-green-700 rounded-xl opacity-0 group-hover/btn:opacity-20 blur transition-opacity" />
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
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export CSV
                </button>

                <button
                  onClick={exportToExcel}
                  className="relative group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-700/10 text-blue-500 font-medium border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl opacity-0 group-hover/btn:opacity-20 blur transition-opacity" />
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="bg-gray-800/40 backdrop-blur-xl text-gray-100 p-2.5 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
          >
            <option value="all">All Chapters</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.name}>
                {chapter.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search visitors..."
              className="w-full bg-gray-800/40 backdrop-blur-xl text-gray-100 pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl"
        >
          <div className="relative min-h-[300px] max-h-[calc(100vh-500px)]">
            {loading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
              </div>
            ) : (
              <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gradient-to-r from-gray-800/95 via-gray-800/98 to-gray-800/95 backdrop-blur-xl">
                      {headers.map((header, index) => (
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

                  <tbody className="divide-y divide-gray-700/50">
                    {filteredVisitors.length > 0 ? (
                      filteredVisitors.map((visitor, index) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          key={visitor.invite_id || index}
                          className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                        >
                          <td className="px-6 py-4 text-sm">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/50 text-amber-500 font-medium">
                              {(pagination.currentPage - 1) * pagination.limit + index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-amber-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                {visitor.invited_by_name || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-amber-500">
                              {visitor.chapter_name || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-300">
                              {visitor.visitor_name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="text-sm text-gray-300">
                                {visitor.company_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-400">
                              {visitor.company_category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-400 font-mono">
                              {visitor.mobile}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-400">
                              {visitor.visitor_email}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-400">
                              {new Date(visitor.invite_date).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => downloadVisitorPDF(visitor)}
                                disabled={downloadingId === visitor.invite_id}
                                className={`relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600/90 to-blue-800/90 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-900/30 ${
                                  downloadingId === visitor.invite_id ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                              >
                                <div className="absolute inset-0 rounded-xl bg-blue-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                                {downloadingId === visitor.invite_id ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                  <Download className="w-5 h-5 text-white/90 group-hover/btn:text-white transition-colors relative z-10" />
                                )}
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="px-6 py-8 text-center">
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
                              No visitors found matching your search criteria
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pagination Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2"
        >
          {/* Results per page selector */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <label htmlFor="resultsPerPage">Show:</label>
              <select
                id="resultsPerPage"
                value={pagination.limit}
                onChange={(e) =>
                  setPagination({
                    ...pagination,
                    limit: Number(e.target.value),
                  })
                }
                className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-6 py-1.5 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
              >
                {[10, 25, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              Showing{" "}
              <span className="font-medium text-amber-500">
                {(pagination.currentPage - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-amber-500">
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.total
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-amber-500">
                {pagination.total}
              </span>{" "}
              results
            </div>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <PaginationButton
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              }
            />
            <PaginationButton
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              }
            />

            <div className="px-4 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300">
              {pagination.currentPage} / {pagination.totalPages}
            </div>

            <PaginationButton
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              }
            />
            <PaginationButton
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5l7 7-7 7m-8-14l7 7-7 7"
                />
              }
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Header Cell Component
const HeaderCell = ({ label, sortKey }) => {
  return (
    <th className="p-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-amber-500 transition-colors duration-200">
      <div className="flex items-center gap-2">
        {label}
        <svg
          className="w-4 h-4"
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
      </div>
    </th>
  );
};

// Pagination Button Component
const PaginationButton = ({ onClick, disabled, icon }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center w-9 h-9 rounded-lg border ${
        disabled
          ? "bg-gray-800/40 border-gray-700 text-gray-600 cursor-not-allowed"
          : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-amber-500"
      } transition-all duration-200`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {icon}
      </svg>
    </button>
  );
};

export default VisitorList;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import chaptersIcon from "../assets/images/icons/list.svg";
import { motion } from "framer-motion";

const ChaptersList = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editChapter, setEditChapter] = useState({ id: "", name: "" });
  const [newChapterName, setNewChapterName] = useState("");

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      const response = await axios.get("/api/chapters");
      if (response.data.status === "success") {
        const sortedChapters = response.data.data.sort((a, b) =>
          a.chapter_name.localeCompare(b.chapter_name)
        );
        setChapters(sortedChapters);
      }
    } catch (error) {
      console.error("Error loading chapters:", error);
      showAlert("error", "Failed to load chapters");
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/chapters", {
        action: "add",
        chapter_name: newChapterName,
      });

      if (response.data.status === "success") {
        showAlert("success", "Chapter added successfully");
        loadChapters();
        setShowAddModal(false);
        setNewChapterName("");
      }
    } catch (error) {
      console.error("Error adding chapter:", error);
      showAlert("error", "Failed to add chapter");
    }
  };

  const handleEditChapter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/chapters", {
        action: "update",
        chapter_id: editChapter.id,
        chapter_name: editChapter.name,
      });

      if (response.data.status === "success") {
        showAlert("success", "Chapter updated successfully");
        loadChapters();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error updating chapter:", error);
      showAlert("error", "Failed to update chapter");
    }
  };

  const showAlert = (icon, text) => {
    Swal.fire({
      background: "#111827",
      color: "#fff",
      icon,
      text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: "bg-gray-900 border-gray-700 rounded-2xl border",
      },
    });
  };

  const filteredChapters = chapters.filter((chapter) =>
    chapter.chapter_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-32 p-1 lg:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={chaptersIcon} alt="Chapters" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">Chapters List</h1>
            <h2 className="text-sm text-gray-400">View and manage chapters</h2>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700"
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

      {/* Main Content Card */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        {/* Search and Add Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="w-full sm:w-[500px] order-2 sm:order-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by chapter name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-11 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white placeholder-gray-400"
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
            </div>
          </div>

          <div className="order-1 sm:order-2 sm:ml-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white/90 hover:text-white rounded-xl flex items-center justify-center gap-2 h-[48px] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Chapter
            </button>
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
            <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80 scrollbar-hide">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-gray-800/95 via-gray-800/98 to-gray-800/95 backdrop-blur-xl">
                    <th className="px-6 py-4 text-left border-b border-gray-700">
                      <span className="text-sm font-semibold text-gray-300">
                        SR No.
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left border-b border-gray-700">
                      <span className="text-sm font-semibold text-gray-300">
                        Chapter Name
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left border-b border-gray-700">
                      <span className="text-sm font-semibold text-gray-300">
                        Created Date
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left border-b border-gray-700">
                      <span className="text-sm font-semibold text-gray-300">
                        Updated Date
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left border-b border-gray-700">
                      <span className="text-sm font-semibold text-gray-300">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredChapters.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        {searchTerm
                          ? "No chapters found matching your search"
                          : "No chapters have been added yet"}
                      </td>
                    </tr>
                  ) : (
                    filteredChapters.map((chapter, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={chapter.chapter_id}
                        className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                      >
                        <td className="px-6 py-4">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/50 text-amber-500 font-medium">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            {chapter.chapter_name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300">
                            {chapter.created_at}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">
                            {chapter.updated_at || "--"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                setEditChapter({
                                  id: chapter.chapter_id,
                                  name: chapter.chapter_name,
                                });
                                setShowEditModal(true);
                              }}
                              className="relative group/btn flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600/90 to-amber-800/90 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-amber-900/30"
                            >
                              <div className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover/btn:opacity-20 blur-lg transition-opacity" />
                              <svg
                                className="w-4 h-4 text-white/90 group-hover/btn:text-white transition-colors relative z-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
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

      {/* Add Chapter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          ></div>
          <div className="relative z-50 bg-gray-800/95 p-6 rounded-2xl border border-gray-700 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Chapter</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddChapter}>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Chapter Name <span className="text-red-500 text-lg">*</span>
                </label>
                <input
                  type="text"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white placeholder-gray-400"
                  placeholder="Enter chapter name"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-gray-700 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Add Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Chapter Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          ></div>
          <div className="relative z-50 bg-gray-800/95 p-6 rounded-2xl border border-gray-700 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit Chapter</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditChapter}>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Chapter Name <span className="text-red-500 text-lg">*</span>
                </label>
                <input
                  type="text"
                  value={editChapter.name}
                  onChange={(e) =>
                    setEditChapter({ ...editChapter, name: e.target.value })
                  }
                  required
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white placeholder-gray-400"
                  placeholder="Enter chapter name"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 border border-gray-700 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Update Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChaptersList;

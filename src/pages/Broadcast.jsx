import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import broadcastIcon from "../assets/images/icons/broadcast-icon.svg";
import { useNavigate } from "react-router-dom";
import api from "../hooks/api";
import DeleteModal from "../layout/DeleteModal";

const Broadcast = () => {
  const [chapters, setChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterChapter, setFilterChapter] = useState("");
  const [formData, setFormData] = useState({
    announcementSlot: "",
    announcementText: "",
    duration: "",
    startDate: "",
    endDate: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [broadcastToDelete, setBroadcastToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.get(`/chapters`);
        if (response.data.status === "success") {
          setChapters(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };
    fetchChapters();
  }, []);

  const handleChapterSelection = (chapterName) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterName)
        ? prev.filter((name) => name !== chapterName)
        : [...prev, chapterName]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // For each selected chapter, create a broadcast
      for (const chapterName of selectedChapters) {
        const payload = {
          chapterName,
          announcementSlot: parseInt(formData.announcementSlot),
          announcementText: formData.announcementText,
          startDate: formData.startDate || new Date(),
          duration: formData.duration,
          endDate: formData.duration === "custom" ? formData.endDate : null,
        };

        console.log("Sending payload:", payload);

        const response = await api.post(`/broadcasts`, payload);

        if (response.data.success) {
          showSuccess("Broadcast created successfully");
          setShowForm(false);
          // Reset form data
          setFormData({
            announcementSlot: "",
            announcementText: "",
            duration: "",
            startDate: "",
            endDate: "",
          });
          setSelectedChapters([]);
          // Refresh broadcasts list
          fetchBroadcasts();
        }
      }
    } catch (error) {
      console.error("Error creating broadcast:", error);
      showError(error.response?.data?.message || "Error creating broadcast");
    }
  };

  const toggleBroadcast = async (id) => {
    try {
      const response = await api.patch(`/broadcasts/toggle-status`, {
        broadcast_id: id,
      });

      if (response.data.success) {
        showSuccess("Broadcast status updated successfully");
        // Refresh broadcasts list
        fetchBroadcasts();
        // Dispatch event to update header only
        window.dispatchEvent(new Event("broadcastUpdated"));
      }
    } catch (error) {
      console.error("Error toggling broadcast:", error);
      showError(
        error.response?.data?.message || "Error updating broadcast status"
      );
    }
  };

  const handleDeleteClick = (broadcast) => {
    setBroadcastToDelete(broadcast);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await api.delete(
        `/broadcasts/${broadcastToDelete.broadcast_id}`
      );

      if (response.data.success) {
        showSuccess("Broadcast deleted successfully");
        setIsDeleteModalOpen(false);
        setBroadcastToDelete(null);
        fetchBroadcasts();
        // Dispatch event to update header
        window.dispatchEvent(new Event("broadcastUpdated"));
      }
    } catch (error) {
      console.error("Error deleting broadcast:", error);
      showError(error.response?.data?.message || "Error deleting broadcast");
    }
  };

  const fetchBroadcasts = async () => {
    try {
      const response = await api.get(`/broadcasts`);
      if (response.data.success) {
        setBroadcasts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching broadcasts:", error);
      showError("Error fetching broadcasts");
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const showError = (message) => {
    Swal.fire({
      background: "#111827",
      color: "#fff",
      icon: "error",
      title: "Error!",
      text: message,
      customClass: {
        popup: "bg-gray-900 border-gray-700 rounded-2xl border",
        title: "text-white",
        htmlContainer: "text-gray-300",
        confirmButton:
          "bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-2",
      },
    });
  };

  const showSuccess = (message) => {
    Swal.fire({
      background: "#111827",
      color: "#fff",
      icon: "success",
      title: "Success!",
      text: message,
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: "bg-gray-900 border-gray-700 rounded-2xl border",
        title: "text-white",
        htmlContainer: "text-gray-300",
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Update the filteredBroadcasts constant to not filter by status
  const filteredBroadcasts = filterChapter
    ? broadcasts.filter((broadcast) => broadcast.chapter_name === filterChapter)
    : broadcasts;

  return (
    <div className="mt-32 p-1 lg:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={broadcastIcon} alt="Broadcast" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">Broadcast</h1>
            <h2 className="text-sm text-gray-400">
              Manage chapter announcements
            </h2>
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

      {/* Main Content Card - Updated styling */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-2xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-white">
            Current Announcements
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <select
              value={filterChapter}
              onChange={(e) => setFilterChapter(e.target.value)}
              className="w-full sm:w-48 p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white"
            >
              <option value="">All Chapters</option>
              {chapters.map((chapter) => (
                <option key={chapter.chapter_name} value={chapter.chapter_name}>
                  {chapter.chapter_name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Add Announcement
            </button>
          </div>
        </div>

        {/* Enhanced Announcement Form */}
        {showForm && (
          <div className="mb-8">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowForm(false)}
                className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Hide Form
              </button>
            </div>
            <div className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-2xl border border-amber-500/20 p-8 shadow-2xl">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>

              <form onSubmit={handleFormSubmit} className="space-y-8 relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Chapter Selection */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-amber-400">
                      Select Chapter(s){" "}
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="max-h-48 overflow-y-auto bg-gray-900/50 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-gray-800/50">
                      <div className="space-y-2">
                        {chapters.map((chapter) => (
                          <div
                            key={chapter.chapter_name}
                            className="flex items-center py-2 px-3 rounded-lg hover:bg-amber-500/10 transition-colors duration-200"
                          >
                            <input
                              type="checkbox"
                              id={`chapter_${chapter.chapter_name}`}
                              checked={selectedChapters.includes(
                                chapter.chapter_name
                              )}
                              onChange={() =>
                                handleChapterSelection(chapter.chapter_name)
                              }
                              className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800"
                            />
                            <label
                              htmlFor={`chapter_${chapter.chapter_name}`}
                              className="ml-3 text-sm text-gray-300 cursor-pointer hover:text-amber-400 transition-colors duration-200"
                            >
                              {chapter.chapter_name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Announcement Slot */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-amber-400">
                      Select Announcement Slot{" "}
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <select
                      required
                      value={formData.announcementSlot}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          announcementSlot: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-amber-500/20 text-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                    >
                      <option value="" className="bg-gray-900">
                        Choose a slot...
                      </option>
                      <option value="1" className="bg-gray-900">
                        Announcement #1
                      </option>
                      <option value="2" className="bg-gray-900">
                        Announcement #2
                      </option>
                      <option value="3" className="bg-gray-900">
                        Announcement #3
                      </option>
                    </select>
                  </div>

                  {/* Announcement Text */}
                  <div className="flex flex-col gap-3 sm:col-span-2">
                    <label className="text-sm font-medium text-amber-400">
                      Announcement Text{" "}
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.announcementText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          announcementText: e.target.value,
                        })
                      }
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-amber-500/20 text-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200 placeholder-gray-500"
                      placeholder="Enter your announcement text here..."
                    />
                  </div>

                  {/* Duration Selection */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-amber-400">
                      Duration <span className="text-red-500 text-lg">*</span>
                    </label>
                    <select
                      required
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-amber-500/20 text-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                    >
                      <option value="" className="bg-gray-900">
                        Choose duration...
                      </option>
                      <option value="7" className="bg-gray-900">
                        7 Days
                      </option>
                      <option value="15" className="bg-gray-900">
                        15 Days
                      </option>
                      <option value="30" className="bg-gray-900">
                        30 Days
                      </option>
                      <option value="custom" className="bg-gray-900">
                        Custom Range
                      </option>
                      <option value="always" className="bg-gray-900">
                        Always
                      </option>
                    </select>
                  </div>

                  {/* Custom Date Range */}
                  {formData.duration === "custom" && (
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium text-amber-400">
                        Custom Date Range{" "}
                        <span className="text-red-500 text-lg">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-amber-500/20 text-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                        />
                        <input
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-amber-500/20 text-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Add Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Announcement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBroadcasts.map((broadcast) => {
            const isActive = broadcast.status === "active";
            const isExpired =
              broadcast.end_date && new Date(broadcast.end_date) < new Date();

            return (
              <div
                key={broadcast.broadcast_id}
                className={`relative overflow-hidden backdrop-blur-sm bg-gradient-to-br ${
                  isActive
                    ? "from-orange-950/30 to-gray-900/95"
                    : "from-gray-800/30 to-gray-900/95"
                } rounded-2xl border ${
                  isActive ? "border-orange-500/30" : "border-gray-700/50"
                } p-6 hover:shadow-lg transition-all duration-300 group`}
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-16 right-6 px-3 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {isActive ? "Active" : "Disabled"}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500"></div>

                {/* Enhanced Chapter and Slot Header */}
                <div className="flex flex-col gap-3 mb-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg text-white font-medium text-sm shadow-lg shadow-orange-500/20">
                      {broadcast.chapter_name}
                    </span>
                    <span className="px-3 py-1 bg-gray-700/80 backdrop-blur-sm rounded-lg text-xs font-semibold text-white border border-gray-600/30">
                      Slot #{broadcast.announcement_slot}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {formatDate(broadcast.created_at)}
                  </p>
                </div>

                {/* Enhanced Announcement Content */}
                <div
                  className={`relative ${
                    isActive
                      ? "bg-gradient-to-br from-orange-900/30 to-orange-900/10"
                      : "bg-gradient-to-br from-gray-800/30 to-gray-800/10"
                  } px-4 py-3 rounded-xl border ${
                    isActive ? "border-orange-500/30" : "border-gray-600/30"
                  } mb-4 group-hover:scale-[1.02] transition-transform duration-300`}
                >
                  <div
                    className={`flex items-start gap-3 ${
                      isActive ? "text-orange-200" : "text-gray-300"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {broadcast.announcement_text}
                    </p>
                  </div>

                  {/* Enhanced Date Display */}
                  <div className="mt-3 space-y-1.5 border-t border-gray-700/50 pt-3">
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M15.833 3.333H4.167C3.24 3.333 2.5 4.074 2.5 5v11.667c0 .926.741 1.666 1.667 1.666h11.666c.926 0 1.667-.74 1.667-1.666V5c0-.926-.74-1.667-1.667-1.667z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.333 2.5V4.167M6.667 2.5V4.167M2.5 7.5h15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Start: {formatDate(broadcast.start_date)}
                    </div>
                    {broadcast.end_date ? (
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M15.833 3.333H4.167C3.24 3.333 2.5 4.074 2.5 5v11.667c0 .926.741 1.666 1.667 1.666h11.666c.926 0 1.667-.74 1.667-1.666V5c0-.926-.74-1.667-1.667-1.667z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13.333 2.5V4.167M6.667 2.5V4.167M2.5 7.5h15M7.5 11.667l2.5 2.5 2.5-2.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Expires: {formatDate(broadcast.end_date)}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">
                        Duration: Permanent
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleDeleteClick(broadcast)}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-sm text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                  <button
                    onClick={() => toggleBroadcast(broadcast.broadcast_id)}
                    disabled={isExpired}
                    className={`px-4 py-1.5 rounded-lg bg-gradient-to-r ${
                      isActive
                        ? "from-red-600 to-red-900 hover:from-red-700 hover:to-red-950 hover:shadow-red-900/30"
                        : "from-green-600 to-green-900 hover:from-green-700 hover:to-green-950 hover:shadow-green-900/30"
                    } text-sm text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isActive ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBroadcastToDelete(null);
        }}
        onDelete={handleDeleteConfirm}
        itemName="Broadcast"
      />
    </div>
  );
};

export default Broadcast;

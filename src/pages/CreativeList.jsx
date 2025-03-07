import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import creativeIcon from "../assets/images/icons/slider.svg";

const CreativeList = () => {
  const navigate = useNavigate();
  const [creatives, setCreatives] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null,
    displayDate: "",
    displayTime: "",
  });

  useEffect(() => {
    loadCreatives();
  }, []);

  const loadCreatives = async () => {
    try {
      const response = await axios.get("/api/creative-sliders");
      if (response.data.status === "success") {
        // Filter out expired creatives
        const currentDate = new Date();
        const validCreatives = response.data.data.filter(creative => {
          const displayUntil = new Date(creative.display_until);
          return displayUntil > currentDate;
        });
        setCreatives(validCreatives);
      }
    } catch (error) {
      console.error("Error loading creatives:", error);
      showAlert("error", "Failed to load creative sliders");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image || !formData.displayDate || !formData.displayTime) {
      showAlert("error", "Please fill all required fields");
      return;
    }

    try {
      const displayUntil = `${formData.displayDate} ${formData.displayTime}`;
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        
        const response = await axios.post("/api/creative-sliders", {
          action: "add",
          image_data: base64Image,
          display_until: displayUntil
        });

        if (response.data.status === "success") {
          showAlert("success", "Creative slider added successfully");
          loadCreatives();
          setShowAddModal(false);
          setFormData({
            image: null,
            imagePreview: null,
            displayDate: "",
            displayTime: ""
          });
        }
      };

      reader.readAsDataURL(formData.image);
    } catch (error) {
      console.error("Error adding creative:", error);
      showAlert("error", "Failed to add creative slider");
    }
  };

  const deleteCreative = async (id) => {
    const result = await Swal.fire({
      background: "#111827",
      color: "#fff",
      title: "Are you sure?",
      text: "This creative slider will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "bg-gray-900 border-gray-700 rounded-2xl border",
        title: "text-white",
        htmlContainer: "text-gray-300",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-6 py-2",
        cancelButton: "bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg px-6 py-2"
      }
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post("/api/creative-sliders", {
          action: "delete",
          creative_id: id
        });

        if (response.data.status === "success") {
          showAlert("success", "Creative slider deleted successfully");
          loadCreatives();
        }
      } catch (error) {
        console.error("Error deleting creative:", error);
        showAlert("error", "Failed to delete creative slider");
      }
    }
  };

  const showAlert = (icon, text) => {
    Swal.fire({
      icon,
      text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#111827",
      color: "#fff",
      customClass: {
        popup: "bg-gray-900 border-gray-700 rounded-2xl border"
      }
    });
  };

  const formatDate = (dateStr, includeTime = false) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    });
  };

  const adjustZoom = (delta) => {
    setCurrentZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const resetZoom = () => {
    setCurrentZoom(1);
  };

  return (
    <div className="mt-32 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3">
          <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
            <img src={creativeIcon} alt="Creative" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">Creative Sliders List</h1>
            <h2 className="text-sm text-gray-400">Manage all creative sliders content</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-green-500 rounded-xl transition-all duration-300 border border-gray-700"
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
          <button
            onClick={() => setShowAddModal(true)}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-900 hover:from-green-700 hover:to-green-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5"
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
            <span className="font-semibold tracking-wide text-sm">Add New Creative Slider</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatives.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-lg font-medium">No Creative Sliders</p>
              <p className="text-gray-500 mt-2">Click the "Add New Creative Slider" button to create one.</p>
            </div>
          ) : (
            creatives.map(creative => (
              <div key={creative.creative_id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-500">Created:</span>
                    <span className="text-gray-300">{formatDate(creative.created_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedImage(creative.image_url);
                        setShowPreviewModal(true);
                      }}
                      className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteCreative(creative.creative_id)}
                      className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-600 to-red-900 hover:from-red-700 hover:to-red-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-red-900/30 hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <img
                    src={creative.image_url}
                    alt="Creative"
                    className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                    onClick={() => {
                      setSelectedImage(creative.image_url);
                      setShowPreviewModal(true);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-500">Display Until:</span>
                  <span className="text-gray-300">{formatDate(creative.display_until, true)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Creative Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative z-50 bg-gray-800/95 p-6 rounded-2xl border border-gray-700 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Creative Slider</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Creative Slider Image <span className="text-red-500 text-lg">*</span>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors overflow-hidden relative">
                    {!formData.imagePreview ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                      </div>
                    ) : (
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Display Until Date <span className="text-red-500 text-lg">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.displayDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayDate: e.target.value }))}
                    className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Display Until Time <span className="text-red-500 text-lg">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.displayTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayTime: e.target.value }))}
                    className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-gray-700 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-900 hover:from-green-700 hover:to-green-950 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Save Creative Slider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowPreviewModal(false)} />
          <div className="relative w-full h-[calc(100vh-2rem)] max-w-[95vw] group">
            {/* Close Button */}
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-6 right-6 z-10 group"
            >
              <div className="relative p-2">
                <div className="absolute inset-0 bg-white/10 rounded-full transition-transform duration-300 group-hover:scale-110" />
                <svg
                  className="w-8 h-8 text-white/90 relative z-10 transition-transform duration-300 group-hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>

            {/* Image */}
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-contain"
              style={{ transform: `scale(${currentZoom})` }}
            />

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-black/50 backdrop-blur-md rounded-full opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <button
                onClick={() => adjustZoom(-0.1)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={resetZoom}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => adjustZoom(0.1)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeList;

import React, { useState, useEffect } from "react";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import axios from "axios";
import api from "../hooks/api";

const EditMemberModal = ({ member, chapters, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    member_id: "",
    name: "",
    mobile: "",
    email: "",
    chapter: "",
    datea: "",
    company: "",
    business_category: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      console.log("Member in Modal:", member);
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData({
        id: member.id,
        member_id: member.member_id,
        name: member.name,
        mobile: member.mobile,
        email: member.email || "",
        chapter: member.chapter_id,
        date: formatDate(member.joiningDate),
        company: member.company || "",
        business_category: member.business_category || "",
      });
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${api}/members/members/${member.id}`, {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        chapter: formData.chapter,
        company: formData.company,
        business_category: formData.business_category,
        joiningDate: formData.date,
      });

      if (response.data.success) {
        // Call the parent component's onSubmit with the updated data
        onSubmit({
          ...formData,
          joiningDate: formData.date,
        });
      }
    } catch (error) {
      console.error("Error updating member:", error);
      // You might want to show an error message to the user here
      const errorMessage =
        error.response?.data?.message || "Failed to update member";
      // You can use your existing showAlert function or create a new one
      alert(errorMessage); // Replace this with your preferred error notification method
    } finally {
      setLoading(false);
    }
  };

  // Update the submit button to show loading state
  const submitButton = (
    <button
      type="submit"
      disabled={loading}
      className={`px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 text-white rounded-lg flex items-center justify-center ${
        loading ? "opacity-75 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Updating...
        </>
      ) : (
        "Update Member"
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 overflow-y-auto max-h-[90vh] scrollbar-hide">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Edit Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Member Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Chapter <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.chapter}
              onChange={(e) =>
                setFormData({ ...formData, chapter: e.target.value })
              }
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select Chapter</option>
              {chapters.map((chapter) => (
                <option key={chapter.chapter_id} value={chapter.chapter_id}>
                  {chapter.chapter_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Join Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 [color-scheme:dark] "
              />
              <img
                src={calendarIcon}
                alt="calendar"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Business Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.business_category}
              onChange={(e) =>
                setFormData({ ...formData, business_category: e.target.value })
              }
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg hover:bg-gray-700 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
            {submitButton}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;

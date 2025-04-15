import React, { useState, useEffect } from "react";
import member from "../assets/images/icons/member.svg";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import api from "../hooks/api";
import Swal from "sweetalert2";

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    chapter: "",
    company: "",
    business_category: "",
    date: "",
  });

  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.get("/chapters");
        if (response.data.status === "success") {
          setChapters(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };
    fetchChapters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const memberData = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        chapter: formData.chapter,
        company: formData.company,
        business_category: formData.business_category,
        joiningDate: formData.date,
        status: "active",
      };

      const response = await api.post(`/members/add-member`, memberData);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Member added successfully",
          background: "#111827",
          color: "#fff",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: "bg-gray-900 border-gray-700 rounded-2xl border",
          },
        });

        setFormData({
          name: "",
          mobile: "",
          email: "",
          chapter: "",
          company: "",
          business_category: "",
          date: "",
        });
      }
    } catch (error) {
      console.error("Error adding member:", error);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to add member",
        background: "#111827",
        color: "#fff",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: "bg-gray-900 border-gray-700 rounded-2xl border",
        },
      });
    }
  };

  return (
    <div className="mt-32 p-1 lg:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl border border-amber-500/20 shadow-lg">
            <img
              src={member}
              alt="member"
              className="w-6 h-6 [&>path]:stroke-white"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Member</h2>
            <p className="text-sm text-gray-400">Create new member profile</p>
          </div>
        </div>
        <button
          onClick={() => window.history.back()}
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

      {/* Form Section */}
      <div className="p-6 rounded-2xl bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Member Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-300"
              >
                Member Name <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder="Enter member name"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="mobile"
                className="text-sm font-medium text-gray-300"
              >
                Mobile Number <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                type="tel"
                id="mobile"
                required
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="Enter 10-digit mobile number"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email address"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Chapter Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="chapter"
                className="text-sm font-medium text-gray-300"
              >
                Chapter Name <span className="text-red-500 text-lg">*</span>
              </label>
              <select
                id="chapter"
                required
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white"
                value={formData.chapter}
                onChange={(e) =>
                  setFormData({ ...formData, chapter: e.target.value })
                }
              >
                <option value="">Select Chapter</option>
                {chapters.map((chapter) => (
                  <option key={chapter.chapter_id} value={chapter.chapter_id}>
                    {chapter.chapter_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="company"
                className="text-sm font-medium text-gray-300"
              >
                Company Name <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                type="text"
                id="company"
                required
                placeholder="Enter company name"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>

            {/* Business Category */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="business_category"
                className="text-sm font-medium text-gray-300"
              >
                Business Category{" "}
                <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                type="text"
                id="business_category"
                required
                placeholder="Enter business category"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.business_category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business_category: e.target.value,
                  })
                }
              />
            </div>

            {/* Joining Date */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="date"
                className="text-sm font-medium text-gray-300"
              >
                Joining Date <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  required
                  className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
                <img
                  src={calendarIcon}
                  alt="calendar"
                  className="absolute right-4 top-[50%] -translate-y-[50%] w-6 h-6 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex justify-end gap-4 mt-10 max-450:justify-between">
            <button
              type="reset"
              onClick={() =>
                setFormData({
                  name: "",
                  mobile: "",
                  email: "",
                  chapter: "",
                  company: "",
                  business_category: "",
                  date: "",
                })
              }
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800a hover:to-amber-950 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Home,
  Calendar,
  Phone,
  ChevronLeft,
  ScrollText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import referralIcon from "../assets/images/icons/ref-given.svg";
import api from "../hooks/api";
import Swal from "sweetalert2";

const MemberReferEditAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    chapter: "",
    member: "",
    referralFor: "",
    mobile: "",
    date: "",
    description: "",
  });

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.get(`/chapters`);
        if (response.data.status === "success") {
          setChapters(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch chapters",
          text: "There was an error loading the chapters.",
          background: "#1F2937",
          color: "#fff",
          confirmButtonColor: "#F59E0B",
        });
      }
    };

    fetchChapters();
  }, []);

  // Fetch members when chapter is selected
  useEffect(() => {
    const fetchMembers = async () => {
      if (!formData.chapter) return;

      try {
        const response = await api.get(`/members/members`);
        if (response.data.success) {
          const chapterMembers = response.data.data.filter(
            (member) =>
              member.chapter === parseInt(formData.chapter) &&
              member.status === "active"
          );
          setMembers(chapterMembers);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch members",
          text: "There was an error loading the members.",
          background: "#1F2937",
          color: "#fff",
          confirmButtonColor: "#F59E0B",
        });
      }
    };

    fetchMembers();
  }, [formData.chapter]);

  // Fetch referral data if editing
  useEffect(() => {
    const fetchReferralData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api.get(`/referrals/${id}`);

        if (response.data.success) {
          const referral = response.data.data;

          // Set chapter first
          const chapterValue =
            referral.receivedByMember?.Chapter?.chapter_id.toString();
          setFormData((prev) => ({ ...prev, chapter: chapterValue }));

          // Fetch members for the chapter
          const membersResponse = await api.get(`/members/members`);
          if (membersResponse.data.success) {
            const chapterMembers = membersResponse.data.data.filter(
              (member) =>
                member.chapter === parseInt(chapterValue) &&
                member.status === "active"
            );
            setMembers(chapterMembers);

            // Now set the complete form data
            setFormData({
              chapter: chapterValue,
              member: referral.received_member_id.toString(),
              referralFor: referral.refer_name || "",
              mobile: referral.mobile || "",
              date: referral.referral_date
                ? new Date(referral.referral_date).toISOString().split("T")[0]
                : "",
              description: referral.description || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching referral:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch referral",
          text: "There was an error loading the referral data.",
          background: "#1F2937",
          color: "#fff",
          confirmButtonColor: "#F59E0B",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.chapter || !formData.member) {
      Swal.fire({
        icon: "error",
        title: "Required Fields Missing",
        text: "Please select both chapter and member",
        background: "#1F2937",
        color: "#fff",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    try {
      setLoading(true);
      const referralData = {
        received_member_id: parseInt(formData.member),
        refer_name: formData.referralFor,
        mobile: formData.mobile,
        description: formData.description,
        referral_date: formData.date,
      };

      let response;
      if (id) {
        response = await api.put(`/referrals/${id}`, referralData);
      } else {
        response = await api.post(`/referrals`, referralData);
      }

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: id ? "Referral Updated" : "Referral Created",
          text: response.data.message,
          background: "#1F2937",
          color: "#fff",
          confirmButtonColor: "#F59E0B",
        }).then(() => {
          navigate("/ref-given");
        });
      }
    } catch (error) {
      console.error("Error saving referral:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to save referral",
        background: "#1F2937",
        color: "#fff",
        confirmButtonColor: "#F59E0B",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-32 p-1 lg:p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746]  rounded-xl shadow-lg">
            <img src={referralIcon} alt="referralIcon" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {id ? "Edit Referral" : "Add Referral"}
            </h2>
            <p className="text-sm text-gray-400">
              {id ? "Update existing referral" : "Create new referral"}
            </p>
          </div>
        </div>

        {/* Back Button */}
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

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chapter Selection */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Chapter <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.chapter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chapter: e.target.value,
                      member: "", // Reset member when chapter changes
                    })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                >
                  <option value="">Select Chapter</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.chapter_id} value={chapter.chapter_id}>
                      {chapter.chapter_name}
                    </option>
                  ))}
                </select>
                <Home className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Member Selection */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.member}
                  onChange={(e) =>
                    setFormData({ ...formData, member: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                  disabled={!formData.chapter}
                >
                  <option value="">Select Member</option>
                  {members.length > 0 ? (
                    members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.company}
                      </option>
                    ))
                  ) : (
                    <option disabled>No members found in this chapter</option>
                  )}
                </select>
                <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
              {formData.chapter && members.length === 0 && (
                <p className="mt-2 text-sm text-amber-500">
                  No active members found in this chapter
                </p>
              )}
            </div>

            {/* Referral For Input */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Referral For
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.referralFor}
                  onChange={(e) =>
                    setFormData({ ...formData, referralFor: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                  placeholder="Enter referred person name"
                />
                <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Mobile Input */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Mobile
              </label>
              <div className="relative">
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                  placeholder="Enter mobile number"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Date Input */}
            <div className="relative group">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* Description field with updated icon */}
          <div className="relative group">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Description
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="4"
                className="w-full p-4 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 resize-none pr-12"
                placeholder="Enter description here..."
              ></textarea>
              <ScrollText className="absolute right-4 top-4 w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  chapter: "",
                  member: "",
                  referralFor: "",
                  mobile: "",
                  date: "",
                  description: "",
                })
              }
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    {id ? "Updating..." : "Saving..."}
                  </div>
                ) : id ? (
                  "Update Referral"
                ) : (
                  "Save Referral"
                )}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MemberReferEditAdd;

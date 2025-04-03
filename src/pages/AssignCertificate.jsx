import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import certi from "../assets/images/icons/certi.svg";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import api from "../hooks/api";

const AssignCertificate = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [formData, setFormData] = useState({
    certificate_type: "",
    issue_date: "",
  });

  const loadMembers = async (chapterId) => {
    try {
      const response = await axios.get(`${api}/members/members`);
      if (response.data.success) {
        const chapterMembers = response.data.data.filter(
          (member) =>
            member.chapter === parseInt(chapterId) && member.status === "active"
        );
        setMembers(chapterMembers.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.error("Error loading members:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load members for this chapter",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#F59E0B",
      });
      setMembers([]);
    }
  };

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`${api}/chapters`);
        if (response.data.status === "success") {
          setChapters(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };
    fetchChapters();
  }, []);

  const handleMemberSelection = (memberId, name) => {
    setSelectedMembers((prev) => {
      if (prev.find((m) => m.id === memberId)) {
        return prev.filter((m) => m.id !== memberId);
      }
      return [...prev, { id: memberId, name }];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedMembers.length === 0) {
      Swal.fire({
        background: "#111827",
        color: "#fff",
        icon: "warning",
        title: "No Members Selected",
        text: "Please select at least one member to assign the certificate",
        customClass: {
          popup: "bg-gray-900 border-gray-700 rounded-2xl border",
          title: "text-white",
          htmlContainer: "text-gray-300",
          confirmButton:
            "bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-2",
        },
      });
      return;
    }

    try {
      const memberNames = {};
      selectedMembers.forEach((member) => {
        memberNames[member.id] = member.name;
      });

      const submitData = {
        action: "assign",
        chapter_id: selectedChapter,
        member_ids: selectedMembers.map((m) => m.id),
        member_names: memberNames,
        ...formData,
      };

      const response = await axios.post(`${api}/certificates`, submitData);

      if (response.data.status === "success") {
        Swal.fire({
          background: "#111827",
          color: "#fff",
          icon: "success",
          title: "Success!",
          text: `Successfully assigned certificates to ${response.data.count} member(s)`,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "bg-gray-900 border-gray-700 rounded-2xl border",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
        }).then(() => {
          // Reset form
          setSelectedChapter("");
          setMembers([]);
          setSelectedMembers([]);
          setFormData({ certificate_type: "", issue_date: "" });
          setSearchTerm("");
        });
      }
    } catch (error) {
      console.error("Error assigning certificates:", error);
      Swal.fire({
        background: "#111827",
        color: "#fff",
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to assign certificates",
        customClass: {
          popup: "bg-gray-900 border-gray-700 rounded-2xl border",
          title: "text-white",
          htmlContainer: "text-gray-300",
          confirmButton:
            "bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-2",
        },
      });
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-32 p-2 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img
              src={certi}
              alt="member"
              className="w-6 h-6 flex justify-center items-center"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">
              Assign Certificate
            </h1>
            <h2 className="text-sm text-gray-400">
              Assign certificates to members
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
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

          <button
            onClick={() => navigate("/certificate-list")}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Certificates List
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Chapter Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Chapter Name <span className="text-red-500 text-lg">*</span>
              </label>
              <select
                required
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  if (e.target.value) {
                    loadMembers(e.target.value);
                  } else {
                    setMembers([]);
                  }
                }}
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white"
              >
                <option value="">Select Chapter</option>
                {chapters.map((chapter) => (
                  <option key={chapter.chapter_id} value={chapter.chapter_id}>
                    {chapter.chapter_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Certificate Type */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Certificate Type <span className="text-red-500 text-lg">*</span>
              </label>
              <select
                required
                value={formData.certificate_type}
                onChange={(e) =>
                  setFormData({ ...formData, certificate_type: e.target.value })
                }
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white"
              >
                <option value="">Select Certificate Type</option>
                <option value="highest_business">Highest Business Given</option>
                <option value="highest_visitor">Highest Visitor Invited</option>
                <option value="best_elevator_pitch">Best Elevator Pitch</option>
                <option value="maximum_referrals">
                  Maximum Referrals Given
                </option>
                <option value="mdp_attended">MDP Attended</option>
              </select>
            </div>

            {/* Issue Date */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Issue Date <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.issue_date}
                  onChange={(e) =>
                    setFormData({ ...formData, issue_date: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                />
                <img
                  src={calendarIcon}
                  alt="calendar"
                  className="absolute right-4 top-[50%] -translate-y-[50%] w-6 h-6 pointer-events-none text-white"
                />
              </div>
            </div>
          </div>

          {/* Members Selection */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-700">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white"
                placeholder="Search members..."
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-700">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 hover:bg-gray-700 transition-colors duration-200"
                >
                  <label className="flex items-center space-x-3 w-full cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMembers.some((m) => m.id === member.id)}
                      onChange={() =>
                        handleMemberSelection(member.id, member.name)
                      }
                      className="form-checkbox h-5 w-5 text-amber-500 rounded border-gray-600 bg-gray-700 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-white font-medium">
                      {member.name}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="reset"
              onClick={() => {
                setSelectedChapter("");
                setMembers([]);
                setSelectedMembers([]);
                setFormData({ certificate_type: "", issue_date: "" });
                setSearchTerm("");
              }}
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Assign Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCertificate;

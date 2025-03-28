import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import memberListIcon from "../assets/images/icons/users.svg";
import addIcon from "../assets/images/icons/add.svg";
import viewIcon from "../assets/images/icons/view.svg";
import editIcon from "../assets/images/icons/edit.svg";
import settingsIcon from "../assets/images/icons/setting.svg";
import EditMemberModal from "../components/EditMemberModal";
import Swal from "sweetalert2";
import api from "../hooks/api";
import axios from "axios";
import { showToast } from "../utils/toast";

const MemberList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersResponse = await axios.get(`${api}/members/members`);
        if (membersResponse.data.success) {
          setMembers(membersResponse.data.data);
        }

        const chaptersResponse = await axios.get(`${api}/chapters`);
        if (chaptersResponse.data.status === "success") {
          setChapters(chaptersResponse.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load members data",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          background: "#1F2937",
          color: "#fff",
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMembers = members.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile?.includes(searchTerm) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.chapter_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditSubmit = async (formData) => {
    try {
      const response = await axios.put(`${api}/members/members/${selectedMember.id}`, {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        chapter: formData.chapter,
        company: formData.company,
        business_category: formData.business_category,
        joiningDate: formData.date
      });

      if (response.data.success) {
        const membersResponse = await axios.get(`${api}/members/members`);
        if (membersResponse.data.success) {
          setMembers(membersResponse.data.data);
        }

        setEditModalOpen(false);
        
        showToast({
          title: "Profile Updated",
          message: "Member profile has been successfully updated",
          icon: "success",
          status: "success"
        });
      }
    } catch (error) {
      console.error("Error updating member:", error);
      
      showToast({
        title: "Update Failed",
        message: error.response?.data?.message || "Failed to update member profile. Please try again.",
        icon: "error",
        status: "error"
      });
    }
  };

  const handleEditClick = (member) => {
    console.log("Selected Member:", member);
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const toggleMemberStatus = async (member) => {
    if (!member || !member.id) {
      showToast({
        title: "Error",
        message: "Invalid member data",
        icon: "error",
        status: "error"
      });
      return;
    }

    const isActive = member.status === "active";

    const result = await Swal.fire({
      title: isActive
        ? '<span class="text-gray-300 text-2xl">Deactivate Member?</span>'
        : '<span class="text-white text-2xl">Activate Member?</span>',
      html: `
        <div class="text-left space-y-6">
          <div class="flex items-center gap-4 p-6 ${
            isActive ? "bg-red-500/10" : "bg-green-500/10"
          } rounded-2xl border border-${isActive ? "red" : "amber"}-500/20">
            <div class="p-3 bg-gradient-to-br ${
              isActive
                ? "from-red-500/20 to-red-600/20"
                : "from-green-500/20 to-green-600/20"
            } rounded-xl border border-${isActive ? "red" : "green"}-500/30">
              <i class="fas ${isActive ? "fa-user-slash" : "fa-user-check"} ${
        isActive ? "text-red-400" : "text-green-400"
      } text-xl"></i>
            </div>
            <div>
              <h3 class="font-semibold text-lg ${
                isActive ? "text-red-400" : "text-green-400"
              }">${member.name}</h3>
              <p class="text-sm text-gray-400">
                ${
                  isActive
                    ? "Currently Active Member"
                    : "Currently Inactive Member"
                }
              </p>
            </div>
          </div>
          
          <div class="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
            <p class="text-sm text-gray-300">
              ${
                isActive
                  ? "This action will deactivate the member's account. They won't be able to access their account until reactivated."
                  : "This action will reactivate the member's account. They will regain access to their account immediately."
              }
            </p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: `
        <div class="flex items-center gap-2">
          <i class="fas ${isActive ? "fa-user-slash" : "fa-user-check"}"></i>
          <span>${isActive ? "Yes, Deactivate" : "Yes, Activate"}</span>
        </div>
      `,
      cancelButtonText: `
        <div class="flex items-center gap-2">
          <i class="fas fa-times"></i>
          <span>Cancel</span>
        </div>
      `,
      background: "#1F2937",
      customClass: {
        popup: "bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl",
        title: "text-2xl font-bold text-white mb-4",
        htmlContainer: "text-gray-300",
        actions: "border-t border-gray-700 mt-6 py-4",
        confirmButton: `
          ${
            isActive
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          } text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-${
          isActive ? "red" : "amber"
        }-500/20 hover:-translate-y-0.5
        `,
        cancelButton:
          "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20 hover:-translate-y-0.5",
      },
    });

    if (result.isConfirmed) {
      try {
        const requestUrl = `${api}/members/members/${member.id}/status`;
        const requestData = {
          status: isActive ? "inactive" : "active",
        };

        const response = await axios.patch(requestUrl, requestData);

        if (response.data.success) {
          const updatedMembers = members.map((m) =>
            m.id === member.id
              ? { ...m, status: isActive ? "inactive" : "active" }
              : m
          );
          setMembers(updatedMembers);

          showToast({
            title: isActive ? "Member Deactivated" : "Member Activated",
            message: isActive 
              ? "The member has been successfully deactivated"
              : "The member has been successfully activated",
            icon: "success",
            status: "success"
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          message: error.response?.data?.message || "Failed to update member status",
          icon: "error",
          status: "error"
        });
      }
    } else {
      console.log("Status update cancelled by user");
    }
  };

  return (
    <div className="mt-32 p-1 lg:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={memberListIcon} alt="Members" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Members List</h2>
            <p className="text-sm text-gray-400">View and manage members</p>
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
      </motion.div>

      {/* Search and Add Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="w-full sm:w-auto order-2 sm:order-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by member name, mobile or chapter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[400px] lg:w-[500px] bg-gray-700 text-white pl-11 pr-4 py-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="order-1 sm:order-2 sm:ml-auto">
          <button
            onClick={() => navigate("/add-member")}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white/90 hover:text-white rounded-xl flex items-center justify-center gap-2 h-[56px] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
          >
            <img src={addIcon} alt="Add" className="w-5 h-5" />
            Add New Member
          </button>
        </div>
      </motion.div>

      {/* Members Table */}
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
                      Member Name
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Mobile Number
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Email
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Chapter
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Join Date
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
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      Loading members...
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No members found
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={member.id}
                      className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                    >
                      <td className="py-5 px-6">
                        <span className="text-gray-400">{index + 1}</span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              member.status === "active"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {member.status === "active" ? "Active" : "Inactive"}
                          </span>
                          <span className="text-gray-400" title={member.name}>
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-400">{member.mobile}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-400">{member.email}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-400">
                          {member.chapter_name || "No Chapter Assigned"}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-400">
                          {new Date(member.joiningDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/member-view/${member.id}`)
                            }
                            className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5"
                          >
                            <img
                              src={viewIcon}
                              alt="View"
                              className="w-5 h-5 opacity-70 group-hover:opacity-100"
                            />
                          </button>
                          {member.status === "active" && (
                            <button
                              onClick={() => handleEditClick(member)}
                              className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-amber-900/30 hover:-translate-y-0.5"
                            >
                              <img
                                src={editIcon}
                                alt="Edit"
                                className="w-5 h-5 opacity-70 group-hover:opacity-100"
                              />
                            </button>
                          )}
                          <button
                            onClick={() => toggleMemberStatus(member)}
                            className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-900 hover:from-yellow-700 hover:to-yellow-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-yellow-900/30 hover:-translate-y-0.5"
                          >
                            <img
                              src={settingsIcon}
                              alt="Settings"
                              className="w-5 h-5 opacity-70 group-hover:opacity-100"
                            />
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

      {editModalOpen && (
        <EditMemberModal
          member={selectedMember}
          chapters={chapters}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default MemberList;

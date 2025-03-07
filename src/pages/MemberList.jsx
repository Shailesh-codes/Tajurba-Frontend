import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import memberListIcon from "../assets/images/icons/users.svg";
import addIcon from "../assets/images/icons/add.svg";
import viewIcon from "../assets/images/icons/view.svg";
import editIcon from "../assets/images/icons/edit.svg";
import settingsIcon from "../assets/images/icons/setting.svg";
import EditMemberModal from '../components/EditMemberModal';
import Swal from "sweetalert2";

const MemberList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [chapters] = useState([
    { chapter_id: 1, chapter_name: "Chapter One" },
    { chapter_id: 2, chapter_name: "Chapter Two" },
    // Add more chapters as needed
  ]);

  // Dummy data for testing UI
  const dummyMembers = [
    {
      member_id: 1,
      full_name: "John Doe",
      mobile: "1234567890",
      email: "john@example.com",
      chapter_name: "Chapter One",
      chapter_id: 1,
      is_active: "1",
      joining_date: "2024-01-01",
      company_name: "ABC Corp",
      business_category: "Technology"
    },
    {
      member_id: 2,
      full_name: "Jane Smith",
      mobile: "9876543210",
      email: "jane@example.com",
      chapter_name: "Chapter Two",
      chapter_id: 2,
      is_active: "0",
      joining_date: "2024-02-01",
      company_name: "XYZ Ltd",
      business_category: "Marketing"
    }
  ];

  const filteredMembers = dummyMembers.filter(member => 
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.mobile.includes(searchTerm) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.chapter_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (formData) => {
    try {
      // For now, just update the dummy data
      const updatedMembers = dummyMembers.map(member => 
        member.member_id === formData.member_id 
          ? {
              ...member,
              full_name: formData.name,
              mobile: formData.mobile,
              email: formData.email,
              chapter_name: chapters.find(c => c.chapter_id === parseInt(formData.chapter))?.chapter_name || member.chapter_name,
              joining_date: formData.date
            }
          : member
      );
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Member updated successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#1F2937',
        color: '#fff'
      });

      setEditModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update member',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#1F2937',
        color: '#fff'
      });
    }
  };

  return (
    <div className="mt-32 p-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
            <img src={memberListIcon} alt="Members" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Members List</h2>
            <p className="text-sm text-gray-400">View and manage members</p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-green-500 rounded-xl transition-all duration-300 border border-gray-700"
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
              className="w-full sm:w-[400px] lg:w-[500px] bg-gray-700 text-white pl-11 pr-4 py-3 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0"
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
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-green-900 hover:from-green-700 hover:to-green-950 text-white/90 hover:text-white rounded-xl flex items-center justify-center gap-2 h-[56px] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5"
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
        className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-5 px-6 text-left text-base font-medium text-white">SR No.</th>
                <th className="py-5 px-6 text-left text-base font-medium text-white">Member Name</th>
                <th className="py-5 px-6 text-left text-base font-medium text-white">Mobile Number</th>
                <th className="py-5 px-6 text-left text-base font-medium text-white">Email</th>
                <th className="py-5 px-6 text-left text-base font-medium text-white">Chapter</th>
                <th className="py-5 px-6 text-left text-base font-medium text-white">Join Date</th>
                <th className="py-5 px-6 text-left text-base font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    Loading members...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => (
                  <tr key={member.member_id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="py-5 px-6">
                      <span className="text-gray-400">{index + 1}</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          member.is_active === "1"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}>
                          {member.is_active === "1" ? "Active" : "Inactive"}
                        </span>
                        <span className="text-gray-400" title={member.full_name}>
                          {member.full_name}
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
                      <span className="text-gray-400">{member.chapter_name}</span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-gray-400">{member.joining_date}</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/member-view/${member.member_id}`)}
                          className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5"
                        >
                          <img src={viewIcon} alt="View" className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                        </button>
                        {member.is_active === "1" && (
                          <button
                            onClick={() => handleEditClick(member)}
                            className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-600 to-green-900 hover:from-green-700 hover:to-green-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-green-900/30 hover:-translate-y-0.5"
                          >
                            <img src={editIcon} alt="Edit" className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                          </button>
                        )}
                        <button
                          onClick={() => {}}
                          className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-900 hover:from-yellow-700 hover:to-yellow-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-yellow-900/30 hover:-translate-y-0.5"
                        >
                          <img src={settingsIcon} alt="Settings" className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

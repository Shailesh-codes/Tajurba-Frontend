import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import memberListIcon from "../assets/images/icons/users.svg";
import addIcon from "../assets/images/icons/add.svg";
import viewIcon from "../assets/images/icons/view.svg";
import editIcon from "../assets/images/icons/edit.svg";
import settingsIcon from "../assets/images/icons/setting.svg";
import deleteIcon from "../assets/images/icons/delete.svg";
import { useState, useEffect } from "react";
import api from "../hooks/api";
import { showToast } from "../utils/toast";
import DeleteModal from "../layout/DeleteModal";
import Swal from "sweetalert2";

const SuperAdminUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/members/active-users");

        if (response.data.success) {
          setUsers(response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        showToast({
          title: "Error",
          message: "Failed to load users",
          status: "error",
        });
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/members/members/${selectedUser.id}`);

      if (response.data.success) {
        // Remove the deleted user from the state
        setUsers(users.filter((user) => user.id !== selectedUser.id));

        showToast({
          title: "Success",
          message: `${selectedUser.role} deleted successfully`,
          status: "success",
        });

        // Close the modal
        setDeleteModalOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);

      // Show error message from the server or a default message
      showToast({
        title: "Error",
        message: error.response?.data?.message || "Failed to delete user",
        status: "error",
      });
    }
  };

  const toggleUserStatus = async (user) => {
    if (!user || !user.id) {
      showToast({
        title: "Error",
        message: "Invalid user data",
        status: "error",
      });
      return;
    }

    const isActive = user.status === "active";

    const result = await Swal.fire({
      title: `<span class="text-gray-300 text-2xl">${
        isActive ? "Deactivate" : "Activate"
      } Regional Director?</span>`,
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
              }">${user.name}</h3>
              <p class="text-sm text-gray-400">${
                isActive ? "Currently Active" : "Currently Inactive"
              } Regional Director</p>
            </div>
          </div>
        </div>
      `,
      background: "#1F2937",
      showCancelButton: true,
      confirmButtonText: isActive ? "Yes, Deactivate" : "Yes, Activate",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl",
        confirmButton: `${
          isActive
            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        } text-white px-4 py-2 rounded-lg`,
        cancelButton:
          "bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await api.patch(`/members/members/${user.id}/status`, {
          status: isActive ? "inactive" : "active",
        });

        if (response.data.success) {
          const updatedUsers = users.map((u) =>
            u.id === user.id
              ? { ...u, status: isActive ? "inactive" : "active" }
              : u
          );
          setUsers(updatedUsers);

          showToast({
            title: "Status Updated",
            message: `Regional Director ${
              isActive ? "deactivated" : "activated"
            } successfully`,
            status: "success",
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          message: error.response?.data?.message || "Failed to update status",
          status: "error",
        });
      }
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
            <img src={memberListIcon} alt="Users" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Users List</h2>
            <p className="text-sm text-gray-400">
              View and manage Admin & Regional Directors
            </p>
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
              placeholder="Search by name, mobile or email..."
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
            onClick={() => navigate("/add-user")}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white/90 hover:text-white rounded-xl flex items-center justify-center gap-2 h-[56px] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
          >
            <img src={addIcon} alt="Add" className="w-5 h-5" />
            Add Users
          </button>
        </div>
      </motion.div>

      {/* Users Table */}
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
                      Name
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left border-b border-gray-700">
                    <span className="text-sm font-semibold text-gray-300">
                      Member Type
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
                      Loading Users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No user found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={user.id}
                      className="group hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-gray-700/40 hover:to-gray-700/30 transition-all duration-300"
                    >
                      <td className="py-5 px-6">
                        <span className="text-gray-400">{index + 1}</span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === "active"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {user.status === "active" ? "Active" : "Inactive"}
                          </span>
                          <span className="text-gray-400">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-400">{user.role}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-400">{user.mobile}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-400">{user.email}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-400">
                          {new Date(user.joiningDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleUserStatus(user)}
                            className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-900 hover:from-yellow-700 hover:to-yellow-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-yellow-900/30 hover:-translate-y-0.5"
                          >
                            <img
                              src={settingsIcon}
                              alt="Settings"
                              className="w-5 h-5 opacity-70 group-hover:opacity-100"
                            />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-600 to-red-900 hover:from-red-700 hover:to-red-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-red-900/30 hover:-translate-y-0.5"
                          >
                            <img
                              src={deleteIcon}
                              alt="Delete"
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

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onDelete={handleDelete}
        itemName={selectedUser?.role || "User"}
      />
    </div>
  );
};

export default SuperAdminUsers;

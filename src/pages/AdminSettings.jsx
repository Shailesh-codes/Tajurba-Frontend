import React, { useState, useRef, useEffect } from "react";
import { Camera, Settings, User, Lock, Save, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import settingsIcon from "../assets/images/icons/setting.svg";
import api from "../hooks/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { IndianRupee } from "lucide-react";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    "https://avatar.iran.liara.run/public"
  );

  const [paymentData, setPaymentData] = useState({
    upiId: "",
    qrCode: null,
    qrCodeUrl: "",
  });

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (!auth.user?.id) return;

        const response = await api.get(`/members/members/${auth.user.id}`);
        const userData = response.data.data;

        if (userData) {
          setFormData((prev) => ({
            ...prev,
            fullName: userData.name || "",
            email: userData.email || "",
            mobile: userData.mobile || "",
          }));

          // Handle profile picture BLOB
          if (userData.profilePicture) {
            // Convert BLOB to base64 if it's not already in base64 format
            const base64String =
              typeof userData.profilePicture === "string"
                ? userData.profilePicture
                : `data:image/jpeg;base64,${Buffer.from(
                    userData.profilePicture
                  ).toString("base64")}`;
            setProfilePictureUrl(base64String);
          }
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load admin data");
      }
    };

    fetchAdminData();
  }, [auth.user?.id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile picture change
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 200 * 1024) {
        toast.error("File size must be less than 200KB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update profile picture
  const handleUpdateProfilePicture = async () => {
    if (!profilePicture) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);

      const response = await api.put(
        "/members/settings/profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile picture updated successfully!");
        setProfilePictureUrl(response.data.data.profilePicture);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile picture"
      );
    }
  };

  // Handle save personal info
  const handleSavePersonalInfo = async () => {
    try {
      const response = await api.put("/members/settings/personal-info", {
        fullName: formData.fullName,
        email: formData.email,
      });

      if (response.data.success) {
        toast.success("Personal information updated successfully!");
      }
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast.error(
        error.response?.data?.message || "Failed to update personal information"
      );
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    try {
      const response = await api.put("/settings/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        toast.success("Password updated successfully!");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response?.status === 401) {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to update password");
      }
    }
  };

  // Handle QR code change
  const handleQRCodeChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 200 * 1024) {
        toast.error("File size must be less than 200KB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setPaymentData((prev) => ({
        ...prev,
        qrCode: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentData((prev) => ({
          ...prev,
          qrCodeUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle UPI ID change
  const handleUPIChange = (e) => {
    setPaymentData((prev) => ({
      ...prev,
      upiId: e.target.value,
    }));
  };

  // Update the API endpoints in the useEffect for fetching payment data
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await api.get("/admin-settings/payment-info", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (response.data.success) {
          setPaymentData({
            upiId: response.data.data.upiId || "",
            qrCode: null,
            qrCodeUrl: response.data.data.qrCodeUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch payment settings"
        );
      }
    };

    if (auth.user?.role === "Admin" || auth.user?.role === "Super Admin") {
      fetchPaymentData();
    }
  }, [auth.user, auth.token]);

  const handleSavePaymentSettings = async () => {
    try {
      const formData = new FormData();
      if (paymentData.qrCode) {
        formData.append("qrCode", paymentData.qrCode);
      }
      if (paymentData.upiId) {
        formData.append("upiId", paymentData.upiId);
      }

      const response = await api.put("/admin-settings/payment-info", formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Payment settings updated successfully!");
      }
    } catch (error) {
      console.error("Error updating payment settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to update payment settings"
      );
    }
  };

  // Update the delete payment settings handler
  const handleDeletePaymentSettings = async () => {
    try {
      const response = await api.delete("/admin-settings/payment-info", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        setPaymentData({
          upiId: "",
          qrCode: null,
          qrCodeUrl: "",
        });
        toast.success("Payment settings deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting payment settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete payment settings"
      );
    }
  };

  // Add role-based rendering
  const canManagePaymentSettings =
    auth.user?.role === "Admin" || auth.user?.role === "Super Admin";

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
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl shadow-lg">
            <img
              src={settingsIcon}
              alt="settings"
              className="w-6 h-6 text-white"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
            <p className="text-sm text-gray-400">
              Manage your admin profile and preferences
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-amber-500 rounded-xl transition-all duration-300 border border-gray-700"
        >
          <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-semibold tracking-wide text-sm">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Picture Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="text-purple-500" />
              Profile Picture
            </h3>

            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/20 group-hover:border-amber-500/40 transition-all duration-300">
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>

              <p className="text-sm text-gray-400">Maximum file size: 200KB</p>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleUpdateProfilePicture}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Update Picture
              </button>
            </div>
          </motion.div>

          {/* Password Change Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="text-blue-500" />
              Change Password
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleChangePassword}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          {/* Personal Information Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="text-blue-500" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Register Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    readOnly
                    className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 cursor-not-allowed"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400 text-sm">Read only</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSavePersonalInfo}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
          {/* Payment Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-purple-500" />
              Payment Information
            </h3>

            {/* QR Code Upload */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-32 h-32 rounded-xl bg-gray-700 overflow-hidden border-2 border-gray-600">
                {paymentData.qrCodeUrl ? (
                  <img
                    src={paymentData.qrCodeUrl}
                    alt="QR Code"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No QR Code
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-3">
                <label className="px-6 py-2.5 rounded-xl   bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800  text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                    </svg>
                    Upload QR Code
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleQRCodeChange}
                  />
                </label>
                <p className="text-sm text-gray-400">
                  Maximum file size: 200KB
                </p>
              </div>
            </div>

            {/* UPI ID Input */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-gray-300">
                UPI ID
              </label>
              <input
                type="text"
                value={paymentData.upiId}
                onChange={handleUPIChange}
                placeholder="Enter your UPI ID"
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeletePaymentSettings}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-red-900/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>

              <button
                onClick={handleSavePaymentSettings}
                className="px-6 py-2.5 rounded-xl  bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
                </svg>
                Save Payment Settings
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSettings;

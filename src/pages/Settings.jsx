import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Settings,
  User,
  Phone,
  Briefcase,
  Lock,
  Globe,
  Mail,
  MapPin,
  Info,
  Save,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import settingsIcon from "../assets/images/icons/setting.svg";
import api from "../hooks/api";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";

const toast = {
  success: (message) => showToast({ status: "success", message }),
  error: (message) => showToast({ status: "error", message }),
  warning: (message) => showToast({ status: "warning", message }),
  info: (message) => showToast({ status: "info", message }),
};

const Setting = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    mobile: "",
    address: "",

    // Business Info
    chapterName: "",
    joiningDate: "",
    companyName: "",
    businessCategory: "",
    gstNumber: "",

    // Social Media
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    website: "",
    whatsapp: "",

    // Password
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    "https://avatar.iran.liara.run/public"
  );
  const fileInputRef = useRef(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
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
            address: userData.address || "",
            chapterName: userData.chapter_name || "",
            joiningDate: userData.joiningDate || "",
            companyName: userData.company || "",
            businessCategory: userData.business_category || "",
            facebook: userData.facebook || "",
            instagram: userData.instagram || "",
            twitter: userData.twitter || "",
            linkedin: userData.linkedin || "",
            website: userData.website || "",
            whatsapp: userData.whatsapp || "",
            gstNumber: userData.gstNumber || "",
          }));

          // Set profile picture if available
          if (userData.profilePicture) {
            setProfilePictureUrl(userData.profilePicture);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
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
      // Check file size (200KB = 200 * 1024 bytes)
      if (file.size > 200 * 1024) {
        toast.error("File size must be less than 200KB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setProfilePicture(file);
      // Show preview
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
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile picture updated successfully!");
        setProfilePictureUrl(response.data.data.profilePicture);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  };

  // Add validation functions
  const isValidGSTNumber = (gst) => {
    if (!gst) return true; // Allow empty GST
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const isValidWhatsAppNumber = (number) => {
    if (!number) return true; // Allow empty WhatsApp number
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  // Update handleSaveSocialMedia to include validation
  const handleSaveSocialMedia = async () => {
    try {
      // Validate WhatsApp number if provided
      if (formData.whatsapp && !isValidWhatsAppNumber(formData.whatsapp)) {
        toast.error("Please enter a valid 10-digit WhatsApp number");
        return;
      }

      const response = await api.put("/members/settings/social-media", {
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        website: formData.website,
        whatsapp: formData.whatsapp,
      });

      if (response.data.success) {
        toast.success("Social media information updated successfully!");
      }
    } catch (error) {
      console.error("Error updating social media:", error);
      toast.error(
        error.response?.data?.message || "Failed to update information"
      );
    }
  };

  // Update handleSavePersonalInfo to show success/error messages
  const handleSavePersonalInfo = async () => {
    try {
      const response = await api.put("/members/settings/personal-info", {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        company: formData.companyName,
        business_category: formData.businessCategory,
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

  // Update handleGSTUpdate to use the correct endpoint
  const handleGSTUpdate = async () => {
    try {
      if (formData.gstNumber && !isValidGSTNumber(formData.gstNumber)) {
        toast.error("Please enter a valid GST number");
        return;
      }

      const response = await api.put("/members/settings/social-media", {
        gstNumber: formData.gstNumber,
      });

      if (response.data.success) {
        toast.success("GST number updated successfully!");
      }
    } catch (error) {
      console.error("Error updating GST number:", error);
      toast.error(
        error.response?.data?.message || "Failed to update GST number"
      );
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    try {
      const response = await api.put("/members/settings/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        toast.success("Password updated successfully!");
        // Clear password fields
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
              Manage your profile and preferences
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
              <User className="text-amber-500" />
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
                    id="profilePreview"
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
                onClick={() => handleUpdateProfilePicture()}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Update Picture
              </button>
            </div>
          </motion.div>

          {/* GST Information Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
            <h2 className="flex items-center space-x-2 font-semibold mb-4">
              <Info className="text-amber-400" />
              <span>GST Information</span>
            </h2>
            <div>
              <label className="block text-gray-400 text-sm">GST Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
                <Info className="absolute right-3 top-3 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Format: 22AAAAA0000A1Z5
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleGSTUpdate}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-2xl flex items-center space-x-2"
              >
                <Save />
                <span>Save GST</span>
              </button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="text-purple-500" />
              Change Password
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                onClick={() => handleChangePassword()}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </motion.div>
        </div>

        {/* Middle Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleSavePersonalInfo()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Personal Info
              </button>
            </div>
          </motion.div>

          {/* Business Information Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="text-yellow-500" />
              Business Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Chapter Name
                </label>
                <input
                  type="text"
                  name="chapterName"
                  value={formData.chapterName}
                  readOnly
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  readOnly
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  readOnly
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Business Category
                </label>
                <input
                  type="text"
                  name="businessCategory"
                  value={formData.businessCategory}
                  readOnly
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 text-white transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>

          {/* Social Media Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="text-pink-500" />
              Social Media Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Facebook Profile URL
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Twitter Profile URL
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  LinkedIn Profile URL
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="10-digit WhatsApp number"
                  className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleSaveSocialMedia()}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Social Links
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Setting;

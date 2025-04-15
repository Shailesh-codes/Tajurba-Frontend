import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import EditMemberModal from "../components/EditMemberModal";
import memberListIcon from "../assets/images/icons/users.svg";
import editIcon from "../assets/images/icons/edit.svg";
import settingsIcon from "../assets/images/icons/setting.svg";
import api from "../hooks/api";
import "../styles/styles.css";

// Import social media icons
import facebookIcon from "../assets/images/socials-media-logos/facebook.svg";
import instagramIcon from "../assets/images/socials-media-logos/instagram.svg";
import linkedinIcon from "../assets/images/socials-media-logos/linkedin.svg";
import twitterIcon from "../assets/images/socials-media-logos/twitter.svg";
import whatsappIcon from "../assets/images/socials-media-logos/whatsapp.svg";
import websiteIcon from "../assets/images/socials-media-logos/website.svg";

const MemberView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch member data
        const memberResponse = await api.get(`members/members`);
        if (memberResponse.data.success) {
          const memberData = memberResponse.data.data.find(
            (m) => m.id === parseInt(id)
          );
          if (memberData) {
            setMember(memberData);
          }
        }

        // Fetch chapters data
        const chaptersResponse = await api.get(`chapters`);
        if (chaptersResponse.data.status === "success") {
          setChapters(chaptersResponse.data.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching member data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load member data",
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
  }, [id]);

  const toggleMemberStatus = async () => {
    const isActive = member?.status === "active";
    const result = await Swal.fire({
      title: isActive
        ? '<span class="text-gray-300 text-2xl font-bold">Deactivate Member?</span>'
        : '<span class="text-white text-2xl font-bold">Activate Member?</span>',
      html: `
        <div class="text-left space-y-6">
          <div class="flex items-center gap-4 p-6 ${
            isActive ? "bg-red-500/15" : "bg-green-500/15"
          } rounded-2xl border border-${
        isActive ? "red" : "green"
      }-500/30 backdrop-blur-sm shadow-inner">
            <div class="p-3.5 bg-gradient-to-br ${
              isActive
                ? "from-red-500/30 to-red-600/30"
                : "from-green-500/30 to-green-600/30"
            } rounded-xl border border-${
        isActive ? "red" : "green"
      }-500/40 shadow-lg transform hover:scale-105 transition-all duration-300">
              <i class="fas ${isActive ? "fa-user-slash" : "fa-user-check"} ${
        isActive ? "text-red-400" : "text-green-400"
      } text-xl animate__animated animate__pulse animate__infinite animate__slow"></i>
            </div>
            <div>
              <h3 class="font-semibold text-lg ${
                isActive ? "text-red-400" : "text-green-400"
              } tracking-wide">${member.name}</h3>
              <p class="text-sm text-gray-400 flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full ${
                  isActive ? "bg-green-500 animate-pulse" : "bg-gray-500"
                }"></span>
                ${
                  isActive
                    ? "Currently Active Member"
                    : "Currently Inactive Member"
                }
              </p>
            </div>
          </div>
          
          <div class="p-5 bg-gradient-to-br from-gray-700/40 to-gray-800/40 rounded-xl border border-gray-600/40 shadow-md hover:shadow-lg transition-all duration-300">
            <p class="text-sm text-gray-300 leading-relaxed">
              ${
                isActive
                  ? "This action will <span class='text-red-400 font-medium'>deactivate</span> the member's account. They won't be able to access their account until reactivated."
                  : "This action will <span class='text-green-400 font-medium'>reactivate</span> the member's account. They will regain access to their account immediately."
              }
            </p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: `
        <div class="flex items-center gap-2">
          <i class="fas ${
            isActive ? "fa-user-slash" : "fa-user-check"
          } animate__animated animate__fadeIn"></i>
          <span>${isActive ? "Yes, Deactivate" : "Yes, Activate"}</span>
        </div>
      `,
      cancelButtonText: `
        <div class="flex items-center gap-2">
          <i class="fas fa-times"></i>
          <span>Cancel</span>
        </div>
      `,
      background: "linear-gradient(145deg, #1F2937, #111827)",
      backdrop: false,
      customClass: {
        popup:
          "bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl animate__animated animate__zoomIn",
        title: "text-2xl font-bold text-white mb-6",
        htmlContainer: "text-gray-300",
        actions: "border-t border-gray-700/50 mt-6 py-4",
        confirmButton: `
          ${
            isActive
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          } text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-${
          isActive ? "red" : "amber"
        }-500/30 hover:-translate-y-1 transform
        `,
        cancelButton:
          "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20 hover:-translate-y-1 transform",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slower",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slower",
      },
      buttonsStyling: true,
      reverseButtons: true,
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      try {
        // Update the API endpoint and request
        const response = await api.patch(`members/members/${id}/status`, {
          status: isActive ? "inactive" : "active",
        });

        if (response.data.success) {
          // Update the local member state with the new status
          setMember({
            ...member,
            status: isActive ? "inactive" : "active",
          });

          // Enhanced success alert
          Swal.fire({
            html: `
            <div class="flex items-start gap-3 p-1">
              <div class="flex-shrink-0">
                <div class="p-2 ${
                  isActive ? "bg-red-500/15" : "bg-green-500/15"
                } rounded-lg border ${
              isActive ? "border-red-500/30" : "border-green-500/30"
            } shadow-lg">
                  <i class="fas ${
                    isActive ? "fa-user-slash" : "fa-user-check"
                  } ${
              isActive ? "text-red-400" : "text-green-400"
            } text-sm"></i>
                </div>
              </div>
              <div class="flex flex-col min-w-[200px]">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold ${
                    isActive ? "text-red-400" : "text-green-400"
                  }">${member.name}</h3>
                  <span class="px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-green-500/10 text-green-400 border-green-500/20"
                  } rounded-full border">
                    ${isActive ? "Deactivated" : "Activated"}
                  </span>
                </div>
                <div class="mt-1 p-2 ${
                  isActive ? "bg-red-500/10" : "bg-green-500/10"
                } rounded-md border ${
              isActive ? "border-red-500/20" : "border-green-500/20"
            }">
                  <p class="text-xs text-gray-300">
                    ${
                      isActive
                        ? "Member has been successfully deactivated"
                        : "Member has been successfully activated"
                    }
                  </p>
                </div>
              </div>
            </div>
          `,
            position: "top-right",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            background: "linear-gradient(145deg, #1F2937, #111827)",
            width: "auto",
            padding: "1rem",
            backdrop: false,
            customClass: {
              popup:
                "swal-smooth-enter bg-gray-800 rounded-xl border border-gray-700 shadow-lg",
              timerProgressBar: `${isActive ? "bg-red-500" : "bg-green-500"}`,
            },
            showClass: {
              popup: "swal-smooth-enter-active",
            },
            hideClass: {
              popup: "swal-smooth-leave-active",
            },
          });
        }
      } catch (error) {
        console.error("Error updating member status:", error);
        // Enhanced error alert
        Swal.fire({
          html: `
            <div class="flex items-start gap-3 p-1">
              <div class="flex-shrink-0">
                <div class="p-2 bg-red-500/15 rounded-lg border border-red-500/30 shadow-lg">
                  <i class="fas fa-exclamation-triangle text-red-400 text-sm"></i>
                </div>
              </div>
              <div class="flex flex-col min-w-[200px]">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold text-red-400">Operation Failed</h3>
                  <span class="px-2 py-0.5 text-xs bg-red-500/10 text-red-400 border-red-500/20 rounded-full border">
                    Error
                  </span>
              </div>
                <div class="mt-1 p-2 bg-red-500/10 rounded-md border border-red-500/20">
                  <p class="text-xs text-gray-300">
                    ${
                      error.response?.data?.message ||
                      "Failed to update member status. Please try again."
                    }
                  </p>
                </div>
              </div>
            </div>
          `,
          position: "top-right",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          background: "linear-gradient(145deg, #1F2937, #111827)",
          width: "auto",
          padding: "1rem",
          backdrop: false,
          customClass: {
            popup:
              "animate__animated bg-gray-800 rounded-xl border border-gray-700 shadow-lg custom-animation-duration",
            timerProgressBar: "bg-red-500",
          },
          showClass: {
            popup: "animate__animated animate__fadeInRight animate__custom",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutRight animate__custom",
          },
        });
      }
    }
  };

  const showAlert = (type, message) => {
    Swal.fire({
      icon: type,
      text: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#111827",
      color: "#fff",
    });
  };

  const previewProfileImage = (imageSrc) => {
    Swal.fire({
      background: "#111827",
      showCloseButton: true,
      showConfirmButton: false,
      width: "auto",
      html: `
        <div class="p-1">
          <img src="${imageSrc}" 
               alt="Profile Image" 
               class="max-w-[300px] w-full rounded-lg shadow-lg">
        </div>
      `,
      customClass: {
        popup: "bg-gray-900 border-gray-700 rounded-2xl border",
        closeButton: "text-gray-400 hover:text-gray-100 focus:outline-none",
        htmlContainer: "p-0",
      },
    });
  };

  // Add handleEditClick function
  const handleEditClick = () => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  // Add handleEditSubmit function
  const handleEditSubmit = async (formData) => {
    try {
      setMember({
        ...member,
        full_name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        chapter_id: formData.chapter,
        chapter_name: chapters.find(
          (c) => c.chapter_id === parseInt(formData.chapter)
        )?.chapter_name,
        joining_date: formData.date,
        company_name: formData.company,
        business_category: formData.business_category,
      });

      setEditModalOpen(false);

      // Show success message
      Swal.fire({
        icon: "success",
        title:
          '<span class="text-lg font-semibold text-white">Profile Updated</span>',
        html: `
          <div class="flex items-center gap-3 mt-2">
            <div class="p-2 bg-amber-500/20 rounded-lg">
              <i class="fas fa-check text-amber-400"></i>
            </div>
            <p class="text-sm text-gray-300">
              Member profile has been successfully updated
            </p>
          </div>
        `,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: "linear-gradient(145deg, #1F2937, #111827)",
        customClass: {
          popup:
            "animate__animated bg-gray-800 rounded-xl border border-gray-700 shadow-lg custom-animation-duration",
          title: "text-white",
          htmlContainer: "text-gray-300",
        },
        showClass: {
          popup: "animate__animated animate__fadeInRight animate__custom",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutRight animate__custom",
        },
      });
    } catch (error) {
      // Show error message
      Swal.fire({
        icon: "error",
        title:
          '<span class="text-lg font-semibold text-white">Update Failed</span>',
        html: `
          <div class="flex items-center gap-3 mt-2">
            <div class="p-2 bg-red-500/20 rounded-lg">
              <i class="fas fa-exclamation-triangle text-red-400"></i>
            </div>
            <p class="text-sm text-gray-300">
              Failed to update member profile. Please try again.
            </p>
          </div>
        `,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        background: "linear-gradient(145deg, #1F2937, #111827)",
        customClass: {
          popup:
            "animate__animated bg-gray-800 rounded-xl border border-gray-700 shadow-lg custom-animation-duration",
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-32 p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

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
            <h2 className="text-2xl font-bold text-white">Member Profile</h2>
            <p className="text-sm text-gray-400">
              View and manage member details
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleEditClick}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
          >
            <img
              src={editIcon}
              alt="Edit"
              className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-semibold tracking-wide text-sm">
              Edit Profile
            </span>
          </button>
          <button
            onClick={toggleMemberStatus}
            className={`group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r ${
              member?.status === "active"
                ? "from-red-800 to-red-900 hover:from-red-700 hover:to-red-950"
                : "from-green-600 to-green-900 hover:from-green-700 hover:to-green-950"
            } text-white/90 hover:text-white rounded-xl transition-all duration-300 hover:shadow-x hover:-translate-y-0.5`}
          >
            <img
              src={settingsIcon}
              alt="Settings"
              className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-semibold tracking-wide text-sm">
              {member?.status === "active"
                ? "Deactivate Member"
                : "Activate Member"}
            </span>
          </button>
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
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl"></div>

            <div className="flex flex-col items-center relative">
              <div className="relative mb-8 group">
                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-amber-500/20 p-1 bg-gradient-to-br from-gray-700 to-gray-800">
                  <img
                    src={
                      member?.profile_image ||
                      "https://avatar.iran.liara.run/public"
                    }
                    alt="Member Avatar"
                    className="w-full h-full object-cover rounded-full cursor-pointer transition-transform duration-300 group-hover:scale-110"
                    onClick={() =>
                      previewProfileImage(
                        member?.profile_image ||
                          "https://avatar.iran.liara.run/public"
                      )
                    }
                  />
                </div>
                <div
                  className={`absolute bottom-2 right-2 p-2.5 rounded-full border-4 border-gray-800 ${
                    member?.status === "active"
                      ? "bg-gradient-to-r from-green-400 to-green-500"
                      : "bg-gradient-to-r from-red-400 to-red-500"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-4 mb-6">
                {member?.facebook_link && (
                  <a
                    href={member.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-gray-700 rounded-xl hover:bg-[#3B5998] transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <img
                      src={facebookIcon}
                      alt="Facebook"
                      className="w-10 h-5"
                    />
                  </a>
                )}
                {member?.instagram_link && (
                  <a
                    href={member.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-gray-700 rounded-xl hover:bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <img
                      src={instagramIcon}
                      alt="Instagram"
                      className="w-10 h-5"
                    />
                  </a>
                )}
                {member?.linkedin_link && (
                  <a
                    href={member.linkedin_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-gray-700 rounded-xl hover:bg-[#0A66C2] transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <img
                      src={linkedinIcon}
                      alt="LinkedIn"
                      className="w-10 h-5"
                    />
                  </a>
                )}
                {member?.twitter_link && (
                  <a
                    href={member.twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-gray-700 rounded-xl hover:bg-[#000000] transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <img src={twitterIcon} alt="Twitter" className="w-10 h-5" />
                  </a>
                )}
                {member?.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <img src={websiteIcon} alt="Website" className="w-10 h-5" />
                  </a>
                )}
                {member?.whatsapp && (
                  <a
                    href={`https://wa.me/${member.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-gray-700 rounded-xl hover:bg-[#25D366] transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <img
                      src={whatsappIcon}
                      alt="WhatsApp"
                      className="w-10 h-5"
                    />
                  </a>
                )}
              </div>

              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-3 text-center">
                {member?.name}
              </h3>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20">
                  {member?.chapter_name}
                </span>
              </div>

              <div className="w-full border-t border-gray-700/50 pt-6">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-700/30">
                    <p className="text-sm text-gray-400 mb-1">Member Since</p>
                    <p className="text-xs font-semibold text-white">
                      {member?.created_at
                        ? new Date(member.created_at).toLocaleDateString()
                        : "--"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-700/30">
                    <p className="text-sm text-gray-400 mb-1">Join Date</p>
                    <p className="text-xs font-semibold text-white">
                      {member?.joiningDate
                        ? new Date(member.joiningDate).toLocaleDateString()
                        : "--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Information Cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Contact Information */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Contact Information
                </h3>
                <p className="text-sm text-gray-400">
                  Member's personal and business details
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ContactField
                label="Full Name"
                value={member?.name}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                gradient="from-gray-600/20 to-gray-700/20"
                borderColor="border-gray-600/30"
                iconColor="text-gray-400"
              />
              <ContactField
                label="Email"
                value={member?.email}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
                gradient="from-purple-500/20 to-purple-600/20"
                borderColor="border-purple-500/30"
                iconColor="text-purple-400"
              />
              <ContactField
                label="Mobile"
                value={member?.mobile}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                }
                gradient="from-blue-500/20 to-blue-600/20"
                borderColor="border-blue-500/30"
                iconColor="text-blue-400"
              />
              <ContactField
                label="Company"
                value={member?.company}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                }
                gradient="from-gray-600/20 to-gray-700/20"
                borderColor="border-gray-600/30"
                iconColor="text-gray-400"
              />
              <ContactField
                label="Business Category"
                value={member?.business_category}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
                gradient="from-gray-600/20 to-gray-700/20"
                borderColor="border-gray-600/30"
                iconColor="text-gray-400"
              />

              <ContactField
                label="Website Link"
                value={member?.website}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"
                    />
                  </svg>
                }
                gradient="from-gray-600/20 to-gray-700/20"
                borderColor="border-gray-600/30"
                iconColor="text-gray-400"
              />
            </div>
          </div>
        </motion.div>
      </div>

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

// Helper component for contact fields
const ContactField = ({
  label,
  value,
  icon,
  gradient,
  borderColor,
  iconColor,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-400">{label}</label>
    <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-colors group">
      <div
        className={`p-2.5 bg-gradient-to-br ${
          gradient || "from-gray-600/20 to-gray-700/20"
        } rounded-lg border ${
          borderColor || "border-gray-600/30"
        } group-hover:scale-110 transition-transform duration-300`}
      >
        <div className={`${iconColor || "text-gray-400"}`}>{icon}</div>
      </div>
      <p className="font-medium text-white break-all">{value || "--"}</p>
    </div>
  </div>
);

export default MemberView;

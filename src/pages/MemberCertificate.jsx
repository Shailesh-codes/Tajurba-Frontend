import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsAward } from "react-icons/bs";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import view from "../assets/images/icons/view.svg";
import download from "../assets/images/icons/download.svg";
import api from "../hooks/api";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MemberCertificate = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);

        // Check if user is authenticated
        if (!auth.isAuthenticated || !auth.user?.id) {
          Swal.fire({
            icon: "error",
            title: "Authentication Error",
            text: "Please login to view your certificates",
            background: "#111827",
            color: "#fff",
          }).then(() => {
            navigate("/");
          });
          return;
        }

        // Get token from auth context
        const token = auth.token || localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await api.get(`/certificates/member/${auth.user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          setCertificates(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch certificates"
          );
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to fetch certificates",
          background: "#111827",
          color: "#fff",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [auth, navigate]);

  const filteredCertificates = certificates.filter((cert) => {
    const matchesType = !selectedType || cert.certificate_type === selectedType;
    const certDate = new Date(cert.issued_date);
    const certMonth = `${certDate.getFullYear()}-${String(
      certDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const matchesMonth = !selectedMonth || certMonth === selectedMonth;
    return matchesType && matchesMonth;
  });

  const formatCertificateType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const downloadCertificateAsPDF = async (certificate) => {
    try {
      // Show loading state
      Swal.fire({
        title: "Generating PDF",
        html: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const img = new Image();
      const imagePath = `/src/Certificates/public/assets/${
        certificate.certificate_type === "highest_business"
          ? "businessImage.jpg"
          : certificate.certificate_type === "highest_visitor"
          ? "visitorImage.jpg"
          : certificate.certificate_type === "best_elevator_pitch"
          ? "elevatorImage.jpg"
          : certificate.certificate_type === "maximum_referrals"
          ? "refImage.jpg"
          : "mdpImage.jpg"
      }`;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imagePath;
        img.crossOrigin = "Anonymous";
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 3508; // A4 width at 300 DPI
      canvas.height = 2480; // A4 height at 300 DPI

      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Configure text styles for name
      ctx.font = "140px Greates-Draken";
      ctx.fillStyle = "black";
      ctx.textAlign = "center"; // This can be changed to 'left' or 'right' if needed

      // Position calculations based on certificate type
      let nameX, nameY, dateX, dateY;

      if (certificate.certificate_type === "highest_visitor") {
        // Adjust these values for highest visitor certificate
        nameX = canvas.width * 0.39; // 39% from left
        nameY = canvas.height * 0.35; // 35% from top
        dateX = canvas.width * 0.3; // 23% from left
        dateY = canvas.height * 0.5; // 45% from top
      } else if (certificate.certificate_type === "mdp_attended") {
        // Positions for MDP certificate
        nameX = canvas.width * 0.4; // Center
        nameY = canvas.height * 0.55;
        dateX = canvas.width * 0.45; // Center
        dateY = canvas.height * 0.68;
      } else if (certificate.certificate_type === "highest_business") {
        // Positions for business certificate
        nameX = canvas.width * 0.39;
        nameY = canvas.height * 0.35;
        dateX = canvas.width * 0.3;
        dateY = canvas.height * 0.5;
      } else if (certificate.certificate_type === "best_elevator_pitch") {
        // Positions for elevator pitch certificate
        nameX = canvas.width * 0.39;
        nameY = canvas.height * 0.35;
        dateX = canvas.width * 0.3;
        dateY = canvas.width * 0.5;
      } else {
        // Default positions
        nameX = canvas.width * 0.39;
        nameY = canvas.height * 0.35;
        dateX = canvas.width * 0.3;
        dateY = canvas.height * 0.5;
      }

      // Draw member name
      ctx.save(); // Save current context state
      ctx.textAlign = "left"; // Set alignment for name
      ctx.fillText(certificate.member_name, nameX, nameY);
      ctx.restore(); // Restore context state

      // Configure text styles for date
      ctx.save(); // Save current context state
      ctx.font = "80px Arial";
      ctx.textAlign = "left"; // Set alignment for date
      ctx.fillText(formatDate(certificate.issued_date), dateX, dateY);
      ctx.restore(); // Restore context state

      // Convert to PDF
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

      // Save the PDF
      pdf.save(
        `${certificate.member_name}_${formatCertificateType(
          certificate.certificate_type
        )}_Certificate.pdf`
      );

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Certificate downloaded successfully",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#b45309",
      });
    } catch (error) {
      console.error("Error downloading certificate:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to download certificate. Please try again.",
        background: "#111827",
        color: "#fff",
      });
    }
  };

  const handleViewCertificate = async (certificate) => {
    try {
      Swal.fire({
        html: `
          <div class="certificate-modal-container">
            <!-- Decorative top border -->
            <div class="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 rounded-t-xl"></div>
            
            <!-- Certificate title -->
            <div class="bg-gradient-to-b from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700">
              <h3 class="text-xl font-semibold text-amber-500">
                ${formatCertificateType(certificate.certificate_type)}
              </h3>
              <p class="text-gray-400 text-sm mt-1">Issued on ${formatDate(
                certificate.issued_date
              )}</p>
            </div>

            <!-- Certificate container with enhanced styling -->
            <div class="relative p-6 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
              <!-- Decorative corner elements -->
              <div class="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/20 rounded-tl-xl"></div>
              <div class="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/20 rounded-tr-xl"></div>
              <div class="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/20 rounded-bl-xl"></div>
              <div class="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/20 rounded-br-xl"></div>

              <!-- Original certificate content -->
              <div class="certificate-container bg-white rounded-xl shadow-2xl transform transition-transform duration-300 hover:scale-[1.02]">
                <div class="relative">
                  <img 
                    src="/src/Certificates/public/assets/${
                      certificate.certificate_type === "highest_business"
                        ? "businessImage.jpg"
                        : certificate.certificate_type === "highest_visitor"
                        ? "visitorImage.jpg"
                        : certificate.certificate_type === "best_elevator_pitch"
                        ? "elevatorImage.jpg"
                        : certificate.certificate_type === "maximum_referrals"
                        ? "refImage.jpg"
                        : "mdpImage.jpg"
                    }"
                    alt="Certificate"
                    class="w-full h-auto rounded-xl"
                  />
                  <div class="absolute inset-0">
                    <div class="font-greates" style="
                      position: absolute;
                      ${
                        certificate.certificate_type === "mdp_attended"
                          ? "top: 48%; left: 50%; transform: translateX(-50%); width: 60%;"
                          : "top: 28%; left: 39%; transform: translateX(-50%); width: 60%;"
                      }
                      text-align: center;
                      font-size: 32px;
                      color: black;
                      font-family: 'Greates-Draken', cursive;
                      text-transform: capitalize;
                    ">
                      ${certificate.member_name}
                    </div>
                    <div style="
                      position: absolute;
                      ${
                        certificate.certificate_type === "mdp_attended"
                          ? "top: 64%; left: 50%; transform: translateX(-50%); width: 120px;"
                          : "top: 46%; left: 23%; width: 200px;"
                      }
                      text-align: center;
                      font-size: 16px;
                      color: black;
                    ">
                      ${formatDate(certificate.issued_date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer with actions -->
            <div class="bg-gradient-to-b from-gray-900 to-gray-800 px-6 py-4 rounded-b-xl border-t border-gray-700">
              <div class="flex justify-end gap-4">
                <button 
                  onclick="window.downloadCertificate()"
                  class="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        `,
        width: 900,
        padding: 0,
        background: "#111827",
        showConfirmButton: false,
        showCloseButton: true,
        closeButtonHtml: `
          <button class="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        `,
        customClass: {
          container: "certificate-modal-container",
          popup: "rounded-xl border border-gray-700 shadow-2xl",
          closeButton:
            "focus:outline-none text-gray-400 hover:text-white absolute top-3 right-3 z-10",
          htmlContainer: "p-0 m-0",
        },
      });

      // Add custom styles
      const style = document.createElement("style");
      style.textContent = `
        .certificate-modal-container {
          background: linear-gradient(to bottom, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.95));
          backdrop-filter: blur(10px);
        }
        @media print {
          .certificate-container {
            width: 100%;
            height: 100%;
          }
          .swal2-close, .modal-footer {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);

      // Add the download function to window object so it can be called from the modal
      window.downloadCertificate = () => {
        downloadCertificateAsPDF(certificate);
      };
    } catch (error) {
      console.error("Error viewing certificate:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to view certificate",
        background: "#111827",
        color: "#fff",
      });
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
            <BsAward className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Your Certificates</h2>
            <p className="text-sm text-gray-400">
              View and download your earned certificates
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700 shadow-xl p-6"
      >
        {/* Filters Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Certificate Type Filter */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Certificate Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300"
            >
              <option value="">All Types</option>
              <option value="highest_business">Highest Business Given</option>
              <option value="highest_visitor">Highest Visitor Invited</option>
              <option value="best_elevator_pitch">Best Elevator Pitch</option>
              <option value="maximum_referrals">Maximum Referrals Given</option>
              <option value="mdp_attended">MDP Attended</option>
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Month
            </label>
            <div className="relative">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition-all duration-300 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
              />
              <img
                src={calendarIcon}
                alt="calendar"
                className="absolute right-4 top-[50%] -translate-y-[50%] w-6 h-6 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="relative min-h-[300px] max-h-[calc(100vh-500px)]">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
          <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80">
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500/20"></div>
                  <div className="w-12 h-12 rounded-full border-t-2 border-amber-500 animate-spin absolute top-0"></div>
                </div>
              </div>
            ) : (
              <table className="w-full min-w-[800px] text-left border-separate border-spacing-0">
                <thead className="sticky top-0 z-20">
                  <tr>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 bg-gray-800 first:rounded-tl-xl whitespace-nowrap">
                      Sr No.
                    </th>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 bg-gray-800 whitespace-nowrap">
                      Certificate Type
                    </th>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 bg-gray-800 whitespace-nowrap">
                      Issue Date
                    </th>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 bg-gray-800 text-center last:rounded-tr-xl whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredCertificates.map((cert, index) => (
                    <motion.tr
                      key={cert.certificate_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-gray-800/50 transition-all duration-300 ease-in-out"
                    >
                      <td className="p-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-700/10 text-amber-500 font-medium group-hover:from-amber-500/20 group-hover:to-amber-700/20 transition-all duration-300">
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-amber-500/10 to-amber-700/10 text-amber-500 group-hover:from-amber-500/20 group-hover:to-amber-700/20 transition-all duration-300">
                          {formatCertificateType(cert.certificate_type)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
                            <img
                              src={calendarIcon}
                              alt="calendar"
                              className="w-5 h-5 opacity-50"
                            />
                          </span>
                          <span className="text-gray-300">
                            {formatDate(cert.issued_date)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewCertificate(cert)}
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-lg hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1"
                          >
                            <img src={view} alt="View" className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => downloadCertificateAsPDF(cert)}
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1"
                            title="Download Certificate"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Empty State */}
            {!loading && filteredCertificates.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 px-4"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/10 to-amber-700/10 flex items-center justify-center mb-6">
                  <BsAward className="w-12 h-12 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 text-center">
                  No Certificates Available
                </h3>
                <p className="text-gray-400 text-center max-w-md">
                  {selectedType || selectedMonth
                    ? "No certificates match your filter criteria. Try adjusting your filters."
                    : "You haven't received any certificates yet. Keep up the good work and earn your first certificate!"}
                </p>
                {(selectedType || selectedMonth) && (
                  <button
                    onClick={() => {
                      setSelectedType("");
                      setSelectedMonth("");
                    }}
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-amber-500/20 to-amber-700/20 text-amber-500 rounded-xl hover:from-amber-500/30 hover:to-amber-700/30 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberCertificate;

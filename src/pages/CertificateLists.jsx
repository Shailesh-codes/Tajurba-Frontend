import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, Trash2 } from "lucide-react";
import certificatesIcon from "../assets/images/icons/certi.svg";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import api from "../hooks/api";
import DeleteModal from "../layout/DeleteModal";
// Import certificate images
import businessImage from "../Certificates/public/assets/businessImage.jpg";
import visitorImage from "../Certificates/public/assets/visitorImage.jpg";
import elevatorImage from "../Certificates/public/assets/elevatorImage.jpg";
import refImage from "../Certificates/public/assets/refImage.jpg";
import mdpImage from "../Certificates/public/assets/mdpImage.jpg";

const CertificatesList = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    chapter: "",
    certificateType: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch certificates and chapters in parallel
      const [certificatesResponse, chaptersResponse] = await Promise.all([
        api.get(`/certificates`),
        api.get(`/chapters`),
      ]);

      if (certificatesResponse.data.status === "success") {
        setCertificates(certificatesResponse.data.data);
      }

      if (chaptersResponse.data.status === "success") {
        setChapters(chaptersResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const getCertificateImage = (type) => {
    switch (type) {
      case "highest_business":
        return businessImage;
      case "highest_visitor":
        return visitorImage;
      case "best_elevator_pitch":
        return elevatorImage;
      case "maximum_referrals":
        return refImage;
      case "mdp_attended":
        return mdpImage;
      default:
        return businessImage;
    }
  };

  const downloadAsPDF = async (container, certificateData) => {
    try {
      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(
        container.querySelector(".certificate-view"),
        {
          scale: 2, // Increase quality
          useCORS: true,
          allowTaint: true,
          logging: true,
          onclone: (document) => {
            // Ensure fonts are loaded
            const style = document.createElement("style");
            style.innerHTML = `
            @font-face {
              font-family: 'Greates-Draken';
              src: url('/src/Certificates/public/fonts/Greates-Draken.otf') format('opentype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `;
            document.head.appendChild(style);
          },
        }
      );

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${certificateData.member_name}_certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showAlert("error", "Failed to download PDF");
    }
  };

  const handlePrint = (container) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Certificate</title>
          <style>
            @media print {
              body { margin: 0; }
              img { width: 100%; height: auto; }
            }
          </style>
        </head>
        <body>
          ${container.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownload = async (certificate) => {
    try {
      // Show the certificate view first
      const modalResult = await Swal.fire({
        html: `
          <div class="certificate-container bg-white p-4 rounded-lg">
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
                class="w-full h-auto"
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
                  ${new Date(certificate.issued_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        `,
        width: 800,
        showConfirmButton: false,
        showCancelButton: false,
        confirmButtonText: "Print",
        cancelButtonText: "Close",
        customClass: {
          popup: "swal2-popup-large",
          confirmButton: false,
          cancelButton:
            "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700",
        },
      });

      if (modalResult.isConfirmed) {
        // Handle print
        const element = document.querySelector(".certificate-container");
        if (element) {
          const printWindow = window.open("", "_blank");
          printWindow.document.write(`
            <html>
              <head>
                <title>${certificate.member_name} - Certificate</title>
                <style>
                  @page {
                    margin: 0;
                    size: A4 portrait;
                  }
                  body {
                    margin: 0;
                    padding: 0;
                  }
                  .print-container {
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                  }
                  @media print {
                    body {
                      -webkit-print-color-adjust: exact;
                      print-color-adjust: exact;
                    }
                  }
                </style>
              </head>
              <body>
                <div class="print-container">
                  ${element.outerHTML}
                </div>
                <script>
                  window.onload = () => {
                    setTimeout(() => {
                      window.print();
                      setTimeout(() => window.close(), 500);
                    }, 300);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } catch (error) {
      console.error("Error handling certificate:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to process certificate",
        background: "#111827",
        color: "#fff",
      });
    }
  };

  const formatCertificateType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const showAlert = (icon, text) => {
    Swal.fire({
      icon,
      text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#111827",
      color: "#fff",
      customClass: {
        popup: "bg-gray-900 border-gray-700 rounded-2xl border",
      },
    });
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.member_name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesChapter =
      !filters.chapter || cert.chapter_id === parseInt(filters.chapter);
    const matchesType =
      !filters.certificateType ||
      cert.certificate_type === filters.certificateType;
    return matchesSearch && matchesChapter && matchesType;
  });

  // Add certificate type style function
  const getCertificateTypeStyle = (type) => {
    const styles = {
      highest_business: "from-blue-600 to-blue-900",
      highest_visitor: "from-amber-600 to-amber-900",
      best_elevator_pitch: "from-purple-600 to-purple-900",
      maximum_referrals: "from-yellow-600 to-yellow-900",
      mdp_attended: "from-red-600 to-red-900",
    };
    return styles[type] || "from-gray-600 to-gray-900";
  };

  const handleDelete = async () => {
    try {
      // Show loading state
      Swal.fire({
        title: "Deleting...",
        background: "#111827",
        color: "#fff",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });

      // Make the delete request
      const response = await api.delete(
        `/certificates/${certificateToDelete.certificate_id}`
      );

      if (response.data.status === "success") {
        // Update the local state by removing the deleted certificate
        setCertificates((prevCerts) =>
          prevCerts.filter(
            (cert) => cert.certificate_id !== certificateToDelete.certificate_id
          )
        );

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Certificate has been deleted successfully.",
          background: "#111827",
          color: "#fff",
          customClass: {
            popup: "bg-gray-900 border-gray-700 rounded-2xl border",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
        });
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to delete certificate. Please try again.",
        background: "#111827",
        color: "#fff",
        customClass: {
          popup: "bg-gray-900 border-gray-700 rounded-2xl border",
          title: "text-white",
          htmlContainer: "text-gray-300",
        },
      });
    } finally {
      setShowDeleteModal(false);
      setCertificateToDelete(null);
    }
  };

  return (
    <div className="mt-32 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img
              src={certificatesIcon}
              alt="Certificates"
              className="w-6 h-6"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">Certificates List</h1>
            <h2 className="text-sm text-gray-400">
              View all assigned certificates
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
            onClick={() => navigate("/assign-certificates")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Assign Certificate
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Search by member name..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white"
            />
          </div>

          <div>
            <select
              value={filters.chapter}
              onChange={(e) =>
                setFilters({ ...filters, chapter: e.target.value })
              }
              className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white"
            >
              <option value="">All Chapters</option>
              {chapters.map((chapter) => (
                <option key={chapter.chapter_id} value={chapter.chapter_id}>
                  {chapter.chapter_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.certificateType}
              onChange={(e) =>
                setFilters({ ...filters, certificateType: e.target.value })
              }
              className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white"
            >
              <option value="">All Types</option>
              <option value="highest_business">Highest Business Given</option>
              <option value="highest_visitor">Highest Visitor Invited</option>
              <option value="best_elevator_pitch">Best Elevator Pitch</option>
              <option value="maximum_referrals">Maximum Referrals Given</option>
              <option value="mdp_attended">MDP Attended</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-900 rounded-xl border border-gray-700">
            <img
              src={certificatesIcon}
              alt="No Certificates"
              className="w-32 h-32 mb-4 opacity-50"
            />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Certificates Available
            </h3>
            <p className="text-gray-400 text-center">
              {filters.search || filters.chapter || filters.certificateType
                ? "No matching certificates found"
                : "No certificates have been issued yet."}
            </p>
          </div>
        ) : (
          <div className="relative min-h-[300px] max-h-[calc(100vh-500px)]">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
            <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/80 scrollbar-hide">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="relative">
                  <tr>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap bg-gray-800/95 backdrop-blur-sm z-10 border-b border-gray-700">
                      Sr No.
                    </th>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap bg-gray-800/95 backdrop-blur-sm z-10 border-b border-gray-700">
                      Member Name
                    </th>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap bg-gray-800/95 backdrop-blur-sm z-10 border-b border-gray-700">
                      Chapter
                    </th>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap bg-gray-800/95 backdrop-blur-sm z-10 border-b border-gray-700">
                      Certificate Type
                    </th>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap bg-gray-800/95 backdrop-blur-sm z-10 border-b border-gray-700">
                      Issue Date
                    </th>
                    <th className="sticky top-0 p-4 font-semibold text-gray-300 text-center whitespace-nowrap bg-gray-800/95 backdrop-blur-sm z-10 border-b border-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="relative">
                  {filteredCertificates.map((cert, index) => (
                    <tr
                      key={cert.certificate_id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="p-4 text-white whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="p-4 text-white whitespace-nowrap">
                        {cert.member_name}
                      </td>
                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {chapters.find(
                          (ch) => ch.chapter_id === cert.chapter_id
                        )?.chapter_name || "Unknown Chapter"}
                      </td>
                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-medium rounded-lg bg-gradient-to-r ${getCertificateTypeStyle(
                            cert.certificate_type
                          )}`}
                        >
                          {formatCertificateType(cert.certificate_type)}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        <div className="relative">
                          <input
                            type="date"
                            value={cert.issued_date?.split("T")[0]}
                            readOnly
                            className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0 text-white [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                          />
                          <img
                            src={calendarIcon}
                            alt="calendar"
                            className="absolute right-4 top-[50%] -translate-y-[50%] w-6 h-6 pointer-events-none text-white"
                          />
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleDownload(cert)}
                            className="group flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5"
                            title="View Certificate"
                          >
                            <Eye className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                          </button>
                          <button
                            onClick={() => {
                              setCertificateToDelete(cert);
                              setShowDeleteModal(true);
                            }}
                            className="group flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-600 to-red-900 hover:from-red-700 hover:to-red-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-red-900/30 hover:-translate-y-0.5"
                            title="Delete Certificate"
                          >
                            <Trash2 className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add DeleteModal at the end of the component */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCertificateToDelete(null);
        }}
        onDelete={handleDelete}
        itemName={`Certificate for ${certificateToDelete?.member_name || ""}`}
      />
    </div>
  );
};

export default CertificatesList;

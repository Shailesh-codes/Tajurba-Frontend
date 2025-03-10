import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import certificatesIcon from "../assets/images/icons/certi.svg";
import calendarIcon from "../assets/images/icons/calender-icon.svg";
import download from "../assets/images/icons/download.svg";
import Certificate from "../Certificates/components/Certificate";

const CertificatesList = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    chapter: "",
    certificateType: "",
  });

  // Add dummy data
  const dummyData = [
    {
      certificate_id: 1,
      member_name: "John Doe",
      chapter_name: "Mumbai Central",
      certificate_type: "highest_business",
      achievement: "₹500,000 Business Generated",
      issued_date: "2024-03-15",
    },
    {
      certificate_id: 2,
      member_name: "Jane Smith",
      chapter_name: "Delhi North",
      certificate_type: "highest_visitor",
      achievement: "15 Visitors Invited",
      issued_date: "2024-03-14",
    },
    {
      certificate_id: 3,
      member_name: "Raj Kumar",
      chapter_name: "Bangalore East",
      certificate_type: "best_elevator_pitch",
      achievement: "Outstanding Presentation",
      issued_date: "2024-03-13",
    },
    {
      certificate_id: 4,
      member_name: "Priya Patel",
      chapter_name: "Chennai Central",
      certificate_type: "maximum_referrals",
      achievement: "25 Quality Referrals",
      issued_date: "2024-03-12",
    },
    {
      certificate_id: 5,
      member_name: "Alex Wilson",
      chapter_name: "Pune West",
      certificate_type: "mdp_attended",
      achievement: "Leadership Development Program",
      issued_date: "2024-03-11",
    },
  ];

  // Modify useEffect to use dummy data
  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setCertificates(dummyData);
      setChapters([
        { chapter_id: 1, chapter_name: "Mumbai Central" },
        { chapter_id: 2, chapter_name: "Delhi North" },
        { chapter_id: 3, chapter_name: "Bangalore East" },
        { chapter_id: 4, chapter_name: "Chennai Central" },
        { chapter_id: 5, chapter_name: "Pune West" },
      ]);
      setLoading(false);
    }, 1000); // Simulate 1 second loading time
  }, []);

  const handleDownload = async (certificate) => {
    try {
      console.log("Handling download for certificate:", certificate);

      const loadingAlert = Swal.fire({
        title: 'Generating...',
        text: 'Please wait while we generate your certificate',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
        background: '#111827',
        color: '#fff',
      });

      // Create a modal to show the certificate
      const result = await Swal.fire({
        html: <Certificate 
          name={certificate.member_name}
          date={certificate.issued_date}
          certificateType={certificate.certificate_type}
        />,
        width: '900px',
        background: '#404040',
        showConfirmButton: true,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
          popup: 'certificate-modal', // Add custom class for styling
        },
        didOpen: (modal) => {
          console.log("Modal opened with certificate:", certificate);
        }
      });

      await loadingAlert.close();

    } catch (error) {
      console.error("Error generating certificate:", error);
      showAlert("error", "Failed to generate certificate");
    }
  };

  const handleDelete = async (certificateId) => {
    const result = await Swal.fire({
      background: "#111827",
      color: "#fff",
      icon: "warning",
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this certificate? This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "bg-gray-900 border-gray-700 rounded-2xl border",
        title: "text-white",
        htmlContainer: "text-gray-300",
        confirmButton:
          "bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-6 py-2",
        cancelButton:
          "bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg px-6 py-2",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post("/api/certificates", {
          action: "delete",
          certificate_id: certificateId,
        });

        if (response.data.status === "success") {
          showAlert("success", "Certificate deleted successfully");
          loadCertificates();
        }
      } catch (error) {
        console.error("Error deleting certificate:", error);
        showAlert("error", "Failed to delete certificate");
      }
    }
  };

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
      !filters.chapter || cert.chapter_name === filters.chapter;
    const matchesType =
      !filters.certificateType ||
      cert.certificate_type === filters.certificateType;
    return matchesSearch && matchesChapter && matchesType;
  });

  // Add certificate type style function
  const getCertificateTypeStyle = (type) => {
    const styles = {
      highest_business: "from-blue-600 to-blue-900",
      highest_visitor: "from-green-600 to-green-900",
      best_elevator_pitch: "from-purple-600 to-purple-900",
      maximum_referrals: "from-yellow-600 to-yellow-900",
      mdp_attended: "from-red-600 to-red-900",
    };
    return styles[type] || "from-gray-600 to-gray-900";
  };

  return (
    <div className="mt-32 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3">
          <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
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
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-green-500 rounded-xl transition-all duration-300 border border-gray-700"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-900 hover:from-green-700 hover:to-green-950 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5 transition-all duration-300"
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
              className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white"
            />
          </div>

          <div>
            <select
              value={filters.chapter}
              onChange={(e) =>
                setFilters({ ...filters, chapter: e.target.value })
              }
              className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white"
            >
              <option value="">All Chapters</option>
              {chapters.map((chapter) => (
                <option key={chapter.chapter_id} value={chapter.chapter_name}>
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
              className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white"
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
          <div className="py-8 text-center text-gray-400">
            Loading certificates...
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-800">
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap">
                    Sr No.
                  </th>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap">
                    Member Name
                  </th>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap">
                    Chapter
                  </th>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap">
                    Certificate Type
                  </th>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap">
                    Issue Date
                  </th>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 text-center whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredCertificates.map((cert, index) => (
                  <tr
                    key={cert.certificate_id}
                    className="hover:bg-gray-700/50"
                  >
                    <td className="p-4 text-white whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="p-4 text-white whitespace-nowrap">
                      {cert.member_name}
                    </td>
                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {cert.chapter_name}
                    </td>
                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-lg bg-gradient-to-r ${getCertificateTypeStyle(cert.certificate_type)}`}>
                        {formatCertificateType(cert.certificate_type)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      <div className="relative">
                        <input
                          type="date"
                          value={cert.issued_date}
                          readOnly
                          className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
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
                          className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5"
                          title="Download Certificate"
                        >
                          <svg
                            className="w-5 h-5 opacity-70 group-hover:opacity-100"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(cert.certificate_id)}
                          className="group flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-600 to-red-900 hover:from-red-700 hover:to-red-950 text-white/90 hover:text-white rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-red-900/30 hover:-translate-y-0.5"
                          title="Delete Certificate"
                        >
                          <svg
                            className="w-5 h-5 opacity-70 group-hover:opacity-100"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesList;

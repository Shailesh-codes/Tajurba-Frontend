import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import attendanceIcon from "../assets/images/icons/attendance-icon.svg";
import api from "../hooks/api";

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    meetings: { total: 0, marked: 0, pending: 0 },
    mdp: { total: 0, marked: 0, pending: 0 },
    social: { total: 0, marked: 0, pending: 0 },
    events: { total: 0, marked: 0, pending: 0 },
  });
  const [formData, setFormData] = useState({
    markingType: "attendance",
    attendanceType: "",
    meetingId: "",
  });
  const [meetings, setMeetings] = useState([]);

  // Update loadMeetingsByType to fetch from backend
  const loadMeetingsByType = async (type) => {
    if (!type) {
      setMeetings([]);
      return;
    }

    try {
      // Convert frontend type to backend type format
      const backendType = type === "social" ? "social_training" : type;
      const response = await axios.get(`${api}/schedules?type=${backendType}`);
      
      if (response.data.success) {
        let meetingsData = response.data.data;
        
        // Handle different response structures based on type
        if (type === "meetings") {
          meetingsData = response.data.data.meetings || [];
        } else if (type === "events") {
          meetingsData = response.data.data.events || [];
        }

        // Transform the data to match the expected format
        const transformedMeetings = meetingsData.map(meeting => {
          const id = meeting.meeting_id || meeting.event_id || meeting.mdp_id || meeting.social_training_id;
          return {
            id: id,
            display_title: `${meeting.title} - ${new Date(meeting.date).toLocaleDateString()} ${meeting.time}`,
            venue: meeting.venue,
            date: meeting.date,
            time: meeting.time
          };
        });
        
        setMeetings(transformedMeetings);
      } else {
        showAlert("error", "Failed to load meetings");
      }
    } catch (error) {
      console.error("Error loading meetings:", error);
      showAlert("error", "Failed to load meetings");
      setMeetings([]);
    }
  };

  // Modify handleContinue to navigate to the correct page
  const handleContinue = () => {
    const { markingType, attendanceType, meetingId } = formData;

    if (!meetingId) {
      showAlert("error", "Please select a meeting first");
      return;
    }

    // Navigate to the appropriate page based on marking type
    if (markingType === "attendance") {
      navigate(
        `/attendance-venue-fee?marking_type=${markingType}&type=${attendanceType}&meeting_id=${meetingId}`
      );
    } else {
      navigate(
        `/mark-venue-fee?type=${attendanceType}&meeting_id=${meetingId}`
      );
    }
  };

  // Add dummy stats data
  useEffect(() => {
    // Simulate API response with dummy data
    setStats({
      meetings: { total: 15, marked: 10, pending: 5 },
      mdp: { total: 8, marked: 6, pending: 2 },
      social: { total: 5, marked: 3, pending: 2 },
      events: { total: 10, marked: 7, pending: 3 },
    });
  }, []);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData((prev) => ({ ...prev, attendanceType: type, meetingId: "" }));
    loadMeetingsByType(type);
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

  return (
    <div className="mt-32 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={attendanceIcon} alt="Attendance" className="w-8 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">
              Mark Meeting Attendance
            </h1>
            <h2 className="text-sm text-gray-400">
              Record attendance and venue fees for meetings
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Meetings Stats */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-400">Meetings</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.meetings.total}
                </h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                    stroke="#22C55E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
                <span className="text-sm text-amber-500">
                  {stats.meetings.marked} Marked
                </span>
              </div>
              <div className="px-2.5 py-1 bg-orange-500/10 rounded-lg">
                <span className="text-sm text-orange-500">
                  {stats.meetings.pending} Pending
                </span>
              </div>
            </div>
          </div>

          {/* MDP Stats */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-400">MDP</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.mdp.total}
                </h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 14L12.7071 13.2929C12.3166 12.9024 11.6834 12.9024 11.2929 13.2929L12 14ZM15 17L14.2929 17.7071C14.6834 18.0976 15.3166 18.0976 15.7071 17.7071L15 17ZM19 13L19.7071 13.7071C20.0976 13.3166 20.0976 12.6834 19.7071 12.2929L19 13ZM15.7071 17.7071L19.7071 13.7071L18.2929 12.2929L14.2929 16.2929L15.7071 17.7071ZM19.7071 12.2929L15.7071 8.29289L14.2929 9.70711L18.2929 13.7071L19.7071 12.2929ZM12.7071 13.2929L8.70711 9.29289L7.29289 10.7071L11.2929 14.7071L12.7071 13.2929ZM11.2929 13.2929L7.29289 17.2929L8.70711 18.7071L12.7071 14.7071L11.2929 13.2929Z"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
                <span className="text-sm text-amber-500">
                  {stats.mdp.marked} Marked
                </span>
              </div>
              <div className="px-2.5 py-1 bg-orange-500/10 rounded-lg">
                <span className="text-sm text-orange-500">
                  {stats.mdp.pending} Pending
                </span>
              </div>
            </div>
          </div>

          {/* Social & Training Stats */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-400">Social & Training</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.social.total}
                </h3>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z"
                    stroke="#A855F7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
                <span className="text-sm text-amber-500">
                  {stats.social.marked} Marked
                </span>
              </div>
              <div className="px-2.5 py-1 bg-orange-500/10 rounded-lg">
                <span className="text-sm text-orange-500">
                  {stats.social.pending} Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Selection */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Marking Type Dropdown */}
            <select
              value={formData.markingType}
              onChange={(e) =>
                setFormData({ ...formData, markingType: e.target.value })
              }
              className="w-full bg-gray-800 text-white p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-0"
            >
              <option value="attendance">Mark Attendance</option>
              <option value="venue">Update Venue Fees</option>
            </select>

            {/* Attendance Type Dropdown */}
            <select
              value={formData.attendanceType}
              onChange={handleTypeChange}
              className="w-full bg-gray-800 text-white p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-0"
            >
              <option value="">Choose Meeting Type</option>
              <option value="events">Events</option>
              <option value="meetings">Meetings</option>
              <option value="mdp">MDP</option>
              <option value="social">Social & Training</option>
            </select>

            {/* Meeting Select Dropdown */}
            <select
              value={formData.meetingId}
              onChange={(e) =>
                setFormData({ ...formData, meetingId: e.target.value })
              }
              className="w-full bg-gray-800 text-white p-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:ring-0"
            >
              <option value="">
                {!formData.attendanceType
                  ? "Select Meeting"
                  : `Select ${
                      formData.attendanceType === "mdp"
                        ? "MDP"
                        : formData.attendanceType === "social"
                        ? "Social & Training"
                        : formData.attendanceType.charAt(0).toUpperCase() +
                          formData.attendanceType.slice(1)
                    }`}
              </option>
              {meetings.map((meeting) => (
                <option key={meeting.id} value={meeting.id}>
                  {meeting.display_title} - {meeting.venue}
                </option>
              ))}
            </select>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
            >
              <span>
                {formData.markingType === "attendance"
                  ? "Continue to Mark Attendance"
                  : "Continue to Update Venue Fees"}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.16699 10H15.8337M15.8337 10L10.8337 5M15.8337 10L10.8337 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;

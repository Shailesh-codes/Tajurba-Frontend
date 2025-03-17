import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import attendanceIcon from "../assets/images/icons/attendance-icon.svg";
import calendarIcon from "../assets/images/icons/calender-icon.svg";

const AttendanceVenueFee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const markingType = queryParams.get("marking_type") || "attendance";
  const type = queryParams.get("type");
  const meetingId = queryParams.get("meeting_id");

  const [meetingDetails, setMeetingDetails] = useState({
    type: "-",
    title: "-",
    date: "-",
    time: "-",
  });
  const [stats, setStats] = useState({
    total_members: 0,
    attendance: {
      marked: 0,
      present: 0,
      absent: 0,
      late_less: 0,
      late_more: 0,
    },
    venue_fee: {
      collected: 0,
      total_expected: 0,
      paid_count: 0,
      unpaid_count: 0,
    },
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!type || !meetingId) {
      navigate("/mark-attendance");
      return;
    }

    // Simulate API response with dummy data
    setMeetingDetails({
      type: type === 'meetings' ? 'Weekly Meeting' : type === 'mdp' ? 'MDP Session' : 'Social Event',
      title: "Business Network Meeting",
      date: "2024-03-15",
      time: "10:00 AM",
    });

    setStats({
      total_members: 25,
      attendance: {
        marked: 20,
        present: 15,
        absent: 3,
        late_less: 1,
        late_more: 1,
      },
      venue_fee: {
        collected: 2000,
        total_expected: 2500,
        paid_count: 20,
        unpaid_count: 5,
      },
    });

    // Dummy members data
    setMembers([
      {
        id: 1,
        full_name: "John Doe",
        chapter_name: "Chapter A",
        is_active: 1,
        total_absences: 2,
        total_substitutes: 1,
        status: "present",
        venue_fee_status: "paid",
        payment_date: "2024-03-15",
      },
      {
        id: 2,
        full_name: "Jane Smith",
        chapter_name: "Chapter B",
        is_active: 1,
        total_absences: 1,
        total_substitutes: 0,
        status: "late",
        late_minutes: "less_than_10",
        venue_fee_status: "paid",
        payment_date: "2024-03-15",
      },
      {
        id: 3,
        full_name: "Mike Johnson",
        chapter_name: "Chapter C",
        is_active: 0,
        total_absences: 3,
        total_substitutes: 2,
        status: "absent",
        venue_fee_status: "unpaid",
      },
      {
        id: 4,
        full_name: "Sarah Williams",
        chapter_name: "Chapter A",
        is_active: 1,
        total_absences: 0,
        total_substitutes: 0,
        status: "present",
        venue_fee_status: "paid",
        payment_date: "2024-03-15",
      },
      {
        id: 5,
        full_name: "Robert Brown",
        chapter_name: "Chapter B",
        is_active: 1,
        total_absences: 1,
        total_substitutes: 1,
        status: "late",
        late_minutes: "more_than_10",
        venue_fee_status: "unpaid",
      },
    ]);

    setLoading(false);
  }, [type, meetingId]);

  const loadTableData = async () => {
    try {
      const response = await axios.get(
        `/api/attendance-venue-fee/meeting_stats?type=${type}&event_id=${meetingId}`
      );
      if (response.data.status === "success") {
        setMeetingDetails(response.data.data.event_details);
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Failed to load meeting stats");
    }
  };

  const loadMeetingData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/attendance-venue-fee/meeting_members?type=${type}&meeting_id=${meetingId}`
      );
      if (response.data.status === "success") {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Failed to load meeting data");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (memberId, status) => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          status,
          late_minutes: status === 'late' ? 'less_than_10' : null
        };
      }
      return member;
    }));
  };

  const handleSubstituteChange = (memberId, checked) => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          is_substitute: checked ? 1 : 0
        };
      }
      return member;
    }));
  };

  const handleLateMinutesChange = (memberId, minutes) => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          late_minutes: minutes
        };
      }
      return member;
    }));
  };

  const saveData = async () => {
    const data = members.map(member => {
      if (markingType === 'attendance') {
        const memberData = {
          member_id: member.id,
          status: member.status,
          late_minutes: member.status === 'late' ? member.late_minutes : null
        };

        if (type === 'meetings') {
          memberData.is_substitute = member.is_substitute;
        }

        return memberData;
      } else {
        return {
          member_id: member.id,
          venue_fee_status: member.venue_fee_status,
          payment_date: member.payment_date
        };
      }
    });

    try {
      await Swal.fire({
        title: "Saving...",
        text: "Please wait while we save the data",
        allowOutsideClick: false,
        showConfirmButton: false,
        background: "#111827",
        color: "#fff",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `/api/attendance-venue-fee/save_${markingType}`,
        {
          event_id: meetingId,
          type: type,
          [`${markingType}_data`]: data,
        }
      );

      if (response.data.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message,
          background: "#111827",
          color: "#fff",
        });
        loadTableData();
        loadMeetingData();
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Failed to save data");
    }
  };

  const showError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
      background: "#111827",
      color: "#fff",
    });
  };

  const filteredMembers = members.filter(
    member =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.chapter_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-32 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[#D4B86A] via-[#C4A55F] to-[#B88746] rounded-xl">
            <img src={attendanceIcon} alt="attendance" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {markingType === 'attendance' ? 'Mark Attendance' : 'Update Venue Fees'}
            </h2>
            <p className="text-sm text-gray-400">
              Record {markingType === 'attendance' ? 'attendance' : 'venue fees'} for meetings
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/mark-attendance")}
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

      {/* Meeting Details Card */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Meeting Type</p>
            <h3 className="text-xl font-semibold text-white">{meetingDetails.type}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Meeting Name</p>
            <h3 className="text-xl font-semibold text-white">{meetingDetails.title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Meeting Date</p>
            <h3 className="text-xl font-semibold text-white">
              {new Date(meetingDetails.date).toLocaleDateString("en-GB")} {meetingDetails.time}
            </h3>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Total Members Card */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:bg-gray-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Members</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.total_members}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {markingType === 'attendance' ? (
          // Attendance Stats Card
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:bg-gray-800 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Marked Attendance</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.attendance.marked}
                </h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#22C55E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
                <span className="text-sm text-amber-500">
                  {stats.attendance.present} Present
                </span>
              </div>
              <div className="px-2.5 py-1 bg-orange-500/10 rounded-lg">
                <span className="text-sm text-orange-500">
                  {parseInt(stats.attendance.late_less) + parseInt(stats.attendance.late_more)} Late
                </span>
              </div>
              <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
                <span className="text-sm text-red-500">
                  {stats.attendance.absent} Absent
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Venue Fee Stats Card
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:bg-gray-800 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Venue Fee Collection</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  ₹{stats.venue_fee.collected} / ₹{stats.venue_fee.total_expected}
                </h3>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 6V12M12 12V18M12 12H18M12 12H6"
                    stroke="#A855F7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg">
                <span className="text-sm text-amber-500">
                  {stats.venue_fee.paid_count} Paid
                </span>
              </div>
              <div className="px-2.5 py-1 bg-red-500/10 rounded-lg">
                <span className="text-sm text-red-500">
                  {stats.venue_fee.unpaid_count} Unpaid
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mt-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 focus:ring-0"
          />
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-400">Loading members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-8 text-center text-gray-400">No members found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-800">
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap">#</th>
                  <th className="sticky top-0 p-4 font-semibold text-gray-300 whitespace-nowrap">Member</th>
                  {markingType === 'attendance' ? (
                    <>
                      {type === 'meetings' && (
                        <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">
                          Substitute
                        </th>
                      )}
                      <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">Present</th>
                      <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">Absent</th>
                      <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">Late</th>
                      <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">Minutes Late</th>
                    </>
                  ) : (
                    <>
                      <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">Paid</th>
                      <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">Unpaid</th>
                      <th className="sticky top-0 p-4 text-center font-semibold text-gray-300 whitespace-nowrap">Payment Date</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredMembers.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-800/50">
                    <td className="p-4 text-gray-300">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 text-xs font-medium ${
                            parseInt(member.is_active) === 1
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-red-500/20 text-red-500"
                          } rounded-full`}>
                            {parseInt(member.is_active) === 1 ? "Active" : "Inactive"}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-500 rounded-full">
                            {member.total_absences} A
                          </span>
                          {type === 'meetings' && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-500 rounded-full">
                              {member.total_substitutes} S
                            </span>
                          )}
                        </div>
    <div>
                          <p className="font-medium text-white">{member.full_name}</p>
                          <p className="text-sm text-gray-400">{member.chapter_name}</p>
                        </div>
                      </div>
                    </td>
                    {markingType === 'attendance' ? (
                      <>
                        {type === 'meetings' && (
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={member.is_substitute === 1}
                              onChange={(e) => handleSubstituteChange(member.id, e.target.checked)}
                              className="substitute-checkbox"
                            />
                          </td>
                        )}
                        <td className="p-4 text-center">
                          <input
                            type="radio"
                            name={`attendance_${member.id}`}
                            value="present"
                            checked={member.status === "present"}
                            onChange={() => handleAttendanceChange(member.id, "present")}
                            className="attendance-radio"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="radio"
                            name={`attendance_${member.id}`}
                            value="absent"
                            checked={member.status === "absent"}
                            onChange={() => handleAttendanceChange(member.id, "absent")}
                            className="attendance-radio"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="radio"
                            name={`attendance_${member.id}`}
                            value="late"
                            checked={member.status === "late"}
                            onChange={() => handleAttendanceChange(member.id, "late")}
                            className="attendance-radio"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={member.late_minutes || "less_than_10"}
                            onChange={(e) => handleLateMinutesChange(member.id, e.target.value)}
                            disabled={member.status !== "late"}
                            className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-amber-500 focus:ring-0"
                          >
                            <option value="less_than_10">Less than 10</option>
                            <option value="more_than_10">More than 10</option>
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4 text-center">
                          <input
                            type="radio"
                            name={`venue_fee_${member.id}`}
                            value="paid"
                            checked={member.venue_fee_status === "paid"}
                            onChange={() => handleVenueFeeChange(member.id, "paid")}
                            className="venue-fee-radio"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="radio"
                            name={`venue_fee_${member.id}`}
                            value="unpaid"
                            checked={member.venue_fee_status === "unpaid"}
                            onChange={() => handleVenueFeeChange(member.id, "unpaid")}
                            className="venue-fee-radio"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <div className="relative">
                            <input
                              type="date"
                              value={member.payment_date || ""}
                              onChange={(e) => handlePaymentDateChange(member.id, e.target.value)}
                              disabled={member.venue_fee_status !== "paid"}
                              className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                            />
                            <img
                              src={calendarIcon}
                              alt="calendar"
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                            />
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-gray-900 p-4 mt-4">
        <button
          onClick={saveData}
          className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3.33301 10L8.33301 15L16.6663 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {markingType === 'attendance' ? 'Save Attendance' : 'Save Venue Fee'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceVenueFee;

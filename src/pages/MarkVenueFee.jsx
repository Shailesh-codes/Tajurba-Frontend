import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import attendanceIcon from "../assets/images/icons/attendance-icon.svg";
import calendarIcon from "../assets/images/icons/calender-icon.svg";

const MarkvenueFee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
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
    venue_fee: {
      collected: 0,
      total_expected: 0,
      paid_count: 0,
      unpaid_count: 0,
    }
  });
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!type || !meetingId) {
      navigate("/mark-attendance");
      return;
    }
    loadTableData();
    loadMeetingData();
  }, [type, meetingId]);

  const loadTableData = async () => {
    try {
      // In production, replace with actual API call
      const response = await axios.get(
        `/api/attendance-venue-fee/meeting_stats?type=${type}&event_id=${meetingId}`
      );
      
      if (response.data.status === "success") {
        setMeetingDetails(response.data.data.event_details);
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error:", error);
      // For development, set dummy data on error
      setMeetingDetails({
        type: type === 'meetings' ? 'Weekly Meeting' : type === 'mdp' ? 'MDP Session' : 'Social Event',
        title: "Business Network Meeting",
        date: "2024-03-15",
        time: "10:00 AM",
      });

      setStats({
        total_members: 25,
        venue_fee: {
          collected: 2500,
          total_expected: 3000,
          paid_count: 20,
          unpaid_count: 5,
        }
      });
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
      // For development, set dummy data on error
      const dummyMembers = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        full_name: `Member ${i + 1}`,
        chapter_name: `Chapter ${Math.floor(i / 5) + 1}`,
        is_active: Math.random() > 0.2 ? 1 : 0,
        venue_fee_status: Math.random() > 0.3 ? 'paid' : 'unpaid',
        payment_date: Math.random() > 0.3 ? '2024-03-15' : null
      }));
      setMembers(dummyMembers);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueFeeChange = (memberId, status) => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          venue_fee_status: status,
          payment_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null
        };
      }
      return member;
    }));
  };

  const handlePaymentDateChange = (memberId, date) => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          payment_date: date,
          venue_fee_status: date ? 'paid' : 'unpaid'
        };
      }
      return member;
    }));
  };

  const saveData = async () => {
    const data = members.map(member => ({
      member_id: member.id,
      venue_fee_status: member.venue_fee_status,
      payment_date: member.payment_date
    }));

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
        `/api/attendance-venue-fee/save_venue_fee`,
        {
          event_id: meetingId,
          type: type,
          venue_fee_data: data,
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
          <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
            <img src={attendanceIcon} alt="attendance" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Update Venue Fees</h2>
            <p className="text-sm text-gray-400">Record venue fees for meetings</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/mark-attendance")}
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
      </div>

      {/* Meeting Details Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-gray-400">Meeting Type</p>
            <h3 className="text-xl font-semibold text-white">{meetingDetails.type}</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Meeting Name</p>
            <h3 className="text-xl font-semibold text-white">{meetingDetails.title}</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Meeting Date & Time</p>
            <h3 className="text-xl font-semibold text-white">
              {new Date(meetingDetails.date).toLocaleDateString()} {meetingDetails.time}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
      >
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-600/30 rounded-xl p-6 border border-blue-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Members</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.total_members}</h3>
            </div>
            <div className="p-4 bg-blue-500/20 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429" 
                  stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-600/30 rounded-xl p-6 border border-purple-800/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400">Venue Fee Collection</p>
              <h3 className="text-3xl font-bold text-white mt-2">
                ₹{stats.venue_fee.collected} / ₹{stats.venue_fee.total_expected}
              </h3>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 6V12M12 12V18M12 12H18M12 12H6" 
                  stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-green-500/20 rounded-lg">
              <span className="text-sm text-green-400">{stats.venue_fee.paid_count} Paid</span>
            </div>
            <div className="px-3 py-1.5 bg-red-500/20 rounded-lg">
              <span className="text-sm text-red-400">{stats.venue_fee.unpaid_count} Unpaid</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Members Table */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0"
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
                <tr className="bg-gray-700/50">
                  <th className="p-4 font-semibold text-gray-300">#</th>
                  <th className="p-4 font-semibold text-gray-300">Member</th>
                  <th className="p-4 text-center font-semibold text-gray-300">Status</th>
                  <th className="p-4 text-center font-semibold text-gray-300">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredMembers.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 text-gray-300">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${member.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium text-white">{member.full_name}</p>
                          <p className="text-sm text-gray-400">{member.chapter_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`venue_fee_${member.id}`}
                            value="paid"
                            checked={member.venue_fee_status === 'paid'}
                            onChange={() => handleVenueFeeChange(member.id, 'paid')}
                            className="venue-fee-radio-paid"
                          />
                          <span className="text-green-400">Paid</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`venue_fee_${member.id}`}
                            value="unpaid"
                            checked={member.venue_fee_status === 'unpaid'}
                            onChange={() => handleVenueFeeChange(member.id, 'unpaid')}
                            className="venue-fee-radio-unpaid"
                          />
                          <span className="text-red-400">Unpaid</span>
                        </label>
                      </div>
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
          className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-900 hover:from-green-700 hover:to-green-950 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3.33301 10L8.33301 15L16.6663 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Save Venue Fee
        </button>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .venue-fee-radio-paid,
        .venue-fee-radio-unpaid {
          appearance: none;
          width: 1.2rem;
          height: 1.2rem;
          border: 2px solid #374151;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .venue-fee-radio-paid:checked {
          border-color: #22C55E;
          background-color: #22C55E;
        }

        .venue-fee-radio-unpaid:checked {
          border-color: #EF4444;
          background-color: #EF4444;
        }
      `}</style>
    </div>
  );
};

export default MarkvenueFee;

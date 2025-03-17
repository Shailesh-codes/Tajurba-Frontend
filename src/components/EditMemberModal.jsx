import React, { useState, useEffect } from 'react';
import calendarIcon from "../assets/images/icons/calender-icon.svg";

const EditMemberModal = ({ member, chapters, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    member_id: '',
    name: '',
    mobile: '',
    email: '',
    chapter: '',
    date: '',
    company: '',
    business_category: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        member_id: member.member_id,
        name: member.full_name,
        mobile: member.mobile,
        email: member.email || '',
        chapter: member.chapter_id,
        date: member.joining_date,
        company: member.company_name || '',
        business_category: member.business_category || ''
      });
    }
  }, [member]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 overflow-y-auto max-h-[90vh] scrollbar-hide">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Edit Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Member Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Chapter <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.chapter}
              onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select Chapter</option>
              {chapters.map(chapter => (
                <option key={chapter.chapter_id} value={chapter.chapter_id}>
                  {chapter.chapter_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Join Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 [color-scheme:dark]"
              />
              <img
                src={calendarIcon}
                alt="calendar"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Business Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.business_category}
              onChange={(e) => setFormData({ ...formData, business_category: e.target.value })}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Update Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;

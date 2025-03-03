import React, { useState, useEffect } from 'react';

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    chapter: '',
    company: '',
    business_category: '',
    date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <div className="mt-32 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Member</h2>
            <p className="text-sm text-gray-400">Create new member profile</p>
          </div>
        </div>
        <button onClick={() => window.history.back()} 
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-green-500 rounded-xl transition-all duration-300 border border-gray-700">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" 
            className="transition-transform duration-300 group-hover:-translate-x-1">
            <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold tracking-wide text-sm">Back</span>
        </button>
      </div>

      {/* Form Section */}
      <div className="p-6 rounded-2xl bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Member Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Member Name <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder="Enter member name"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-2">
              <label htmlFor="mobile" className="text-sm font-medium text-gray-300">
                Mobile Number <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                type="tel"
                id="mobile"
                required
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="Enter 10-digit mobile number"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email address"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Chapter Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="chapter" className="text-sm font-medium text-gray-300">
                Chapter Name <span className="text-red-500 text-lg">*</span>
              </label>
              <select
                id="chapter"
                required
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white"
                value={formData.chapter}
                onChange={(e) => setFormData({...formData, chapter: e.target.value})}
              >
                <option value="">Select Chapter</option>
                {/* Add your chapter options here */}
              </select>
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-sm font-medium text-gray-300">
                Company Name <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                type="text"
                id="company"
                required
                placeholder="Enter company name"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>

            {/* Business Category */}
            <div className="flex flex-col gap-2">
              <label htmlFor="business_category" className="text-sm font-medium text-gray-300">
                Business Category <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                type="text"
                id="business_category"
                required
                placeholder="Enter business category"
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white placeholder-gray-400"
                value={formData.business_category}
                onChange={(e) => setFormData({...formData, business_category: e.target.value})}
              />
            </div>

            {/* Joining Date */}
            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="text-sm font-medium text-gray-300">
                Joining Date <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  required
                  className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-0 text-white [color-scheme:dark]"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex justify-end gap-4 mt-10 max-450:justify-between">
            <button
              type="reset"
              onClick={() => setFormData({name: '', mobile: '', email: '', chapter: '', company: '', business_category: '', date: ''})}
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-900 hover:from-green-700 hover:to-green-950 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;

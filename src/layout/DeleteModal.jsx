import React from "react";
import { Trash2 } from "lucide-react";
import { FiAlertCircle } from "react-icons/fi";

const DeleteModal = ({ isOpen, onClose, onDelete, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/35 via-black/0 to-amber-900/20" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      {/* Modal container */}
      <div className="relative w-full max-w-[360px] transform transition-all duration-700 scale-100">
        {/* Glass card with enhanced effects */}
        <div
          className="bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 rounded-2xl 
                    border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl
                    overflow-hidden"
        >
          {/* Decorative light effects */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-500 rounded-full blur-[100px] opacity-10 animate-pulse-slow" />
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-500 rounded-full blur-[100px] opacity-10 animate-pulse-slow" />

          {/* Top gradient border */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20" />

          <div className="relative p-6">
            <div className="flex flex-col items-center">
              {/* Enhanced Delete Icon */}
              <div className="relative mb-6 group">
                {/* Multiple animated rings */}
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 
                            rounded-full blur-md opacity-70 group-hover:opacity-100 animate-spin-slow transition-all duration-500"
                />
                <div
                  className="absolute -inset-2 bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 
                            rounded-full blur-sm opacity-50 group-hover:opacity-75 animate-spin-reverse-slow transition-all duration-500"
                />

                {/* Main icon container */}
                <div
                  className="relative p-5 rounded-full bg-gradient-to-b from-gray-800 via-gray-900 to-black 
                            border-2 border-white/10 group-hover:border-red-500/50 transition-all duration-500
                            shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40"
                >
                  <Trash2
                    className="w-8 h-8 stroke-red-400 stroke-2 group-hover:stroke-red-300 
                              transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Enhanced content */}
              <h2
                className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r 
                          from-red-400 via-rose-300 to-red-400 text-center animate-gradient"
              >
                Delete {itemName}
              </h2>
              <div className="mb-6 text-center">
                <p className="text-gray-300 mb-3 text-base">
                  Are you sure you want to delete this {itemName.toLowerCase()}?
                </p>
                {/* Enhanced alert box */}
                <div
                  className="flex items-center justify-center gap-2 text-red-300/90 
                            bg-gradient-to-r from-red-500/10 via-rose-500/10 to-red-500/10 
                            py-2.5 px-4 rounded-xl border border-red-500/20"
                >
                  <FiAlertCircle className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-medium">
                    This action cannot be undone
                  </span>
                </div>
              </div>

              {/* Enhanced buttons */}
              <div className="flex justify-center gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 rounded-xl 
                          bg-gradient-to-b from-gray-800 via-gray-900 to-gray-900/50 
                          border border-white/10 hover:border-white/20
                          hover:bg-gradient-to-t hover:shadow-lg hover:shadow-black/20
                          transform hover:-translate-y-0.5 active:translate-y-0
                          transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl
                          bg-gradient-to-r from-red-500 via-rose-500 to-red-600
                          hover:from-red-600 hover:via-rose-600 hover:to-red-700
                          transform hover:-translate-y-0.5 active:translate-y-0
                          hover:shadow-lg hover:shadow-red-500/30
                          transition-all duration-300 border border-red-400/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-reverse-slow {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 10s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default DeleteModal;

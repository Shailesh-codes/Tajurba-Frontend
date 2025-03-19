import React from "react";
import { LogOut } from "lucide-react";
import { FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Enhanced animated backdrop with multiple layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/0 to-orange-900/20" />
        <div className="absolute inset-0" 
             style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)' }} />
      </div>

      {/* Modal container - reduced max-width */}
      <div className="relative w-full max-w-[360px] transform transition-all duration-700 scale-100">
        {/* Glass card with enhanced effects */}
        <div className="bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 rounded-2xl 
                    border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl
                    overflow-hidden">
          {/* Decorative light effects - reduced size */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 animate-pulse-slow" />
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20 animate-pulse-slow" />

          {/* Top gradient border */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

          <div className="relative p-6">
            <div className="flex flex-col items-center">
              {/* Enhanced Lucide Logout Icon - reduced size */}
              <div className="relative mb-6 group">
                {/* Multiple animated rings - adjusted size */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-amber-500 to-purple-600 
                            rounded-full blur-md opacity-70 group-hover:opacity-100 animate-spin-slow transition-all duration-500" />
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-orange-500 to-amber-600 
                            rounded-full blur-sm opacity-50 group-hover:opacity-75 animate-spin-reverse-slow transition-all duration-500" />
                
                {/* Main icon container - reduced padding */}
                <div className="relative p-5 rounded-full bg-gradient-to-b from-gray-800 via-gray-900 to-black 
                            border-2 border-white/10 group-hover:border-orange-500/50 transition-all duration-500
                            shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40">
                  <LogOut 
                    className="w-8 h-8 stroke-orange-400 stroke-2 group-hover:stroke-amber-300 
                              transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Enhanced content - reduced text sizes */}
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r 
                          from-orange-400 via-amber-300 to-orange-400 text-center animate-gradient">
                Ready to Leave?
              </h2>
              <div className="mb-6 text-center">
                <p className="text-gray-300 mb-3 text-base">
                  Are you sure you want to end your current session?
                </p>
                {/* Enhanced alert box - reduced padding */}
                <div className="flex items-center justify-center gap-2 text-orange-300/90 
                            bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-orange-500/10 
                            py-2.5 px-4 rounded-xl border border-orange-500/20">
                  <FiAlertCircle className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-medium">
                    You'll need to sign in again to continue
                  </span>
                </div>
              </div>

              {/* Enhanced buttons - reduced padding */}
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
                  Stay Here
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl
                          bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600
                          hover:from-orange-600 hover:via-amber-600 hover:to-orange-700
                          transform hover:-translate-y-0.5 active:translate-y-0
                          hover:shadow-lg hover:shadow-orange-500/30
                          transition-all duration-300 border border-orange-400/20"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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

export default LogoutModal;

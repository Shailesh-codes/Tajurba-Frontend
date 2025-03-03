import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Lottie from "react-lottie";
import animation from "../../public/lottie/crmlottie.json";
import Logo from "../assets/images/Tajurba-Logo-Golden.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    // Check for logout message in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("logout") === "success") {
      showSuccessAlert(
        "Logged Out Successfully",
        "You have been logged out of your account."
      );
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#27DA68",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePassword = (type) => {
    setShowPassword((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const validateMemberLogin = async (e) => {
    e.preventDefault();
    // Add your member login validation logic here
  };

  const validateAdminLogin = async (e) => {
    e.preventDefault();
    // Add your admin login validation logic here
  };

  return (
    <div className="w-full min-h-screen flex">
      <div className="w-full lg:w-1/2 p-4 md:p-8 bg-gray-900">
        <div className="max-w-md mx-auto">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <img src={Logo} alt="Logo" className="h-20 mb-14" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Sign in to{" "}
              <span className="text-[#c3942f] font-['Namaste']">Tajurba.</span>
            </h2>
            <p className="text-gray-400">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {/* Mobile Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-[#27DA68] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="tel"
                className="w-full pl-10 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:border-[#27DA68] focus:ring-1 focus:ring-[#27DA68] transition-all duration-200"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 focus:text-[#27DA68] group-focus-within:text-[#27DA68] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:border-[#27DA68] focus:ring-1 focus:ring-[#27DA68] transition-all duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#27DA68] transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-600 text-[#27DA68] focus:ring-[#27DA68] transition-colors"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#27DA68] to-[#1a8f45] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-[#27DA68] focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Sign In
            </button>
          </form>

          {/* Version Info */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Version 1.0.0
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 pt-10 bg-gradient-to-br from-gray-800 to-gray-900">
        <Lottie options={defaultOptions} height={500} width={500} />
      </div>
    </div>
  );
};

export default SignIn;

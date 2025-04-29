import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const goBack = () => {
    if (auth.role === "Member") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-300 mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={goBack}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

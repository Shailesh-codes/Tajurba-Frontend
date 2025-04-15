import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");

    if (token && userRole) {
      setAuth({
        isAuthenticated: true,
        user: {
          id: userId,
          name: userName,
          role: userRole,
        },
        token,
        role: userRole,
      });
    }
  }, []);

  const login = async (data) => {
    const { token, member } = data;
    
    // Make sure the role is exactly "Member", "Admin", or "Super Admin"
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", member.role);
    localStorage.setItem("userId", member.id);
    localStorage.setItem("userName", member.name);

    setAuth({
      isAuthenticated: true,
      user: member,
      token,
      role: member.role  // This should match exactly with the allowedRoles check
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
      role: null,
    });
  };

  // Provide the auth object and functions
  const value = {
    auth,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

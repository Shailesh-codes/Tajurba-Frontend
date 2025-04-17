import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../hooks/api"; // Make sure this is imported

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
    isLoading: true, // Add loading state
  });

  // Function to get token from cookies
  const getTokenFromCookies = () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      // Store in localStorage as backup if not already there
      if (!localStorage.getItem("token")) {
        localStorage.setItem("token", token);
      }
      return token;
    }
    return null;
  };

  // Initialize auth state from stored data
  const initializeAuthState = () => {
    const token = getTokenFromCookies() || localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    if (token && userRole) {
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setAuth({
        isAuthenticated: true,
        user: {
          id: userId,
          name: userName,
          role: userRole,
          email: userEmail,
        },
        token,
        role: userRole,
        isLoading: false
      });
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Verify token on mount and after refreshes
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Initialize from stored data first
        initializeAuthState();

        const token = getTokenFromCookies() || localStorage.getItem("token");
        
        if (!token) {
          return;
        }

        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Silent token verification - don't logout on failure
        try {
          const response = await api.get('/members/verify-token', {
            withCredentials: true,
          });
          
          if (response.data.success) {
            const { member } = response.data;
            
            // Update localStorage with latest data
            localStorage.setItem("token", token);
            localStorage.setItem("userRole", member.role);
            localStorage.setItem("userName", member.name);
            localStorage.setItem("userId", member.id);
            if (member.email) localStorage.setItem("userEmail", member.email);
            
            setAuth({
              isAuthenticated: true,
              user: member,
              token,
              role: member.role,
              isLoading: false
            });
          }
        } catch (verifyError) {
          console.warn("Token verification failed, but keeping session:", verifyError);
          // Don't logout - just keep the current session
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Don't logout - maintain current session
      }
    };

    verifyToken();
  }, []);

  const login = async (data) => {
    const { token, member } = data;
    
    // Set token in both localStorage and cookie
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", member.role);
    localStorage.setItem("userName", member.name);
    localStorage.setItem("userId", member.id);
    if (member.email) localStorage.setItem("userEmail", member.email);
    
    // Set default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setAuth({
      isAuthenticated: true,
      user: member,
      token,
      role: member.role,
      isLoading: false
    });
  };

  const logout = async () => {
    try {
      await api.post('/members/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage
      localStorage.clear();
      
      // Clear cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // Remove default authorization header
      delete api.defaults.headers.common['Authorization'];

      setAuth({
        isAuthenticated: false,
        user: null,
        token: null,
        role: null,
        isLoading: false
      });
    }
  };

  // Configure axios defaults
  useEffect(() => {
    api.defaults.withCredentials = true; // Always include credentials
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

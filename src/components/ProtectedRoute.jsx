import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { navigationConfig } from "../config/navigation";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Check authentication
  if (!auth.isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Get role key
  const getRoleKey = (role) => {
    switch (role) {
      case "Super Admin":
        return "superAdmin";
      case "Regional Director":
        return "regionalDirector";
      case "Admin":
        return "admin";
      case "Member":
        return "member";
      default:
        return role.toLowerCase();
    }
  };

  // Define additional routes for each role
  const additionalRoutes = {
    admin: [
      // Add Member related routes
      '/add-member',
      '/edit-member',
      '/member-view',
      
      // Attendance related routes
      '/mark-attendance',
      '/attendance-venue-fee',
      '/mark-venue-fee',
      
      // Schedule related routes
      '/edit-schedule',
      '/view-schedule',
      '/add-schedule',
      
      // BDM related routes
      '/add-bdm',
      '/edit-bdm',
      '/view-bdm',
      
      // Business related routes
      '/add-business',
      '/view-business',
      '/add-res-business',
      '/view-res-business',
      
      // Chapter related routes
      '/view-chapter-member',
      
      // Referral related routes
      '/view-ref-given',
      '/add-edit-ref-given',
      
      // Visitor related routes
      '/add-visitor',
      '/edit-visitor',
      '/view-visitor'
    ],
    superAdmin: [
      // Include all admin routes for Super Admin
      '/add-member',
      '/edit-member',
      '/member-view',
      '/mark-attendance',
      '/attendance-venue-fee',
      '/mark-venue-fee',
      '/edit-schedule',
      '/view-schedule',
      '/add-schedule',
      '/add-bdm',
      '/edit-bdm',
      '/view-bdm',
      '/add-business',
      '/view-business',
      '/add-res-business',
      '/view-res-business',
      '/view-chapter-member',
      '/view-ref-given',
      '/add-edit-ref-given',
      '/add-visitor',
      '/edit-visitor',
      '/view-visitor'
    ]
  };

  // Check if user's role is allowed
  const userRoleKey = getRoleKey(auth.role);
  const isRoleAllowed = allowedRoles.some(role => getRoleKey(role) === userRoleKey);

  if (!isRoleAllowed) {
    console.log(`Role ${auth.role} is not in allowed roles:`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  // Get all allowed paths for the user's role
  const getAllowedPaths = (roleKey) => {
    const paths = new Set();
    
    // Add navigation config paths
    if (navigationConfig[roleKey]) {
      navigationConfig[roleKey].forEach(section => {
        section.items.forEach(item => {
          paths.add(item.path);
        });
      });
    }

    // Add additional routes for the role
    if (additionalRoutes[roleKey]) {
      additionalRoutes[roleKey].forEach(path => {
        paths.add(path);
      });
    }

    // Add common paths
    if (navigationConfig.common) {
      navigationConfig.common.forEach(section => {
        section.items.forEach(item => {
          paths.add(item.path);
        });
      });
    }

    return paths;
  };

  const allowedPaths = getAllowedPaths(userRoleKey);
  
  // Check if current path or any of its parent paths are allowed
  const isPathAllowed = Array.from(allowedPaths).some(allowedPath => {
    // Check exact match
    if (location.pathname === allowedPath) return true;
    
    // Check if current path starts with allowed path
    if (location.pathname.startsWith(allowedPath + '/')) return true;
    
    // Check if current path is a sub-route of allowed path
    const pathParts = location.pathname.split('/');
    const allowedParts = allowedPath.split('/');
    return allowedParts.every((part, index) => {
      if (part.startsWith(':')) return true; // Dynamic parameter
      return part === pathParts[index];
    });
  });

  if (!isPathAllowed) {
    console.log(`Access denied to ${location.pathname} for role ${auth.role}`);
    console.log('Allowed paths:', Array.from(allowedPaths));
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

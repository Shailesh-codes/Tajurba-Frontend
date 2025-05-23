import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User } from "lucide-react";

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
  console.log(auth.user);

  // Check authentication
  if (!auth.isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Simple role check
  const isRoleAllowed = allowedRoles.includes(auth.role);

  // If role is not allowed, redirect to unauthorized
  if (!isRoleAllowed) {
    console.log(`Role ${auth.role} is not in allowed roles:`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  // Member specific routes check
  if (auth.role === "Member") {
    const memberAllowedPaths = [
      "/dashboard",
      "/bdm",
      "/add-bdm",
      "/edit-bdm",
      "/view-bdm",
      "/business-given",
      "/add-business",
      "/view-business",
      "/business-received",
      "/view-res-business",
      "/add-res-business",
      "/member-certificate",
      "/chapter-members",
      "/view-chapter-member",
      "/meetings-mdp-socials",
      "/members-mdp-events",
      "/monthly-reward",
      "/member-levels",
      "/ref-given",
      "/view-ref-given",
      "/add-edit-ref-given",
      "/request-received",
      "/referral-request",
      "/bdm-request",
      "/visitors-invited",
      "/add-visitor",
      "/edit-visitor",
      "/view-visitor",
      "/settings",
      "/calendar",
      "/privacy-policy",
      "/business-request",
    ];

    // Check if current path starts with any allowed path
    const isPathAllowed = memberAllowedPaths.some((path) => {
      // Exact match
      if (location.pathname === path) return true;

      // Check for dynamic routes (paths with IDs)
      if (location.pathname.startsWith(path + "/")) return true;

      // Handle special cases for edit/view routes
      const specialPaths = ["/edit-", "/view-"];
      return specialPaths.some(
        (specialPath) =>
          location.pathname.includes(specialPath) &&
          memberAllowedPaths.some((allowedPath) =>
            location.pathname.startsWith(
              allowedPath.replace(specialPath, specialPath)
            )
          )
      );
    });

    if (!isPathAllowed) {
      console.log(`Access denied to ${location.pathname} for Member role`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Add Regional Director specific routes check
  if (auth.role === "Regional Director") {
    const regionalDirectorAllowedPaths = [
      "/dashboard",
      "/member-list",
      "/add-user",
      "/chapters-list",
      "/add-member",
      "/member-view",
      "/settings",
      "/privacy-policy",
    ];

    const isPathAllowed = regionalDirectorAllowedPaths.some((path) => {
      // Exact match
      if (location.pathname === path) return true;

      // Check for dynamic routes (paths with IDs)
      if (location.pathname.startsWith(path + "/")) return true;

      // Handle special cases for view routes
      if (location.pathname.startsWith("/member-view/")) return true;

      return false;
    });

    if (!isPathAllowed) {
      console.log(
        `Access denied to ${location.pathname} for Regional Director role`
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Admin specific routes check
  if (auth.role === "Admin") {
    const adminAllowedPaths = [
      "/dashboard",
      "/add-user",
      "/add-member",
      "/edit-member",
      "/member-view",
      "/assign-certificates",
      "/broadcast",
      "/chapters-list",
      "/creative-list",
      "/certificate-list",
      "/mark-attendance",
      "/attendance-venue-fee",
      "/mark-venue-fee",
      "/users-list",
      "/member-list",
      "/meetings",
      "/edit-schedule",
      "/view-schedule",
      "/add-schedule",
      "/visitor-list",
      "/monthly-reward",
      "/admin-settings",
      "/privacy-policy",
    ];

    const isPathAllowed = adminAllowedPaths.some((path) => {
      if (location.pathname === path) return true;
      if (location.pathname.startsWith(path + "/")) return true;
      return false;
    });

    if (!isPathAllowed) {
      console.log(`Access denied to ${location.pathname} for Admin role`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Super Admin has access to both Admin and Member routes
  if (auth.role === "Super Admin") {
    const superAdminAllowedPaths = [
      // Admin paths
      "/dashboard",
      "/add-user",
      "/add-member",
      "/edit-member",
      "/member-view",
      "/assign-certificates",
      "/broadcast",
      "/chapters-list",
      "/creative-list",
      "/certificate-list",
      "/mark-attendance",
      "/attendance-venue-fee",
      "/mark-venue-fee",
      "/active-users",
      "/member-list",
      "/meetings",
      "/edit-schedule",
      "/view-schedule",
      "/add-schedule",
      "/visitor-list",
      "/monthly-reward",
      "/settings",
      "/privacy-policy",
      // Member paths
      "/bdm",
      "/add-bdm",
      "/edit-bdm",
      "/view-bdm",
      "/business-given",
      "/add-business",
      "/view-business",
      "/business-received",
      "/view-res-business",
      "/add-res-business",
      "/member-certificate",
      "/chapter-members",
      "/view-chapter-member",
      "/meetings-mdp-socials",
      "/members-mdp-events",
      "/member-monthly-reward",
      "/ref-given",
      "/view-ref-given",
      "/add-edit-ref-given",
      "/request-received",
      "/bdm-request",
      "/referral-request",
      "/visitors-invited",
      "/add-visitor",
      "/edit-visitor",
      "/view-visitor",
      "/business-request",
    ];

    const isPathAllowed = superAdminAllowedPaths.some((path) => {
      if (location.pathname === path) return true;
      if (location.pathname.startsWith(path + "/")) return true;
      return false;
    });

    if (!isPathAllowed) {
      console.log(`Access denied to ${location.pathname} for Super Admin role`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

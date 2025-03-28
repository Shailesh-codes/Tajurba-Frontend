import Swal from "sweetalert2";
import "../styles/styles.css";

/**
 * Display a toast notification
 * @param {Object} config - Toast configuration
 * @param {string} config.title - Title of the toast (optional)
 * @param {string} config.message - Message to display
 * @param {string} config.icon - Icon to display (e.g., 'success', 'error', 'warning', 'info')
 * @param {string} config.status - Status for color scheme ('success', 'error', 'warning', 'info')
 */
export const showToast = ({
  title = "",
  message,
  icon = "success",
  status = "success",
}) => {
  const colorScheme = {
    success: {
      bg: "bg-green-500/8",
      border: "border-green-500/20",
      text: "text-green-400",
      iconBg: "bg-gradient-to-br from-green-400 to-emerald-500",
      gradient: "from-green-500/5 via-emerald-400/10 to-green-500/5",
      timerProgress: "bg-gradient-to-r from-green-400 via-emerald-500 to-green-400",
      glow: "shadow-[0_0_12px_rgba(34,197,94,0.15)]",
      ringColor: "ring-green-500/30"
    },
    error: {
      bg: "bg-red-500/8",
      border: "border-red-500/20",
      text: "text-red-400",
      iconBg: "bg-gradient-to-br from-red-400 to-rose-500",
      gradient: "from-red-500/5 via-rose-400/10 to-red-500/5",
      timerProgress: "bg-gradient-to-r from-red-400 via-rose-500 to-red-400",
      glow: "shadow-[0_0_12px_rgba(239,68,68,0.15)]",
      ringColor: "ring-red-500/30"
    },
    warning: {
      bg: "bg-amber-500/8",
      border: "border-amber-500/20",
      text: "text-amber-400",
      iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
      gradient: "from-amber-500/5 via-orange-400/10 to-amber-500/5",
      timerProgress: "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400",
      glow: "shadow-[0_0_12px_rgba(245,158,11,0.15)]",
      ringColor: "ring-amber-500/30"
    },
    info: {
      bg: "bg-blue-500/8",
      border: "border-blue-500/20",
      text: "text-blue-400",
      iconBg: "bg-gradient-to-br from-blue-400 to-cyan-500",
      gradient: "from-blue-500/5 via-cyan-400/10 to-blue-500/5",
      timerProgress: "bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400",
      glow: "shadow-[0_0_12px_rgba(59,130,246,0.15)]",
      ringColor: "ring-blue-500/30"
    },
  };

  const colors = colorScheme[status] || colorScheme.success;

  // Get the appropriate icon based on status and icon prop
  const getIcon = () => {
    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    };
    return icons[icon] || icons.success;
  };

  Swal.fire({
    html: `
      <div class="flex items-start gap-3 p-1">
        <div class="flex-shrink-0">
          <div class="relative p-2.5 rounded-full ${colors.iconBg} ${colors.glow} ring-1 ring-offset-2 ring-offset-gray-800 ${colors.ringColor} shimmer-icon">
            <i class="fas ${getIcon()} text-white text-sm"></i>
          </div>
        </div>
        <div class="flex flex-col min-w-[200px]">
          ${
            title
              ? `<div class="flex items-center gap-2">
                   <h3 class="text-sm font-semibold ${colors.text} tracking-wide">${title}</h3>
                 </div>`
              : ""
          }
          <div class="mt-1 p-2.5 ${colors.bg} rounded-lg border ${colors.border} backdrop-blur-sm bg-gradient-to-r ${colors.gradient} ring-1 ring-white/5">
            <p class="text-xs text-gray-100 font-medium">
              ${message}
            </p>
          </div>
        </div>
      </div>
    `,
    position: "top-right",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    background: "linear-gradient(165deg, rgba(31,41,55,0.95), rgba(17,24,39,0.98))",
    width: "auto",
    padding: "0.85rem",
    backdrop: false,
    customClass: {
      popup: `swal-smooth-enter bg-gray-800/95 rounded-xl border border-gray-700/50 shadow-lg ${colors.glow} backdrop-blur-md ring-1 ring-white/10`,
      timerProgressBar: `${colors.timerProgress}`,
    },
    showClass: {
      popup: "swal-smooth-enter-active",
    },
    hideClass: {
      popup: "swal-smooth-leave-active",
    },
  });
};

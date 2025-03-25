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
  // Define color schemes based on status
  const colorScheme = {
    success: {
      bg: "bg-green-500/15",
      border: "border-green-500/30",
      text: "text-green-400",
      gradient: "from-green-500/10 to-green-500/20",
      timerProgress: "bg-green-500",
    },
    error: {
      bg: "bg-red-500/15",
      border: "border-red-500/30",
      text: "text-red-400",
      gradient: "from-red-500/10 to-red-500/20",
      timerProgress: "bg-red-500",
    },
    warning: {
      bg: "bg-amber-500/15",
      border: "border-amber-500/30",
      text: "text-amber-400",
      gradient: "from-amber-500/10 to-amber-500/20",
      timerProgress: "bg-amber-500",
    },
    info: {
      bg: "bg-blue-500/15",
      border: "border-blue-500/30",
      text: "text-blue-400",
      gradient: "from-blue-500/10 to-blue-500/20",
      timerProgress: "bg-blue-500",
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
          <div class="p-2 ${colors.bg} rounded-lg border ${
      colors.border
    } shadow-lg">
            <i class="fas ${getIcon()} ${colors.text} text-sm"></i>
          </div>
        </div>
        <div class="flex flex-col min-w-[200px]">
          ${
            title
              ? `<div class="flex items-center gap-2">
                   <h3 class="text-sm font-semibold ${colors.text}">${title}</h3>
                 </div>`
              : ""
          }
          <div class="mt-1 p-2 ${colors.bg} rounded-md border ${colors.border}">
            <p class="text-xs text-gray-300">
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
    background: "linear-gradient(145deg, #1F2937, #111827)",
    width: "auto",
    padding: "1rem",
    backdrop: false,
    customClass: {
      popup:
        "swal-smooth-enter bg-gray-800 rounded-xl border border-gray-700 shadow-lg",
      timerProgressBar: colors.timerProgress,
    },
    showClass: {
      popup: "swal-smooth-enter-active",
    },
    hideClass: {
      popup: "swal-smooth-leave-active",
    },
  });
};

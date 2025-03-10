import React from "react";
import { FiTrash2, FiAlertCircle } from "react-icons/fi";

const DeleteModal = ({ isOpen, onClose, onDelete, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800/95 rounded-2xl border border-gray-700 shadow-2xl w-[90%] max-w-[400px]">
        <div className="p-6">
          <div className="flex flex-col items-center">
            {/* Icon Container */}
            <div className="relative mb-6">
              <div className="absolute -inset-1 bg-red-500/20 rounded-full blur-md"></div>
              <div className="relative p-4 rounded-full bg-gray-900/80 border border-red-500/30">
                <FiTrash2 className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* Content */}
            <h2 className="mb-3 text-xl font-semibold text-gray-100">
              Delete {itemName}
            </h2>
            <div className="mb-6 text-center">
              <p className="text-gray-400 mb-2 text-sm">
                Are you sure you want to delete this {itemName.toLowerCase()}?
              </p>
              <div className="flex items-center justify-center gap-2 text-red-400">
                <FiAlertCircle className="w-4 h-4" />
                <span className="text-xs font-medium">
                  This action cannot be undone
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 rounded-xl 
                          bg-gray-900/50 border border-gray-700 
                          hover:bg-gray-900 hover:border-gray-600 
                          transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white 
                          bg-red-500/90 rounded-xl
                          hover:bg-red-500 
                          transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

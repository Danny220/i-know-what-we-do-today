import React from "react";
import Button from "./Button.jsx";
import H2 from "./H2.jsx";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/75">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <H2>{title}</H2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <Button
            className="bg-gray-600 hover:bg-gray-700 w-auto"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 w-auto"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;

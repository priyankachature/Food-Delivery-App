// AddAddressModal.jsx
import React from "react";
import AddAddress from "./AddAddress";

const AddAddressModal = ({ initialData , onClose, onSave }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-4 sm:mx-6 bg-white rounded-lg shadow-lg p-6">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-900">
          {initialData ? "Edit Address" : "Add New Address"}

        </h2>

        {/* Reuse your existing form */}
        <AddAddress
          initialData={initialData}
          onSave={(saved) => {
            onSave(saved);   // parent updates state
            onClose();       // close modal after saving
          }}
        />

      </div>
    </div>
  );
};

export default AddAddressModal;
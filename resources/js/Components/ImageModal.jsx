import React from 'react';
import { XCircle } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageSrc, imageAlt }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="max-w-[90vw] max-h-[90vh] relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-7 -right-7 text-white hover:text-gray-300 focus:outline-none transition-colors duration-200"
          aria-label="Close modal"
        >
          <XCircle className="w-8 h-8" />
        </button>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-md"
        />
      </div>
    </div>
  );
};

export default ImageModal;

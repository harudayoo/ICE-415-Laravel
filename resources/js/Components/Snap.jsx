import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import PrimaryButton from './PrimaryButton';
import ImageModal from './ImageModal';

export default function Snap({ snap, onUpdateSnap, onDeleteSnap }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPhoto, setUpdatedPhoto] = useState(null);
    const [selectedPhotoName, setSelectedPhotoName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

  if (!snap?.user?.name || !snap?.photo_path) {
    return null;
  }

  const handlePhotoUpdate = (event) => {
    const file = event.target.files[0];
    setUpdatedPhoto(file);
    setSelectedPhotoName(file.name);
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

      const handleImageClick = () => {
    if (!isEditing) {
      setIsModalOpen(true);
    }
  };

  const handleSaveClick = async () => {
    if (updatedPhoto && onUpdateSnap) {
      onUpdateSnap(snap.id, updatedPhoto);
      setIsEditing(false);
      setUpdatedPhoto(null);
      setSelectedPhotoName('');
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-800 font-medium">{snap.user.name}</span>
            <small className="ml-2 text-sm text-gray-600">
              {new Date(snap.created_at).toLocaleString()}
            </small>
          </div>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={handleUpdateClick}
              title="Edit snap"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-800 focus:outline-none"
              onClick={() => onDeleteSnap(snap)}
              title="Delete snap"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <label htmlFor={`photo-upload-${snap.id}`} className="cursor-pointer">
                  <div className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-300">
                    {selectedPhotoName || 'Choose New Photo'}
                  </div>
                </label>
                <input
                  id={`photo-upload-${snap.id}`}
                  type="file"
                  onChange={handlePhotoUpdate}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <PrimaryButton
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  onClick={handleSaveClick}
                  disabled={!updatedPhoto}
                >
                  Save Changes
                </PrimaryButton>
              </div>
            </div>
          ) : (
          <>
            <img
              src={`/storage/${snap.photo_path}`}
              alt={`Snap by ${snap.user.name}`}
              className="w-full rounded-3xl shadow-lg cursor-pointer"
              onClick={handleImageClick}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300';
                e.target.onerror = null;
              }}
            />
            <ImageModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              imageSrc={`/storage/${snap.photo_path}`}
              imageAlt={`Snap by ${snap.user.name}`}
            />
          </>
          )}
        </div>
      </div>
    </div>
  );
}

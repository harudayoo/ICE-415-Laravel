import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head, router } from '@inertiajs/react';
import Snap from '@/Components/Snap';
import { XCircle } from 'lucide-react';

export default function Index({ auth, snaps = [] }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    photo: null,
  });
  const [selectedFileName, setSelectedFileName] = useState('');
  const [updatedSnaps, setUpdatedSnaps] = useState(snaps);
  const [snapToDelete, setSnapToDelete] = useState(null);

  useEffect(() => {
    setUpdatedSnaps(snaps);
  }, [snaps]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData('photo', file);
    setSelectedFileName(file?.name || '');
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('snaps.store'), {
      onSuccess: () => {
        reset();
        setSelectedFileName('');
      },
      preserveScroll: true,
    });
  };

  const handleUpdateSnap = (snapId, updatedPhoto) => {
    const formData = new FormData();
    formData.append('photo', updatedPhoto);
    formData.append('_method', 'PUT');

    router.post(route('snaps.update', snapId), formData, {
      forceFormData: true,
      onSuccess: () => {
        // Refresh the page to show updated image
        router.reload({ only: ['snaps'] });
      },
    });
  };

  const handleDeleteSnap = (snap) => {
    setSnapToDelete(snap);
  };

  const confirmDeleteSnap = () => {
    router.delete(route('snaps.destroy', snapToDelete.id), {
      onSuccess: () => {
        setSnapToDelete(null);
        // Optional: Update local state instead of relying on page reload
        setUpdatedSnaps(updatedSnaps.filter((snap) => snap.id !== snapToDelete.id));
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Snaps" />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={submit}>
          <div className="mb-4 flex items-center">
            <div className="relative mr-2 flex-1">
              <input
                type="file"
                name="photo"
                id="photo"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
              />
              <div className="flex items-center">
                <PrimaryButton
                  type="button"
                  className="w-full"
                  onClick={() => document.getElementById('photo').click()}
                >
                  {selectedFileName || 'Choose a file to snap'}
                </PrimaryButton>
              </div>
            </div>
            <PrimaryButton className="mt-0 w-1/4" disabled={processing}>
              Snap
            </PrimaryButton>
          </div>
          <InputError message={errors.photo} className="mt-2" />
        </form>

        <div className="mt-8 space-y-6">
          {updatedSnaps.length > 0 ? (
            updatedSnaps.map((snap) => (
              <Snap
                key={snap.id}
                snap={snap}
                onUpdateSnap={handleUpdateSnap}
                onDeleteSnap={handleDeleteSnap}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">No snaps available.</p>
          )}
        </div>
      </div>

      {snapToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Delete Snap</h3>
              <button
                onClick={() => setSnapToDelete(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this snap? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-4">
              <PrimaryButton
                onClick={() => setSnapToDelete(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                onClick={confirmDeleteSnap}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

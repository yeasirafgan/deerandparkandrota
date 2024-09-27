// app/rota/page.js

'use client';

import { useState } from 'react';
import RotaUploadForm from '/components/RotaUploadForm';
import RotaList from '/components/RotaList';
import { useRouter } from 'next/navigation';

export default function RotaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // Import useRouter for refreshing

  async function handleUpload(formData) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/rota/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // If upload is successful, trigger a router refresh to update the list
        router.refresh(); // This forces the page to refetch data
      } else {
        const result = await response.json();
        console.error('Error response:', result);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='container mx-auto'>
        {/* Heading */}
        <h1 className='text-2xl font-bold text-lime-900 mb-6'>Manage Rota</h1>

        {/* Rota Upload Form */}
        <div className='w-full mb-6'>
          <RotaUploadForm
            onSubmit={handleUpload}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Rota List */}
        <div className='w-full'>
          <RotaList key="rota-page" showActions={true} />
        </div>
      </div>
    </div>
  );
}

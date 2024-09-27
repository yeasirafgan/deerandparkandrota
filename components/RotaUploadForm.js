//components / RotaUploadForm.js;

'use client';

import { useState } from 'react';

export default function RotaUploadForm({ onSubmit, isSubmitting }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [weekStart, setWeekStart] = useState('');

  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!file || !name || !weekStart) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('weekStart', weekStart);

    onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white shadow-lg rounded-lg p-4 md:p-3 lg:px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto'
    >
      <div className='flex flex-col'>
        <label
          htmlFor='rotaName'
          className='text-sm font-medium text-gray-600 mb-1 md:mb-1.5 lg:mb-2 '
        >
          Rota Name
        </label>
        <input
          id='rotaName'
          type='text'
          placeholder='Rota Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='border border-gray-300 rounded-lg p-2.5 md:p-2 lg:p-1.5 lg:ml-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='flex flex-col'>
        <label
          htmlFor='weekStart'
          className='text-sm font-medium text-gray-600 mb-1 md:mb-1.5 lg:mb-2'
        >
          Week Start Date
        </label>
        <input
          id='weekStart'
          type='date'
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
          className='border border-gray-300 rounded-lg p-2.5 md:p-2 lg:p-1.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='flex flex-col'>
        <label
          htmlFor='fileUpload'
          className='text-sm font-medium text-gray-600 mb-1 md:mb-1.5 lg:mb-2'
        >
          Upload File
        </label>
        <input
          id='fileUpload'
          type='file'
          accept='.xls,.xlsx'
          onChange={handleFileChange}
          className='border border-gray-300 rounded-lg p-2.5 md:p-2 lg:p-1.5 text-gray-800 file:py-1.5 file:px-2.5 file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium file:rounded-lg hover:file:bg-blue-100'
        />
      </div>

      <div className='flex flex-col justify-end col-span-full'>
        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-[98%] mx-auto bg-slate-700 text-white p-2.5 md:p-2 lg:p-1.5 rounded-lg hover:bg-lime-900 transition-colors duration-300 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </form>
  );
}

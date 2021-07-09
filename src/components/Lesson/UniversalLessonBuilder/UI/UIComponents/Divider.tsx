import React from 'react';
import {
  AnnotationIcon,
  PaperClipIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/solid';

const Divider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-0 border-gray-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="w-auto relative z-0 inline-flex shadow-sm rounded-md -space-x-px">
          <button
            type="button"
            className="relative w-auto inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <span className="sr-only">Edit</span>
            <PencilIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="relative w-auto inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <span className="sr-only">Attachment</span>
            <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="relative w-auto inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <span className="sr-only">Annotate</span>
            <AnnotationIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="relative w-auto inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <span className="sr-only">Delete</span>
            <TrashIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </span>
      </div>
    </div>
  );
};

export default Divider;

import React, {useContext, useState} from 'react';

const NewPageDialog = () => {
  return (
    <div className={`grid grid-cols-3 gap-2`}>
      <div className={`flex flex-col`}>
        <h2>Add New Page</h2>
        <div>
          <label htmlFor="field1" className="text-left block text-sm font-medium text-gray-700">
            Field 1
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="field1"
              id="field1"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="field1" className="text-left block text-sm font-medium text-gray-700">
            Field 1
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="field1"
              id="field1"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="field1" className="text-left block text-sm font-medium text-gray-700">
            Field 1
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="field1"
              id="field1"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </div>
      <div>
        <h2>Use Existing Page</h2>
        <p className={`text-left block text-sm font-medium text-gray-700`}>Page From Lesson</p>
        <p className={`text-left block text-sm font-medium text-gray-700`}>Page From Lesson</p>
        <p className={`text-left block text-sm font-medium text-gray-700`}>Page From Lesson</p>
        <p className={`text-left block text-sm font-medium text-gray-700`}>Page From Lesson</p>
        <p className={`text-left block text-sm font-medium text-gray-700`}>Page From Lesson</p>
      </div>
      <div>
        <h2>Page From Template</h2>
        <div className={`grid grid-cols-3 gap-2 h-full w-full`}>
          <div className={`w-full h-full bg-gray-200 rounded`}></div>
          <div className={`w-full h-full bg-gray-200 rounded`}></div>
          <div className={`w-full h-full bg-gray-200 rounded`}></div>
          <div className={`w-full h-full bg-gray-200 rounded`}></div>
          <div className={`w-full h-full bg-gray-200 rounded`}></div>
          <div className={`w-full h-full bg-gray-200 rounded`}></div>
        </div>
      </div>
    </div>
  );
};

export default NewPageDialog;

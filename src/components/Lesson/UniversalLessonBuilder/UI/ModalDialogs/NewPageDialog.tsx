import React, {useContext, useState} from 'react';

const NewPageDialog = () => {
  return (
    <div className={`grid grid-cols-3 gap-2`}>
      {/* LEFT */}
      <div className={`flex flex-col`}>
        <h2>Add New Page</h2>
        <div>
          <label
            htmlFor="field1"
            className="text-left block text-xs font-medium text-gray-700">
            Lesson Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="lessonNameInput"
              id="lessonNameInput"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="My Custom Lesson"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="field1"
            className="text-left block text-xs font-medium text-gray-700">
            Subject
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="lessonSubjectInput"
              id="lessonSubjectInput"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Creative Writing"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="field1"
            className="text-left block text-xs font-medium text-gray-700">
            Type
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="lessonTypeInput"
              id="lessonTypeInput"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Standard Lesson"
            />
          </div>
        </div>
      </div>

      {/* MIDDLE */}
      <div>
        <h2>Use Existing Page</h2>
        <div className={`h-full w-full`}>
          <p className={`text-left block text-xs font-medium text-gray-700`}>
            Activities
          </p>
          <div className={`flex flex-wrap w-full`}>
            <div className={`m-1 w-16 h-24 bg-gray-200 rounded`}></div>
            <div className={`m-1 w-16 h-24 bg-gray-200 rounded`}></div>
            <div className={`m-1 w-16 h-24 bg-gray-200 rounded`}></div>
          </div>

          <p className={`text-left block text-xs font-medium text-gray-700`}>
            Checkpoints
          </p>
          <div>
            <div className={`grid grid-cols-3 gap-2 h-auto w-full`}>
              <div className={`w-full h-24 bg-gray-200 rounded`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div>
        <h2>Page From Template</h2>

        <div className={`h-full w-full`}>
          <p className={`text-left block text-xs font-medium text-gray-700`}>Style 1</p>
          <div className={`grid grid-cols-3 gap-2 h-auto w-full`}>
            <div className={`w-full h-24 bg-gray-200 rounded`}></div>
          </div>

          <p className={`text-left block text-xs font-medium text-gray-700`}>Style 2</p>
          <div className={`grid grid-cols-3 gap-2 h-auto w-full`}>
            <div className={`w-full h-24 bg-gray-200 rounded`}></div>
            <div className={`w-full h-24 bg-gray-200 rounded`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPageDialog;

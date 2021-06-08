import React, {useContext, useState} from 'react';
import PageTile from '../common/PageTile';
import {VscNewFile} from 'react-icons/vsc';
import Buttons from '../../../../Atoms/Buttons';

const NewPageDialog = () => {
  const [focussed, setFocussed] = useState<
    'new_page' | 'existing_page' | 'template' | ''
  >('');

  const handleToggleFocussed = (
    sectionTag: 'new_page' | 'existing_page' | 'template' | ''
  ) => {
    if (focussed !== sectionTag) {
      setFocussed(sectionTag);
    } else {
      setFocussed('');
    }
  };

  return (
    <div className={`flex flex-row z-50`}>
      {/* LEFT */}
      <div
        className={`
        ${
          focussed === ''
            ? ''
            : focussed === 'new_page'
            ? 'w-full h-full'
            : 'w-0 overflow-hidden opacity-0'
        }
        transition-all duration-400 ease-in-out
        flex flex-col`}>
        <div className="relative flex items-center">
          <h2 className="w-auto bg-white text-lg font-medium text-gray-900 truncate">
            Add New Page
          </h2>
          <Buttons
            onClick={() => handleToggleFocussed('new_page')}
            Icon={VscNewFile}
            label="More"
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
          />
        </div>
        <div className={`bg-gray-200 p-2`}>
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
        <div className={`bg-gray-200 p-2`}>
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
        <div className={`bg-gray-200 p-2`}>
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
      <div
        className={`
        ${
          focussed === ''
            ? ''
            : focussed === 'existing_page'
            ? 'w-full'
            : 'w-0 overflow-hidden opacity-0'
        }
        transition-all duration-400 ease-in-out
      `}>
        <div className="relative flex items-center">
          <h2 className="w-auto bg-white text-lg font-medium text-gray-900 truncate">
            Use Existing Page
          </h2>
          <Buttons
            onClick={() => handleToggleFocussed('existing_page')}
            Icon={VscNewFile}
            label="More"
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
          />
        </div>

        <div className={`w-full bg-gray-200`}>
          <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
            Activities
          </p>
          <div className="mt-4 p-4 grid grid-cols-3 bg-gray-200">
            <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
          </div>

          <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
            Checkpoints
          </p>
          <div>
            <div className="mt-4 p-4 grid grid-cols-3 bg-gray-200">
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className={`
        ${
          focussed === ''
            ? ''
            : focussed === 'template'
            ? 'w-full'
            : 'w-0 overflow-hidden opacity-0'
        }
        transition-all duration-400 ease-in-out
      `}>
        <div className="relative flex items-center">
          <h2 className="w-auto bg-white text-lg font-medium text-gray-900 truncate">
            Page From Template
          </h2>
          <Buttons
            onClick={() => handleToggleFocussed('template')}
            Icon={VscNewFile}
            label="More"
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
          />
        </div>

        <div className={`w-full bg-gray-200`}>
          <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
            Style 1
          </p>
          <div className="mt-4 p-4 grid grid-cols-3 bg-gray-200">
            <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
          </div>

          <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
            Style 2
          </p>
          <div className="mt-4 p-4 grid grid-cols-3 bg-gray-200">
            <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPageDialog;

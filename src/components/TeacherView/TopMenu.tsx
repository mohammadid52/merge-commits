import React, { useContext, useState, useEffect, Suspense, lazy } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaExpand, FaCompress, FaHome, FaRegThumbsUp } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';

/**
 * IMPORT FUNCTIONS
 */
import { firstInitialFunc } from '../../utilities/strings';

interface TopMenuControlProps {
  shareable: boolean;
  setShareable: React.Dispatch<React.SetStateAction<boolean>>;
  isSameStudentShared: boolean;
  handleOpen: () => void;
  handleLessonButton: () => void;
  handleQuitViewing: () => void;
  handleShareStudentData: () => void;
  handleQuitShare: () => void;
  handleClick: () => void;
  handleHomePopup: () => void;
}

const TopMenuControl: React.FC<TopMenuControlProps> = (props: TopMenuControlProps) => {
  const {
    shareable,
    setShareable,
    isSameStudentShared,
    handleOpen,
    handleLessonButton,
    handleQuitViewing,
    handleShareStudentData,
    handleQuitShare,
    handleClick,
    handleHomePopup,
  } = props;

  const { state, theme, dispatch } = useContext(LessonControlContext);

  return (
    <>
      {/* LABELS */}

      <div
        className={`relative w-full h-0.5/10 border-b border-gray-400 flex flex-row items-center`}>
        {/* LABELS BG */}
        <div className='absolute w-full h-8 top-0 font-medium bg-light-gray bg-opacity-30'></div>

        {/* LEFT */}
        <div className='h-full w-4/10 min-w-100 max-w-160 px-4 flex flex-row justify-between '>
          <div className='w-full flex flex-col'>
            <div title='title' className='h-8 align-middle font-bold text-xs leading-8 '>
              Lesson:
            </div>
          </div>

          <div className='w-32 flex flex-col text-center'>
            <div className='h-8 align-middle font-bold text-xs leading-8 '>Control:</div>
          </div>
        </div>

        {/* RIGHT */}
        <div className='h-full w-full pr-4 flex flex-row justify-between  text-center'>
          <div className='w-1.5/10 flex flex-col'>
            <div className='h-8 align-middle font-bold text-xs leading-8 '>Start/End Date:</div>
          </div>

          {/* SHARING START */}
          <div className='w-7/10 flex justify-around'>
            {/* VIEWING TAB */}
            <div className='w-full flex flex-col'>
              <div className='h-8 align-middle font-bold text-xs leading-8 '>
                <span className='font-bold text-black'>Currently viewing:</span>
              </div>
            </div>

            {/* SHARE ACTION */}
            <div className='w-full flex flex-col'>
              <div className='h-8 align-middle font-bold text-xs leading-8 '>
                <span className='font-bold text-black'>Action:</span>
              </div>
            </div>

            {/* SHARING TAB */}
            <div className={`w-full h-full flex flex-col`}>
              <div className='h-8 align-middle font-bold text-xs leading-8 '>
                <span className='font-bold text-black'>Currently sharing:</span>
              </div>
            </div>
          </div>

          {/* SHARING END */}

          {/* BUTTONS */}
          <div className='w-1.5/10 flex flex-col content-between'>
            <div className='h-8 align-middle font-bold text-xs leading-8 '>
              <span className='font-bold text-black'>Navigation:</span>
            </div>
          </div>
        </div>
      </div>

      {/* BUTTONS & CONTENT */}

      <div
        className={`relative w-full h-22 py-2 bg-light-gray bg-opacity-10 border-b border-gray-400 flex flex-row mt-0`}>
        {/* LEFT */}
        <div className='h-full w-4/10 min-w-100 max-w-160 px-4 flex flex-row justify-between '>
          <div className='w-full flex flex-col my-auto'>
            <h1 className={`text-3xl font-medium`}>"{state.data.lesson.title}"</h1>
          </div>

          <div className='w-32 h-full flex flex-col  text-sm'>
            <div className='h-1/2 flex items-start'>
              {/* START BUTTON */}
              {!state.open ? (
                <div
                  className='w-full bg-sea-green hover:bg-green-400 text-white cursor-pointer  w-24 mt-0 p-2 leading-none rounded-lg flex items-center justify-center text-center border border-light-gray'
                  onClick={() => {
                    !state.open ? handleOpen() : null;
                  }}>
                  Start
                </div>
              ) : (
                <div className='w-full bg-dark-gray bg-opacity-20 text-white w-24 mt-0 p-2 leading-none rounded-lg flex items-center justify-center text-center border border-light-gray'>
                  Start
                </div>
              )}
            </div>

            <div className='h-1/2 flex items-end'>
              {/* COMPLETE BUTTON */}
              {state.open ? (
                <div
                  className='w-full bg-dark-red hover:bg-red-700 text-white cursor-pointer w-24 mb-0 p-2 leading-none rounded-lg flex items-center justify-center text-center border border-light-gray'
                  onClick={() => {
                    state.open ? handleLessonButton() : null;
                  }}>
                  Complete
                </div>
              ) : (
                <div className='w-full bg-dark-red text-gray-200 cursor-pointer w-24 mb-0 p-2 leading-none rounded-lg flex items-center justify-center text-center border border-light-gray'>
                  Complete
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className='h-full w-full pr-4 flex flex-row justify-between '>
          <div className='w-1/10 h-full flex flex-col  my-auto text-center text-sm'>
            <div className='h-1/2 flex items-start'>
              <div className='w-auto mx-auto bg-white bg-opacity-50 rounded-lg mt-0 p-1 text-sea-green hover:text-green-600 font-bold border border-light-gray'>
                S: {state.expectedStartDate}
              </div>
            </div>

            <div className='h-1/2 flex items-end'>
              <div className='w-auto mx-auto bg-white bg-opacity-50 rounded-lg mb-0 p-1 text-dark-red hover:text-red-600 font-bold border border-light-gray'>
                E: {state.expectedEndDate}
              </div>
            </div>
          </div>

          {/* SHARING START */}
          <div className='w-7/10 flex justify-around'>
            {/* VIEWING TAB */}
            <div className='w-full flex flex-col border border-light-gray mx-2 rounded-lg'>
              <div className='w-full flex justify-center my-auto'>
                <div
                  className={`w-auto  h-8 px-3 flex justify-center items-center rounded-lg text-sm font-medium overflow-x-auto cursor-pointer ${
                    state.studentViewing.studentInfo && state.studentViewing.studentInfo.id
                      ? 'bg-blueberry hover:bg-opacity-80 text-white'
                      : 'text-gray-600 text-sm'
                  }`}
                  onClick={handleQuitViewing}>
                  {state.studentViewing.studentInfo && state.studentViewing.studentInfo.id
                    ? state.studentViewing.studentInfo.student.firstName +
                      ' ' +
                      firstInitialFunc(state.studentViewing.studentInfo.student.lastName)
                    : '(click on a student)'}
                </div>
                <div className={`w-auto ml-2 ${state.studentViewing.live ? '' : 'hidden'}`}>
                  {state.studentViewing.live ? (
                    <div
                      className='font-bold cursor-pointer text-xl text-red-700 hover:text-red-400 flex justify-center items-center'
                      onClick={handleQuitViewing}>
                      X
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* SHARE ACTION */}
            <div className='w-full flex flex-col border border-light-gray mx-2 rounded-lg'>
              {shareable && state.studentViewing.live && !isSameStudentShared ? (
                <div className={`cursor-pointer w-auto my-auto text-center text-sm z-50`}>
                  <button
                    className='bg-sea-green hover:bg-opacity-80 text-white h-8 w-36 rounded-lg'
                    onClick={handleShareStudentData}>
                    Share Student
                  </button>
                </div>
              ) : (
                <div className={`w-auto my-auto text-center text-sm z-50`}>
                  <button
                    className='bg-dark-gray bg-opacity-20 text-white h-8 w-36 rounded-lg'
                    style={{ pointerEvents: 'none' }}>
                    Share Student
                  </button>
                </div>
              )}
            </div>

            {/* SHARING TAB */}
            <div
              className={`w-full h-full flex flex-col mx-2 rounded-lg ${
                state.sharing ? 'border-2 border-dark-gray' : 'border border-light-gray'
              }`}>
              <div className={`w-full flex justify-center my-auto`}>
                <div
                  className={`w-auto h-8 px-3 flex justify-center items-center text-sm rounded-lg font-medium cursor-pointer ${
                    state.sharing
                      ? 'bg-blueberry hover:bg-opacity-80  text-white '
                      : 'text-gray-600'
                  }`}
                  onClick={handleQuitShare}>
                  {state.sharing
                    ? state.displayData.studentInfo.firstName +
                      ' ' +
                      firstInitialFunc(state.displayData.studentInfo.lastName)
                    : '(share student info)'}
                </div>
                <div className={`w-auto ml-2 ${state.sharing ? '' : 'hidden'}`}>
                  {state.sharing ? (
                    <div
                      className='font-bold cursor-pointer text-xl text-red-700 hover:text-red-400 flex justify-center items-center'
                      onClick={handleQuitShare}>
                      X
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {/* SHARING END */}

          {/* BUTTONS */}
          <div className='w-1.5/10 flex flex-col content-between '>
            <div className='flex flex-row my-auto justify-around'>
              <div
                className='relative w-16 flex flex-col content-between justify-center items-center text-center cursor-pointer px-2'
                onClick={handleClick}>
                <IconContext.Provider value={{ size: '1.5rem' }}>
                  <FiUsers />
                </IconContext.Provider>
                {/**
                 *
                 * STILL NEED TO ADD THE LABELS OF THE BUTTOINS TO
                 * TOOLTIPS...
                 *
                 */}
                {/* <p className="absolute bottom-0 text-sm text-center">Students Management</p> */}
              </div>
              <div
                className='relative w-16 flex flex-col content-between justify-center items-center text-center cursor-pointer px-2'
                onClick={handleHomePopup}>
                <IconContext.Provider value={{ size: '1.5rem' }}>
                  <FaHome />
                </IconContext.Provider>
                {/* <p className="absolute bottom-0 text-sm text-center">Home</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopMenuControl;

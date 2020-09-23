import React, { useContext } from 'react';
import { IconContext } from 'react-icons';
import { FaRegSave, FaHome } from 'react-icons/fa';
import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import { LessonContext } from '../../../../contexts/LessonContext';

const SaveQuit = () => {
  const { theme } = useContext(LessonContext);
  // the bottom is from 'LessonHeaderBar.tsx'
  // const { theme, state, dispatch } = useContext(LessonContext);
  // const handleSave = () => {
  //     if ( state.unsavedChanges ) {
  //         if ( !state.firstSave ) {
  //             createClassroomData()
  //         }

  //         if ( state.firstSave ) {
  //             updateClassroomData()
  //         }
  //     }
  // }

  return (
    <span className="w-7/10 ml-3 flex inline-flex rounded-md shadow-sm">
        <button type="submit" className="text-xs sm:text-base inline-flex justify-center py-1 md:py-2 px-2 md:px-4 border border-transparent text-m leading-5 font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:border-yellow-700 focus:shadow-outline-yellow active:bg-yellow-700 transition duration-150 ease-in-out">
        Save and Go to Dashboard
        </button>
    </span>
  );
};

export default SaveQuit;

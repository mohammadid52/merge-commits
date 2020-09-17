import React, { useContext } from 'react';
import { IconContext } from 'react-icons';
import { FaRegSave, FaHome } from 'react-icons/fa';
import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import { LessonContext } from '../../../../contexts/LessonContext';

const Links = () => {
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
    <div
      className={`${theme.gradient.cardBase} w-10/10 bg-dark-blue flex flex-col justify-between items-center rounded-lg p-4 mb-4 shadow-xl`}>
      <div className='flex flex-row justify-around items-start rounded-lg text-gray-200'>
        <div
          className={`h-full w-3/10 bg-medium-blue p-4 rounded-lg cursor-pointer flex flex-col justify-center items-center`}
          // onClick={handleSave}
        >
          <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem' }}>
            <AiOutlineSave />
          </IconContext.Provider>
          <p className='font-light text-base text-blue-100 text-opacity-70 text-center'>
            Save your work
          </p>
        </div>

        <div
          className={`h-full w-3/10 bg-medium-blue p-4 rounded-lg flex flex-col justify-center items-center cursor-pointer`}>
          <NavLink to='/dashboard'>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem' }}>
              <AiOutlineHome />
            </IconContext.Provider>
          </NavLink>
          <p className='font-light text-base text-blue-100 text-opacity-70 text-center'>
            Go Home &#10140;
          </p>
        </div>
      </div>
    </div>
  );
};

export default Links;

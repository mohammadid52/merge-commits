import React, {useContext} from 'react';

import {LessonCardProps} from '../Classroom';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import SideImage from './StandardLessonCard/SideImage';
import BottomBar from './StandardLessonCard/BottomBar';
import MainSummary from './StandardLessonCard/MainSummary';

const StandardLessonCard = (props: LessonCardProps) => {
  const {
    isTeacher,
    keyProps,
    roomID,
    activeRoomInfo,
    lessonProps,
    accessible,
    lessonType,
  } = props;
  const {theme} = useContext(GlobalContext);

  return (
    <>
      <div className="relative mb-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t-0 border-gray-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span
            className="px-2 text-sm text-gray-500 w-auto"
            style={{
              backgroundColor: '#f0f2f5',
            }}>
            {lessonProps.sessionHeading}
          </span>
        </div>
      </div>

      <div
        key={keyProps}
        className={`relative bg-white shadow rounded-lg flex flex-col lg:flex-row mb-8 ${theme.elem.textDark} `}>
        {/**
         *  LEFT SECTION IMAGE
         */}
        <SideImage lessonProps={lessonProps} />
        {/**
         *  RIGHT SECTION
         */}
        <div className={`w-full lg:w-7.5/10 flex flex-col rounded-b`}>
          <MainSummary lessonType={lessonType} lessonProps={lessonProps} />

          <BottomBar
            isTeacher={isTeacher}
            activeRoomInfo={activeRoomInfo}
            accessible={accessible}
            roomID={roomID}
            lessonProps={lessonProps}
            lessonType={lessonType}
          />
        </div>
      </div>
    </>
  );
};

export default StandardLessonCard;

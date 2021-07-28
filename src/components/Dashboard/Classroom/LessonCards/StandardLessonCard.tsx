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
    <div
      key={keyProps}
      className={`relative bg-white shadow rounded-lg flex mb-8 ${theme.elem.textDark} `}>
      {/**
       *  LEFT SECTION IMAGE
       */}
      <SideImage lessonProps={lessonProps} />
      {/**
       *  RIGHT SECTION
       */}
      <div className={` w-7.5/10 flex flex-col rounded-b`}>
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
  );
};

export default StandardLessonCard;

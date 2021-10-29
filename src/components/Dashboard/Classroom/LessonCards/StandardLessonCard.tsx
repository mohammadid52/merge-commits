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
    syllabusProps,
    accessible,
    lessonType,
    getImageFromS3 = true,
    preview = false,
  } = props;
  const {theme} = useContext(GlobalContext);

  return (
    <div
      key={keyProps}
      className={`relative bg-white shadow rounded-lg flex flex-col md:flex-row mb-8 ${theme.elem.textDark} `}>
      {/**
       *  LEFT SECTION IMAGE
       */}
      <SideImage getImageFromS3={getImageFromS3} lessonProps={lessonProps} />
      {/**
       *  RIGHT SECTION
       */}
      <div className={`w-full md:w-7.5/10 flex flex-col rounded-b`}>
        <MainSummary lessonType={lessonType} lessonProps={lessonProps} />

        <BottomBar
          isTeacher={isTeacher}
          activeRoomInfo={activeRoomInfo}
          preview={preview}
          accessible={accessible}
          roomID={roomID}
          lessonProps={lessonProps}
          syllabusProps={syllabusProps}
          lessonType={lessonType}
        />
      </div>
    </div>
  );
};

export default StandardLessonCard;

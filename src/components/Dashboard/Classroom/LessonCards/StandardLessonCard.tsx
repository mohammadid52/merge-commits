import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import Start from '../Start';

import { LessonCardProps } from '../Classroom';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import SideImage from './StandardLessonCard/SideImage';
import BottomBar from './StandardLessonCard/BottomBar';
import MainSummary from './StandardLessonCard/MainSummary';

const StandardLessonCard = (props: LessonCardProps) => {
  const { isTeacher, keyProps, activeRoomInfo, lessonProps, accessible, lessonType } = props;
  const { theme } = useContext(GlobalContext);

  return (
    <div key={keyProps} className={`relative bg-white shadow rounded-lg flex mb-8 ${theme.elem.textDark} `}>
      {/**
       *  LEFT SECTION IMAGE
       */}
      {lessonType !== 'survey' && <SideImage lessonProps={lessonProps} />}
      {/**
       *  RIGHT SECTION
       */}
      <div className={`${lessonType !== 'survey' ? 'w-7.5/10' : 'w-full'} flex flex-col rounded-b`}>
        <MainSummary lessonType={lessonType} lessonProps={lessonProps} />

        <BottomBar
          isTeacher={isTeacher}
          accessible={accessible}
          activeRoomInfo={activeRoomInfo}
          lessonProps={lessonProps}
          lessonType={lessonType}
        />
      </div>
    </div>
  );
};

export default StandardLessonCard;

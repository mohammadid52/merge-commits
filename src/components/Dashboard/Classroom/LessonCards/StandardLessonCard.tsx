import React, {useContext, useEffect, useState} from 'react';

import {LessonCardProps} from '../Classroom';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import SideImage from './StandardLessonCard/SideImage';
import BottomBar from './StandardLessonCard/BottomBar';
import MainSummary from './StandardLessonCard/MainSummary';
import Rating from './StandardLessonCard/Rating';
import ProgressBar from './StandardLessonCard/ProgressBar';

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
    user,
    handleLessonMutationRating,
    getLessonRating,
    getLessonByType,
    getImageFromS3 = true,
    preview = false
  } = props;
  const {theme} = useContext(GlobalContext);
  const [existsOrNot, setexistsOrNot] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    checkValueOrNull();
  }, []);

  const checkValueOrNull = async () => {
    try {
      const value = await getLessonRating(lessonProps.lesson.id, user.email, user.authId);
      if (typeof value === 'undefined') setexistsOrNot(true);

      if (value) {
        if (value.lessonProgress === value.totalPages) setIsCompleted(true);
      }
      return;
    } catch (error) {}
  };

  return (
    <div
      key={keyProps}
      className={`relative overflow-hidden bg-white shadow rounded-xl flex flex-col md:flex-row mb-8 ${theme.elem.textDark} `}>
      {/**
       *  LEFT SECTION IMAGE
       */}
      <SideImage getImageFromS3={getImageFromS3} lessonProps={lessonProps} />
      {/**
       *  RIGHT SECTION
       */}
      <div className={`w-full md:w-7.5/10 flex flex-col rounded-b`}>
        <MainSummary lessonType={lessonType} lessonProps={lessonProps} />
        <ProgressBar
          lessonProps={{
            ...lessonProps,
            lesson: {...lessonProps.lesson, type: lessonType}
          }}
          user={user}
          value=""
          max="100"
          getLessonByType={getLessonByType}
        />
        {lessonProps.lesson.type !== 'survey' && !existsOrNot && isCompleted ? (
          <Rating
            user={user}
            getLessonRating={getLessonRating}
            lessonProps={lessonProps}
            handleLessonMutationRating={handleLessonMutationRating}
          />
        ) : (
          <></>
        )}
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

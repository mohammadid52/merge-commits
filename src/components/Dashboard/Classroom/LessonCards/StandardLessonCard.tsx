import React, {useContext, useEffect, useState} from 'react';

import {LessonCardProps} from '../Classroom';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import SideImage from './StandardLessonCard/SideImage';
import BottomBar from './StandardLessonCard/BottomBar';
import MainSummary from './StandardLessonCard/MainSummary';
import Rating from './StandardLessonCard/Rating';

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
    getImageFromS3 = true,
    preview = false,
  } = props;
  const {theme} = useContext(GlobalContext);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [existsOrNot, setexistsOrNot] = useState<boolean>(false);

  useEffect(() => {
    checkValueOrNull();
  }, []);

  const checkValueOrNull = async () => {
    try {
      const value = await getLessonRating(lessonProps.lesson.id, user.email, user.authId);
      if (typeof value === 'undefined') {
        setexistsOrNot(true);
      }
      setPageNumber(value.currentPage);
      return;
    } catch (error) {}
  };

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
        {lessonProps.lesson.type !== 'survey' && !existsOrNot ? (
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
          pageNumber={pageNumber}
          lessonProps={lessonProps}
          syllabusProps={syllabusProps}
          lessonType={lessonType}
        />
      </div>
    </div>
  );
};

export default StandardLessonCard;

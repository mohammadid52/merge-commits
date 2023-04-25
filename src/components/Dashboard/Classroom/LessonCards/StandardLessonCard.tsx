import {useEffect, useState} from 'react';

import useAuth from '@customHooks/useAuth';
import {useGlobalContext} from 'contexts/GlobalContext';

import BottomBar from './StandardLessonCard/BottomBar';
import MainSummary from './StandardLessonCard/MainSummary';
import ProgressBar from './StandardLessonCard/ProgressBar';
import Rating from './StandardLessonCard/Rating';
import SideImage from './StandardLessonCard/SideImage';
import {LessonCardProps} from '@interfaces/ClassroomInterface';

const StandardLessonCard = (props: LessonCardProps) => {
  const {
    isTeacher,
    keyProps,
    roomID,
    activeRoomInfo,
    lessonProps,
    syllabusProps,
    accessible,
    user,
    handleLessonMutationRating,
    getLessonRating,
    getImageFromS3 = true,

    preview = false
  } = props;

  const {theme, lessonDispatch} = useGlobalContext();
  const [existsOrNot, setexistsOrNot] = useState<boolean>(false);

  const [isFetched, setIsFetched] = useState(false);
  const [personDataObj, setPersonDataObj] = useState<any>(null);

  const {isStudent} = useAuth();
  useEffect(() => {
    if (!isFetched) {
      checkValueOrNull();
    }
  }, [isFetched]);

  const checkValueOrNull = async () => {
    try {
      const value = await getLessonRating?.(
        lessonProps.lesson.id,
        user.email,
        user.authId
      );

      if (typeof value === 'undefined') setexistsOrNot(true);

      if (value) {
        setPersonDataObj(value);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: value.lessonProgress
        });
      }
      return;
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetched(true);
    }
  };

  const _isCompleted =
    activeRoomInfo?.completedLessons?.findIndex(
      (item: {lessonID?: string | null; time?: string | null}) =>
        item.lessonID === lessonProps.lessonID
    ) > -1 || personDataObj?.isCompleted;

  return (
    <div
      key={keyProps}
      className={`relative overflow-hidden bg-white theme-card-shadow rounded-lg flex lesson-card  mb-8 ${theme.elem.textDark} `}>
      {/**
       *  LEFT SECTION IMAGE
       */}
      <SideImage getImageFromS3={getImageFromS3} lessonProps={lessonProps} />
      {/**
       *  RIGHT SECTION
       */}
      <div className={`w-7.5/10 lesson-card-summary flex flex-col rounded-b-lg`}>
        <MainSummary lessonProps={{...lessonProps, isTeacher, accessible}} />
        {isStudent && (
          <ProgressBar _isCompleted={_isCompleted} personDataObj={personDataObj} />
        )}
        {lessonProps.lesson.type !== 'survey' &&
        !existsOrNot &&
        personDataObj?.isCompleted ? (
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
          lessonProgress={personDataObj?.lessonProgress}
          roomID={roomID}
          isCompleted={_isCompleted}
          lessonProps={lessonProps}
          syllabusProps={syllabusProps}
          lessonType={lessonProps.lesson.type}
        />
      </div>
    </div>
  );
};

export default StandardLessonCard;

import {useEffect, useState} from 'react';

import useAuth from '@customHooks/useAuth';
import {useGlobalContext} from 'contexts/GlobalContext';

import BottomBar from './StandardLessonCard/BottomBar';
import MainSummary from './StandardLessonCard/MainSummary';
import ProgressBar from './StandardLessonCard/ProgressBar';
import Rating from './StandardLessonCard/Rating';
import SideImage from './StandardLessonCard/SideImage';
import {LessonCardProps} from '@interfaces/ClassroomInterface';
import {Card} from 'antd';

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
    searchTerm,
    preview = false
  } = props;

  const {lessonDispatch} = useGlobalContext();
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
      // logError(error, {authId, email}, 'StandardLessonCard @checkValueOrNull');
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
    <Card
      actions={[
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
      ]}
      key={keyProps}>
      <div className="w-full flex items-center">
        {/**
         *  LEFT SECTION IMAGE
         */}
        <SideImage getImageFromS3={getImageFromS3} lessonProps={lessonProps} />
        {/**
         *  RIGHT SECTION
         */}
        <div className={`w-full lesson-card-summary flex flex-col rounded-b-lg`}>
          <MainSummary
            searchTerm={searchTerm}
            lessonProps={{...lessonProps, isTeacher, accessible}}
          />
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
        </div>
      </div>
    </Card>
  );
};

export default StandardLessonCard;

import React, {useContext, useEffect} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {useHistory} from 'react-router-dom';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineClockCircle, AiOutlineUser} from 'react-icons/ai';
import ProgressRing from './ProgressRing';
import {CurriculumInfo} from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';
import {isTextFile} from '@aws-amplify/core';

interface ClassProps {
  isTeacher: boolean;
  link: string;
  curriculum?: CurriculumInfo;
  lessons: any;
  lessonType: string;
  accessible: boolean;
  roomID: any;
}

const SurveyCard: React.FC<ClassProps> = (props: ClassProps) => {
  const {isTeacher, link, lessons, roomID, lessonType} = props;
  const history = useHistory();
  const {theme} = useContext(GlobalContext);

  const handleLink = () => {
    // come back to this later
    history.push(link);
  };

  return (
    <>
      {lessons && lessons.length > 0
        ? lessons.map((lesson: any, key: number) => {
            return (
              <div key={`survey-${key}_wrapper`} id={`survey-${key}_wrapper`}>
                <StandardLessonCard
                  roomID={roomID}
                  isTeacher={isTeacher}
                  keyProps={`survey-${key}`}
                  lessonProps={lesson}
                  lessonType={lessonType}
                  accessible={lesson.status === 'Active'}
                />
              </div>
            );
          })
        : null}
    </>
  );
};

export default SurveyCard;

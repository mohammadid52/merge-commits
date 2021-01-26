import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import ProgressRing from './ProgressRing';
import { CurriculumInfo } from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';

interface ClassProps {
  link: string;
  curriculum?: CurriculumInfo;
  lessons: any;
  lessonType: string;
  accessible: boolean;
}

const SurveyCard: React.FC<ClassProps> = (props: ClassProps) => {
  const { link, lessons, accessible } = props;
  const history = useHistory();
  const { theme } = useContext(GlobalContext);

  const handleLink = () => {
    // come back to this later
    history.push(link);
  };

  return (
    <>
      {lessons && lessons.length > 0
        ? lessons.map((value: any, key: number) => {
            return (
              <div key={`survey-${key}_wrapper`} id={`survey-${key}_wrapper`}>
                <StandardLessonCard
                  keyProps={`survey-${key}`}
                  lessonProps={value}
                  lessonType={`survey`}
                  accessible={accessible}
                />
              </div>
            );
          })
        : null}
    </>
  );
};

export default SurveyCard;

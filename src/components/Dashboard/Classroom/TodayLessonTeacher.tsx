import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { CurriculumInfo } from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';

interface ClassProps {
  link: string;
  display?: boolean;
  curriculums: any;
  // open: boolean
}

const Today: React.FC<ClassProps> = (props: ClassProps) => {
  const { link, curriculums, display } = props;
  const [accessible, setAccessible] = useState<boolean>(true);

  const Lessons = curriculums
    ? curriculums.filter((value: any, index: number, array: CurriculumInfo[]) => {
        if (value.SELStructure !== null) {
          return value;
        }
      })
    : [];

  useEffect(() => {
    if (display) {
      setAccessible(false);
    }

    if (!display) {
      setAccessible(true);
    }
  }, [props]);

  return (
    <div>
      {Lessons.map((lesson: any, key: number) => {
        return (
          <StandardLessonCard
            isTeacher={true}
            keyProps={`today_lesson_teacher-${key}`}
            lessonProps={lesson}
            accessible={accessible}
          />
        );
      })}
    </div>
  );
};

export default Today;

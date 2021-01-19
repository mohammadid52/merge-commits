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
  curriculum: CurriculumInfo;
  lessons: any;
  lessonType: string;
  accessible: boolean;
}

const SurveyCard: React.FC<ClassProps> = (props: ClassProps) => {
  const { link, curriculum, lessons, accessible } = props;
  const history = useHistory();
  const { theme } = useContext(GlobalContext);

  const handleLink = () => {
    // come back to this later
    history.push(link);
  };

  return (
    <>
      {/*<div className={`relative bg-white rounded-xl shadow-container ${theme.elem.text} h-auto flex mb-8`}>
      <div className="w-full flex flex-col ">
        <div className="h-8.7/10 p-4 flex flex-col justify-center items-center">
          <h1 className={`text-2xl text-black font-open text-left`}>Onboarding Survey</h1>
          <p className="text-sm text-left">
            This is a quick survey to see where you're at in terms of some of the topics we'll cover this semester.
            Please click the button below and answer each of the questions to the best of your ability. We appreciate
            your time in completing this survey, and we're excited to get started on this Iconoclast journey with you!
          </p>
        </div>
        <div className={`h-10 ${theme.dashboard.bg} flex justify-between rounded-b-xl text-sm`}>
          <div className={`flex justify-center items-center my-2 w-2.5/10 text-gray-300`}></div>
          <div className={`flex justify-center items-center my-2 w-2.5/10 text-gray-300`}>
            <div className="w-auto text-gray-300">
              <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                <AiOutlineClockCircle />
              </IconContext.Provider>
            </div>
            <div className={`w-auto mx-4 text-gray-300`}>15 min.</div>
          </div>
          <div className={`flex justify-center items-center my-2 w-2.5/10`}>
            <div className="w-auto text-gray-300">
              <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                <AiOutlineUser />
              </IconContext.Provider>
            </div>
            <div className={`w-auto mx-4 text-gray-200`}>Self</div>
          </div>
          <div className="flex w-2.5/10">
            <button
              type="submit"
              onClick={handleLink}
              className={`bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 text-white
                                w-full text-white rounded-br-xl focus:outline-none transition duration-150 ease-in-out`}>
              <span className="w-auto h-auto">START SURVEY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
*/}

      {lessons && lessons.length > 0
        ? lessons.map((value: any, key: number) => {
            return <StandardLessonCard keyProps={`survey-${key}`} lessonProps={value} lessonType={`survey`} accessible={accessible}/>;
          })
        : null}
    </>
  );
};

export default SurveyCard;

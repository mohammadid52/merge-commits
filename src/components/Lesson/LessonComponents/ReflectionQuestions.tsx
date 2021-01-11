import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import usePageLabel from '../../../customHooks/pageLabel';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

interface ReflectionQuestionProps {
  isTeacher?: boolean;
  questions: string[];
}

const ReflectionQuestions = (props: ReflectionQuestionProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme } = switchContext;


  const pageLabel = usePageLabel({isTeacher: isTeacher});
  const [question, setQuestion] = useState(0);
  const questArr = props.questions;

  const nextQuestion = () => {
    if (question < questArr.length - 1) {
      setQuestion(question + 1);
    } else if (question === questArr.length - 1) {
      setQuestion(0);
    }
  };

  const prevQuestion = () => {
    if (question > 0) {
      setQuestion(question - 1);
    } else if (question === 0) {
      setQuestion(questArr.length - 1);
    }
  };

  return (
    <div className={`${theme.elem.text} ${theme.elem.card} p-2 reflection w-full flex flex-col`}>
      <div className={`w-full`}>
        <div className={`w-full flex flex-row text-xl ${theme.banner} border-b-4 border-sea-green`}>
          <h3>{pageLabel.prev} Discussion:</h3>
          <div
            className={`text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 cursor-pointer`}
            onClick={prevQuestion}>
            <IconContext.Provider
              value={{
                size: '1.5rem',
                style: { width: '32px' },
                className: `text-white`,
              }}>
              <AiOutlineArrowLeft />
            </IconContext.Provider>
          </div>

          <div
            className={`text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 cursor-pointer`}
            onClick={nextQuestion}>
            <IconContext.Provider
              value={{
                size: '1.5rem',
                style: { width: '32px' },
                className: `text-white`,
              }}>
              <AiOutlineArrowRight />
            </IconContext.Provider>
          </div>
        </div>
      </div>

      <div className="question w-full flex-grow text-sm md:text-xl font-light text-gray-200 flex justify-center md:px-4">
        <p className="text-center">{questArr[question]}</p>
      </div>
    </div>
  );
};

export default ReflectionQuestions;

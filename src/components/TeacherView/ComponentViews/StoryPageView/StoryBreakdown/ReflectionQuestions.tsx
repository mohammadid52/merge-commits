import React, { useState, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

interface props {
        fullscreen: boolean
    }

const ReflectionQuestions = (props: props) => {
    const {  fullscreen } = props;
    const [ question, setQuestion ] = useState(0);
    const { state, theme } = useContext(LessonControlContext);
    const questArr = state.data.lesson.warmUp.breakdown.reflectionQuestions;

    const nextQuestion = () => {
        if (question < questArr.length - 1) {
            setQuestion(question + 1);
        } else if (question === questArr.length - 1) {
            setQuestion(0);
        }
    }

    const prevQuestion = () => {
        if (question > 0) {
            setQuestion(question - 1);
        } else if (question === 0) {
            setQuestion(questArr.length - 1);
        }
    }

    return (
        <div className={`${theme.elem.text} reflection w-full flex flex-col`}>
        <div className={`w-full`}>
          <div className={`w-full flex flex-row text-xl ${theme.banner} border-b-4 border-sea-green`}>
            <h3>Discussion Questions:</h3>
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
  
        <div className='question w-full flex-grow text-sm md:text-xl font-light text-gray-200 flex justify-center md:px-4'>
          <p className='text-center'>{questArr[question]}</p>
        </div>
      </div>
    )
}

export default ReflectionQuestions;
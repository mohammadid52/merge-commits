import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from '../../ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaExpand, FaCompress } from 'react-icons/fa';
import PollOutput from './PollOutput';

interface teacherData {
  breakdownComponent: string;
  studentInfo?: {
    id: string;
    firstName: string;
    preferredName?: string;
    lastName: string;
  };
  doFirstData?: { [key: string]: any };
  warmUpData?: { [key: string]: any };
  corelessonData?: { [key: string]: any };
  activityData?: { [key: string]: any };
}

const tempData = [
  {
    id: 'classes-school',
    question: 'Would you rather have classes on Saturdays or school during the summer',
    option: 'classes on Saturdays',
  },
  {
    id: 'clean-or-sleep',
    question: 'Would you rather clean the house everyday or sleep in the backyard?',
    option: 'clean the house everyday',
  },
  {
    id: 'food-taste',
    question:
      'Would you rather only eat your favorite food for the rest of your life or lose your sense of taste but can eat whatever you want?',
    option: 'lose your sense of taste but can eat whatever you want',
  },
];

const tempData2 = [
  {
    id: 'classes-school',
    question: 'Would you rather have classes on Saturdays or school during the summer',
    option: 'classes on Saturdays',
    option2: 'school during the summer',
  },
  {
    id: 'clean-or-sleep',
    question: 'Would you rather clean the house everyday or sleep in the backyard?',
    option: 'clean the house everyday',
    option2: 'sleep in the backyard',
  },
  {
    id: 'food-taste',
    question:
      'Would you rather only eat your favorite food for the rest of your life or lose your sense of taste but can eat whatever you want?',
    option: 'eat your favorite food for the rest of your life',
    option2: 'lose your sense of taste but can eat whatever you want',
  },
];

const CoopDisplay = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const displayProps = state.componentState.poll;
  const [fullscreen, setFullscreen] = useState(false);

  const [teacherData, setTeacherData] = useState<teacherData>();
  const student = state.displayData.studentInfo;

  const handleFullscreen = () => {
    setFullscreen((fullscreen) => {
      return !fullscreen;
    });
  };

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' });
  }, []);

  useEffect(() => {
    if (
      state.displayData &&
      state.displayData.breakdownComponent &&
      state.displayData.breakdownComponent === 'warmup/breakdown'
    ) {
      setTeacherData(state.displayData);
    }
  }, [state.displayData]);

  return (
    <div className={theme.section}>
      <ReflectionQuestions questions={state.data.lesson.warmUp.breakdown.reflectionQuestions} />

      {/**
       *
       * tempData = for SELF,
       *                should be DISPLAYPROPS
       *
       * tempData2 = for OTHER STUDENT data coming from TEACHER
       *                should be TEACHERDATA
       *
       */}

      {/* TEACHER DISPLAY */}
      {/*<div
          className={`relative ${
            fullscreen ? 'w-full' : 'w-4.85/10'
          } h-full rounded-lg  border-0 shadow-inner-dark bg-darker-blue p-4`}>
          <div className="w-full h-full flex flex-col justify-between items-center">
            <div
              className="absolute cursor-pointer w-full text-xl m-2"
              style={{ bottom: 0, right: 0 }}
              onClick={handleFullscreen}>
              <IconContext.Provider
                value={{
                  color: '#E2E8F0',
                  size: '2rem',
                  style: { width: 'auto', right: '0', bottom: '0', position: 'absolute' },
                }}>
                {fullscreen ? <FaCompress /> : <FaExpand />}
              </IconContext.Provider>
            </div>
            <div className="relative">
              <div className="absolute w-auto z-50" style={{ bottom: '-15px', right: 0 }}>
                <div className="bg-yellow-300 text-gray-800 font-light text-center flex flex-col justify-center items-center h-auto w-auto py-1 px-2 font-medium rounded-xl shadow-elem-dark z-50">
                  <p>
                    class results
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-full flex md:flex-col justify-between">
              <div
                className={`bg-gradient-to-tl from-dark-blue to-med-dark-blue ${
                  teacherData && teacherData.warmUpData && teacherData.warmUpData.additional ? 'md:h-7.85/10' : 'h-full'
                } ${
                  fullscreen ? 'text-lg md:text-2xl' : 'text-md md:text-xl'
                } md:mb-0 overflow-y-auto overflow-x-hidden w-full p-4 md:p-6 items-center text-gray-200 rounded-lg shadow-2`}>
                <div className={`${fullscreen ? 'text-3xl' : 'text-xl'} h-full rounded-lg font-light`}>
                  {tempData2.map((item: { id: string; question: string; option: any; option2: any }, key: number) => {
                    return (
                      <div className={`pb-4`}>
                        <div className={`text-xl mb-4`}>{`${item.question}:`}</div>
                        <div>
                          <div className={`text-base w-auto`}>
                            {item.option} <span className="text-yellow-300">2</span>
                          </div>
                          <div className={`text-base w-auto`}>
                            {item.option2} <span className="text-yellow-300">8</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>*/}

      <Banner title={state.data.lesson.warmUp.title} display="COOP" />
      <Modules
        dataProps={teacherData && teacherData.warmUpData ? teacherData.warmUpData : null}
        displayMode="COOP"
      />
      <PollOutput dataProps={teacherData && teacherData.warmUpData ? teacherData.warmUpData : null} />

      {/* SELF DISPLAY */}
      <Banner title={state.data.lesson.warmUp.title} display="SELFinCOOP" />
      <Modules dataProps={displayProps ? displayProps : null} displayMode="SELFinCOOP" />
      <PollOutput dataProps={displayProps ? displayProps : null} />
    </div>
  );
};

export default CoopDisplay;

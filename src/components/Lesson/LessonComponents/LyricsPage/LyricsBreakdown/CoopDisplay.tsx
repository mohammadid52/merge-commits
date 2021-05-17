import React, { useContext, useEffect, useState } from 'react';
import ReflectionQuestions from '../../ReflectionQuestions';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaCompress, FaExpand } from 'react-icons/fa';

import LyricsOutput from './LyricsOutput';


/**
 *
 * IMPORT EXTERNAL FUNCTIONS
 *
 */
import { firstInitialFunc } from '../../../../../utilities/strings';
import Banner from '../../Banner';

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

const CoopDisplay = () => {
  const { dispatch, theme, state } = useContext(LessonContext);
  const [modules, setModules] = useState<Array<any>>();
  const displayProps = state.componentState?.lyrics?.selected;
  const moduleTypes = state.data.lesson.coreLesson.tools;
  const [fullscreen, setFullscreen] = useState(false);
  const student = state.displayData.studentInfo;

  const [teacherData, setTeacherData] = useState<teacherData>();
  const [teacherModules, setTeacherModules] = useState<Array<any>>();

  const handleFullscreen = () => {
    setFullscreen((fullscreen) => {
      return !fullscreen;
    });
  };

  const arrayParseToString = (arr: Array<Array<{ [key: string]: any }>>) => {
    let resultArray = arr.map((item: Array<{ text: string; [key: string]: any }>) => {
      let parsedString = '';
      item.forEach((item: { text: string; [key: string]: any }) => {
        parsedString = parsedString + ' ' + item.text;
      });
      return parsedString;
    });
    return resultArray;
  };

  useEffect(() => {
    if (displayProps) {
      let modulesArray = moduleTypes.map((item: { [key: string]: any }) => {
        let contentArray = displayProps
          .filter((selection: { color: string; content: any }) => {
            return item.color === selection.color;
          })
          .map((selection: { content: any }) => {
            return selection.content;
          });

        return {
          name: item.name,
          label: item.icon,
          color: item.color,
          content: arrayParseToString(contentArray),
        };
      });

      setModules(modulesArray);
    }

    dispatch({ type: 'ACTIVATE_LESSON', payload: 'corelesson/breakdown' });
  }, []);

  useEffect(() => {
    if (
      state.displayData &&
      state.displayData.breakdownComponent &&
      state.displayData.breakdownComponent === 'corelesson/breakdown'
    ) {
      // console.log( 'got it', state.displayData );
      setTeacherData(state.displayData);
    }
  }, [state.displayData]);

  useEffect(() => {
    // console.log(teacherData);
    if (teacherData && teacherData.corelessonData && teacherData.corelessonData.selected) {
      let modulesArray = moduleTypes.map((item: { [key: string]: any }) => {
        let contentArray = teacherData.corelessonData.selected
          .filter((selection: { color: string; content: any }) => {
            return item.color === selection.color;
          })
          .map((selection: { content: any }) => {
            return selection.content;
          });

        return {
          name: item.name,
          label: item.icon,
          color: item.color,
          content: arrayParseToString(contentArray),
        };
      });

      // console.log(modulesArray);

      setTeacherModules(modulesArray);
    }
  }, [teacherData]);

  const { title } = state.data.lesson.coreLesson.content;

  return (
    <div className={theme.section}>
      <ReflectionQuestions questions={state.data.lesson.coreLesson.breakdown.reflectionQuestions}  />

      <Banner title={title} iconName={`FaHeadphonesAlt`} />

      <div className='h-7.2/10 w-full flex flex-col justify-between items-center'>
        {/* teacher view */}
        <div
          className={`relative 
          ${fullscreen ? 'h-full' : ''} 
          ${theme.elem.card}
          p-4 my-4
          w-full border
          `}>
          <div className=' w-full z-50 top-0 '>
            <div className='w-2.5/10 h-auto w-auto py-1 text-gray-800 font-light flex flex-col justify-center items-center z-50'>
              <p>
                <span className='text-white'>
                  by:{' '}
                  <span className='font-medium text-yellow-600'>
                    {student
                      ? student.preferredName
                        ? student.preferredName
                        : student.firstName
                      : null}{' '}
                    {student ? firstInitialFunc(student.lastName) : null}
                  </span>
                </span>
              </p>
            </div>
          </div>

          <div
            className='absolute top-2 right-0 cursor-pointer w-full text-xl m-2'
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
          <div className='h-full w-full flex flex-col justify-between items-center'>
            <LyricsOutput modules={teacherModules} />
          </div>
        </div>

        {/* self view */}
        <div
          className={`${
            fullscreen ? 'hidden' : 'h-full'
          } w-full flex flex-col justify-between items-center p-4 bg-darker-gray rounded-lg`}>
          <div className=' w-full z-50 top-0 '>
            <div className='w-2.5/10 h-auto w-auto py-1 text-gray-800 font-light flex flex-col justify-center items-center z-50'>
              <p>
                <span className='text-white'>
                  by: <span className='font-medium text-blueberry'>You</span>
                </span>
              </p>
            </div>
          </div>

          <LyricsOutput modules={modules} />
        </div>
      </div>
    </div>
  );
};

export default CoopDisplay;

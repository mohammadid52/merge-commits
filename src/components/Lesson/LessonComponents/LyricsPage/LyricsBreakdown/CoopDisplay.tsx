import React, { useEffect, useContext, useState } from 'react';
import ReflectionQuestions from './ReflectionQuestions';
import Banner from './Banner';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaExpand, FaCompress } from 'react-icons/fa';

import LyricsOutput from './LyricsOutput';

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
  const displayProps = state.componentState.lyrics.selected;
  const { artist, title } = state.data.lesson.coreLesson.content;
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

  const firstInitialFunc = (str: string) => {
    if (typeof str !== 'string' || str === '') {
      return 'Profile';
    }
    let firstInitial = str.charAt(0);
    firstInitial = firstInitial.toUpperCase() + '.';
    return firstInitial;
  };

  const arrayParseToString = (arr: Array<Array<{ [key: string]: any }>>) => {
    let resultArray = arr.map((item: Array<{ text: string;[key: string]: any }>) => {
      let parsedString = '';
      item.forEach((item: { text: string;[key: string]: any }) => {
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

  // ${key === 0 ? 'md:mr-2' : key === modules.length - 1 ? 'md:ml-2' : 'md:mx-2'}

  return (
    <div className={theme.section}>

      <Banner title={title} artist={artist} />

      <ReflectionQuestions />

      {/* self view */}
      <div className='h-7.2/10 w-full flex flex-col justify-between items-center'>
        <div
          className={`${fullscreen ? 'hidden' : 'h-4.7/10'
            } w-full flex flex-col md:flex-row justify-between items-center`}>
          <LyricsOutput modules={modules} />
        </div>

        {/* teacher view */}
        <div className={`relative ${fullscreen ? 'h-full' : 'h-4.85/10' }  w-full rounded-lg border p-2 bg-white bg-opacity-20`}>
          <div className='absolute w-full z-50 top-0 transform -translate-y-1/2'>
            <div className='w-2.5/10 h-auto w-auto mx-auto py-1 px-2 bg-yellow-300 text-gray-800 font-light text-center flex flex-col justify-center items-center font-medium rounded-xl shadow-elem-dark z-50'>
              <p>
                by:{' '}
                {student
                  ? student.preferredName
                    ? student.preferredName
                    : student.firstName
                  : null}{' '}
                {student ? firstInitialFunc(student.lastName) : null}
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
          <div className='h-full w-full flex flex-col md:flex-row justify-between items-center'>
            <LyricsOutput modules={teacherModules} />
          </div>
        </div>
      </div>


    </div>
  );
};

export default CoopDisplay;

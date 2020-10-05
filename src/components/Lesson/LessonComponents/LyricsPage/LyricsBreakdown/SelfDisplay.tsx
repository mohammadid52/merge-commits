import React, { useEffect, useContext, useState } from 'react';
import ReflectionQuestions from './ReflectionQuestions';
import Banner from './Banner';
import { LessonContext } from '../../../../../contexts/LessonContext';

const SelfDisplay = () => {
  const { dispatch, theme, state } = useContext(LessonContext);
  const [modules, setModules] = useState<Array<any>>();
  const displayProps = state.componentState.lyrics.selected;
  const { artist, title } = state.data.lesson.coreLesson.content;
  const moduleTypes = state.data.lesson.coreLesson.tools;

  const arrayParseToString = (arr: Array<Array<{ [key: string]: any }>>) => {
    let resultArray = arr.map((item: Array<{ text: string; [key: string]: any }>) => {
      let parsedString = '';
      item.forEach((item: { text: string; [key: string]: any }) => {
        // console.log('arrayParseToString: ', item);
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

  // ${key === 0 ? 'md:mr-2' : key === modules.length - 1 ? 'md:ml-2' : 'md:mx-2'}

  return (
    <div className='w-full h-full flex flex-col justify-between items-center'>
      <Banner title={title} artist={artist} />
      <div className='h-7/10 w-full flex flex-col md:flex-row justify-between items-center'>
        {modules && modules.length >= 1
          ? modules.map((module: any, key: number) => (
              <div
                key={key}
                className={`${theme.gradient.cardBase} h-64 md:h-full w-3.27/10 text-gray-200 flex flex-col flex-no-wrap items-center p-4 rounded-lg shadow-2xlr`}>
                <div className='w-full flex flex-row justify-between items-center pb-2 border-b border-white border-opacity-10'>
                  <div
                    className={`w-12 h-12 p-2 text-3xl rounded-lg bg-${module.color} flex justify-center items-center shadow-2`}>
                    {module.label}
                  </div>
                  <div className='w-full pl-4 text-gray-200 font-open text-xl font-light'>
                    {module.name}
                  </div>
                </div>
                <div className='w-full md:my-4 flex flex-col overflow-y-auto overflow-x-hidden px-6 font-light'>
                  {/* {console.log('module content: ', module.content)} */}
                  {module.content.map((line: string, i: number) => {
                    return line.split('\n').map((subStr: string, key: number, arr: any) => (
                      <>
                        <p key={key} className={`text-sm text-gray-200 font-light mb`}>
                          {subStr}
                        </p>
                        {key === arr.length - 1 && <br className='mb-3' />}
                      </>
                    ));
                  })}
                </div>
              </div>
            ))
          : null}
      </div>
      <ReflectionQuestions />
    </div>
  );
};

export default SelfDisplay;

import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineForm } from 'react-icons/ai';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface LyricsOutputProps {
  modules?: string[];
}

const LyricsOutput = (props: LyricsOutputProps) => {
  const { theme } = useContext(LessonContext);

  return (
    <div className={`flex flex-row ${theme.block.text} mt-4 rounded-r-lg`}>
      {props.modules && props.modules.length >= 1
        ? props.modules.map((module: any, key: number) => (
            <div
              key={key}
              className={`h-64 md:h-full w-3.3/10 text-gray-200 flex flex-col flex-no-wrap items-center rounded-lg`}>
              <div className='w-full h-16 flex flex-row justify-between items-center pb-2 border-b border-white border-opacity-10'>
                <div
                  className={`w-12 h-12 p-2 text-3xl rounded-lg bg-${module.color} flex justify-center items-center`}>
                  {module.label}
                </div>
                <div className='w-full pl-4 text-gray-200 font-open text-xl font-light'>
                  {module.name}
                </div>
              </div>
              <div className='w-full md:my-4 flex flex-col overflow-y-auto overflow-x-hidden px-6 font-light'>
                {/* {console.log('module content: ', module.content)} */}
                {module.content.map((line: string, i: number) => {
                  return line.split('\n').map(
                    (subStr: string, key: number, arr: any) =>
                      subStr.length > 0 && (
                        <>
                          <p key={key} className={`text-sm text-gray-200 font-light mb`}>
                            {subStr}
                          </p>
                          {key === arr.length - 1 && <br className='mb-3' />}
                        </>
                      )
                  );
                })}
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default LyricsOutput;

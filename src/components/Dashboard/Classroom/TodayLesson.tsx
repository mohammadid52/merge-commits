import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
// import { FaClock, FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import ProgressRing from './ProgressRing';
import { CurriculumInfo } from './Classroom';
import ToolTip from '../../General/ToolTip/ToolTip';
import * as customQueries from '../../../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import Start from './Start';

interface ClassProps {
  link: string;
  display?: boolean;
  curriculums: any;
}

const Today: React.FC<ClassProps> = (props: ClassProps) => {
  const { link, curriculums, display } = props;
  const [accessible, setAccessible] = useState<boolean>(true);
  const history = useHistory();
  const { theme } = useContext(GlobalContext);
  const [lessons, setLessons] = useState<Array<CurriculumInfo>>();

  const todayLesson = curriculums
  ? curriculums.filter((value: any, index: number, array: CurriculumInfo[]) => {
      if(new Date(value.expectedStartDate) <= new Date )  {
        if (new Date(value.expectedEndDate) >= new Date){
          if (!value.complete && value.SELStructure !== null){
            return value.lesson;
          }
        }
      }
    })
  : [];


  useEffect(() => {
    setLessons(todayLesson);
  }, [props]);

  useEffect(() => {
    if (display) {
      setAccessible(false);
    }

    if (!display) {
      setAccessible(true);
    }
  }, [props]);

  return (
    <div className={``}>
      {lessons
        ? lessons.map((value: any, key: number) => {
            return (
              <div key={key}>
                <div
                  className={`relative bg-white rounded-xl shadow-container ${theme.elem.text} h-auto flex mb-8`}>
                  <div
                    className={`w-2.5/10 ${theme.dashboard.bg} rounded-tl-xl rounded-bl-xl`}
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${
                        value && value.lesson.artist.images
                          ? value.lesson.artist.images
                          : null
                      })`,
                      backgroundSize: 'cover',
                    }}>
                    <div className='h-6/10 flex justify-center items-center'></div>
                    <div className='h-1/10 pl-6'>
                      <div
                        className='tracking-widest border-b text-gray-300 border-ketchup'
                        style={{ textShadow: '1px 1px black' }}>
                        FEATURED ARTIST
                      </div>
                    </div>
                    <div className='h-3/10 flex flex-row-reverse'>
                      <h2
                        className={`first w-full text-2xl text-right font-open font-medium tracking-widest mt-2 mr-1 text-gray-200`}
                        style={{ textShadow: '1px 1px black' }}>
                        {value && value.lesson.artist.name
                          ? value.lesson.artist.name
                          : null}
                      </h2>
                    </div>
                  </div>
                  <div className='w-7.5/10 flex flex-col '>
                    <div className='h-44 p-4 flex flex-col justify-start items-center'>
                      <h1 className={`text-2xl text-black font-open text-left`}>
                        {value && value.lesson.title ? value.lesson.title : null}
                      </h1>
                      <p className='text-sm text-left'>
                        {value && value.lesson.summary ? value.lesson.summary : null}
                      </p>
                    </div>
                    <div
                      className={`h-2/10 ${theme.dashboard.bg} flex justify-between text-sm  rounded-br-xl`}>
                      <div
                        className={`flex justify-center items-center my-2 w-3.3/10 text-gray-300`}>
                        <div className='w-auto text-gray-300'>
                          <IconContext.Provider
                            value={{ size: '1.5rem', style: { width: 'auto' } }}>
                            <AiOutlineClockCircle />
                          </IconContext.Provider>
                        </div>
                        <div className={`w-auto mx-4 text-gray-300`}>45 min.</div>
                      </div>
                      <div className={`flex justify-center items-center my-2 w-3.3/10`}>
                        <div className='w-auto text-gray-300'>
                          <IconContext.Provider
                            value={{ size: '1.5rem', style: { width: 'auto' } }}>
                            <AiOutlineUser />
                          </IconContext.Provider>
                        </div>
                        <div className={`w-auto mx-4 text-gray-200`}>Marlon</div>
                      </div>
                      <div className='flex w-3.3/10'> 
                        <Start lessonKey={value ? value.lessonID : null} open={value ? value.open : null} accessible={accessible}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Today;

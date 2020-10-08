import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaClock, FaUserAlt } from 'react-icons/fa';
import { CurriculumInfo } from './Classroom';

interface UpcomingProps {
  curriculum: Array<CurriculumInfo>;
}

const UpcomingClass: React.FC<UpcomingProps> = (props: UpcomingProps) => {
  const { curriculum } = props;
  const history = useHistory();
  const { theme } = useContext(GlobalContext);

  // const curriculumLessonTest =
  //     curriculum.map(( lesson: {title: string, artist: {id: string, images: any, name: string, type: string}, summary: string} ) => {
  //         return (
  //             value.lesson
  //             // console.log(value.lesson.artist, 'lesson')
  //     )

  //     })

  // const slice = curriculum.slice(1, 2);
  const curriculumLesson = curriculum
    ? curriculum.map((value: any, index: number, array: CurriculumInfo[]) => {
        return value.lesson;
      })
    : [];

  useEffect(() => {
    setLessons(curriculumLesson);
    // curriculum;
  }, [props]);

  // make sure to limit (max 5?) when fetching from data
  const [lessons, setLessons] = useState(curriculumLesson.slice(1, 2));

  const setOpen = () => {
    setLessons(
      lessons.map(
        (
          lesson: {
            title: string;
            artist: { id: string; images: any; name: string; type: string };
            language: string;
            summary: string;
          },
          i: number
        ) => {
          return {
            ...lesson,
            open: false,
          };
        }
      )
    );
  };

  const toggle = (key: number) => {
    setOpen();

    setLessons(
      lessons.map(
        (
          lesson: {
            title: string;
            artist: { id: string; images: any; name: string; type: string };
            language: string;
            summary: string;
            open: boolean;
          },
          i: number
        ) => {
          if (i === key) {
            lesson.open = !lesson.open;
          }
          return lesson;
        }
      )
    );
  };

  // const handleLink = () => {
  //     history.push('/lesson');
  // }

  return (
    <div className={`relative w-64rem h-auto flex justify-between`}>
      {lessons
        ? lessons.map(
            (
              lesson: {
                title: string;
                artist: { id: string; images: any; name: string; type: string };
                language: string;
                summary: string;
                open: boolean;
              },
              i: number
            ) => (
              <div
                key={i}
                className={`relative bg-white rounded-xl shadow-container ${theme.elem.text} w-3/10 h-auto flex flex-col mb-8`}>
                <div className={`w-full bg-dark rounded-t-xl`}>
                  <div className='h-6/10 justify-center items-center align-center'>
                    <div
                      className='w-24 h-24 mt-2 mx-auto bg-cover rounded-full'
                      style={{
                        backgroundImage: `url(${lesson.artist.images})`,
                      }}
                    />
                  </div>
                  <div className='h-1/10 pl-6'>
                    <div className='tracking-widest border-b text-gray-300 border-ketchup'>
                      FEATURED ARTIST
                    </div>
                  </div>
                  <div className='h-3/10 flex flex-row-reverse'>
                    <h2
                      className={`first w-6/10 text-lg font-open leading-8 font-medium tracking-widest mb-4 text-gray-200`}>
                      <p> {lesson.artist.name} </p>
                    </h2>
                  </div>
                </div>
                <div className='w-full flex flex-col rounded-b-xl'>
                  <div className='h-8.7/10 p-4 flex flex-col justify-center items-center'>
                    <h1 className={`text-lg text-black font-open text-left`}>{lesson.title}</h1>
                    <p className='text-md text-left'>
                      {lesson.summary ? lesson.summary : 'No Information Available'}
                    </p>
                  </div>
                  <div className={`h-10 bg-dark flex justify-between rounded-b-xl`}>
                    <div
                      className={`flex mx-4 justify-center items-center my-2 w-5/10 text-gray-300`}>
                      <div className='w-auto text-gray-300'>
                        <IconContext.Provider
                          value={{ size: '1.5rem', style: { width: 'auto' }, className: '' }}>
                          <FaClock />
                        </IconContext.Provider>
                      </div>
                      <div className={`w-auto mx-4 text-gray-300`}>15 min.</div>
                    </div>
                    <div className={`flex mx-4 justify-center items-center my-2 w-5/10`}>
                      <div className='w-auto text-gray-300'>
                        <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                          <FaUserAlt />
                        </IconContext.Provider>
                      </div>
                      <div className={`w-auto mx-4 text-gray-200`}>Self</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        : null}
      {/* DUMMY CARDS */}
      <div
        className={`relative bg-white rounded-xl shadow-container ${theme.elem.text} w-3/10 h-auto flex flex-col mb-8`}>
        <div className={`w-full bg-dark rounded-t-xl`}>
          <div className='h-6/10 justify-center items-center align-center'>
            <div
              className='w-24 h-24 mt-2 mx-auto bg-cover rounded-full'
              style={{
                backgroundImage: ``,
              }}
            />
          </div>
          <div className='h-1/10 pl-6'>
            <div className='tracking-widest border-b text-gray-300 border-ketchup'>
              FEATURED ARTIST
            </div>
          </div>
          <div className='h-3/10 flex flex-row-reverse'>
            <h2
              className={`first w-6/10 text-lg font-open leading-8 font-medium tracking-widest mb-4 text-gray-200`}>
              <p>Artist name</p>
            </h2>
          </div>
        </div>
        <div className='w-full h-full flex flex-col rounded-b-xl'>
          <div className='h-8.7/10 min-h-8.7/10 p-4 flex flex-col justify-center items-center'>
            <h1 className={`text-lg text-black font-open text-left`}>Title</h1>
            <p className='text-md text-left'>Summary coming soon...</p>
          </div>
          <div className={`h-10 bg-dark flex justify-between rounded-b-xl`}>
            <div className={`flex mx-4 justify-center items-center my-2 w-5/10 text-gray-300`}>
              <div className='w-auto text-gray-300'>
                <IconContext.Provider
                  value={{ size: '1.5rem', style: { width: 'auto' }, className: '' }}>
                  <FaClock />
                </IconContext.Provider>
              </div>
              <div className={`w-auto mx-4 text-gray-300`}>15 min.</div>
            </div>
            <div className={`flex mx-4 justify-center items-center my-2 w-5/10`}>
              <div className='w-auto text-gray-300'>
                <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                  <FaUserAlt />
                </IconContext.Provider>
              </div>
              <div className={`w-auto mx-4 text-gray-200`}>Self</div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`relative bg-white rounded-xl shadow-container ${theme.elem.text} w-3/10 h-auto flex flex-col mb-8`}>
        <div className={`w-full bg-dark rounded-t-xl`}>
          <div className='h-6/10 justify-center items-center align-center'>
            <div
              className='w-24 h-24 mt-2 mx-auto bg-cover rounded-full'
              style={{
                backgroundImage: ``,
              }}
            />
          </div>
          <div className='h-1/10 pl-6'>
            <div className='tracking-widest border-b text-gray-300 border-ketchup'>
              FEATURED ARTIST
            </div>
          </div>
          <div className='h-3/10 flex flex-row-reverse'>
            <h2
              className={`first w-6/10 text-lg font-open leading-8 font-medium tracking-widest mb-4 text-gray-200`}>
              <p>Artist name</p>
            </h2>
          </div>
        </div>
        <div className='w-full h-full flex flex-col rounded-b-xl'>
          <div className='h-8.7/10 min-h-8.7/10 p-4 flex flex-col justify-center items-center'>
            <h1 className={`text-lg text-black font-open text-left`}>Title</h1>
            <p className='text-md text-left'>Summary coming soon...</p>
          </div>
          <div className={`h-10 bg-dark flex justify-between rounded-b-xl`}>
            <div className={`flex mx-4 justify-center items-center my-2 w-5/10 text-gray-300`}>
              <div className='w-auto text-gray-300'>
                <IconContext.Provider
                  value={{ size: '1.5rem', style: { width: 'auto' }, className: '' }}>
                  <FaClock />
                </IconContext.Provider>
              </div>
              <div className={`w-auto mx-4 text-gray-300`}>15 min.</div>
            </div>
            <div className={`flex mx-4 justify-center items-center my-2 w-5/10`}>
              <div className='w-auto text-gray-300'>
                <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                  <FaUserAlt />
                </IconContext.Provider>
              </div>
              <div className={`w-auto mx-4 text-gray-200`}>Self</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingClass;

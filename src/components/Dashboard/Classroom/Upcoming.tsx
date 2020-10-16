import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
/* import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/fa'; */
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import { CurriculumInfo } from './Classroom';

interface UpcomingProps {
  curriculum: Array<CurriculumInfo>;
}

const UpcomingClass: React.FC<UpcomingProps> = (props: UpcomingProps) => {
  const { curriculum } = props;
  const history = useHistory();
  const { theme } = useContext(GlobalContext);
  const [openCards, setOpenCards] = useState<string[]>(['']);
  // console.log(curriculum, 'curr')

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

  /**
   * Function to toggle card opening
   * @param cardID - self explanatory
   */
  const toggleOpenCard = (cardID: string /* e: React.MouseEvent */) => {
    if (openCards.includes(cardID)) {
      setOpenCards(openCards.filter((stringID: string) => stringID !== cardID));
    } else {
      setOpenCards([...openCards, cardID]);
    }
  };

  /**
   * Functional 'component' to toggle on/off covering too much text
   * @param toggleID - Id of the card being covered
   */
  const gradientCover = (toggleID: string) => {
    return (
      <div
        className={`w-full h-20 absolute flex items-end bottom-0 transform -translate-y-10 transition ${
          !openCards.includes(toggleID) ? 'bg-gradient-to-t from-white h-8' : ''
        }`}>
        <p
          className='text-center text-sm text-bold text-blueberry cursor-pointer'
          onClick={() => {
            toggleOpenCard(toggleID);
          }}>
          {openCards.includes(toggleID) ? 'Less' : 'More'}
        </p>
      </div>
    );
  };

  // const handleLink = () => {
  //     history.push('/lesson');
  // }

  return (
    <div className={`relative h-auto flex justify-start`}>
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
                id='upcoming-1'
                key={i}
                className={`relative pl-2 pr-2 ${theme.elem.text} w-2.5/10 `}>
                <div className='rounded-xl  bg-white h-auto flex flex-col mb-8'>
                  <div
                    className={`w-full bg-white  ${theme.dashboard.bg} rounded-t-xl`}
                    style={{
                      background: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${lesson.artist.images})`,
                      backgroundSize: 'cover',
                    }}>
                    <div className='h-6/10 justify-center items-center align-center'>
                      <div className='w-24 h-24 mt-2 mx-auto bg-cover rounded-full' />
                    </div>
                    <div className='h-1/10 pl-6'>
                      <div className='tracking-widest border-b text-gray-300 border-ketchup' style={{textShadow:'1px 1px black'}}>
                        FEATURED ARTIST
                      </div>
                    </div>
                    <div className='h-3/10 flex flex-row-reverse'>
                      <h2
                        className={`first w-full text-lg font-open leading-8 font-medium tracking-widest mb-4 text-gray-200 text-center`} style={{textShadow:'1px 1px black'}}>
                        <p> {lesson.artist.name} </p>
                      </h2>
                    </div>
                  </div>
                  <div className='w-full relative flex flex-col rounded-b-xl'>
                    <div
                      className={`${
                        openCards.includes('upcoming-1') ? 'h-72' : 'h-32'
                      } p-4 mb-2 flex flex-col justify-start overflow-hidden ease-in-out duration-500`}>
                      <h1 className={`text-lg text-black font-open text-left`}>{lesson.title}</h1>
                      <p className={`text-sm text-left`}>
                        {lesson.summary ? lesson.summary : 'No Information Available'}
                      </p>
                    </div>
                    {/* Gradient - start*/}
                    {gradientCover('upcoming-1')}
                    {/* Gradient - end */}
                    <div className={`h-10 ${theme.dashboard.bg} flex justify-between rounded-b-xl`}>
                      <div
                        className={`flex mx-2 justify-center items-center my-2 w-5/10 text-gray-300`}>
                        <div className='w-auto text-gray-300'>
                          <IconContext.Provider
                            value={{ size: '1.5rem', style: { width: 'auto' }, className: '' }}>
                            <AiOutlineClockCircle />
                          </IconContext.Provider>
                        </div>
                        <div className={`w-auto ml-2 text-sm text-gray-300`}>45 min.</div>
                      </div>
                      <div className={`flex mx-2 justify-center items-center my-2 w-5/10`}>
                        <div className='w-auto text-gray-300'>
                          <IconContext.Provider
                            value={{ size: '1.5rem', style: { width: 'auto' } }}>
                            <AiOutlineUser />
                          </IconContext.Provider>
                        </div>
                        <div className={`w-auto ml-2 text-sm text-gray-200`}>Marlon</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        : null}
      {/* DUMMY CARD 2 */}
      {/* <div id='upcoming-2' className={`relative pl-2 pr-2 ${theme.elem.text} w-2.5/10 `}>
        <div className=' rounded-xl  bg-white h-auto flex flex-col mb-8'>
          <div
            className={`w-full bg-white  ${theme.dashboard.bg} rounded-t-xl`}
            style={{
              backgroundImage: ``,
            }}>
            <div className='h-6/10 justify-center items-center align-center'>
              <div className='w-24 h-24 mt-2 mx-auto bg-cover rounded-full' />
            </div>
            <div className='h-1/10 pl-6'>
              <div className='tracking-widest border-b text-gray-300 border-ketchup' style={{textShadow:'1px 1px black'}}>
                FEATURED ARTIST
              </div>
            </div>
            <div className='h-3/10 flex flex-row-reverse'>
              <h2
                className={`first w-full text-lg font-open leading-8 font-medium tracking-widest mb-4 text-gray-200 text-center`} style={{textShadow:'1px 1px black'}}>
                <p>Elizabeth Acevedo</p>
              </h2>
            </div>
          </div>
          <div className='relative w-full h-full flex flex-col rounded-b-xl'>
            <div
              className={`${
                openCards.includes('upcoming-2') ? 'h-72' : 'h-32'
              } mb-2 p-4 flex flex-col justify-start overflow-hidden ease-in-out duration-500`}>
              <h1 className={`text-lg text-black font-open text-left`}>Ode to the rat</h1>
              <p className={`text-sm text-left `}>Summary coming soon...</p>
            </div>
             Gradient - start
            {gradientCover('upcoming-2')} 
             Gradient - end 
            <div className={`h-10 ${theme.dashboard.bg} flex justify-between rounded-b-xl`}>
              <div className={`flex mx-2 justify-center items-center my-2 w-5/10 text-gray-300`}>
                <div className='w-auto text-gray-300'>
                  <IconContext.Provider
                    value={{ size: '1.5rem', style: { width: 'auto' }, className: '' }}>
                    <AiOutlineClockCircle />
                  </IconContext.Provider>
                </div>
                <div className={`w-auto ml-2 text-sm text-gray-300`}>45 min.</div>
              </div>
              <div className={`flex mx-2 justify-center items-center my-2 w-5/10`}>
                <div className='w-auto text-gray-300'>
                  <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                    <AiOutlineUser />
                  </IconContext.Provider>
                </div>
                <div className={`w-auto ml-2 text-sm text-gray-200`}>Marlon</div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* DUMMY CARD 3 */}
      {/* <div id='upcoming-3' className={`relative pl-2 pr-2 ${theme.elem.text} w-2.5/10`}>
        <div className=' rounded-xl  bg-white h-auto flex flex-col mb-8'>
          <div
            className={`w-full bg-white  ${theme.dashboard.bg} rounded-t-xl`}
            style={{
              backgroundImage: ``,
            }}>
            <div className='h-6/10 justify-center items-center align-center'>
              <div
                className='w-24 h-24 mt-2 mx-auto bg-cover rounded-full'
                style={{
                backgroundImage: ``,
              }} 
              />
            </div>
            <div className='h-1/10 pl-6'>
              <div className='tracking-widest border-b text-gray-300 border-ketchup' style={{textShadow:'1px 1px black'}}>
                FEATURED ARTIST
              </div>
            </div>
            <div className='h-3/10 flex flex-row-reverse'>
              <h2
                className={`first w-full text-lg font-open leading-8 font-medium tracking-widest mb-4 text-gray-200 text-center`} style={{textShadow:'1px 1px black'}}>
                <p>Rudy Francisco</p>
              </h2>
            </div>
          </div>
          <div className='relative w-full h-full flex flex-col rounded-b-xl'>
            <div
              className={`${
                openCards.includes('upcoming-3') ? 'h-72' : 'h-32'
              } mb-2 p-4 flex flex-col justify-start overflow-hidden ease-in-out duration-500`}>
              <h1 className={`text-lg text-black font-open text-left`}>My Honest Poem</h1>
              <p className={`text-sm text-left`}>Summary coming soon...</p>
            </div>
             Gradient - start
           {gradientCover('upcoming-3')} 
           Gradient - end 
            <div className={`h-10 ${theme.dashboard.bg} flex justify-between rounded-b-xl`}>
              <div className={`flex mx-2 justify-center items-center my-2 w-5/10 text-gray-300`}>
                <div className='w-auto text-gray-300'>
                  <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                    <AiOutlineClockCircle />
                  </IconContext.Provider>
                </div>
                <div className={`w-auto ml-2 text-sm text-gray-300`}>45 min.</div>
              </div>
              <div className={`flex mx-2 justify-center items-center my-2 w-5/10`}>
                <div className='w-auto text-gray-300'>
                  <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                    <AiOutlineUser />
                  </IconContext.Provider>
                </div>
                <div className={`w-auto ml-2 text-sm text-gray-200`}>Marlon</div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    
    </div>
  );
};

export default UpcomingClass;

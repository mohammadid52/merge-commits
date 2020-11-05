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
  const [lessons, setLessons] = useState<Array<CurriculumInfo>>();

  const curriculumLesson = curriculum
    ? curriculum.filter((value: any, index: number, array: CurriculumInfo[]) => {
        if(!value.complete && value.SELStructure !== null && !value.open ) {
          return value.lesson;
        }
      })
    : [];

  useEffect(() => {
    setLessons(curriculumLesson);
    
    

  }, [props]);

  console.log(lessons, 'lessons')
  
  const sortDates = lessons ? lessons.sort((a: any, b: any) => {
    return (a.expectedStartDate > b.expectedStartDate) ? 1 : -1;
  }) : []



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

  return (
    <div className={`relative h-auto flex flex-wrap justify-start`}>
      {lessons ? lessons.map((lesson: any, i: number) => 
      (
            <div
                id={`upcoming-${i}`}
                key={i}
                className={`relative pl-2 pr-2 ${theme.elem.text} w-2.5/10 `}>
                <div className='rounded-xl  bg-white h-auto flex flex-col mb-8'>
                  <div
                    className={`w-full bg-white  ${theme.dashboard.bg} rounded-t-xl bg-cover`}
                    style={{
                      background: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))`,
                      backgroundImage: `url(${lesson.lesson.artist.images})`,
                      backgroundSize: 'cover',
                    }}
                   >
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
                        <p> {lesson.lesson.artist.name} </p>
                      </h2>
                    </div>
                  </div>
                  <div className='w-full relative flex flex-col rounded-b-xl'>
                    <div
                      className={`${
                        openCards.includes(`upcoming-${i}`) ? 'h-72 h-auto' : 'h-32'
                      } p-4 mb-2 flex flex-col justify-start overflow-hidden ease-in-out duration-500`}>
                      <h1 className={`text-lg text-black font-open text-left`}>{lesson.lesson.title}</h1>
                      <p className={`text-sm text-left`}>
                        {lesson.lesson.summary ? lesson.lesson.summary : 'No Information Available'}
                      </p>
                    </div>
                    
                    {gradientCover(`upcoming-${i}`)}

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
      ))
      : null }

    </div>
  );
};

export default UpcomingClass;

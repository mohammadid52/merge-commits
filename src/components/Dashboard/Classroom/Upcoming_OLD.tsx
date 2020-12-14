import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import { CurriculumInfo } from './Classroom';

interface UpcomingProps {
  curriculum: Array<CurriculumInfo>;
}

const UpcomingClass: React.FC<UpcomingProps> = (props: UpcomingProps) => {
  const { curriculum } = props;
  const history = useHistory();
  const { theme } = useContext(GlobalContext);
  const [openCards, setOpenCards] = useState<string>('');
  const [lessons, setLessons] = useState<Array<CurriculumInfo>>();

  const curriculumLesson = curriculum
    ? curriculum.filter((value: any, index: number, array: CurriculumInfo[]) => {
        if (!value.complete && value.SELStructure !== null && !value.open) {
          return value.lesson;
        }
      })
    : [];

  // useEffect(() => {
  //   setLessons(curriculumLesson);
  // }, [props]);

  useEffect(() => {
    setLessons(curriculumLesson);
  }, []);

  const sortDates = lessons
    ? lessons.sort((a: any, b: any) => {
        return a.expectedStartDate > b.expectedStartDate ? 1 : -1;
      })
    : [];

  /**
   * Function to toggle card opening
   * @param cardID - self explanatory
   */
  const toggleOpenCard = (cardID: string /* e: React.MouseEvent */) => {
    // if (openCards !== cardID) {
    //   setOpenCards(cardID);
    // } else {
    //   setOpenCards('');
    // }
    console.log('toggle open card: ', cardID);
  };

  /**
   * Functional 'component' to toggle on/off covering too much text
   * @param toggleID - Id of the card being covered
   */
  const gradientCover = (toggleID: string) => {
    return (
      <div
        className={`w-full h-20 absolute flex items-end bottom-0 transform -translate-y-10 transition ${
          openCards !== toggleID ? 'bg-gradient-to-t from-white h-8' : ''
        }`}>
        <p
          className="py-2 text-center text-lg font-semibold text-blueberry cursor-pointer"
          onClick={() => {
            toggleOpenCard(toggleID);
          }}>
          {openCards === toggleID ? 'Less' : 'More'}
        </p>
      </div>
    );
  };

  return (
    <div className={`relative h-auto flex flex-wrap justify-start`}>
      {lessons
        ? lessons.map((lesson: any, i: number) => (
            <div
              id={`upcoming-${i}`}
              key={`upcoming-${i}`}
              className={`${openCards === `upcoming-${i}` ? 'z-50' : 'z-10'} ${
                theme.elem.text
              } relative pl-2 pr-2 w-2.5/10 h-100 transition ease-in-out duration-500`}>
              <div
                className={`${
                  openCards === `upcoming-${i}` ? 'absolute h-auto' : 'absolute h-100'
                } min-h-100 p-2 rounded-xl h-auto flex flex-col mb-6 transition ease-in-out duration-500`}>
                {/* CARD CONTAINER */}

                <div
                  className={`w-full h-40 bg-white  ${theme.dashboard.bg} rounded-t-xl bg-cover flex flex-col place-content-end`}
                  style={{
                    background: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))`,
                    backgroundImage: `url(${lesson.lesson.artist.images})`,
                    backgroundSize: 'cover',
                  }}>
                  <div className="text-center">
                    <div
                      className="tracking-widest border-b text-gray-300 border-ketchup"
                      style={{ textShadow: '1px 1px black' }}>
                      FEATURED ARTIST
                    </div>
                  </div>
                  <div className="text-center">
                    <h2
                      className={`first w-full text-lg font-open leading-8 font-medium tracking-widest mb-4 text-gray-200 text-center`}
                      style={{ textShadow: '1px 1px black' }}>
                      <p> {lesson.lesson.artist.name} </p>
                    </h2>
                  </div>
                </div>
                <div className={`w-full relative flex flex-col rounded-b-xl hover:shadow-lg bg-white`}>
                  <div
                    className={`${
                      openCards === `upcoming-${i}` ? 'min-h-72 h-full' : 'h-32'
                    }  p-4 mb-10 flex flex-col justify-start overflow-hidden transition ease-in-out duration-500 bg-white`}>
                    <h1 className={`text-lg text-black font-open text-left`}>{lesson.lesson.title}</h1>
                    <p className={`text-sm text-left`}>
                      {lesson.lesson.summary ? lesson.lesson.summary : 'No Information Available'}
                    </p>
                  </div>

                  {gradientCover(`upcoming-${i}`)}

                  <div className={`h-10 ${theme.dashboard.bg} flex justify-between rounded-b-xl`}>
                    <div className={`flex mx-2 justify-center items-center my-2 w-5/10 text-gray-300`}>
                      <div className="w-auto text-gray-300">
                        <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' }, className: '' }}>
                          <AiOutlineClockCircle />
                        </IconContext.Provider>
                      </div>
                      <div className={`w-auto ml-2 text-sm text-gray-300`}>45 min.</div>
                    </div>
                    <div className={`flex mx-2 justify-center items-center my-2 w-5/10`}>
                      <div className="w-auto text-gray-300">
                        <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                          <AiOutlineUser />
                        </IconContext.Provider>
                      </div>
                      <div className={`w-auto ml-2 text-sm text-gray-200`}>Marlon</div>
                    </div>
                  </div>
                </div>

                {/* CARD CONTAINER END */}
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default UpcomingClass;

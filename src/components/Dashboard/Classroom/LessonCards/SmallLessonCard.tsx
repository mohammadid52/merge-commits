import React, { useContext } from 'react';

import { LessonCardProps } from '../Classroom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import { GlobalContext } from '../../../../contexts/GlobalContext';

const SmallLessonCard = (props: LessonCardProps) => {
  const { keyProps, lessonProps, openCards, setOpenCards } = props;
  const { theme } = useContext(GlobalContext);

  /**
   * Function to toggle card opening
   * @param cardID - self explanatory
   */
  const toggleOpenCard = (cardID: string /* e: React.MouseEvent */) => {
    if (!openCards.includes(cardID)) {
      setOpenCards(cardID);
    } else {
      setOpenCards('');
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
          className="py-2 text-center text-lg font-semibold text-blueberry cursor-pointer"
          onClick={() => {
            toggleOpenCard(toggleID);
          }}>
          {openCards.includes(toggleID) ? 'Less' : 'More'}
        </p>
      </div>
    );
  };

  return (
    <div
      id={keyProps}
      key={keyProps}
      className={`${openCards.includes(keyProps) ? 'z-50' : 'z-10'} ${
        theme.elem.text
      } `}>
      <div
        className={`${
          openCards.includes(keyProps) ? 'absolute h-auto' : 'absolute h-100'
        } min-h-100 p-2 mb-6 rounded h-auto flex flex-col `}>
        {/* CARD CONTAINER */}
        {/* LESSON CARD TOP - WITH IMAGE */}
        <div className={`border rounded`}>
          <div
            className={`w-full h-40 bg-white  ${theme.dashboard.bg} rounded-t bg-cover flex flex-col place-content-end`}
            style={{
              background: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))`,
              backgroundImage: `url(${lessonProps.lesson.artist.images})`,
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
                <p> {lessonProps.lesson.artist.name} </p>
              </h2>
            </div>
          </div>

          {/* LESSON CARD MIDDLE - SUMMARY */}
          <div
            className={`w-full relative flex flex-col rounded-b hover:shadow-lg bg-white`}>
            <div
              className={`${
                openCards.includes(keyProps) ? 'min-h-72 h-full' : 'h-32'
              }  p-4 mb-10 flex flex-col justify-start overflow-hidden transition ease-in-out duration-500 bg-white`}>
              <h1 className={`text-lg text-black font-open text-left`}>{lessonProps.lesson.title}</h1>
              <p className={`text-sm text-left`}>
                {lessonProps.lesson.summary ? lessonProps.lesson.summary : 'No Information Available'}
              </p>
            </div>

            {gradientCover(keyProps)}

            {/* LESSON CARD BOTTOM - DETAILS */}
            <div className={`h-10 ${theme.dashboard.bg} flex justify-between rounded-b`}>
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
        </div>
        {/* CARD CONTAINER END */}
      </div>
    </div>
  );
};

export default SmallLessonCard;

import React, { useContext } from 'react';
import { Lesson, LessonCardProps } from '../../Classroom';
import { GlobalContext } from '../../../../../contexts/GlobalContext';

const SideImage = (props: LessonCardProps) => {
  const {lessonProps} = props;
  const {theme} = useContext(GlobalContext);

  return (
    <div
      className={`w-2.5/10 ${theme.dashboard.bg} rounded-tl rounded-bl`}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${
          lessonProps && lessonProps.lesson?.artist?.images ? lessonProps.lesson?.artist?.images : null
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="h-6/10 flex justify-center items-center"/>

      <>
        <div className="h-1/10 pl-6">
          <div
            className="tracking-widest border-b text-gray-300 border-ketchup"
            style={{ textShadow: '1px 1px black' }}>
            FEATURED PERSON
          </div>
        </div>
        <div className="h-3/10 flex flex-row-reverse">
          <h2
            className={`first w-full text-2xl text-right font-open font-medium tracking-widest mt-2 mr-1 text-gray-200`}
            style={{ textShadow: '1px 1px black' }}>
            {lessonProps && lessonProps.lesson?.artist?.name ? lessonProps.lesson?.artist?.name : null}
          </h2>
        </div>
      </>

    </div>
  )
}

export default SideImage;
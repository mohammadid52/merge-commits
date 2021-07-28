import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import { getImageFromS3Static } from '../../../../../utilities/services';
import {LessonCardProps} from '../../Classroom';

const SideImage = (props: LessonCardProps) => {
  const {lessonProps} = props;
  const {theme} = useContext(GlobalContext);

  return (
    <div
      className={`w-2.5/10 ${theme.dashboard.bg} rounded-tl rounded-bl shadow`}
      style={{
        /* stylelint-disable */
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${
          lessonProps && lessonProps.lesson?.cardImage
            ? getImageFromS3Static(lessonProps.lesson?.cardImage)
            : null
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="h-6/10 flex justify-center items-center" />

      <div className="mt-4">
        <div className="h-1/10 pl-6">
          <div
            className="tracking-widest border-b-0 text-gray-300 border-ketchup"
            style={{textShadow: '1px 1px black'}}>
            FEATURED PERSON
          </div>
        </div>
        <div className="h-14 flex flex-row-reverse">
          <h2
            className={`first w-full text-2xl sm:text-xl text-right  font-medium tracking-widest mt-2 mr-1 text-gray-200`}
            style={{textShadow: '1px 1px black'}}>
            {lessonProps && lessonProps.lesson?.artist?.name
              ? lessonProps.lesson?.artist?.name
              : null}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SideImage;

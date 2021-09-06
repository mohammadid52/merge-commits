import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {getImageFromS3Static} from '../../../../../utilities/services';
import {LessonCardProps} from '../../Classroom';

const SideImage = (props: LessonCardProps) => {
  const {lessonProps, getImageFromS3 = true} = props;
  const {theme} = useContext(GlobalContext);

  return (
    <div
      className={`w-full h-48 md:h-auto sm:w-2.5/10 ${theme.dashboard.bg} rounded-tl rounded-bl shadow`}
      style={{
        /* stylelint-disable */
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${
          lessonProps && lessonProps.lesson?.cardImage
            ? getImageFromS3
              ? getImageFromS3Static(lessonProps.lesson?.cardImage)
              : lessonProps.lesson?.cardImage
            : null
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="h-30 sm:h-7/10 flex justify-center items-center" />

      <div className="">
        {/* <div className="h-1/10 pl-6">
          <div
            className="tracking-widest text-center text-2xl md:text-lg text-gray-300"
            style={{textShadow: '1px 1px black'}}>
            {lessonProps?.lesson?.cardCaption}
          </div>
        </div> */}
        <div className="h-14 flex flex-row-reverse">
          <h2
            className={`first w-full text-base 2xl:text-xl text-right font-bold tracking-widest mb-2 mx-2 text-gray-200`}
            style={{textShadow: '1px 1px black'}}>
            {lessonProps?.lesson?.cardCaption}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SideImage;

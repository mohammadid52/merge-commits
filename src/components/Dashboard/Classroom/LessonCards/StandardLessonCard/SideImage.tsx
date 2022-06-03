import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {getImageFromS3Static} from '../../../../../utilities/services';
import {LessonCardProps} from '../../Classroom';

const SideImage = (props: LessonCardProps) => {
  const {lessonProps, getImageFromS3 = true} = props;
  const {theme} = useContext(GlobalContext);

  return (
    <div
      className={`w-full h-48 md:h-auto sm:w-2.5/10 ${theme.dashboard.bg} rounded-tl rounded-bl shadow relative`}
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
      {lessonProps?.lesson?.cardCaption && (
        <div className="">
          {/* <div className="h-1/10 pl-6">
          <div
            className="tracking-widest text-center text-2xl md:text-lg text-gray-300"
            style={{textShadow: '1px 1px black'}}>
            {lessonProps?.lesson?.cardCaption}
          </div>
        </div> */}
          <div className="flex flex-row-reverse ">
            <h2
              className={`first w-full text-base 2xl:text-xl text-right font-bold tracking-widest absolute bottom-1 px-3 text-gray-200`}
              style={{textShadow: '1px 1px black'}}>
              {lessonProps?.lesson?.cardCaption}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideImage;

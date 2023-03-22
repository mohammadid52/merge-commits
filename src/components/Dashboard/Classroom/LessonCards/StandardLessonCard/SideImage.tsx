import {LessonCardProps} from '@interfaces/ClassroomInterface';
import {useGlobalContext} from 'contexts/GlobalContext';
import {getImageFromS3Static} from 'utilities/services';

const SideImage = (props: LessonCardProps) => {
  const {lessonProps, getImageFromS3 = true} = props;
  const {theme} = useGlobalContext();

  return (
    <div
      className={`relative rounded-lg bg-contain bg-gray-100 min-w-[14rem] h-56 w-56`}
      style={{
        /* stylelint-disable */
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${
          lessonProps && lessonProps.lesson?.cardImage
            ? getImageFromS3
              ? getImageFromS3Static(lessonProps.lesson?.cardImage)
              : lessonProps.lesson?.cardImage
            : null
        })`
      }}>
      {lessonProps?.lesson?.cardCaption && (
        <div className="">
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

import {LessonCardProps} from '@interfaces/ClassroomInterface';
import {useGlobalContext} from 'contexts/GlobalContext';

const MainSummary = (props: LessonCardProps) => {
  const {theme} = useGlobalContext();
  const {lessonProps} = props;

  return (
    <div
      className={`sm:min-h-48 relative p-5 px-5 flex flex-col justify-start items-center`}>
      <h1 className={`${theme.lessonCard.title}  w-full font-medium`}>
        {lessonProps.lesson && lessonProps.lesson.title ? lessonProps.lesson.title : null}
      </h1>
      <div className="descriptive">
        <p
          className="mt-1  text-gray-500 text-left leading-5"
          dangerouslySetInnerHTML={{
            __html:
              lessonProps.lesson && lessonProps.lesson?.summary
                ? lessonProps.lesson?.summary
                : ''
          }}></p>
      </div>
    </div>
  );
};

export default MainSummary;

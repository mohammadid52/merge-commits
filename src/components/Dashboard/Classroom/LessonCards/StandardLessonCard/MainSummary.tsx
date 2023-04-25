import {LessonCardProps} from '@interfaces/ClassroomInterface';
import {useGlobalContext} from 'contexts/GlobalContext';

const MainSummary = (props: LessonCardProps) => {
  const {theme} = useGlobalContext();
  const {lessonProps} = props;

  return (
    <div className={`sm:min-h-48 relative p-4 flex flex-col justify-start items-start`}>
      <h1 className={`${theme.lessonCard.title}  w-full font-medium`}>
        {lessonProps.lesson && lessonProps.lesson.title ? lessonProps.lesson.title : null}
      </h1>

      <p className="mt-1  text-medium  text-left leading-5">
        {lessonProps.lesson?.summary}
      </p>
    </div>
  );
};

export default MainSummary;

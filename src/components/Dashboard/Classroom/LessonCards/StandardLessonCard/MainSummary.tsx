import Highlighted from '@components/Atoms/Highlighted';
import {LessonCardProps} from '@interfaces/ClassroomInterface';
import {Tag} from 'antd';
import {useGlobalContext} from 'contexts/GlobalContext';

const MainSummary = (props: LessonCardProps) => {
  const {theme} = useGlobalContext();
  const {lessonProps, searchTerm} = props;

  const {title, summary, type} = lessonProps.lesson;
  return (
    <div
      className={`sm:min-h-48 relative p-5 px-5 flex flex-col justify-start items-center`}>
      <h1 className={`${theme.lessonCard.title}  w-full font-medium`}>
        <Highlighted highlight={searchTerm} text={title ? title : null} />

        <Tag className="ml-2" color={type === 'lesson' ? 'volcano' : 'lime'}>
          {type}
        </Tag>
      </h1>

      <p
        className="mt-1  text-gray-500 text-left max-h-[6rem] overflow-y-auto leading-5"
        dangerouslySetInnerHTML={{
          __html: summary ? summary : ''
        }}></p>
    </div>
  );
};

export default MainSummary;

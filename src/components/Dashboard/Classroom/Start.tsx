import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';

interface StartProps {
  isTeacher?: boolean;
  lessonKey: any;
  open: boolean;
  accessible: boolean;
  type?: string;
}

const Start: React.FC<StartProps> = (props: StartProps) => {
  const { isTeacher, lessonKey, open, accessible, type } = props;
  const history = useHistory();

  const handleLink = () => {
    if (!isTeacher && accessible && open) {
      history.push(`${`/lesson?id=${lessonKey}`}`);
    }

    if (isTeacher) {
      history.push(`${`/lesson-control?id=${lessonKey}`}`);
    }
  };

  const firstPart = () => {
    if (isTeacher) {
      return 'TEACH';
    } else {
      return 'START';
    }
  };

  const secondPart = () => {
    if (type === 'survey' || type === 'assessment') {
      return type.toUpperCase();
    } else {
      return 'LESSON';
    }
  };

  return (
    <div>
      <button
        type="submit"
        onClick={handleLink}
        className={`${
          isTeacher || (accessible && open)
            ? 'bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 text-white'
            : 'bg-gray-500 text-gray-700 cursor-default'
        } h-full w-full text-white rounded-br focus:outline-none transition duration-150 ease-in-out`}>
        <span className="w-auto h-auto">{`${firstPart()} ${secondPart()}`}</span>
      </button>
    </div>
  );
};

export default Start;
